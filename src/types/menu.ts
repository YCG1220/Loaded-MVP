export interface ModifierOption {
  id: string;
  name: string;
  priceDelta: number;
  calories?: number;
  grams?: number;
  isDefault?: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  minSelect: number;
  maxSelect: number;
  isRequired: boolean;
  options: ModifierOption[];
  step?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  calories?: number;
  categoryId: string;
  modifierGroups?: ModifierGroup[];
<<<<<<< HEAD
  sortOrder?: number;
=======
>>>>>>> origin/main
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
<<<<<<< HEAD
  imageUrl?: string;
=======
>>>>>>> origin/main
}
