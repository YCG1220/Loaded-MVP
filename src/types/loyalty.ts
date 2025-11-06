export interface RewardSummary {
  id: string;
  name: string;
  description?: string;
  pointsCost: number;
  isActive: boolean;
  updatedAt?: string;
}

export interface OfferSummary {
  id: string;
  code: string;
  name: string;
  description?: string;
  discountType?: string | null;
  discountValue?: number | null;
  bonusPoints?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  isActive: boolean;
}

export interface LoyaltyContent {
  rewards: RewardSummary[];
  offers: OfferSummary[];
}
