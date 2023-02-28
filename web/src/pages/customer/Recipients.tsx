import { Button, Col, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useFetch } from '~/hooks';
import { FetchMethod } from '~/models';
import { Get } from 'shared';
import { API } from '~/constants';
import { Recipient } from '~/models/customers';
import { AddModal, DelModal, EditModal } from '~/components/recipientModal';
import { useAsync, useDeepCompareEffect } from 'react-use';
import { routes } from '~/Routes';
import { RECIPIENT_HEADER_COLUMNS } from '~/constants/customer';
import { TbCirclePlus, TbEdit, TbTrash, TbArrowLeft } from 'react-icons/tb';
import '~/styles/Recipients.scss';
import { useNotify } from '~/hooks/useNotify';
import { FaUserCog } from 'react-icons/fa';
import { Loading, Error, Header } from '~/components';
import { useTable } from '~/hooks/useTable';
import { mapTableRowRecipients } from '~/helpers/table';
import { useState } from 'react';

export function Recipients() {
  const { api } = useFetch();
  const { showNotifications } = useNotify();

  const [rows, setRows] = useState<Recipient[]>([]);
  const state = useAsync(
    async () => await api<Get['Recipient'][]>(FetchMethod.GET, API.customer.recipients.get),
    [rows],
  );

  useDeepCompareEffect(() => {
    const data = mapTableRowRecipients(state.value?.json || []);
    setRows(data);
  }, [state.value?.json]);

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
    handleDelRow,
  } = useTable<Recipient>({
    data: rows,
    setRows,
    api,
    addRoute: API.customer.recipients.post,
    editRoute: API.customer.recipients.put,
    delRoute: API.customer.recipients.delete,
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
            {RECIPIENT_HEADER_COLUMNS.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody className="align-middle recipient-table-body">
          {rows.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.bankCode}</td>
              <td>{item.bankName}</td>
              <td>{item.number}</td>
              <td>{item.fullname}</td>
              <td>{item.nickname}</td>
              <td>
                <Button onClick={() => getDataRow(index, 1)} className="m-1 update-btn" title="Update" size="sm">
                  <TbEdit />
                </Button>
                <Button onClick={() => getDataRow(index, 2)} className="m-1 delete-btn" title="Delete" size="sm">
                  <TbTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <>
      <Header />
      <div className="p-4 recipients-wrap">
        <div className="recipients-page">
          <div className="page-icon text-center">
            <FaUserCog />
          </div>
          <h2 className="primary-color text-center">Manage Recipients</h2>
          <Row>
            <Col className="d-flex justify-content-end">
              <Button className="align-middle primary-btn" onClick={() => setAddModalState(!addModalState)}>
                <TbCirclePlus />
                <span className="ms-1">Add Recipients</span>
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>{renderBody()}</Col>
          </Row>
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
          <EditModal
            data={dataRow}
            openState={editModalState}
            setOpenState={setEditModalState}
            handleSubmitModal={handleEditRow}
          ></EditModal>
          <DelModal
            openState={delModalState}
            setOpenState={setDelModalState}
            handleSubmitDelModal={handleDelRow}
          ></DelModal>
        </div>
      </div>
    </>
  );
}
