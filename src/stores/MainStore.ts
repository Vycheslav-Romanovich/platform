import { Capacitor } from '@capacitor/core';
import { OrientationType } from '@robingenz/capacitor-screen-orientation';
import autoBind from 'auto-bind';
import MobileDetect from 'mobile-detect';
import { action, computed, makeAutoObservable, observable } from 'mobx';

export type Platform = 'ios' | 'android' | 'web' | 'mobile';

export default class Main {
  readonly limitWidth = 600;
  @observable usedPlatform: Platform = 'web';
  @observable orientation: OrientationType;
  @observable userAgent = '';
  @observable deviceWidth: number;
  @observable deviceInnerWidth: number;
  @observable startTime: Date;
  @observable showNotification = true;

  @observable installReady: boolean;
  @observable installFunc: () => void;

  @computed get isInAppInstagram() {
    return this.userAgent.indexOf('instagram') !== -1;
  }

  @computed get isInAppChromeOnIos() {
    return this.userAgent.indexOf('crios') !== -1;
  }

  @computed get isIos() {
    return /iphone|ipad|ipod/.test(this.userAgent);
  }

  @computed get isAndroid() {
    return this.userAgent.indexOf('android') !== -1;
  }

  constructor() {
    makeAutoObservable(this);
    autoBind(this);
    this.installReady = false;
    this.startTime = new Date();
    if (typeof window !== 'undefined') {
      this.detectUserAgent();
      this.detectUsedPlatform();
      this.getOrientation();
      window.addEventListener('resize', () => {
        this.mobileCheck();
        this.getOrientation();
      });
    }
  }

  @action closeNotification() {
    this.showNotification = false;
  }

  @action mobileCheck() {
    const width = window.outerWidth;
    this.deviceWidth = width;
    this.deviceInnerWidth = window.innerWidth;
    if (width !== 0 && width <= this.limitWidth && this.usedPlatform === 'web') {
      this.usedPlatform = 'mobile';
    } else if (width > this.limitWidth && this.usedPlatform !== 'web') {
      this.usedPlatform = 'mobile';
    }
  }

  @action detectUsedPlatform() {
    const usedPlatform = Capacitor.getPlatform() as Platform;
    if (usedPlatform === 'web') {
      typeof window !== 'undefined' && this.mobileCheck();
    } else {
      this.usedPlatform = usedPlatform;
    }
  }

  @action detectUserAgent() {
    return (this.userAgent = navigator.userAgent.toLowerCase());
  }

  @action installApp() {
    return this.installFunc();
  }

  @action setInstallFunc(func: () => void) {
    return (this.installFunc = func);
  }

  @action setInstallReady(value: boolean) {
    return (this.installReady = value);
  }

  @action getOrientation() {
    return (this.orientation =
      window.outerWidth > window.outerHeight
        ? OrientationType.LANDSCAPE_PRIMARY
        : OrientationType.PORTRAIT_PRIMARY);
  }

  @action setOrientation(value: OrientationType) {
    return (this.orientation = value);
  }

  @computed get isLandscape() {
    return this.orientation === OrientationType.LANDSCAPE_PRIMARY;
  }

  @computed get isWeb() {
    return this.usedPlatform === 'web';
  }

  @computed get isNativeMobile() {
    const md = new MobileDetect(window.navigator.userAgent);
    return !!md.mobile();
  }

  @computed get isMobile() {
    return (
      this.usedPlatform === 'mobile' ||
      this.usedPlatform === 'android' ||
      this.usedPlatform === 'ios'
    );
  }
}
