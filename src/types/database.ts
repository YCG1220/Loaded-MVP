export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          loyalty_tier: string;
          yearly_points: number;
          spendable_points: number;
          is_admin: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          loyalty_tier?: string;
          yearly_points?: number;
          spendable_points?: number;
          is_admin?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      categories: {
        Row: {
          id: string;
          slug: string | null;
          name: string;
          subtitle: string | null;
          image_url: string | null;
          sort_order: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          slug?: string | null;
          name: string;
          subtitle?: string | null;
          image_url?: string | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
      menu_items: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          is_active: boolean | null;
          calories: number | null;
          protein: number | null;
          carbs: number | null;
          fat: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          is_active?: boolean | null;
          calories?: number | null;
          protein?: number | null;
          carbs?: number | null;
          fat?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["menu_items"]["Insert"]>;
      };
      modifier_groups: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          min_select: number | null;
          max_select: number | null;
          is_required: boolean | null;
          step: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          min_select?: number | null;
          max_select?: number | null;
          is_required?: boolean | null;
          step?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["modifier_groups"]["Insert"]>;
      };
      modifiers: {
        Row: {
          id: string;
          group_id: string | null;
          name: string;
          price_delta: number | null;
          calories: number | null;
          grams: number | null;
          is_default: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          group_id?: string | null;
          name: string;
          price_delta?: number | null;
          calories?: number | null;
          grams?: number | null;
          is_default?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["modifiers"]["Insert"]>;
      };
      menu_item_modifiers: {
        Row: {
          menu_item_id: string;
          modifier_group_id: string;
        };
        Insert: {
          menu_item_id: string;
          modifier_group_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["menu_item_modifiers"]["Insert"]>;
      };
      inventory_items: {
        Row: {
          id: string;
          sku: string | null;
          name: string;
          description: string | null;
          unit_of_measure: string | null;
          cost_cents: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          sku?: string | null;
          name: string;
          description?: string | null;
          unit_of_measure?: string | null;
          cost_cents?: number | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["inventory_items"]["Insert"]>;
      };
      lots: {
        Row: {
          id: string;
          inventory_item_id: string | null;
          lot_code: string | null;
          expiry_date: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          inventory_item_id?: string | null;
          lot_code?: string | null;
          expiry_date?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["lots"]["Insert"]>;
      };
      stock_movements: {
        Row: {
          id: string;
          inventory_item_id: string | null;
          product_id: string | null;
          change_qty: number;
          movement_type: string;
          reference_table: string | null;
          reference_id: string | null;
          lot_id: string | null;
          unit_cost_cents: number | null;
          location: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          inventory_item_id?: string | null;
          product_id?: string | null;
          change_qty: number;
          movement_type: string;
          reference_table?: string | null;
          reference_id?: string | null;
          lot_id?: string | null;
          unit_cost_cents?: number | null;
          location?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["stock_movements"]["Insert"]>;
      };
      stock_levels: {
        Row: {
          id: string;
          inventory_item_id: string;
          location: string | null;
          quantity: number;
          min_quantity: number | null;
          last_updated: string | null;
          inventory_sku: string;
        };
        Insert: {
          id?: string;
          inventory_item_id: string;
          location?: string | null;
          quantity?: number;
          min_quantity?: number | null;
          last_updated?: string | null;
          inventory_sku: string;
        };
        Update: Partial<Database["public"]["Tables"]["stock_levels"]["Insert"]>;
      };
      menu_item_inventory: {
        Row: {
          menu_item_id: string;
          inventory_item_id: string;
          grams_per_item: number;
        };
        Insert: {
          menu_item_id: string;
          inventory_item_id: string;
          grams_per_item: number;
        };
        Update: Partial<Database["public"]["Tables"]["menu_item_inventory"]["Insert"]>;
      };
      rewards: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          points_cost: number;
          is_active: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          points_cost: number;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["rewards"]["Insert"]>;
      };
      offers: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string | null;
          discount_type: string | null;
          discount_value: number | null;
          bonus_points: number | null;
          start_date: string | null;
          end_date: string | null;
          is_active: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description?: string | null;
          discount_type?: string | null;
          discount_value?: number | null;
          bonus_points?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["offers"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          store_id: string | null;
          subtotal: number;
          discount: number | null;
          tax: number | null;
          total: number;
          points_earned: number | null;
          points_redeemed: number | null;
          status: Database["public"]["Enums"]["order_status"] | null;
          fulfillment_method: string | null;
          placed_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          store_id?: string | null;
          subtotal: number;
          discount?: number | null;
          tax?: number | null;
          total: number;
          points_earned?: number | null;
          points_redeemed?: number | null;
          status?: Database["public"]["Enums"]["order_status"] | null;
          fulfillment_method?: string | null;
          placed_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string | null;
          menu_item_id: string | null;
          name: string;
          quantity: number;
          base_price: number;
          modifiers: Json | null;
          notes: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          menu_item_id?: string | null;
          name: string;
          quantity: number;
          base_price: number;
          modifiers?: Json | null;
          notes?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      audit_logs: {
        Row: {
          id: number;
          user_id: string | null;
          action: string;
          table_name: string | null;
          record_id: string | null;
          payload: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          user_id?: string | null;
          action: string;
          table_name?: string | null;
          record_id?: string | null;
          payload?: Json | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
      };
      backfill_runs: {
        Row: {
          id: string;
          run_name: string | null;
          started_at: string | null;
          completed_at: string | null;
          details: Json | null;
        };
        Insert: {
          id?: string;
          run_name?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          details?: Json | null;
        };
        Update: Partial<Database["public"]["Tables"]["backfill_runs"]["Insert"]>;
      };
      stock_backfill_diffs: {
        Row: {
          id: string;
          backfill_run_id: string;
          inventory_item_id: string;
          location: string | null;
          previous_quantity: number | null;
          new_quantity: number | null;
          computed_at: string | null;
        };
        Insert: {
          id?: string;
          backfill_run_id: string;
          inventory_item_id: string;
          location?: string | null;
          previous_quantity?: number | null;
          new_quantity?: number | null;
          computed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["stock_backfill_diffs"]["Insert"]>;
      };
      sales_orders: {
        Row: {
          id: string;
          external_id: string | null;
          channel: string | null;
          status: string | null;
          total_cents: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          external_id?: string | null;
          channel?: string | null;
          status?: string | null;
          total_cents?: number | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["sales_orders"]["Insert"]>;
      };
      sales_lines: {
        Row: {
          id: string;
          sales_order_id: string | null;
          product_id: string | null;
          inventory_item_id: string | null;
          qty: number;
          unit_price_cents: number | null;
          discount_cents: number | null;
          cost_at_sale_cents: number | null;
          created_at: string | null;
          backfill_processed: boolean | null;
          backfill_run_id: string | null;
        };
        Insert: {
          id?: string;
          sales_order_id?: string | null;
          product_id?: string | null;
          inventory_item_id?: string | null;
          qty: number;
          unit_price_cents?: number | null;
          discount_cents?: number | null;
          cost_at_sale_cents?: number | null;
          created_at?: string | null;
          backfill_processed?: boolean | null;
          backfill_run_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["sales_lines"]["Insert"]>;
      };
    };
    Views: {};
    Functions: {
      run_stock_levels_backfill: {
        Args: {
          run_name: string | null;
          p_batch_limit?: number | null;
          p_apply?: boolean | null;
        };
        Returns: string;
      };
    };
    Enums: {
      order_status: "pending" | "in_progress" | "ready" | "completed" | "cancelled";
    };
  };
}
