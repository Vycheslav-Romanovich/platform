import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { Button, TextareaAutosize, TextField } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import styles from './helpButton.module.scss';

import api from '~/api_client/api';
import { useInput } from '~/customHooks/useValidation';
import { sendEvent } from '~/helpers/sendToGtm';
import { userStore } from '~/stores';

const HelpButton = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const name = useInput('', { isEmpty: true, isEmail: false });
  const email = useInput('', { isEmpty: true, isEmail: true });
  const description = useInput('', { isEmpty: true, isEmail: false });
  const [showResultMessage, setShowResultMessage] = useState<boolean>(false);
  const [messageWasSend, setMassageWasSend] = useState<'succeed' | 'pending' | 'error'>('pending');
  const [nameInputError, setNameInputError] = useState<boolean>(false);
  const [emailInputError, setEmailInputError] = useState<boolean>(false);
  const [messageInputError, setMessageInputError] = useState<boolean>(false);
  const { t } = useTranslation();

  const sendEmail = (event: SyntheticEvent) => {
    event.preventDefault();
    if (!name.value || !description.value || (!userStore.isAuth && !email.value)) {
      setEmailInputError(true);
      setNameInputError(true);
      setMessageInputError(true);
    } else {
      api
        .sendSupportMail({
          text: description.value,
          from: userStore.isAuth ? userStore.user.email : email.value,
          name: name.value,
          subject: 'support eLang-edu',
        })
        .then(() => {
          name.clear();
          email.clear();
          description.clear();
          setShowResultMessage(true);
          setMassageWasSend('succeed');
        })
        .catch((err) => {
          setMassageWasSend('error');
          console.error(err);
        });
    }
    sendEvent('leave_feedback');
  };

  const handleClickHepl = () => {
    !showModal && sendEvent('help');
    setShowModal(!showModal);
    setMessageInputError(false);
    setEmailInputError(false);
    setNameInputError(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMassageWasSend('pending');
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [showResultMessage]);

  return (
    <div className={styles.isShown}>
      {showModal && (
        <form onSubmit={sendEmail}>
          <div className={styles.feedbackWindow}>
            <div className={styles.title}>{t('helpButton.titleDo')}</div>
            <TextField
              error={nameInputError}
              name={'name'}
              variant="filled"
              value={name.value}
              onChange={(e) => {
                name.onChange(e);
                setNameInputError(false);
              }}
              onBlur={name.onBlur}
              label={t('helpButton.labelName')}
              style={{ width: '100%' }}
            />
            {!userStore.isAuth && (
              <TextField
                error={emailInputError}
                name="email"
                variant="filled"
                value={email.value}
                onChange={(e) => {
                  email.onChange(e);
                  setEmailInputError(false);
                }}
                onBlur={email.onBlur}
                label={t('helpButton.labelEmail')}
                style={{ width: '100%' }}
              />
            )}
            <TextareaAutosize
              className={messageInputError ? styles.textareaError : styles.textarea}
              style={{ width: '100%', minHeight: 144 }}
              value={description.value}
              onChange={(e) => {
                description.onChange(e);
                setMessageInputError(false);
              }}
              placeholder={t('helpButton.placeholder1') + ' \n' + t('helpButton.placeholder2')}
            />
            <div className={styles.sendButtonWrapper}>
              <div
                className={
                  messageWasSend === 'succeed'
                    ? styles.resultWindowCorrect
                    : messageWasSend === 'error'
                    ? styles.resultWindowIncorrect
                    : styles.resultWindowPending
                }
              >
                {messageWasSend === 'succeed' ? (
                  <>
                    <CheckIcon fontSize="small" />
                    {t('helpButton.succeed')}
                  </>
                ) : messageWasSend === 'error' ? (
                  <>
                    <ClearIcon fontSize="small" />
                    {t('helpButton.error')}
                  </>
                ) : (
                  ''
                )}
              </div>
              <Button type="submit" variant="contained" size="large">
                {t('helpButton.send')}
              </Button>
            </div>
          </div>
        </form>
      )}
      <Tooltip
        open={showTooltip && !showModal}
        onOpen={() => setShowTooltip(true)}
        onClose={() => setShowTooltip(false)}
        title={<span className={styles.tooltip}>{t('helpButton.help')}</span>}
        arrow={true}
        placement={'top'}
        className={styles.tooltip}
      >
        <div
          className={showModal ? styles.openedButton : styles.closedButton}
          onClick={handleClickHepl}
        >
          {showModal ? <ClearIcon /> : <span style={{ fontSize: 'x-large' }}>?</span>}
        </div>
      </Tooltip>
    </div>
  );
};

export default HelpButton;
