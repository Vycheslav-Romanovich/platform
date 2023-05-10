import React from 'react';

import { Group } from '../../models/model_verbs';
import { Alert } from '../Alert';

import style from './ChooseVerb.module.scss';

type PropsChooseVerbType = {
  random: Group[] | undefined;
  setWordHandler: (form: any, id: any) => void;
  wordList_1: { id: string; wordId: number; word: string };
  wordList_2: { id: string; wordId: number; word: string };
  wordList_3: { id: string; wordId: number; word: string };
  allFormsForAlert: string | undefined;
  failHandling: () => void;
  showAlert: boolean;
  isHint: boolean;
};

const ChooseVerb = (props: PropsChooseVerbType) => {
  return (
    <div>
      <div className={style.wrap}>
        {(props.showAlert || props.isHint) && (
          <Alert
            title={'Right answer:'}
            verbs={props.allFormsForAlert}
            textButton={'Continue'}
            failHandling={props.failHandling}
          />
        )}
        <div className={style.block}>
          {props.random?.map((el: any) => (
            <div
              key={el.id}
              onClick={() => props.setWordHandler(el.form, el.id)}
              className={
                el.id === props.wordList_1.wordId ||
                el.id === props.wordList_2.wordId ||
                el.id === props.wordList_3.wordId
                  ? style.wordChooseList
                  : style.wordFromList
              }
            >
              {el.form}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChooseVerb;
