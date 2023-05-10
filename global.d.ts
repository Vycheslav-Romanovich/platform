interface Window {
  dataLayer?: object[];
  FB?: any;
  gapi?: import('@types/gapi.auth2');
}

interface Element {
  contentWindow?: any;
}

interface Document {
  selection?: any;
}

interface ParentNode {
  getClientRects(): {
    top: number;
    left: number;
    right: number;
    bottom: number;
    height: number;
    width: number;
  };
  id: string;
  offsetWidth: number;
}

declare namespace NodeJS {
  interface ProcessEnv {
    APP_ENV: 'development' | 'production' | 'local';
    IS_PROD: boolean;
    CURRENT_SITE_URL: string;
    PRODUCT_SERVER_URL: string;
    PRODUCT_SERVER_RECOMENDED_VIDEO_URL: string;
    GOOGLE_CLIENT_ID: string;
  }
}
