import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useNumber } from 'common/hooks/useNumber';
import { useFadeAnimation } from 'common/hooks/useFade';
import { useInput } from 'common/hooks/useInput';
import { fetchSignUp } from 'common/apis/auth';
import Title from 'components/atoms/Title/Title';
import InputLabelBox from 'components/molecules/InputLabelBox/InputLabelBox';
import BasicButton from 'components/atoms/Button/BasicButton/BasicButton';
import Message from 'components/atoms/Message/Message';
import Modal from 'components/organisms/Modal/Modal';
import { FaUserGraduate, FaAddressCard, FaKey, FaEnvelope, FaPhone } from 'react-icons/fa';
import { PRIME_COLOR_CODE, PRIME_HOVER_COLOR_CODE, DISABLE_COLOR_CODE, DISABLE_HOVER_COLOR_CODE } from 'common/theme';
import { StyledSignUpForm, StyledButtonWrapper } from './SignUpForm.styled';

interface ModalState {
  isModalActive: boolean;
  modalStatus: 'error' | 'warn' | 'confirm';
  modalMessage: string;
  onClickConfirm?: (...args: any) => any;
  onClickCancel?: (...args: any) => any;
}

const SignUpForm: React.FC = () => {
  const [studentId, handleStudentId] = useNumber();
  const [studnetName, handleStudentName] = useInput();
  const [email, handleEmail] = useInput();
  const [phone, handlePhone] = useNumber();
  const [password, handlePassword] = useInput();
  const [passwordConfirm, handlePasswordConfirm] = useInput();

  const [modalState, setModalState] = useState<ModalState>({
    isModalActive: false,
    modalStatus: 'error',
    modalMessage: '',
  });

  const history = useHistory();
  const [passwordConfirmMsgRef, messageFade] = useFadeAnimation();

  const userGraduateIcon = useMemo(() => <FaUserGraduate />, []);
  const addressCardIcon = useMemo(() => <FaAddressCard />, []);
  const keyIcon = useMemo(() => <FaKey />, []);
  const envelopeIcon = useMemo(() => <FaEnvelope />, []);
  const phoneIcon = useMemo(() => <FaPhone />, []);

  const toggleModalActive = () => setModalState(prev => ({ ...prev, isModalActive: !prev.isModalActive }));

  const isPasswordConfirmValid = () => {
    if (password === passwordConfirm) {
      return true;
    }
    return false;
  };

  const isEmailValid = () => {
    const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if (regExp.test(email)) {
      return true;
    }
    return false;
  };

  const goLoginPage = useCallback(() => {
    history.push('/login');
  }, [history]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    if (!isPasswordConfirmValid()) {
      setModalState({
        isModalActive: true,
        modalStatus: 'error',
        modalMessage: '???????????? ????????? ????????????????????????',
        onClickConfirm: toggleModalActive,
      });
      return;
    }

    if (!isEmailValid()) {
      setModalState({
        isModalActive: true,
        modalStatus: 'error',
        modalMessage: '????????? ????????? ??????????????????. ????????? ????????? ?????? ??????????????????',
        onClickConfirm: toggleModalActive,
      });
      return;
    }

    const signupResponse = await fetchSignUp({ studentId, name: studnetName, email, phone, password });

    if (signupResponse?.status === 409) {
      setModalState({
        isModalActive: true,
        modalStatus: 'error',
        modalMessage: '???????????? ???????????? ????????? ???????????? ???????????????',
        onClickConfirm: toggleModalActive,
      });
      return;
    }

    if (signupResponse?.status === 200) {
      setModalState({
        isModalActive: true,
        modalStatus: 'confirm',
        modalMessage: '??????????????? ????????? ?????????????????????',
        onClickConfirm: goLoginPage,
      });
    }
  };

  useEffect(() => {
    if (password.length === 0 || passwordConfirm.length === 0) {
      messageFade(false);
      return;
    }

    if (password === passwordConfirm) {
      messageFade(false);
    } else {
      messageFade(true);
    }
  }, [password, passwordConfirm, messageFade]);

  return (
    <StyledSignUpForm onSubmit={handleSubmit}>
      {modalState.isModalActive && (
        <Modal
          type={modalState.modalStatus}
          onClickConfirm={modalState.onClickConfirm}
          onClickOutside={modalState.onClickConfirm}
        >
          {modalState.modalMessage}
        </Modal>
      )}

      <Title className="signup-title" color={PRIME_COLOR_CODE} fontSize="1.75rem" center>
        ????????????
      </Title>

      <InputLabelBox
        inputId="student-id"
        icon={userGraduateIcon}
        className="input-label-box"
        label="??????"
        labelSize="1.125rem"
        labelFor="student-id"
        color={PRIME_COLOR_CODE}
        value={studentId}
        required
        placeholder="????????? 8????????? ???????????????"
        minLength={8}
        maxLength={8}
        onChange={handleStudentId}
      />

      <InputLabelBox
        inputId="student-name"
        icon={addressCardIcon}
        className="input-label-box"
        label="??????"
        labelSize="1.125rem"
        labelFor="student-name"
        color={PRIME_COLOR_CODE}
        value={studnetName}
        required
        placeholder="????????? ???????????????"
        minLength={2}
        maxLength={15}
        onChange={handleStudentName}
      />

      <InputLabelBox
        inputId="student-password"
        icon={keyIcon}
        className="input-label-box"
        label="????????????"
        labelSize="1.125rem"
        labelFor="student-password"
        color={PRIME_COLOR_CODE}
        value={password}
        required
        inputType="password"
        placeholder="???????????? 8-20?????? ???????????????"
        minLength={8}
        maxLength={20}
        onChange={handlePassword}
      />

      <InputLabelBox
        inputId="student-password-confirm"
        icon={keyIcon}
        className="input-label-box"
        label="???????????? ??????"
        labelSize="1.125rem"
        labelFor="student-password-confirm"
        color={PRIME_COLOR_CODE}
        value={passwordConfirm}
        required
        inputType="password"
        placeholder="??????????????? ?????? ??? ???????????????"
        minLength={8}
        maxLength={20}
        onChange={handlePasswordConfirm}
      />
      <Message className="error-message fade-animation-init" _ref={passwordConfirmMsgRef} color="#ee415c">
        ??????????????? ???????????? ????????????
      </Message>

      <InputLabelBox
        inputId="student-email"
        icon={envelopeIcon}
        className="input-label-box"
        label="?????????"
        labelSize="1.125rem"
        labelFor="student-email"
        color={PRIME_COLOR_CODE}
        value={email}
        required
        placeholder="???????????? ???????????????"
        onChange={handleEmail}
      />

      <InputLabelBox
        inputId="student-phone"
        icon={phoneIcon}
        className="input-label-box"
        label="?????????"
        labelSize="1.125rem"
        labelFor="student-phone"
        color={PRIME_COLOR_CODE}
        value={phone}
        required
        placeholder="????????? ????????? '-' ?????? ??????????????????"
        onChange={handlePhone}
      />

      <StyledButtonWrapper>
        <BasicButton
          className="signup-form-button"
          type="button"
          backgroundColor={DISABLE_COLOR_CODE}
          hoverColor={DISABLE_HOVER_COLOR_CODE}
          onClick={goLoginPage}
        >
          ????????????
        </BasicButton>
        <BasicButton
          className="signup-form-button"
          type="submit"
          backgroundColor={PRIME_COLOR_CODE}
          hoverColor={PRIME_HOVER_COLOR_CODE}
        >
          ????????????
        </BasicButton>
      </StyledButtonWrapper>
    </StyledSignUpForm>
  );
};

export default SignUpForm;
