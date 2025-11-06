import { fetchMenuCatalog } from "../../src/lib/menu-service";
import { OrderExperience } from "../../components/menu/order-experience";

export const revalidate = 0;

export default async function OrderPage() {
  const { categories, menuItems } = await fetchMenuCatalog();

  return (
    <div className="space-y-10 pb-24">
      <OrderExperience categories={categories} menuItems={menuItems} />
    </div>
  );
}
