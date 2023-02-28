import {Col, Row, Table} from 'react-bootstrap';
import '~/styles/Dashboard.scss';
import {useAsync, useAsyncFn} from "react-use";
import {FetchMethod, TransferType} from "~/models";
import {params} from "~/helpers";
import {API, DATE_TIME_FORMAT, INTERNAL_BANK, TRANSACTION_REPORT_HEADER_COLUMNS} from "~/constants";
import {useFetch} from "~/hooks";
import {Get} from "shared";
import {Error, Loading} from "~/components";
import {RiMoneyDollarCircleLine, TbFileReport} from "react-icons/all";
import {TbNotes} from "react-icons/tb";
import dayjs from "dayjs";
import {useState} from "react";

export function ViewByBank() {
  const {api} = useFetch();
  const [bankId, setBankId] = useState(2);
  const [dataState, getData] = useAsyncFn(async () => {
    const to = dayjs();
    const from = to.clone().set('month', to.month() - 1).set('hour', 0).set('minute', 0).set('second', 0);
    const {json, error} = await api<Get['ReportTransaction']>(FetchMethod.GET, params(API.transaction.report, {from: from.toISOString(), to: to.toISOString() } ) );
    const transactions = json?.transactions?.filter(item => item.RecipientAccount.Bank.id === bankId || item.SenderAccount.Bank.id === bankId);
    const total = transactions?.reduce((accumulator, currentItem) => +currentItem.amount + accumulator, 0);
    return {
      json: {
        transactions: transactions,
        totalAmount: total,
      },
      error,
    }
  }, [bankId]);

  const bankState = useAsync(async () => {
    const {json, error} = await api<Get['Bank'][]>(FetchMethod.GET, API.bank);
    return  {
      json: json?.filter(item => item.id !== INTERNAL_BANK),
      error
    }
  });

  const data = dataState.value?.json;
  const banks = bankState.value?.json;

  const renderBody = () => {
    if (dataState.loading || bankState.loading) {
      return <Loading />;
    }

    if (dataState?.value?.error || bankState?.value?.error) {
      return <Error message={dataState?.value?.error || bankState?.value?.error} />;
    }

    if (data == null) {
      return null;
    }

    return (
      <Table responsive className="my-3 text-center transaction table-sm">
        <thead className="primary-color">
        <tr>
          {TRANSACTION_REPORT_HEADER_COLUMNS.map((item, index) => (
            <th key={index}>{item}</th>
          ))}
        </tr>
        </thead>
        <tbody className="align-middle recipient-table-body">

        {data?.transactions && data?.transactions.map((item, index) => {
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
                <p className={'mb-0'}>{item.SenderAccount.Bank.name}</p>
              </td>
              <td>
                <p className={'mb-1'}>{item.RecipientAccount.number}</p>
                <p className={'mb-0'}>{item.RecipientAccount.Bank.name}</p>
              </td>
              <td>{item.feePayer}</td>
              <td>
                <div className="d-flex align-items-center justify-content-center">
                  {typeIcon}
                  <p className={'mb-0'}>{item.type}</p>
                </div>
              </td>
              <td>{dayjs(item.createdAt).format(DATE_TIME_FORMAT)}</td>
            </tr>
          );
        })}
        {
          data && (
            <tr>
              <td colSpan={TRANSACTION_REPORT_HEADER_COLUMNS.length - 1}>Total</td>
              <td className={'text-primary fw-bold'}>{Number(data?.totalAmount)?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
            </tr>
          )
        }
        </tbody>
      </Table>
    )
  }

  return (
    <div className="trans-history-page">
      <h2 className="primary-color text-center my-3">Transactions by bank</h2>
      <div className="transfer__transaction__wrap">
        <Row className="my-4">
          <Col>
            <div className="d-flex align-items-center justify-content-center bank-control">
              <label htmlFor="bank-name">Bank Name:</label>
              <select id={'bank-name'} className={'form-select form-select-sm'} value={bankId} onChange={(e) => setBankId(+e.target.value)}>
                {
                  banks && banks.map((item, index) => (
                    <option key={index} value={item.id}>{item.name}</option>
                  ))
                }
              </select>
              <button className={'btn-primary text-white h-100 rounded-pill text-center border-primary px-3 py-2 d-block ms-3'} onClick={() => getData()}> <TbFileReport/> Statics</button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            {renderBody()}
          </Col>
        </Row>
      </div>
    </div>
  );
}
