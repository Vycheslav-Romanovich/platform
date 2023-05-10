import axios from 'axios';

export const finishSubscription = (subscriptionId, reasonText, token: string) => {
  return axios.post(
    `${process.env.PRODUCT_SERVER_URL}/api/paypro-global/platform-finish-subscription`,
    { subscriptionId, reasonText },
    {
      headers: { Authorization: token },
    }
  );
};
