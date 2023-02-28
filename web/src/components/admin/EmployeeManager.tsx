import { Button, Col, Row, Table } from 'react-bootstrap';
import { useFetch } from '~/hooks';
import {FetchMethod, User} from '~/models';
import { Get, log } from 'shared';
import {API, EMPLOYEE_HEADER_COLUMNS} from '~/constants';
import { AddModal, DelModal, EditModal } from '~/components/admin/employeeModal';
import { useAsync, useDeepCompareEffect } from 'react-use';
import { TbCirclePlus, TbEdit, TbTrash } from 'react-icons/tb';
import { useNotify } from '~/hooks/useNotify';
import { Loading, Error } from '~/components';
import { useTable } from '~/hooks/useTable';
import { useState } from 'react';

export function EmployeeManager() {
  const { api } = useFetch();
  const { showNotifications } = useNotify();

  const [rows, setRows] = useState<User[]>([]);
  const state = useAsync(
    async () => await api<Get['User'][]>(FetchMethod.GET, API.user.get),
    [rows],
  );

  useDeepCompareEffect(() => setRows(state?.value?.json || []), [state.value?.json]);

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
  } = useTable<User>({
    data: rows,
    setRows,
    api,
    addRoute: API.user.addEmployee,
    editRoute: API.user.editEmployee,
    delRoute: API.user.delete,
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
            {EMPLOYEE_HEADER_COLUMNS.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody className="align-middle recipient-table-body">
          {rows.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.fullname}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td>{item.username}</td>
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
    <div className="employee-manager-wrap">
      <div className="employee-manager-page">
        <h2 className="primary-color text-center">Employee Manager</h2>
        <Row>
          <Col className="d-flex justify-content-end">
            <Button className="align-middle primary-btn" onClick={() => setAddModalState(!addModalState)}>
              <TbCirclePlus />
              <span className="ms-1">Add Employee</span>
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>{renderBody()}</Col>
        </Row>
      </div>
      <div className="modal-wrap">
        <AddModal openState={addModalState} setOpenState={setAddModalState} handleSubmitModal={handleAddRow}></AddModal>
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
  );
}
