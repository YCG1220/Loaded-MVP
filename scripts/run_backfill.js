#!/usr/bin/env node
/**
 * CLI runner for public.run_stock_levels_backfill
 * Usage: node scripts/run_backfill.js --run-name="ci-dry-20240607" [--batch=1000] [--apply]
 */

const { Client } = require("pg");
const readline = require("readline");

function parseArgs(argv) {
  const options = {
    runName: `cli-${new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12)}`,
    batch: 1000,
    apply: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;

    if (arg === "--help") {
      options.help = true;
      break;
    }

    if (arg.startsWith("--run-name=")) {
      options.runName = arg.split("=")[1];
      continue;
    }
    if (arg === "--run-name" && argv[i + 1]) {
      options.runName = argv[i + 1];
      i += 1;
      continue;
    }

    if (arg.startsWith("--batch=")) {
      options.batch = Number(arg.split("=")[1]);
      continue;
    }
    if (arg === "--batch" && argv[i + 1]) {
      options.batch = Number(argv[i + 1]);
      i += 1;
      continue;
    }

    if (arg === "--apply") {
      options.apply = true;
      continue;
    }
    if (arg === "--dry-run") {
      options.apply = false;
      continue;
    }
  }

  return options;
}

function showHelp() {
  console.log(`Usage: node scripts/run_backfill.js [options]\n\nOptions:\n  --run-name <name>    Identifier saved with the backfill run\n  --batch <size>       Batch size for FOR UPDATE SKIP LOCKED windows (default 1000)\n  --apply              Persist changes to stock_levels instead of dry-run\n  --dry-run            Explicitly force dry-run mode (default)\n  --help               Show this message`);
}

async function confirmApply() {
  if (process.env.CI || process.env.NON_INTERACTIVE) {
    return true;
  }
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question("⚠️  You are about to APPLY stock level changes. Type 'apply' to continue: ", (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "apply");
    });
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  if (!Number.isFinite(args.batch) || args.batch <= 0) {
    console.error("Batch size must be a positive number.");
    process.exit(1);
  }

  if (args.apply) {
    const confirmed = await confirmApply();
    if (!confirmed) {
      console.log("Backfill cancelled by user.");
      process.exit(0);
    }
  }

  const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!connectionString) {
    console.error("DATABASE_URL or SUPABASE_DB_URL must be set in the environment.");
    process.exit(1);
  }

  const client = new Client({ connectionString });

  try {
    await client.connect();
    const result = await client.query(
      "select public.run_stock_levels_backfill($1, $2, $3) as run_id",
      [args.runName, args.batch, args.apply]
    );

    const runId = result.rows?.[0]?.run_id;
    if (!runId) {
      throw new Error("Backfill did not return a run id.");
    }

    console.log(`RUN_ID=${runId}`);

    const details = await client.query(
      "select run_name, started_at, completed_at, details from public.backfill_runs where id = $1",
      [runId]
    );

    if (details.rows.length > 0) {
      const row = details.rows[0];
      console.log("Backfill summary:");
      console.log(JSON.stringify(row, null, 2));
    }

    console.log(`Finished at ${new Date().toISOString()}`);
  } catch (error) {
    console.error("Backfill failed:", error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
