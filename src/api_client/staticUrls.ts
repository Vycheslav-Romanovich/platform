const apiServer = process.env.PRODUCT_SERVER_URL;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  plans: 'https://easylang.app/plans',
  tutor: `${apiServer}`,
  blankAuth: `${apiServer}/blank-auth.html`,
};
