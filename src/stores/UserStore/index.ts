import autoBind from 'auto-bind';
import jwtDecode from 'jwt-decode';
import { action, computed, makeAutoObservable, observable } from 'mobx';

import api from '../../api_client/api';
import UserStorage from './UserStorage';
import UserStorageLocal from './UserStorageLocal';
import UserStorageSync from './UserStorageSync';

import { DecodeToken, IUsage, IUserInfo } from '~/types/api';

export default class UserStore {
  @observable isInit = false;
  @observable user: IUserInfo | null = null;
  @observable usage: IUsage | null = null;
  @observable loadingUserInfo = false;
  @observable userNotAuthLink = '';
  @observable userNotAuthLinkLessonId = '';

  private storage: UserStorage = undefined;
  private syncStorage: UserStorageSync = undefined;

  constructor() {
    autoBind(this);
    makeAutoObservable(this);
    if (typeof window !== 'undefined') {
      this.storage = new UserStorageLocal();
      this.syncStorage = new UserStorageSync();
      this.syncStorage.useUpdateToken((respToken) =>
        respToken ? this.getAndSaveUserInfo(respToken) : this.deleteUser()
      );
    }
  }

  @action setUser(userData: IUserInfo) {
    this.user = { ...this.user, ...userData };
  }

  @action setInit(isInit: boolean) {
    this.isInit = isInit;
  }

  @action setInteresting(userInteresting: Array<string>) {
    this.user ? (this.user = { ...this.user, interestTags: userInteresting }) : this.user;
  }

  @action setUserNotAuthLink(data: string) {
    this.userNotAuthLink = data;
  }

  @action setUserNotAuthLinkLessonId(data: string) {
    this.userNotAuthLinkLessonId = data;
  }

  @action deleteUser() {
    this.user = null;
    this.removeAvatar();
  }

  @action setUsage(usage: IUsage) {
    this.usage = usage;
  }

  @action setAvatar(avatarUrl: string) {
    this.storage.saveAvatar(avatarUrl);
    this.user.avatar = avatarUrl;
  }

  @action async getAvatar() {
    const avatarUrl = await this.storage.getAvatar();

    if (!this.user.avatar) {
      this.user.avatar = avatarUrl;
    }
  }

  @action removeAvatar() {
    this.storage.removeAvatar();
  }

  @action
  async login(userData: IUserInfo) {
    this.setUser(userData);
    this.storage?.save(userData.token as string);
    this.syncStorage?.save(userData.token as string);
  }

  @action logout() {
    this.deleteUser();
    this.syncStorage.remove();
    this.storage.remove();
  }

  @computed get isAuth() {
    return !!this.user;
  }

  async getSyncToken(isInit: () => void) {
    try {
      const resp = await this.syncStorage.get();

      if (resp === 'NO_TOKEN') {
        return this.getFromStorage();
      }

      if (resp === 'INVALID_TOKEN') {
        await this.syncStorage.remove();
        return this.getFromStorage();
      }

      await this.storage.save(resp);
      await this.getAndSaveUserInfo(resp);
    } catch (error) {
      console.error(error);
    } finally {
      isInit();
    }
  }

  async getFromStorage() {
    try {
      const token = await this.storage.get();

      if (!token) return console.error('No token');

      if (token && UserStore.isValidJWT(token)) {
        this.syncStorage.save(token);
      }

      await this.getAndSaveUserInfo(token);
    } catch (error) {
      throw new Error(error);
    }
  }

  @action async getUserInfo() {
    const token = await this.storage.get();
    await this.getAndSaveUserInfo(token);
  }

  private async getAndSaveUserInfo(token: string) {
    this.loadingUserInfo = true;

    try {
      const resp = await api.info(token);

      this.setUser({ ...resp.data, token });
    } catch (error) {
      throw new Error(error);
    } finally {
      this.loadingUserInfo = false;
    }
  }

  static isValidJWT(token: string) {
    try {
      const decode: DecodeToken = jwtDecode(token);

      return decode && decode.exp * 1000 >= Date.now();
    } catch (error) {
      throw new Error(error);
    }
  }
}
