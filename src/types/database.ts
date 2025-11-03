export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          sort_order?: number;
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
          is_active: boolean;
          calories: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          is_active?: boolean;
          calories?: number | null;
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
          is_required: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          min_select?: number | null;
          max_select?: number | null;
          is_required?: boolean;
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
          is_default: boolean;
        };
        Insert: {
          id?: string;
          group_id?: string | null;
          name: string;
          price_delta?: number | null;
          calories?: number | null;
          grams?: number | null;
          is_default?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["modifiers"]["Insert"]>;
      };
      inventory_items: {
        Row: {
          id: string;
          name: string;
          sku: string | null;
          unit: string;
          grams_per_unit: number | null;
          cost_per_unit: number | null;
          quantity_on_hand: number | null;
          reorder_threshold: number | null;
        };
        Insert: {
          id?: string;
          name: string;
          sku?: string | null;
          unit: string;
          grams_per_unit?: number | null;
          cost_per_unit?: number | null;
          quantity_on_hand?: number | null;
          reorder_threshold?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["inventory_items"]["Insert"]>;
      };
      rewards: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          points_cost: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          points_cost: number;
          is_active?: boolean;
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
          is_active: boolean;
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
          is_active?: boolean;
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
          status: string;
          fulfillment_method: string | null;
          placed_at: string | null;
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
          status?: string;
          fulfillment_method?: string | null;
          placed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
    };
  };
}
