import { Button, Modal, ModalBody, ModalHeader } from 'react-bootstrap';
import { SubscribeRecipientModal} from "~/models/transfer";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {API, NICK_NAME} from "~/constants";
import {FetchMethod, Recipient} from "~/models";
import {useFetch} from "~/hooks";
import {useNotify} from "~/hooks/useNotify";

export function SubscribeRecipient({ recipientNo ,openState, setOpenState, redirectTo }: SubscribeRecipientModal) {
  const {
    register,
    handleSubmit,
  } = useForm<Recipient>();

  const { api } = useFetch();
  const navigate = useNavigate();
  const {showNotifications} = useNotify();

  const handleClose = () => setOpenState(false);

  const onSubmit = async (dto: Recipient) => {
    const {json, error} = await api<Recipient>(FetchMethod.POST, API.customer.recipients.post, {
      ...dto,
      nickname: dto.nickname !== '' ? dto.nickname : undefined,
      recipientNumber: recipientNo,
    });
    if (error) {
      showNotifications('Cannot subscribe recipient', error, {type: "danger"});
    }
    else {
      showNotifications('Subscribe recipient successfully', 'Recipient Saved successfully, now you can visit recipient page to checkout your saved recipients', {type: "success"});
      navigate(redirectTo);
      handleClose();
    }
  };

  return (
    <Modal show={openState} onHide={handleClose}>
      <ModalHeader>Would you like to save this recipient for later using ? </ModalHeader>
      <ModalBody>
        <p>We highly recommend that you should save your recipient to whom you has just interacted with.
          This way, You can save them or add them in recipient page, transfer or paid off really quick thank you.</p>
        <form className="form-save-recipient" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-outline mb-3">
            <label className="form-label" htmlFor="accountNumber">
              Nick Name:
            </label>
            <input
              type="text"
              id={NICK_NAME}
              className="form-control box-shadow-none"
              {...register(NICK_NAME)}
            />
          </div>
          <div className="submit_btn d-flex justify-content-end">
            <Button className={'me-3'} variant="primary" type={'submit'}>
              Save
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </form>
      </ModalBody>

    </Modal>
  );
}
