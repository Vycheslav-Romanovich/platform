import autoBind from 'auto-bind';
import { action, makeObservable, observable } from 'mobx';

import { deleteSubscription, finishSubscription, getSubscriptionInfo } from '../api';
import { SubscriptionInfoDto } from './types';

export default class SubscriptionStore {
  @observable subscriptionInfo: SubscriptionInfoDto = null as SubscriptionInfoDto;
  @observable isLoading = true;

  constructor() {
    autoBind(this);
    makeObservable(this);
  }

  @action async getSubscription(id: number, token: string) {
    this.isLoading = true;

    try {
      const subscriptionInfo = await getSubscriptionInfo(id, token);

      this.subscriptionInfo = subscriptionInfo.data;
      this.isLoading = false;
    } catch (error) {
      console.error(error);
      this.isLoading = false;
    }
  }

  @action async finishSubscription(id: number, token: string) {
    this.isLoading = true;

    try {
      await finishSubscription(this.subscriptionInfo.subscriptionId, 'Cancel subscription', token);
      this.getSubscription(id, token);
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  @action async deleteSubscription(id: number, token: string) {
    this.isLoading = true;

    try {
      await deleteSubscription(id, token);
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }
}
