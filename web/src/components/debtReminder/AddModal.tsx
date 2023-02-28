import { Modal, Row, Col, Table } from 'react-bootstrap';
import { useFetch } from '~/hooks';
import { useAsync } from 'react-use';
import { Get } from 'shared';
import { CustomerType, debitSchema, Debt, FetchMethod, IDebitModalManagement } from '~/models';
import { API, TRANSACTION_SAVED_DEBTORS_COLUMNS } from '~/constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Error, Loading } from '~/components';
import { TbInfoCircle, TbSearch } from 'react-icons/all';
import { useState } from 'react';
import { params } from '~/helpers';
import { useNotify } from '~/hooks/useNotify';

export function AddModal({ openState, setOpenState, handleSubmitModal }: IDebitModalManagement) {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<Debt>({
    resolver: yupResolver(debitSchema),
  });
  const { api } = useFetch();
  const { showNotifications } = useNotify();
  const [accountNo, setAccountNo] = useState('');
  const [accountFullName, setAccountFullName] = useState('');
  const [accountBank, setAccountBank] = useState(1);
  const debtState = useAsync(async () => await api<Get['Debt'][]>(FetchMethod.GET, API.debts.get));
  const bankState = useAsync(async () => await api<Get['Bank'][]>(FetchMethod.GET, API.bank));

  const debtAccounts = debtState.value?.json;
  const banks = bankState.value?.json;

  const handleClose = () => setOpenState(false);

  const onSubmit = async (dto: Debt) => {
    if (
      errors &&
      Object.keys(errors).length === 0 &&
      Object.getPrototypeOf(errors) === Object.prototype &&
      handleSubmitModal
    ) {
      const value = {
        id: dto.creditorDebtorId,
        debtorNumber: dto.debtorNumber,
        debtorBankId: dto.debtorBankId,
        amount: dto.amount,
        content: dto.content,
      };
      handleSubmitModal(value);
      handleClose();
    }
  };

  const handleChangeAccountNo = async () => {
    const accountsNo = debtAccounts?.map((item) => item.DebtorAccount.number);
    clearErrors('debtorNumber');
    const query = { number: getValues('debtorNumber'), bankId: getValues('debtorBankId') };
    if (!accountsNo?.includes(accountNo)) {
      const { json, error } = await api<CustomerType>(FetchMethod.GET, params(API.customer.account, query));
      if (error) {
        setError('debtorNumber', { type: 'Not Found', message: 'Not Found account' });
      } else {
        if (json) {
          setAccountNo(json.accountNumber);
          setValue('debtorNumber', json.accountNumber);
          setAccountBank(json.bankId);
          setValue('debtorBankId', json.bankId);
          setAccountFullName(json.fullname);
        } else {
          setError('debtorNumber', { type: 'Not Found', message: 'Account not found' });
        }
      }
    } else {
      showNotifications(`Account is already exist!`, 'Select the saved account in the right panel!', {
        type: 'danger',
      });
    }
  };

  const renderBody = () => {
    if (debtState.loading || bankState.loading) {
      return <Loading />;
    }

    if (debtState?.value?.error || bankState?.value?.error) {
      return <Error message={debtState?.value?.error || bankState?.value?.error} />;
    }

    if (debtAccounts == null || banks == null) {
      return null;
    }

    return (
      <Row>
        <Col>
          <h4 className={'primary-color text-center align-middle mb-3'}>
            {' '}
            <TbInfoCircle /> General Information
          </h4>
          <form className="form-transfer" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <div className="form-outline mb-3">
                <label className="form-label">
                  Debit Bank <span className={'text-danger'}>*</span>:
                </label>
                <select
                  className={'form-select'}
                  {...register('debtorBankId', { required: true })}
                  value={accountBank}
                  onChange={(e) => {
                    setAccountBank(+e.target.value);
                    setValue('debtorBankId', +e.target.value);
                  }}
                >
                  {banks.map((item, index) => (
                    <option value={item.id} key={index}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <p className="text-danger mb-0">{errors?.debtorBankId?.message}</p>
              </div>

              <div className="form-outline mb-3">
                <label className="form-label">
                  Account Debit No <span className={'text-danger'}>*</span>:
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    id="debtorNumber"
                    placeholder="Account receiver Number"
                    {...register('debtorNumber', { required: true })}
                    value={accountNo}
                    onChange={(e) => {
                      clearErrors('debtorNumber');
                      setAccountNo(e.target.value);
                      setValue('debtorNumber', e.target.value);
                    }}
                  />
                  <button
                    className="btn btn-primary rounded-end d-inline-flex justify-content-center align-items-center"
                    type="button"
                    id="button-addon2"
                    onClick={() => handleChangeAccountNo()}
                  >
                    <TbSearch />
                  </button>
                </div>
                <p className="text-danger  mb-0">{errors?.debtorNumber?.message}</p>
              </div>

              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="">
                  Full Name :
                </label>
                <input type={'text'} className={'form-control'} value={accountFullName} disabled />
              </div>

              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="">
                  Amount <span className={'text-danger'}>*</span>:
                </label>
                <input type={'text'} className={'form-control'} {...register('amount', { required: true })} />
                <p className="text-danger  mb-0">{errors?.amount?.message}</p>
              </div>

              <div className="form-outline mb-3">
                <label className="form-label">
                  Content <span className={'text-danger'}>*</span>:
                </label>
                <textarea
                  className={'form-control'}
                  style={{ height: 210 }}
                  {...register('content', { required: true })}
                />
              </div>
            </Row>
            <button type={'submit'} className="btn btn-block w-100 btn-primary text-uppercase">
              Add
            </button>
          </form>
        </Col>
        <Col>
          <h4 className={'primary-color text-center align-middle mb-3'}>
            {' '}
            <TbInfoCircle /> Select from saved Debtors
          </h4>
          <Table striped size={'sm'} bordered hover>
            <thead>
              <tr>
                {TRANSACTION_SAVED_DEBTORS_COLUMNS.map((item, index) => (
                  <th key={index}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {debtAccounts?.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    clearErrors('debtorNumber');
                    setAccountNo(item.DebtorAccount.number);
                    setValue('debtorNumber', item.DebtorAccount.number);
                    setAccountBank(item.DebtorAccount.bankId);
                    setValue('debtorBankId', item.DebtorAccount.bankId);
                    setAccountFullName(item.DebtorAccount?.Customer?.User?.fullname || '');
                  }}
                >
                  <td>{index + 1}</td>
                  <td>{item.DebtorAccount.number}</td>
                  <td>{banks?.find((element) => element.id === item.DebtorAccount.bankId)?.name || ''}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    );
  };

  return (
    <div>
      <Modal size={'lg'} show={openState} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create debt reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderBody()}</Modal.Body>
      </Modal>
    </div>
  );
}
