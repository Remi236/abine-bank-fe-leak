import { Col, Row, Table} from 'react-bootstrap';
import '~/styles/Dashboard.scss';
import {useFetch} from "~/hooks";
import {FetchMethod, ITransactionReportDateRange, transactionReportDateRangeSchema, TransferType} from "~/models";
import {RiMoneyDollarCircleLine, TbFileReport} from "react-icons/all";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {params} from "~/helpers";
import {API, DATE_TIME_FORMAT, TRANSACTION_REPORT_HEADER_COLUMNS} from "~/constants";
import {useNotify} from "~/hooks/useNotify";
import {Get} from "shared";
import dayjs from "dayjs";
import {TbNotes} from "react-icons/tb";

export function ViewInTime() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ITransactionReportDateRange>({
    resolver: yupResolver(transactionReportDateRangeSchema),
  });

  const {api} = useFetch();
  const {showNotifications} = useNotify();
  const [transactionReport, setTransactionReport] = useState<Get['ReportTransaction'] | null>();

  async function onSubmit(dto: ITransactionReportDateRange) {
    const from = dayjs(dto.startDate).toISOString();
    const to = dayjs(dto.endDate).set('hour', 23).set('minute', 59).set('second', 59).toISOString();
    const {json, error} = await api<Get['ReportTransaction']>(FetchMethod.GET, params(API.transaction.report, {from, to}));
    if(error) {
      showNotifications('Cannot get transactions due to error', error, {type: "danger"});
      return;
    }
    setTransactionReport(json);
  }

  return (
    <div className="trans-history-page">
      <h2 className="primary-color text-center my-3">Transactions during the period</h2>
      <div className="transfer__transaction__wrap">
        <form className="date_range__filter" onSubmit={handleSubmit(onSubmit)}>
          <Row className="my-4">
            <Col md={5}>
              <div className="d-flex align-items-center justify-content-center time-control">
                <label htmlFor="start-time">Start date:</label>
                <input className="time-input" type="date" id="start-time"  {...register('startDate')} />
              </div>
              <p className={'text-danger'}>{errors?.startDate?.message}</p>
            </Col>
            <Col md={5}>
              <div className="d-flex align-items-center justify-content-center time-control">
                <label htmlFor="end-time">End date:</label>
                <input className="time-input" type="date" id="end-time"  {...register('endDate')}  />
              </div>
              <p className={'text-danger'}>{errors?.endDate?.message}</p>
            </Col>
            <Col md={2}>
              <button className={'btn-primary text-white h-100 rounded-pill text-center border-primary px-3 py-2 d-block w-100'} type={'submit'}> <TbFileReport/> Statics</button>
            </Col>
          </Row>
        </form>
        <Row>
          <Col>
            <Table responsive className="my-3 text-center transaction table-sm">
              <thead className="primary-color">
                <tr>
                  {TRANSACTION_REPORT_HEADER_COLUMNS.map((item, index) => (
                    <th key={index}>{item}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="align-middle recipient-table-body">

              {transactionReport && transactionReport?.transactions.map((item, index) => {
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
                transactionReport && (
                  <tr>
                    <td colSpan={TRANSACTION_REPORT_HEADER_COLUMNS.length - 1}>Total</td>
                    <td className={'text-primary fw-bold'}>{Number(transactionReport?.totalAmount)?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                  </tr>
                )
              }
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    </div>
  );
}
