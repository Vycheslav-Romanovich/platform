import axios from 'axios';

export const deleteSubscription = (id: number, token: string) => {
  return axios.delete(`${process.env.PRODUCT_SERVER_URL}/api/paypro-global/${id}`, {
    headers: { Authorization: token },
  });
};
