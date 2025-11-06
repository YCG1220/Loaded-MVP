import { Category, MenuItem, ModifierGroup } from "../types/menu";
import { createServerSupabaseClient } from "./supabase-server";

interface MenuCatalog {
  categories: Category[];
  menuItems: MenuItem[];
}

function mapModifierGroup(row: any): ModifierGroup | null {
  if (!row) return null;
  const options = Array.isArray(row.modifiers)
    ? row.modifiers.map((option: any) => ({
        id: option.id,
        name: option.name,
        priceDelta: option.price_delta ? Number(option.price_delta) : 0,
        calories: option.calories ?? undefined,
        grams: option.grams !== null && option.grams !== undefined ? Number(option.grams) : undefined,
        isDefault: option.is_default ?? false,
      }))
    : [];

  return {
    id: row.id,
    name: row.name,
    minSelect: row.min_select ?? 0,
    maxSelect: row.max_select ?? 0,
    isRequired: row.is_required ?? false,
    options,
    step: row.step ?? undefined,
  };
}

export async function fetchMenuCatalog(): Promise<MenuCatalog> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { categories: [], menuItems: [] };
  }

  const supabase = createServerSupabaseClient();

  const { data: categoryRows, error: categoryError } = await supabase
    .from("categories")
    .select("id, name, subtitle, sort_order")
    .order("sort_order", { ascending: true });

  if (categoryError) {
    console.error("Failed to load categories", categoryError);
    return { categories: [], menuItems: [] };
  }

  const { data: menuRows, error: menuError } = await supabase
    .from("menu_items")
    .select(
      `id, name, description, price, image_url, calories, category_id,
       menu_item_modifiers(
         modifier_groups(
           id, name, min_select, max_select, is_required, step,
           modifiers(id, name, price_delta, calories, grams, is_default)
         )
       )`
    )
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (menuError) {
    console.error("Failed to load menu items", menuError);
    return {
      categories: (categoryRows ?? []).map((category) => ({
        id: category.id,
        name: category.name,
        description: category.subtitle ?? undefined,
        sortOrder: category.sort_order ?? 0,
      })),
      menuItems: [],
    };
  }

  const categories = (categoryRows ?? []).map((category) => ({
    id: category.id,
    name: category.name,
    description: category.subtitle ?? undefined,
    sortOrder: category.sort_order ?? 0,
  }));

  const menuItems = (menuRows ?? []).map((item) => {
    const modifierGroups = Array.isArray(item.menu_item_modifiers)
      ? item.menu_item_modifiers
          .map((relation: any) => mapModifierGroup(relation?.modifier_groups))
          .filter((group): group is ModifierGroup => Boolean(group))
          .sort((a, b) => {
            const stepA = a.step ?? 0;
            const stepB = b.step ?? 0;
            if (stepA !== stepB) return stepA - stepB;
            return a.name.localeCompare(b.name);
          })
      : [];

    return {
      id: item.id,
      name: item.name,
      description: item.description ?? "",
      price: item.price ? Number(item.price) : 0,
      imageUrl: item.image_url ?? "",
      calories: item.calories ?? undefined,
      categoryId: item.category_id ?? "",
      modifierGroups,
    } satisfies MenuItem;
  });

  return { categories, menuItems };
}
