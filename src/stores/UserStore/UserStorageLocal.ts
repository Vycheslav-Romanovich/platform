import { Storage } from '@capacitor/storage';

import UserStorage from './UserStorage';

export default class UserStorageLocal extends UserStorage {
  private storageNameToken = 'access_token';
  private storageAvatar = 'avatar';

  async get() {
    const resp = await Storage.get({ key: this.storageNameToken });
    return resp.value;
  }

  async remove() {
    return await Storage.remove({ key: this.storageNameToken });
  }

  async save(token: string) {
    return await Storage.set({ key: this.storageNameToken, value: token });
  }

  async getAvatar() {
    const resp = await Storage.get({ key: this.storageAvatar });
    return resp.value;
  }

  async removeAvatar() {
    return await Storage.remove({ key: this.storageAvatar });
  }

  async saveAvatar(value: string) {
    return await Storage.set({ key: this.storageAvatar, value });
  }
}
