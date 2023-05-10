import React from 'react';

import { SetWordsListType } from '../../models/model_verbs';

import style from './Answer.module.css';

type PropsAnswerType = {
  isCheck: boolean;
  isCheckForm_1: string;
  isCheckForm_2: string;
  isCheckForm_3: string;
  styleForm_1: string;
  styleForm_2: string;
  styleForm_3: string;
  wordList_1: SetWordsListType;
  wordList_2: SetWordsListType;
  wordList_3: SetWordsListType;
  setCancelWordHandler: (id: string) => void;
};
const Answer = (props: PropsAnswerType) => {
  return (
    <div>
      <div className={style.blockWordList}>
        <div>
          <div
            onClick={() => props.setCancelWordHandler(props.wordList_1.id)}
            className={props.isCheck ? props.isCheckForm_1 : props.styleForm_1}
          >
            {props.wordList_1.word}
          </div>
          <div className={style.bottomSignature}>Infinitive</div>
        </div>
        <div>
          <div
            onClick={() => props.setCancelWordHandler(props.wordList_2.id)}
            className={props.isCheck ? props.isCheckForm_2 : props.styleForm_2}
          >
            {props.wordList_2.word}
          </div>
          <div className={style.bottomSignature}>Past Simple</div>
        </div>

        <div>
          <div
            onClick={() => props.setCancelWordHandler(props.wordList_3.id)}
            className={props.isCheck ? props.isCheckForm_3 : props.styleForm_3}
          >
            {props.wordList_3.word}
          </div>
          <div className={style.bottomSignature}>Past Participle </div>
        </div>
      </div>
    </div>
  );
};

export default Answer;
