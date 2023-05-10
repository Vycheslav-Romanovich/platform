import staticUrls from '../../api_client/staticUrls';
import UserStore from './index';
import UserStorage from './UserStorage';

export default class UserStorageSync extends UserStorage {
  private frame: Element | null = null;

  constructor() {
    super();
    if (typeof window !== 'undefined') {
      this.frame = document.querySelector('#blank-auth');
    }
  }

  get() {
    return new Promise<string>((resolve, reject) => {
      let token;
      this._send('getToken')
        .then((data: { token: string }) => {
          token = data.token;
          if (token && !UserStore.isValidJWT(token)) {
            return resolve('INVALID_TOKEN');
          }
          if (token === null) {
            return resolve('NO_TOKEN');
          }
          return resolve(token);
        })
        .catch(() => {
          reject('Something goes wrong in sync auth');
        });
    });
  }

  save(token: string) {
    this._send({
      type: 'logIn',
      data: {
        token,
      },
    }).then();
  }

  remove() {
    this._send('logOut').then();
  }

  useUpdateToken(callback: (token?: string) => void) {
    window.addEventListener('message', (event) => {
      if (event.origin !== staticUrls.tutor) return;
      const e = event.data;
      const token = e.changeToken;
      if (token !== undefined) {
        if (token) {
          callback(e.changeToken);
        } else {
          callback();
        }
      }
    });
  }

  private _send(message: string | { type: string; data: { token: string } }) {
    return new Promise((resolve, reject) => {
      let data: undefined;

      function listenMessage(e) {
        if (e.origin !== staticUrls.tutor) return;
        data = e.data;
        window.removeEventListener('message', listenMessage);
        return resolve(data);
      }

      window.addEventListener('message', listenMessage);
      this.frame?.contentWindow.postMessage(message, staticUrls.tutor);

      setTimeout(() => {
        if (!data) {
          reject('timeout error');
          window.removeEventListener('message', listenMessage);
        }
      }, 10000);
    });
  }

  getAvatar() {
    return new Promise<string>(() => {});
  }
  removeAvatar() {}
  saveAvatar() {}
}
