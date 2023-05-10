import axios from 'axios';

export const getSubscriptionInfo = (id: number, token: string) => {
  return axios.get(`${process.env.PRODUCT_SERVER_URL}/api/paypro-global/${id}`, {
    headers: { Authorization: token },
  });
};
