import { Button, Modal, ModalHeader, ModalBody } from 'react-bootstrap';
import {
  FetchMethod,
  IDebitModalManagement,
  OtpResponse,
  PayerType,
  TransferResponse,
  TransferType
} from "~/models";

import {OtpModal} from "~/components/Otp/OtpModal";
import {useState} from "react";
import {API} from "~/constants";
import {useFetch} from "~/hooks";
import {useNotify} from "~/hooks/useNotify";


export function PaidOffModal(
{
  data,
  openState,
  setOpenState,
  setRows,
 }: IDebitModalManagement) {
  const handleClose = () => setOpenState(false);
  const [otpModal, setOtpModal] = useState(false);
  const {showNotifications} = useNotify();
  const { api } = useFetch();

  async function paidDebt() {
    const {json, error} = await api<OtpResponse>(FetchMethod.POST, API.auth.otp, {type: TransferType.PAID_OFF});
    setOpenState(false);
    setOtpModal(true);
    if (error) {
      showNotifications('Cannot send OTP to your email', error, {type: "danger"});
    }
    else if(json?.success){
      showNotifications('An OTP sent to your email', 'A email message with a 6-digit verification code was just sent to your email', {type: "success"});
    }
  }

  async function payoffDebit(otp : string) {
    if (data) {
      const value = {
        recipientNumber: data?.CreditorAccount?.number,
        recipientBankId: data?.CreditorAccount?.bankId,
        amount: data.amount,
        content: data.content,
        type: TransferType.PAID_OFF,
        feePayer: PayerType.SENDER,
      }
      const {json, error} = await api<TransferResponse>(FetchMethod.POST, API.transaction.post, {...value, otp});
      if (error) {
        showNotifications(`Your ${TransferType.PAID_OFF} is unsuccessfully !`, error, {type: "danger"});

      }
      else if(json?.success){
        showNotifications(`Your ${TransferType.PAID_OFF} is successfully`, '', {type: "success"});

        if(setRows){
          setRows([]);
        }
      }
    }
    else {
      showNotifications(`Your ${TransferType.PAID_OFF} is unsuccessfully !`, 'no information given !', {type: "danger"});
    }
  }

  return (
  <>
    <Modal show={openState} onHide={handleClose}>
      <ModalHeader>Do you really want to paid this debt reminder?</ModalHeader>
      <ModalBody>
          <div className="submit__wrap d-flex justify-content-end">
            <Button className="btn delete-btn me-2" onClick={() => paidDebt()} >Paid Debt</Button>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </div>

      </ModalBody>
    </Modal>
    <OtpModal otpModal={otpModal} setOtpModal={setOtpModal} handleWithOtp={payoffDebit} />
  </>
  );
}
