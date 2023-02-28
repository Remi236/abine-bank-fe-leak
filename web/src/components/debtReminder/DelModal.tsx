import { Button, Modal, ModalHeader, ModalBody } from 'react-bootstrap';
import { Debt, IDebitModalManagement} from "~/models";
import {useForm} from "react-hook-form";

export function DelModal({
  openState,
  setOpenState,
 handleSubmitModal,
}: IDebitModalManagement) {
  const handleClose = () => setOpenState(false);
  const {
    register,
    handleSubmit,
  } = useForm<Debt>();

  async function onSubmit(dto: Debt) {
    if (handleSubmitModal) {
      handleSubmitModal(dto);
      handleClose();
    }
  }

  return (
    <div>
      <Modal show={openState} onHide={handleClose}>
        <ModalHeader>Do you really want to remove this debt reminder?</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-outline mb-3"  >
              <label className="form-label" htmlFor="content">
                Content:
              </label>
              <textarea className={'form-control'} style={{ height: 100 }} id="content" {...register('content')} />
            </div>
            <div className="submit__wrap d-flex justify-content-end">
              <Button className="btn delete-btn me-2" type='submit' >Delete</Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
