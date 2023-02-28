import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap';
import { IRecipientModalManagement } from '~/models/customers';

export function DelModal({ openState, setOpenState, handleSubmitDelModal }: IRecipientModalManagement) {
  const handleClose = () => setOpenState(false);
  return (
    <Modal show={openState} onHide={handleClose}>
      <ModalHeader>Are you really sure about this ?</ModalHeader>
      <ModalBody>
        Do you really wish to delete this record ? Careful that we won&apos;t take responsibility anything about this
        record !!
      </ModalBody>
      <ModalFooter>
        <Button
          className="btn delete-btn"
          onClick={() => {
            if (handleSubmitDelModal) {
              handleSubmitDelModal();
              handleClose();
            }
          }}
        >
          Delete
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
