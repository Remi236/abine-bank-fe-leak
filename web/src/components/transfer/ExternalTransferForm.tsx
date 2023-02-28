import { useFetch } from '~/hooks';
import { useAsync } from 'react-use';
import { Get } from 'shared';
import { Error, Loading } from '~/components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Col, Row, Table } from 'react-bootstrap';
import { API, INTERNAL_BANK, PAYER_TYPES, TRANSACTION_SAVED_RECIPIENTS_COLUMNS, TRANSFER_TYPES } from '~/constants';
import { externalTransferSchema, IExternalTransferForm, TransferResponse, FetchMethod, OtpResponse } from '~/models';
import { OtpModal } from '~/components/Otp/OtpModal';
import { useState } from 'react';
import { useNotify } from '~/hooks/useNotify';
import { TbInfoCircle, TbSearch } from 'react-icons/all';
import { routes } from '~/Routes';
import { SubscribeRecipient } from '~/components/transfer/SubscribeRecipient';
import { params } from '~/helpers';

export function ExternalTransferForm() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<IExternalTransferForm>({
    resolver: yupResolver(externalTransferSchema),
  });

  const { api } = useFetch();
  const [accountNo, setAccountNo] = useState('');
  const [accountBank, setAccountBank] = useState(2);
  const { showNotifications } = useNotify();

  const [recipientAccount, setRecipientAccount] = useState<Get['RecipientTransaction']>();
  const [otpModal, setOtpModal] = useState(false);
  const [subscribe, setSubscribe] = useState(false);

  const accountState = useAsync(async () => {
    const { json, error } = await api<Get['RecipientTransaction'][]>(FetchMethod.GET, API.customer.recipients.get);
    return {
      json: json?.filter((item) => item.bankId !== INTERNAL_BANK),
      error,
    };
  });
  const bankState = useAsync(async () => {
    const { json, error } = await api<Get['Bank'][]>(FetchMethod.GET, API.bank);
    return {
      json: json?.filter((item) => item.id !== INTERNAL_BANK),
      error,
    };
  });

  const accounts = accountState.value?.json;
  const banks = bankState.value?.json;

  async function onSubmit(dto: IExternalTransferForm) {
    const { json, error } = await api<OtpResponse>(FetchMethod.POST, API.auth.otp, { type: dto.type });
    setOtpModal(true);
    if (error) {
      showNotifications('Cannot send OTP to your email', error, { type: 'danger' });
    } else if (json?.success) {
      showNotifications(
        'An OTP sent to your email',
        'A email message with a 6-digit verification code was just sent to your email',
        { type: 'success' },
      );
    }
  }

  async function externalTransfer(otp: string) {
    const data = getValues();
    const { json, error } = await api<TransferResponse>(FetchMethod.POST, API.transaction.post, { ...data, otp });
    if (error) {
      showNotifications(`Your ${data.type} is unsuccessfully !`, error, { type: 'danger' });
    } else if (json?.success) {
      showNotifications(`Your ${data.type} is successfully`, '', { type: 'success' });
      setSubscribe(true);
    }
  }

  const handleChangeAccountNo = async () => {
    const accountsNo = accounts?.map((item) => item.number);
    clearErrors('recipientNumber');
    const query = { number: getValues('recipientNumber'), bankId: getValues('recipientBankId') };
    if (!accountsNo?.includes(accountNo)) {
      const { json, error } = await api<Get['RecipientTransaction']>(
        FetchMethod.GET,
        params(API.customer.account, query),
      );
      if (error) {
        setError('recipientNumber', { type: 'Not Found', message: 'Account not found' });
      } else {
        if (json) {
          setRecipientAccount(json);
        } else {
          setError('recipientNumber', { type: 'Not Found', message: 'Account not found' });
        }
      }
    }
  };

  const renderBody = () => {
    if (accountState.loading || bankState.loading) {
      return <Loading />;
    }

    if (accountState?.value?.error || bankState?.value?.error) {
      return <Error message={accountState?.value?.error || bankState?.value?.error} />;
    }

    if (accounts == null || banks == null) {
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
                  Transfer Type <span className={'text-danger'}>*</span>:
                </label>
                <select className={'form-select'} {...register('type', { required: true })}>
                  {TRANSFER_TYPES.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}
                </select>
                <p className="text-danger mb-0">{errors?.type?.message}</p>
              </div>

              <div className="form-outline mb-3">
                <label className="form-label">
                  Account Recipient No <span className={'text-danger'}>*</span>:
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    id="recipientNumber"
                    placeholder="Account receiver Number"
                    {...register('recipientNumber', { required: true })}
                    value={accountNo}
                    onChange={(e) => {
                      clearErrors('recipientNumber');
                      setAccountNo(e.target.value);
                      setValue('recipientNumber', e.target.value);
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
                <p className="text-danger  mb-0">{errors?.recipientNumber?.message}</p>
              </div>

              <div className="form-outline mb-3">
                <label className="form-label">
                  Recipient Bank <span className={'text-danger'}>*</span>:
                </label>
                <select
                  className={'form-select'}
                  {...register('recipientBankId', { required: true })}
                  value={accountBank}
                  onChange={(e) => {
                    setAccountBank(+e.target.value);
                    setValue('recipientBankId', +e.target.value);
                  }}
                >
                  {banks.map((item, index) => (
                    <option value={item.id} key={index}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <p className="text-danger mb-0">{errors?.recipientBankId?.message}</p>
              </div>

              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="">
                  Full Name :
                </label>
                <input type={'text'} className={'form-control'} value={recipientAccount?.fullname} disabled />
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

              <div className="form-outline mb-3">
                <label className="form-label">
                  Fee Payer Types <span className={'text-danger'}>*</span>: (Fee=1000 VND)
                </label>
                <select className={'form-select'} {...register('feePayer', { required: true })}>
                  {PAYER_TYPES.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}
                </select>
                <p className="text-danger">{errors?.feePayer?.message}</p>
              </div>
            </Row>
            <button type={'submit'} className="btn btn-block w-100 btn-primary text-uppercase">
              Transfer
            </button>
          </form>
        </Col>
        <Col>
          <h4 className={'primary-color text-center align-middle mb-3'}>
            {' '}
            <TbInfoCircle /> Select from saved recipient
          </h4>
          <Table striped size={'sm'} bordered hover>
            <thead>
              <tr>
                {TRANSACTION_SAVED_RECIPIENTS_COLUMNS.map((item, index) => (
                  <th key={index}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accounts?.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    clearErrors('recipientNumber');
                    setRecipientAccount(item);
                    setAccountNo(item.number);
                    setValue('recipientNumber', item.number);
                    setAccountBank(item.bankId);
                    setValue('recipientBankId', item.bankId);
                  }}
                >
                  <td>{index + 1}</td>
                  <td>{item.number}</td>
                  <td>{item.bankName}</td>
                  <td>{item.fullname}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    );
  };

  return (
    <Card className="m-3 internal-transfer__card">
      <Card.Header as="h5">Beneficiary information</Card.Header>
      <Card.Body>{renderBody()}</Card.Body>
      <div className={'modal__wrap'}>
        <OtpModal otpModal={otpModal} setOtpModal={setOtpModal} handleWithOtp={externalTransfer} />
        <SubscribeRecipient
          recipientNo={accountNo}
          openState={subscribe}
          setOpenState={setSubscribe}
          redirectTo={routes.transactions}
        />
      </div>
    </Card>
  );
}
