import { fetchMenuCatalog } from "../../src/lib/menu-service";
import { OrderExperience } from "../../components/menu/order-experience";

export const revalidate = 0;

export default async function OrderPage() {
  const { categories, menuItems } = await fetchMenuCatalog();

  const isCatalogEmpty = categories.length === 0 || menuItems.length === 0;

  return (
    <div className="space-y-10 pb-24">
      <OrderExperience categories={categories} menuItems={menuItems} />
      {isCatalogEmpty && (
        <div className="rounded-3xl border border-dashed border-brand-red/30 bg-brand-cream/70 p-6 text-sm text-brand-dark/70">
          The menu is driven by the admin panel. Add categories, menu items, and modifier groups in Supabase to populate this
          page.
        </div>
      )}
    </div>
  );
}
