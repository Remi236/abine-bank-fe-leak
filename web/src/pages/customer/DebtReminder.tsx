import { useState } from 'react';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { TbArrowLeft, TbCirclePlus, TbTrash, TbCashOff } from 'react-icons/tb';
import { routes } from '~/Routes';
import { AddModal, DelModal } from '~/components/debtReminder';
import { useAuth, useDebtsSocket, useFetch } from '~/hooks';
import { useNotify } from '~/hooks/useNotify';
import { useAsync, useDeepCompareEffect } from 'react-use';
import { Debt, FetchMethod } from '~/models';
import { API, DATE_TIME_FORMAT, DEBTORS_HEADER_COLUMNS } from '~/constants';
import { useTable } from '~/hooks/useTable';
import { Error, Loading, Header } from '~/components';
import { mapTableRowDebtors } from '~/helpers/table';
import dayjs from 'dayjs';
import { PaidOffModal } from '~/components/debtReminder/PaidOffModal';
import { Get, log } from 'shared';

export function DebtReminder() {
  const { api } = useFetch();
  const { user } = useAuth();
  const { showNotifications } = useNotify();

  const [rows, setRows] = useState<Debt[]>([]);
  const state = useAsync(async () => {
    const { json, error } = await api<Get['Debt'][]>(FetchMethod.GET, API.debts.getFull);
    return {
      json: json?.sort((a, b) => (b.createdAt < a.createdAt ? -1 : b.createdAt > a.createdAt ? 1 : 0)),
      error,
    };
  }, [rows]);

  useDeepCompareEffect(() => {
    const data = mapTableRowDebtors(state.value?.json || []);
    setRows(data);
  }, [state.value?.json]);

  useDebtsSocket({
    onNew: (creditorDebtor: Get['Debt']) =>
      setRows((prev) => {
        const p = [...prev];
        return [mapTableRowDebtors([creditorDebtor])[0], ...p];
      }),
    onCancel: (id: number) =>
      setRows((prev) => {
        const itemToUpdate = prev.find((row) => row.id === id);
        const filter = prev.filter((row) => row.id !== id);
        if (itemToUpdate == null) {
          log.error("DebtReminder: can't find debt with id", id);
          return prev;
        }
        itemToUpdate.status = 'CANCELLED';
        return [...filter, itemToUpdate];
      }),
    onPaidOff: (id: number) =>
      setRows((prev) => {
        const itemToUpdate = prev.find((row) => row.id === id);
        if (itemToUpdate == null) {
          log.error("DebtReminder: can't find debt with id", id);
          return prev;
        }
        const filter = prev.filter((row) => row.id !== id);
        itemToUpdate.status = 'PAID_OFF';
        return [...filter, itemToUpdate];
      }),
  });

  const {
    dataRow,
    addModalState,
    setAddModalState,
    editModalState,
    setEditModalState,
    delModalState,
    setDelModalState,
    getDataRow,
    handleAddRow,
    handleEditRow,
  } = useTable<Debt>({
    data: rows,
    setRows,
    api,
    addRoute: API.debts.post,
    editRoute: API.debts.cancel,
    delRoute: '',
    showNotifications,
  });

  const renderBody = () => {
    if (state.loading) {
      return <Loading />;
    }

    if (state?.value?.error) {
      return <Error message={state.value.error} />;
    }

    if (rows == null) {
      return null;
    }

    return (
      <Table responsive className="my-3 text-center recipient-table table-sm">
        <thead className="primary-color">
          <tr>
            {DEBTORS_HEADER_COLUMNS.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody className="align-middle recipient-table-body">
          {rows.map((item, index) => {
            const balance = item?.amount
              ? Number(item.amount)?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
              : 0;
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <p className={'mb-2'}>{item.CreditorAccount ? item.CreditorAccount.number : 0}</p>
                  <p className={'mb-0'}>{item?.CreditorAccount?.Customer?.User?.fullname}</p>
                </td>
                <td>
                  <p className={'mb-2'}>{item.DebtorAccount ? item.DebtorAccount.number : ''}</p>
                  <p className={'mb-0'}>{item?.DebtorAccount?.Customer?.User?.fullname}</p>
                </td>
                <td>{balance}</td>
                <td>{item.status}</td>
                <td>{dayjs(item.createdAt).format(DATE_TIME_FORMAT)}</td>
                <td>
                  {user?.accountNumber !== item?.CreditorAccount?.number && (
                    <Button
                      disabled={item.status === 'PAID_OFF'}
                      onClick={() => getDataRow(index, 1)}
                      className="m-1 paid-btn"
                      title="Paid debt"
                      size="sm"
                    >
                      <TbCashOff />
                    </Button>
                  )}
                  {user?.accountNumber === item?.CreditorAccount?.number && (
                    <Button
                      disabled={item.status === 'PAID_OFF'}
                      onClick={() => getDataRow(index, 2)}
                      className="m-1 delete-btn"
                      title="Delete"
                      size="sm"
                    >
                      <TbTrash />
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  return (
    <>
      <Header />
      <div className="p-4 recipients-wrap">
        <div className="recipients-page">
          <h2 className="primary-color text-center">List of unpaid debts</h2>
          <Row>
            <Col className="d-flex justify-content-end">
              <Button className="align-middle primary-btn" onClick={() => setAddModalState(!addModalState)}>
                <TbCirclePlus />
                <span className="ms-1">Create debt reminder</span>
              </Button>
            </Col>
          </Row>
          <div className="transfer__transaction__wrap">
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
          <AddModal
            openState={addModalState}
            setOpenState={setAddModalState}
            handleSubmitModal={handleAddRow}
          ></AddModal>
          <DelModal
            openState={delModalState}
            setOpenState={setDelModalState}
            handleSubmitModal={handleEditRow}
          ></DelModal>
          <PaidOffModal
            data={dataRow}
            setRows={setRows}
            openState={editModalState}
            setOpenState={setEditModalState}
            handleSubmitModal={handleEditRow}
          ></PaidOffModal>
        </div>
      </div>
    </>
  );
}
