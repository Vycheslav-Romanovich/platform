import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  FormHelperText,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { observer } from 'mobx-react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import TeacherWithStudents from '~/assets/images/teacherWithStudents.svg';

import styles from './index.module.scss';

import { FirstLetterAvatar } from '~/entities/FirstLetterAvatar';
import { FullViewModal } from '~/modals/fullViewModal';
import { teacherClassesStore, userStore } from '~/stores';
import { IAddTeacherClassRequest } from '~/types/api';
import { IClass } from '~/types/teacherClass';
import BackDrop from '~/UI/backdrop';
import { ChoosePlan } from '~/widget/ChoosePlan';

type Props = {
  isOpen: boolean;
  close: () => void;
  isCreateModal?: boolean;
  isTeacherClass?: boolean;
  shouldAssignLesson?: boolean;
  lessonId?: number;
};

const CreateClass: FC<Props> = ({
  isOpen,
  close,
  isCreateModal,
  isTeacherClass,
  shouldAssignLesson,
  lessonId,
}) => {
  const { push } = useRouter();
  const { t } = useTranslation();
  const isMdSize = useMediaQuery('(max-width:767px)');
  const isKeyboardHeight = useMediaQuery('(max-height:470px)');
  // const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  // const popoverOpen = Boolean(anchorEl);
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState<IClass>();
  const [fields, setFields] = useState<IAddTeacherClassRequest>({ name: '' });
  const [classAvatarPreview, setClassAvatarPreview] = useState<string | null>(null);

  // const id = popoverOpen ? 'simple-popover' : undefined;
  const isPrem = userStore.user?.isActivePremium;

  const secondTitleStyles = {
    color: 'var(--L_Grey)',
    alignSelf: { xs: 'flex-start', md: 'auto' },
    paddingBottom: { xs: '12px', md: 0 },
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, name: event.target.value });
  };

  // const openPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  //   setTimeout(() => {
  //     setAnchorEl(null);
  //   }, 2000);
  // };

  const uploadCover = () => {
    if (!isPrem) {
      setIsPlanOpen(true);
      closeModal();
    }
    isPrem && (document as Document).getElementById('file-upload').click();
  };

  const handleCreateTeacherClass = async (
    data: IAddTeacherClassRequest,
    shouldAssignLesson?: boolean,
    lessonId?: number
  ) => {
    try {
      const teacherClassData = await teacherClassesStore.postTeacherClass(data);
      teacherClassesStore.toggleInviteStudentsModal(true);
      if (shouldAssignLesson) {
        await teacherClassesStore.addTeacherLesson({ classId: teacherClassData.id, lessonId });
      }
      await closeModal();
      setTimeout(() => {
        push(`/teacher-classes/${teacherClassesStore?.teacherClass.id}`);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateTeacherClass = async (data: IAddTeacherClassRequest, classId: number) => {
    try {
      await teacherClassesStore.updateTeacherClass(data, classId);
      await closeModal();
      setClassAvatarPreview(null);
      isTeacherClass
        ? await teacherClassesStore.getTeacherClassData(classId)
        : await teacherClassesStore.getClassesByUserId();
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setClassAvatarPreview(null);
    close();
    setFields({ name: '' });
  };

  const loadImageFromDevice = (event) => {
    (document as Document).getElementById('file-upload').click();

    const file = event.target.files[0];

    if (file.size > 4194304) {
      console.error('TOO_LARGE_COVER');
      return;
    }
    setFields({ ...fields, avatarUrl: file });

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      event.target.value = null;
      typeof reader.result === 'string' && setClassAvatarPreview(reader.result);
    };
  };

  const selectCorrectAvatar = () => {
    if (isCreateModal) {
      return classAvatarPreview ? (
        <Image
          width={'44px'}
          height={'44px'}
          className={styles.img}
          src={classAvatarPreview}
          alt="classCover"
        />
      ) : (
        <FirstLetterAvatar title={fields.name} />
      );
    } else {
      return classAvatarPreview ||
        currentClass?.avatarUrl ||
        teacherClassesStore?.teacherClassData[0]?.avatarUrl ? (
        <Image
          width={'44px'}
          height={'44px'}
          className={styles.img}
          src={
            classAvatarPreview ||
            currentClass?.avatarUrl ||
            teacherClassesStore?.teacherClassData[0]?.avatarUrl
          }
          alt="classCover"
        />
      ) : (
        fields.name && <FirstLetterAvatar title={fields.name} />
      );
    }
  };

  useEffect(() => {
    if (teacherClassesStore.classesData[0]) {
      const currentClass = teacherClassesStore.classesData[0]['teacherClasses']?.filter(
        (classData) => classData.id === teacherClassesStore.classDataId?.classId
      );
      setCurrentClass(currentClass[0]);
      setFields({
        ...fields,
        name: isCreateModal
          ? ''
          : currentClass[0]?.name || teacherClassesStore.teacherClassData[0].name,
      });
    }
  }, [teacherClassesStore.classDataId, isCreateModal]);

  return (
    <>
      <FullViewModal
        isOpen={isPlanOpen}
        close={() => {
          setIsPlanOpen(false);
        }}
        title={'Switch to another plan to make your lesson private'}
      >
        <ChoosePlan openFromPopup />
      </FullViewModal>

      <Dialog
        fullScreen={isMdSize}
        open={isOpen}
        onClose={closeModal}
        sx={{ '& .MuiModal-backdrop': { backgroundColor: 'transparent' } }}
        PaperProps={!isMdSize && { sx: { borderRadius: '20px' } }}
      >
        <div className={styles.innerWrapper}>
          <IconButton aria-label="Close modal" className={styles.closeClass} onClick={closeModal}>
            <CloseIcon />
          </IconButton>

          <h2>{isCreateModal ? t('createClass.createClass') : t('createClass.editClass')}</h2>

          <TeacherWithStudents className={styles.teacherWithStudents} alt="TeacherWithStudents" />

          <div className={styles.cover}>
            <div className={styles.updateField}>
              <Typography variant={'h4'} sx={secondTitleStyles}>
                {t('createClass.cover')}
              </Typography>

              <div className={styles.uploadCoverContainer}>
                <div className={styles.imgContainer}>{selectCorrectAvatar()}</div>

                <Button
                  onClick={uploadCover}
                  variant="outlined"
                  style={{ minWidth: '190px', height: '44px', width: '100%' }}
                >
                  {!isPrem && (
                    <div className={styles.lockImg}>
                      <Image src="/assets/icons/lock.svg" width="24px" height="24px" alt="lock" />
                    </div>
                  )}
                  {t('createClass.upload')}
                </Button>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  onChange={loadImageFromDevice}
                />
              </div>
            </div>

            <div className={styles.updateField}>
              <Typography variant={'h4'} sx={secondTitleStyles}>
                {t('createClass.title')}
              </Typography>

              <TextField
                sx={{ width: '100%', maxWidth: { xs: '100%', md: '250px' } }}
                name="name"
                focused
                label={'Class’s title'}
                variant="filled"
                color="secondary"
                type="text"
                value={fields.name}
                inputProps={{ maxLength: 50 }}
                onChange={handleChangeName}
              />
              <FormHelperText sx={{ textAlign: 'end' }}>{fields.name.length}/50</FormHelperText>
            </div>
          </div>

          {!isKeyboardHeight && (
            <div className={styles.buttons}>
              <Button
                onClick={closeModal}
                size="large"
                variant="outlined"
                style={{ minWidth: '106px', width: '100%', height: '44px' }}
              >
                {t('account.cancel')}
              </Button>
              {isCreateModal ? (
                <Button
                  onClick={() => handleCreateTeacherClass(fields, shouldAssignLesson, lessonId)}
                  variant="contained"
                  style={{ minWidth: '106px', width: '100%', height: '44px' }}
                >
                  {t('step.create')}
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    handleUpdateTeacherClass(fields, teacherClassesStore.classDataId.classId)
                  }
                  variant="contained"
                  style={{ minWidth: '106px', width: '100%', height: '44px' }}
                >
                  {t('account.save')}
                </Button>
              )}
            </div>
          )}
        </div>
        <BackDrop show={isOpen} onClick={closeModal} />
      </Dialog>
    </>
  );
};
export default observer(CreateClass);
