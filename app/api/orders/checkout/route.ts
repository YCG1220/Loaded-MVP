import { z } from "zod";
import { getAdminSupabaseClient } from "../../../../src/lib/supabase-admin";
import { jsonResponse, errorResponse } from "../../../../src/lib/api-response";

const cartItemSchema = z.object({
  menu_item_id: z.string().uuid(),
  quantity: z.number().min(1),
  modifiers: z.record(z.array(z.string())).optional(),
  notes: z.string().max(120).optional(),
});

const checkoutSchema = z.object({
  user_id: z.string().uuid(),
  store_id: z.string(),
  fulfillment_method: z.enum(["pickup", "delivery"]),
  subtotal: z.number().positive(),
  discount: z.number().min(0).optional().default(0),
  tax: z.number().min(0).optional().default(0),
  total: z.number().positive(),
  points_redeemed: z.number().min(0).optional().default(0),
  items: z.array(cartItemSchema).min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = checkoutSchema.parse(body);
    const supabase = getAdminSupabaseClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: payload.user_id,
        store_id: payload.store_id,
        subtotal: payload.subtotal,
        discount: payload.discount,
        tax: payload.tax,
        total: payload.total,
        fulfillment_method: payload.fulfillment_method,
        points_redeemed: payload.points_redeemed,
        points_earned: Math.floor(payload.subtotal * 10),
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const menuIds = payload.items.map((item) => item.menu_item_id);
    const { data: menuRows, error: menuError } = await supabase
      .from('menu_items')
      .select('id,name,price')
      .in('id', menuIds);
    if (menuError) throw menuError;

    const menuMap = new Map(menuRows?.map((row) => [row.id, row]) ?? []);
    const orderItems = payload.items.map((item) => {
      const menu = menuMap.get(item.menu_item_id);
      return {
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        modifiers: item.modifiers ?? {},
        notes: item.notes ?? null,
        base_price: menu?.price ?? 0,
        name: menu?.name ?? 'Unknown Item',
      };
    });

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    return jsonResponse({ order_id: order.id, points_awarded: order.points_earned });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
