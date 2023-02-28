import { Button, Col, Row, Table } from 'react-bootstrap';
import { TbArrowLeft, TbFileDescription, TbNotes, TbSwitchHorizontal } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { routes } from '~/Routes';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useFetch } from '~/hooks';
import { ChangeEvent, useState } from 'react';
import { Get, log } from 'shared';
import { useAsync } from 'react-use';
import { FetchMethod, TransferType } from '~/models';
import { Error, Loading, Header } from '~/components';
import { API, DATE_TIME_FORMAT, TRANSACTION_HEADER_COLUMNS, TRANSFER_TYPES, INTERNAL_BANK } from '~/constants';
import { DetailModal } from '~/components/transaction';
import { RiMoneyDollarCircleLine } from 'react-icons/all';

dayjs.extend(customParseFormat);

export function UserTransactions() {
  const { api } = useFetch();
  const [row, setRow] = useState<Get['Transaction']>();
  const [detailModalState, setDetailModalState] = useState(false);
  const [typeTransfer, setTypeTransfer] = useState<string>(TransferType.TRANSFER);
  const state = useAsync(async () => {
    const { json, error } = await api<Get['Transaction'][]>(FetchMethod.GET, API.transaction.get);
    const transactions = json?.filter(
      (item) => item.type === typeTransfer && dayjs(item.createdAt).month() == dayjs().month(),
    );
    return {
      json: transactions,
      error,
    };
  }, [typeTransfer]);

  const rows = state?.value?.json;

  const renderBody = () => {
    if (state.loading) {
      return <Loading />;
    }
    if (state?.error) {
      return <Error message={state?.error?.message} />;
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
            // log.info(item);
            const typeIcon =
              item.type === TransferType.TRANSFER ? (
                <TbNotes className={'me-2'} />
              ) : (
                <RiMoneyDollarCircleLine className={'me-2'} />
              );
            const bankFromColor = item.SenderAccount.Bank.id === INTERNAL_BANK ? 'bd-indigo-500' : 'bd-red-500';
            const bankToColor = item.RecipientAccount.Bank.id === INTERNAL_BANK ? 'bd-indigo-500' : 'bd-red-500';
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{Number(item.amount)?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                <td>
                  <p className={'mb-1'}>{item.SenderAccount.number}</p>
                  <p className={`mb-0 ${bankFromColor}`}>{item.SenderAccount.Bank.name}</p>
                </td>
                <td>
                  <p className={'mb-1'}>{item.RecipientAccount.number}</p>
                  <p className={`mb-0 ${bankToColor}`}>{item.RecipientAccount.Bank.name}</p>
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

  function handleOnChange(e: ChangeEvent<HTMLSelectElement>) {
    setTypeTransfer(e.target.value);
  }

  return (
    <>
      <Header />
      <div className="p-4 recipients-wrap">
        <div className="recipients-page">
          <div className="page-icon text-center">
            <TbSwitchHorizontal />
          </div>
          <h2 className="primary-color text-center">Transactions in month</h2>
          <div className="transfer__transaction__wrap">
            <Row>
              <Col md={4}>
                <div className="d-flex align-items-center">
                  <label className={'d-inline me-2 text-nowrap'}>Transfer Type: </label>
                  <select
                    id={'transaction-select'}
                    className={'form-select form-select-sm'}
                    onChange={(e) => handleOnChange(e)}
                  >
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
          <Row>
            <Col className="d-flex justify-content-start">
              <Link className="btn btn-primary back-home-btn" to={routes.home}>
                <TbArrowLeft />
                Back to home
              </Link>
            </Col>
          </Row>
        </div>
        <div className="modal-wrap">
          <DetailModal data={row} openState={detailModalState} setOpenState={setDetailModalState}></DetailModal>
        </div>
      </div>
    </>
  );
}
