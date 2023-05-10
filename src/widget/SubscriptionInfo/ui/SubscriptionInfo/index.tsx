import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import { subscriptionStore } from '../../module';
import { CancelSubscribtionBlock } from '../CancelSubscribtionBlock';
import { PaymentHistoryBlock } from '../PaymentHistoryBlock';
import { PaymentMethodBlock } from '../PaymentMethodBlock';
import { PlanBlock } from '../PlanBlock';
import { SubscriptionAlert } from '../SubscriptionAlert';

import { InitLoader } from '~/components/initLoader';
import { SubscriptionBlockTemplate } from '~/entities/SubscriptionBlockTemplate';
import { userStore } from '~/stores';
import { subscriptionTypeData } from '~/widget/SubscriptionInfo/config';
import { SubscriptionTypes } from '~/widget/SubscriptionInfo/types';

export const SubscriptionInfo: React.FC = observer(() => {
  const checkSubscriptionType = (data: SubscriptionTypes[], subscriptionInfo: string) => {
    const subscriptionType = subscriptionInfo.toLowerCase();
    let currentSubscription: string;

    data.forEach((item) => {
      if (subscriptionType.includes(item.toLowerCase())) {
        currentSubscription = item;
      }
    });

    return currentSubscription ? currentSubscription : subscriptionInfo;
  };

  useEffect(() => {
    subscriptionStore.getSubscription(userStore.user.id, userStore.user.token);
  }, []);

  return (
    <>
      {subscriptionStore.isLoading ? (
        <InitLoader position={'centerPage'} />
      ) : subscriptionStore.subscriptionInfo ? (
        <>
          <SubscriptionBlockTemplate
            title={'Plan'}
            note={'You can change plan in personal account of PayPro Global.'}
          >
            <PlanBlock
              subscriptionType={checkSubscriptionType(
                subscriptionTypeData,
                subscriptionStore.subscriptionInfo.subscriptionType
              )}
              expirationDate={subscriptionStore.subscriptionInfo.expirationDate}
              price={subscriptionStore.subscriptionInfo.price}
              currencyCode={subscriptionStore.subscriptionInfo.currencyCode}
              isSubscriptionFinished={subscriptionStore.subscriptionInfo.isSubscriptionFinished}
            />
          </SubscriptionBlockTemplate>

          <SubscriptionBlockTemplate
            title={'Payment Method'}
            note={'You can change payment method in personal account of PayPro Global.'}
          >
            <PaymentMethodBlock
              paymentMethodName={subscriptionStore.subscriptionInfo.paymentMethodName}
              creditCardLast4={subscriptionStore.subscriptionInfo.creditCardLast4}
            />
          </SubscriptionBlockTemplate>

          <SubscriptionBlockTemplate title={'Payment History'}>
            <PaymentHistoryBlock
              platformPaymentHistory={subscriptionStore.subscriptionInfo.platformPaymentHistory}
            />
          </SubscriptionBlockTemplate>

          <CancelSubscribtionBlock />
        </>
      ) : (
        <SubscriptionAlert />
      )}
    </>
  );
});
