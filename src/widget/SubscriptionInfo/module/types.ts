export interface PaymentHistory {
  createdAt: Date;
  currencyCode: string;
  id: number;
  isTrialPeriod: boolean;
  orderCustomerTime: string;
  orderStatus: string;
  price: string;
  subscriptionType: string;
  updatedAt: string;
  userId: number;
}

export interface SubscriptionInfoDto {
  createdAt: Date;
  creditCardLast4: string;
  currencyCode: string;
  expirationDate: string;
  isSubscriptionFinished: boolean;
  isTrialPeriod: boolean;
  paymentMethodName: string;
  platformPaymentHistory: PaymentHistory[];
  price: string;
  subscriptionId: number;
  subscriptionType: string;
  updatedAt: Date;
  userId: number;
}
