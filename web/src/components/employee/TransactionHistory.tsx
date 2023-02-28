import { Button, Col, Row, Table } from 'react-bootstrap';
import { TbFileDescription, TbNotes } from 'react-icons/tb';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useFetch } from '~/hooks';
import { ChangeEvent, useState } from 'react';
import {Get} from 'shared';
import { useAsync } from 'react-use';
import { FetchMethod, TransferType } from '~/models';
import { Error, Loading } from '~/components';
import { API, DATE_TIME_FORMAT, TRANSACTION_HEADER_COLUMNS, TRANSFER_TYPES } from '~/constants';
import { DetailModal } from '~/components/transaction';
import { RiMoneyDollarCircleLine } from 'react-icons/all';
import {id} from "~/helpers";

dayjs.extend(customParseFormat);

export function TransactionHistory() {
  const { api } = useFetch();
  const [row, setRow] = useState<Get['Transaction']>();
  const [detailModalState, setDetailModalState] = useState(false);
  const [typeTransfer, setTypeTransfer] = useState<string>(TransferType.TRANSFER);
  const [accountSelected, setAccountSelected] = useState('');
  const customersState = useAsync(async () =>  await api<Get['Customer'][]>(FetchMethod.GET, API.customer.get), []);
  const transactionState = useAsync(async () => {
    const { json, error } = await api<Get['Transaction'][]>(FetchMethod.GET, id(API.transaction.viewById, accountSelected));
    return {
      json: json?.filter((item) => item.type === typeTransfer),
      error,
    };
  }, [typeTransfer, accountSelected]);

  const rows = transactionState?.value?.json;
  const customers = customersState?.value?.json;

  const renderBody = () => {
    if (transactionState.loading || customersState.loading) {
      return <Loading />;
    }

    if (transactionState?.error || customersState?.error) {
      return <Error message={transactionState?.error?.message || customersState?.error?.message} />;
    }
    if (rows == null) {
      return null;
    }

    return (
      <Table responsive className="my-3 text-center recipient-table table-sm">
        <thead className="primary-color">
          <tr>
            {TRANSACTION_HEADER_COLUMNS.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody className="align-middle recipient-table-body">
          {rows.map((item, index) => {
            const typeIcon =
              item.type === TransferType.TRANSFER ? (
                <TbNotes className={'me-2'} />
              ) : (
                <RiMoneyDollarCircleLine className={'me-2'} />
              );
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{Number(item.amount)?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                <td>
                  <p className={'mb-1'}>{item.SenderAccount.number}</p>
                  {item.SenderAccount.number !== 'me' && <p className={'mb-0'}>{item.SenderAccount.Bank.name}</p>}
                </td>
                <td>
                  <p className={'mb-1'}>{item.RecipientAccount.number}</p>
                  {item.RecipientAccount.number !== 'me' && <p className={'mb-0'}>{item.RecipientAccount.Bank.name}</p>}
                </td>
                <td>{item.feePayer}</td>
                <td>
                  <div className="d-flex align-items-center justify-content-center">
                    {typeIcon}
                    <p className={'mb-0'}>{item.type}</p>
                  </div>
                </td>
                <td>{dayjs(item.createdAt).format(DATE_TIME_FORMAT)}</td>
                <td>
                  <Button
                    onClick={() => {
                      setRow(item);
                      setDetailModalState(true);
                    }}
                    className="m-1 add-btn"
                    title="Detail"
                    size="sm"
                  >
                    <TbFileDescription />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  function handleOnAccountChange(e: ChangeEvent<HTMLSelectElement>) {
    setAccountSelected(e.target.value);
  }
  function handleOnChange(e: ChangeEvent<HTMLSelectElement>) {
    setTypeTransfer(e.target.value);
  }
  return (
    <div className="trans-history-page">
      <h2 className="primary-color text-center my-3">Transaction History</h2>
      <div className="transfer__transaction__wrap">
        <Row className="my-4">
          <Col md={6}>
            <div className="d-flex align-items-center">
              <label className={'d-inline me-2 text-nowrap'}>Account Number: </label>
              <select id={'accountNumber-select'} className={'form-select form-select-sm'} onChange={(e) => handleOnAccountChange(e)}>
                <option value={""}>Select Account</option>
                {
                  customers && customers.map((item, index) => (
                    <option value={item.Account.id} key={index}>{item.Account.number}</option>
                  ))
                }
              </select>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center">
              <label className={'d-inline me-2 text-nowrap'}>Transfer Type: </label>
              <select
                id={'transaction-select'}
                className={'form-select form-select-sm'}
                onChange={(e) => handleOnChange(e)}
              >
                <option value={""}>Select Transfer Type</option>
                {TRANSFER_TYPES.map((item, index) => (
                  <option value={item} key={index}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>{renderBody()}</Col>
        </Row>
      </div>
      <div className="modal-wrap">
        <DetailModal data={row} openState={detailModalState} setOpenState={setDetailModalState}></DetailModal>
      </div>
    </div>
  );
}
