import { Button, Col, Modal, Row } from 'react-bootstrap';
import { IDetailTransactionModal } from '~/models/transaction';
import { PAYER_TYPES, TRANSFER_TYPES } from '~/constants/transaction';
//import { log } from 'shared';

export function DetailModal({ data, openState, setOpenState }: IDetailTransactionModal) {
  const renderBody = () => {
    if (data == null) {
      return null;
    }

    return (
      <>
        <Row>
          <Col>
            <div className="form-outline mb-3">
              <label className="form-label">Account Sender Bank:</label>
              <input type={'text'} className={'form-control'} defaultValue={data.SenderAccount.Bank.name} disabled />
            </div>
            <div className="form-outline mb-3">
              <label className="form-label">Account Sender No:</label>
              <input type={'text'} className={'form-control'} defaultValue={data.SenderAccount.number} disabled />
            </div>
            <div className="form-outline mb-3">
              <label className="form-label">Account Sender Name:</label>
              <input
                type={'text'}
                className={'form-control'}
                defaultValue={data?.SenderAccount?.Customer?.User?.fullname}
                disabled
              />
            </div>
          </Col>

          <Col>
            <div className="form-outline mb-3">
              <label className="form-label">Account Recipient Bank:</label>
              <input type={'text'} className={'form-control'} defaultValue={data.RecipientAccount.Bank.name} disabled />
            </div>
            <div className="form-outline mb-3">
              <label className="form-label">Account Recipient No:</label>
              <input type={'text'} className={'form-control'} defaultValue={data.RecipientAccount.number} disabled />
            </div>
            <div className="form-outline mb-3">
              <label className="form-label">Account Sender Name:</label>
              <input
                type={'text'}
                className={'form-control'}
                defaultValue={data?.RecipientAccount?.Customer?.User?.fullname}
                disabled
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="form-outline mb-3">
              <label className="form-label">Transfer Type:</label>
              <select className={'form-select'} defaultValue={data.type} disabled>
                {TRANSFER_TYPES.map((item, index) => (
                  <option value={item} key={index}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-outline mb-3">
              <label className="form-label" htmlFor="">
                Amount:
              </label>
              <input type={'text'} className={'form-control'} defaultValue={data.amount.toString()} disabled />
            </div>

            <div className="form-outline mb-3">
              <label className="form-label">Free Payer Types:</label>
              <select className={'form-select'} defaultValue={data.feePayer} disabled>
                {PAYER_TYPES.map((item, index) => (
                  <option value={item} key={index}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </Col>
          <Col>
            <div className="form-outline mb-3">
              <label className="form-label">Content:</label>
              <textarea className={'form-control'} style={{ height: 210 }} disabled value={data.content || ''} />
            </div>
          </Col>
        </Row>

        <div className="submit_btn d-flex justify-content-end">
          <Button variant="secondary" onClick={() => setOpenState(false)}>
            Close
          </Button>
        </div>
      </>
    );
  };

  return (
    <div>
      <Modal size="lg" show={openState} onHide={() => setOpenState(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detail Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderBody()}</Modal.Body>
      </Modal>
    </div>
  );
}
