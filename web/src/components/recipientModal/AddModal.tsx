import {Button, Col, Modal, Row, Table} from 'react-bootstrap';
import {
  IRecipientModalManagement,
  Recipient,
  recipientSchema,
} from '~/models/customers';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  API,
  NICK_NAME,
  TRANSACTION_SAVED_RECIPIENTS_COLUMNS,
} from '~/constants';
import {useFetch} from "~/hooks";
import {useAsync} from "react-use";
import {Get} from "shared";
import {FetchMethod} from "~/models";
import {Error, Loading} from "~/components";
import {useState} from "react";
import {TbInfoCircle, TbSearch} from "react-icons/all";
import {params} from "~/helpers";

export function AddModal({
  openState,
  setOpenState,
  handleSubmitModal,
}: IRecipientModalManagement) {
  const {
    register,
    getValues,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<Recipient>({
    resolver: yupResolver(recipientSchema),
  });

  const { api } = useFetch();
  const accountState = useAsync(async () => await api<Get['RecipientTransaction'][]>(FetchMethod.GET, API.customer.recipients.get));
  const recipientState = useAsync(async () => await api<Get['RecipientTransaction'][]>(FetchMethod.GET, API.customer.recipients.transactions));
  const bankState = useAsync(async () => await api<Get['Bank'][]>(FetchMethod.GET, API.bank));

  const recipientAccounts = recipientState.value?.json;
  const banks = bankState.value?.json;
  const accounts = accountState.value?.json;

  const [accountNo, setAccountNo] = useState('');
  const [accountBank, setAccountBank] = useState(1);
  const [recipientAccount, setRecipientAccount] = useState<Get['RecipientTransaction']>();

  const handleClose = () => setOpenState(false);

  const handleChangeAccountNo = async () => {
    if(recipientAccounts && accounts) {
      const accountArray = [...recipientAccounts, ...accounts].map(item => item.number);
      clearErrors('number');
      const query = {number: getValues('number'), bankId: getValues('bankId')};
      if(!accountArray?.includes(accountNo)) {
        const {json, error} = await api<Get['RecipientTransaction']>(FetchMethod.GET, params(API.customer.account, query));
        if (error) {
          setError('number', { type: 'Not Found', message: 'Account not found' });
        }
        else {
          if (json) {
            setRecipientAccount(json);
          }
          else {
            setError('number', { type: 'Not Found', message: 'Account not found' });
          }
        }
      }
    }
  }

  const onSubmit = async (dto: Recipient) => {
    if (
      errors &&
      Object.keys(errors).length === 0 &&
      Object.getPrototypeOf(errors) === Object.prototype &&
      handleSubmitModal
    ) {

      const value : any = {
        nickname: dto.nickname,
        recipientNumber: dto.number,
      }
      handleSubmitModal(value);
      handleClose();
    }
  };

  const renderBody = () => {
    if (recipientState.loading || accountState.loading || bankState.loading) {
      return <Loading />;
    }

    if (recipientState?.value?.error || accountState?.value?.error || bankState?.value?.error) {
      return <Error message={recipientState?.value?.error || accountState?.value?.error || bankState?.value?.error} />;
    }

    if (recipientAccounts == null || accounts == null || banks == null) {
      return null;
    }
    return (
      <Row>
        <Col>
          <h4 className={'primary-color text-center align-middle mb-3'}> <TbInfoCircle/> General Information</h4>
          <form className="form-transfer" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <div className="form-outline mb-3">
                <label className="form-label" >
                  Account Recipient No <span className={'text-danger'}>*</span>:
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    id="recipientNumber"
                    placeholder="Account receiver Number"
                    {...register('number', { required: true })}
                    value={accountNo}
                    onChange={(e) => {
                      clearErrors('number');
                      setAccountNo(e.target.value);
                      setValue('number', e.target.value);
                    }}
                  />
                  <button className="btn btn-primary rounded-end d-inline-flex justify-content-center align-items-center" type="button" id="button-addon2" onClick={() =>handleChangeAccountNo()}>
                    <TbSearch/>
                  </button>

                </div>
                <p className="text-danger  mb-0">{errors?.number?.message}</p>
              </div>

              <div className="form-outline mb-3">
                <label className="form-label" >
                  Recipient Bank <span className={'text-danger'}>*</span>:
                </label>
                <select className={'form-select'} {...register('bankId', {required: true}) } value={accountBank} onChange={(e) => {
                  setAccountBank(+e.target.value);
                }}>
                  {
                    banks.map((item, index) => (
                      <option value={item.id} key={index}>{item.name}</option>
                    ))
                  }
                </select>
              </div>

              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="">
                  Full Name :
                </label>
                <input type={'text'} className={'form-control'} value={recipientAccount?.fullname} disabled/>
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
                />
              </div>

            </Row>
            <div className="submit_btn d-flex justify-content-end">
              <Button className={'me-3'} variant="primary" type={'submit'}>
                Save
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </div>
          </form>
        </Col>
        <Col>
          <h4  className={'primary-color text-center align-middle mb-3'}> <TbInfoCircle/> Select from last transaction</h4>
          <Table striped size={'sm'} bordered hover>
            <thead>
            <tr>
              {
                TRANSACTION_SAVED_RECIPIENTS_COLUMNS.map( (item, index) => (
                  <th key={index}>{item}</th>
                ))
              }
            </tr>
            </thead>
            <tbody>
            {
              recipientAccounts?.map((item, index) => (
                <tr key={index} onClick={() => {
                  clearErrors('number');
                  setRecipientAccount(item);
                  setAccountNo(item.number);
                  setValue('number', item.number);
                  setAccountBank(item.bankId);
                  setValue('bankId', item.bankId);
                }}>
                  <td>{index + 1}</td>
                  <td>{item.number}</td>
                  <td>{item.bankName}</td>
                  <td>{item.fullname}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>
        </Col>
      </Row>
    );
  };

  return (
    <div>
      <Modal size="lg" show={openState} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Recipient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderBody()}
        </Modal.Body>
      </Modal>
    </div>
  );
}
