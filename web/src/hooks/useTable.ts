import {useState} from "react";
import {ActionTypeEnum} from "~/models/customers";
import {FetchMethod, TableType} from "~/models";
import {id} from "~/helpers";
import {addRowToTable, delRowFromTable, editRowOnTable} from "~/helpers/table";

export function useTable<T extends { id?: number }>(
  {
    data,
    setRows,
    api,
    addRoute,
    editRoute,
    delRoute,
    showNotifications
  } : TableType<T>
){
  const [dataRow, setDataRow] = useState<T>();
  const [addModalState, setAddModalState] = useState(false);
  const [editModalState, setEditModalState] = useState(false);
  const [delModalState, setDelModalState] = useState(false);

  const getDataRow = (idx: number, type: ActionTypeEnum) => {
    type === ActionTypeEnum.EDIT ? setEditModalState(true) : setDelModalState(true);
    setDataRow(data[idx]);
  };

  const handleAddRow = (dataAdd: T) => submitAdd(dataAdd);
  const handleEditRow = (dataEdit: Pick<T, keyof T>) => submitEdit({...dataEdit, id: dataRow?.id});
  const handleDelRow = () => dataRow ? submitDel(dataRow) : false;

  const submitAdd = async (value: T) => {
    const { json, error } = await api(FetchMethod.POST, addRoute, {...value, id: undefined});
    if (error) {
      showNotifications('Your action unsuccessfully !', error, {
        type: 'danger',
      });
      return;
    }
    showNotifications('Your action successfully !', '', {
      type: 'success',
    });
    // reset ui
    setRows(addRowToTable(value, data));
  };

  const submitEdit = async (value: T) => {
    const { json, error } = await api(FetchMethod.PUT, id(editRoute, value?.id), {...value, id: undefined});
    if (error) {
      showNotifications('Your action unsuccessfully !', error, {
        type: 'danger',
      });
      return;
    }
    showNotifications('Your action successfully !', '', {
      type: 'success',
    });
    // reset ui
    setRows(editRowOnTable(value, data));
  };

  const submitDel = async (value: T) => {
    const { json, error } = await api(FetchMethod.DELETE, id(delRoute, value.id));
    if (error) {
      showNotifications('Your action unsuccessfully !', error, {
        type: 'danger',
      });
      return;
    }
    showNotifications('Your action successfully !', '', {
      type: 'success',
    });
    // reset ui
    setRows(delRowFromTable(value, data));
  };

  return {
    dataRow,
    setDataRow,
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
  }
}
