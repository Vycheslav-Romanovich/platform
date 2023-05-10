import { useEffect, useState } from 'react';

export const useValidation = (value, check, validations) => {
  const [isEmpty, setIsEmpty] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const [isPolitics, setIsPolitics] = useState(true);
  const [inputValid, setInputValid] = useState(false);
  const [minLengthError, setMinLengthError] = useState(false);
  const [maxLengthError, setMaxLengthError] = useState(false);
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const pattern = /^[\s]+$/;

  useEffect(() => {
    for (const validation in validations) {
      switch (validation) {
        case 'minLength':
          value.length < validations[validation]
            ? setMinLengthError(true)
            : setMinLengthError(false);
          break;
        case 'maxLength':
          value.length > validations[validation]
            ? setMaxLengthError(true)
            : setMaxLengthError(false);
          break;
        case 'isEmpty':
          !pattern.test(value) && value.trim() ? setIsEmpty(false) : setIsEmpty(true);
          break;
        case 'isEmail':
          return String(value).toLowerCase().match(regex)
            ? setEmailError(false)
            : setEmailError(true);
        case 'isChecked':
          check ? setIsPolitics(true) : setIsPolitics(false);
          check ? setIsEmpty(false) : setIsEmpty(true);
          break;
      }
    }
  }, [value, check]);

  useEffect(() => {
    if (isEmpty || emailError || minLengthError || maxLengthError || !isPolitics) {
      setInputValid(false);
    } else {
      setInputValid(true);
    }
  }, [isEmpty, emailError, minLengthError, maxLengthError, isPolitics]);

  return {
    isEmpty,
    minLengthError,
    maxLengthError,
    emailError,
    isPolitics,
    inputValid,
  };
};

export const useInput = (initialValue, validations) => {
  const [value, setValue] = useState(initialValue);
  const [isDirty, setIsDirty] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const valid = useValidation(value, isChecked, validations);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onChecked = (e) => {
    setIsChecked(e.target.checked);
  };

  const onBlur = () => {
    setIsDirty(true);
  };

  const onClick = () => {
    setOnSubmit(true);
  };

  const clear = () => {
    setValue(initialValue);
  };

  return {
    value,
    onChange,
    onChecked,
    onBlur,
    onClick,
    clear,
    onSubmit,
    isDirty,
    isChecked,
    ...valid,
  };
};
