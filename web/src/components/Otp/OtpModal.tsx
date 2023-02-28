import { Button, Modal, ModalBody, ModalHeader } from 'react-bootstrap';
import OtpInput from '~/components/Otp/OtpInput';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IOtpForm, OtpModalType, otpSchema } from '~/models';

export function OtpModal({ otpModal, setOtpModal, handleWithOtp }: OtpModalType) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<IOtpForm>({
    resolver: yupResolver(otpSchema),
  });

  const [otp, setOtp] = useState('');
  const onChange = (value: string) => {
    setOtp(value);
    setValue('otp', value);
  };

  const onSubmit = async () => {
    handleWithOtp(otp);
    setOtpModal(!otpModal);
  };

  return (
    <div className="modal-wrap">
      <Modal show={otpModal} onHide={() => setOtpModal(!otpModal)}>
        <ModalHeader className="text-center fw-bold">OTP Verify</ModalHeader>
        <ModalBody>
          <p> A email message with a 6-digit verification code was just sent to your email</p>
          <form className="form-forgot-pass" onSubmit={handleSubmit(onSubmit)}>
            <OtpInput value={otp} valueLength={6} onChange={onChange} />
            <input type={'hidden'} {...register('otp', { required: true })} />
            <p className="text-danger">{errors.otp?.message}</p>
            <div className="btn_submit d-flex justify-content-end">
              <Button className="btn delete-btn me-2" type={'submit'}>
                Confirm
              </Button>
              <Button variant="secondary" onClick={() => setOtpModal(!otpModal)}>
                Cancel
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
