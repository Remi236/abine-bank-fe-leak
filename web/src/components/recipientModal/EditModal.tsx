import { Button, Modal } from 'react-bootstrap';
import {
  IRecipientModalManagement,
  Recipient,
} from '~/models/customers';
import { useForm } from 'react-hook-form';
import {API, NICK_NAME, RECIPIENT_ID} from '~/constants';
import {useFetch} from "~/hooks";
import {useAsync} from "react-use";
import {Get} from "shared";
import {FetchMethod} from "~/models";
import {Error, Loading} from "~/components";

export function EditModal({
  data,
  openState,
  setOpenState,
  handleSubmitModal,
}: IRecipientModalManagement) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Recipient>();

  const { api } = useFetch();
  const state = useAsync(async () => await api<Get['RecipientTransaction'][]>(FetchMethod.GET, API.customer.recipients.transactions));
  const recipientAccounts = state.value?.json;

  const handleClose = () => setOpenState(false);

  const onSubmit = async (dto: Recipient) => {
    if (
      errors &&
      Object.keys(errors).length === 0 &&
      Object.getPrototypeOf(errors) === Object.prototype &&
      handleSubmitModal
    ) {
      handleSubmitModal(dto);
      handleClose();
    }
  };

  const renderBody = () => {

    if (state.loading) {
      return <Loading />;
    }

    if (state?.value?.error) {
      return <Error message={state.value.error} />;
    }

    if (recipientAccounts == null) {
      return null;
    }

    return (
      <form className="form-login" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-outline mb-3">
          <label className="form-label" htmlFor="accountNumber">
            Account No:
          </label>
          <select id={RECIPIENT_ID} name={RECIPIENT_ID} className={'w-100 form-select'} defaultValue={data ? data[RECIPIENT_ID] : ""} disabled>
            <option value={""}>Select Account</option>
            {
              recipientAccounts.map((item, index) => (
                <option value={item[RECIPIENT_ID]} key={index}>{item.number}</option>
              ))
            }
          </select>
        </div>
        <div className="form-outline mb-3">
          <label className="form-label" htmlFor="accountNumber">
            Full Name: {data?.fullname}
          </label>
        </div>
        <div className="form-outline mb-3">
          <label className="form-label" htmlFor="accountNumber">
            Bank Name: {data?.bankName}
          </label>
        </div>
        <div className="form-outline mb-3">
          <label className="form-label" htmlFor="accountNumber">
            Nick Name:
          </label>
          <input
            type="text"
            id={NICK_NAME}
            className="form-control box-shadow-none"
            {...register(NICK_NAME)}
            defaultValue={data?.nickname || ''}
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
    );
  };

  return (
    <div>
      <Modal show={openState} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Recipient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderBody()}
        </Modal.Body>
      </Modal>
    </div>
  );
}
