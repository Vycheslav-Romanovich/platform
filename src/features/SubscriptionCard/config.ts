import { PlansSubscriptions, SubscriptionCardItems } from './types';

const freeFeatures = [
  'Create up to 6 lessons',
  'Up to 3 students per class',
  'Publication of lessons in the public access',
];
const premFeatures = [
  'Unlimited number of lessons',
  'Unlimited number of students in the class',
  'Tracking students progress',
  'Protecting lessons from public access',
  'Customizing lessons and classes',
];

const freeSubscriptionItems: SubscriptionCardItems = {
  title: 'Free',
  price: '$0',
  subtitle: 'free forever',
  month: '/ month',
  button: 'Get started',
};
const premSubscriptionItemsMonth: SubscriptionCardItems = {
  title: 'Premium 🔥',
  price: '$4.99',
  month: '/ month',
  subtitle: 'paid monthly $4.99',
  button: 'Start 14-day free trial',
  buttonOpPopup: 'Start 14-day free trial',
};
const premSubscriptionItemsYear: SubscriptionCardItems = {
  title: 'Premium 🔥',
  price: '$2.99',
  month: '/ month',
  subtitle: 'paid yearly $35.99',
  button: 'Start 14-day free trial',
  buttonOpPopup: 'Start 14-day free trial',
};

export const dataCard: PlansSubscriptions = {
  free: {
    monthly: {
      features: freeFeatures,
      ...freeSubscriptionItems,
    },
    yearly: {
      features: freeFeatures,
      ...freeSubscriptionItems,
    },
  },
  prem: {
    monthly: {
      features: premFeatures,
      ...premSubscriptionItemsMonth,
    },
    yearly: {
      features: premFeatures,
      ...premSubscriptionItemsYear,
    },
  },
};
