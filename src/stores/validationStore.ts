import autoBind from 'auto-bind';
import { action, observable } from 'mobx';

export interface objValidate {
  word: boolean;
  translate: boolean;
}

export default class ValidationStore {
  @observable objValidate: objValidate = {
    word: false,
    translate: false,
  };

  @observable objValidateSpace: objValidate = {
    word: false,
    translate: false,
  };

  constructor() {
    autoBind(this);
  }

  @action validationFields = (value) => {
    return value?.map((value) => {
      if (!value.word) {
        this.objValidate.word = true;
      }
      if (!value.translate) {
        this.objValidate.translate = true;
      }
    });
  };

  @action validateSpace = (value) => {
    const pattern = /^[\s]+$/;
    return value?.map((item) => {
      if (pattern.test(item.word)) {
        this.objValidateSpace.word = true;
      }
      if (pattern.test(item.translate)) {
        this.objValidateSpace.translate = true;
      }
    });
  };

  @action clearObjStore() {
    this.objValidate = {
      word: false,
      translate: false,
    };
    this.objValidateSpace = {
      word: false,
      translate: false,
    };
  }
}
