import { useEffect, useState } from 'react';
import { Box, CardMedia } from '@mui/material';
import { observer } from 'mobx-react';
import { io } from 'socket.io-client';

import { InitLoader } from '~/components/initLoader';
import { PAYPROGLOBAL_LINK } from '~/constants/payProGlobal';
import { CardTemplate } from '~/entities/CardTemplate';
import { SubscriptionPeriod } from '~/features/SubscriptionCard';
import { sendEvent } from '~/helpers/sendToGtm';
import { subscriptionStore, userStore } from '~/stores';

export const PaymentBlock: React.FC = observer(() => {
  const [paymentUrl, setPaymentUrl] = useState('');
  const [subscriptionPeriod, setSubscriptionPeriod] = useState<SubscriptionPeriod>();
  const [isLoading, setLoading] = useState(true);

  const hideSpinner = () => {
    setLoading(false);
  };

  useEffect(() => {
    const socket = io(process.env.PRODUCT_SERVER_URL, { transports: ['websocket'] });

    socket.on('connect', () => {
      socket.connected && socket.emit('joinRoom', userStore.user.id.toString());
    });

    socket.on('connect_error', () => {
      socket.connect();
    });

    socket.on('paymentDone', (data) => {
      if (data.isPaid) {
        const url = new URL(window.location.href);
        const period = url.searchParams.get('period') as SubscriptionPeriod;
        sendEvent('start_premium_plan', { plan: period });
        userStore.getUserInfo();
      }
    });

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const period = url.searchParams.get('period') as SubscriptionPeriod;

    setSubscriptionPeriod(period);
  }, []);

  const getSubscription = async () => {
    await subscriptionStore.getSubscription(userStore.user.id, userStore.user.token);

    const isPeriod = (period: SubscriptionPeriod) => {
      return period === subscriptionPeriod;
    };

    const periodBool = isPeriod('yearly') || isPeriod('monthly');
    const isTrialPeriod = subscriptionStore.subscriptionInfo?.isTrialPeriod;

    if (process.env.IS_PROD && periodBool) {
      if (isTrialPeriod === undefined) {
        isPeriod('yearly')
          ? setPaymentUrl(`${PAYPROGLOBAL_LINK.prod.yearly.trial}${userStore.user.id}`)
          : isPeriod('monthly')
          ? setPaymentUrl(`${PAYPROGLOBAL_LINK.prod.monthly.trial}${userStore.user.id}`)
          : null;
      } else {
        isPeriod('yearly')
          ? setPaymentUrl(`${PAYPROGLOBAL_LINK.prod.yearly.payment}${userStore.user.id}`)
          : isPeriod('monthly')
          ? setPaymentUrl(`${PAYPROGLOBAL_LINK.prod.monthly.payment}${userStore.user.id}`)
          : null;
      }
    } else {
      if (isTrialPeriod === undefined) {
        isPeriod('yearly')
          ? setPaymentUrl(`${PAYPROGLOBAL_LINK.dev.yearly.trial}${userStore.user.id}`)
          : isPeriod('monthly')
          ? setPaymentUrl(`${PAYPROGLOBAL_LINK.dev.monthly.trial}${userStore.user.id}`)
          : null;
      } else {
        isPeriod('yearly')
          ? setPaymentUrl(`${PAYPROGLOBAL_LINK.dev.yearly.payment}${userStore.user.id}`)
          : isPeriod('monthly')
          ? setPaymentUrl(`${PAYPROGLOBAL_LINK.dev.monthly.payment}${userStore.user.id}`)
          : null;
      }
    }
  };

  useEffect(() => {
    getSubscription();
  }, [subscriptionPeriod]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pb: '60px' }}>
      {isLoading && <InitLoader position="centerPage" />}

      <CardTemplate background={'--White'} width={'810px'} height={'1250px'}>
        <CardMedia
          sx={{ width: '100%', height: '100%', borderRadius: '8px' }}
          src={paymentUrl}
          aria-hidden="false"
          component="iframe"
          onLoad={hideSpinner}
        ></CardMedia>
      </CardTemplate>
    </Box>
  );
});
