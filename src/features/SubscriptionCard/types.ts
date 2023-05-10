export interface SubscriptionCardItems {
  title: string;
  price: string;
  month: string;
  subtitle: string;
  button: string;
  buttonOpPopup?: string;
}

export interface CardDataTextItems extends SubscriptionCardItems {
  features: string[];
}

export interface PlansSubscriptions {
  free: {
    monthly: CardDataTextItems;
    yearly: CardDataTextItems;
  };
  prem: {
    monthly: CardDataTextItems;
    yearly: CardDataTextItems;
  };
}

export type SubscriptionType = 'prem' | 'free';
export type SubscriptionPeriod = 'monthly' | 'yearly';
