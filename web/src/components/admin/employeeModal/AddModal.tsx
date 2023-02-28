import { Button, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {EMAIL_FIELD, PASSWORD_FIELD} from '~/constants';
import {employeeSchema, IEmployeeModalManagement, User} from '~/models';

export function AddModal({ openState, setOpenState, handleSubmitModal }: IEmployeeModalManagement) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: yupResolver(employeeSchema),
  });

  const handleClose = () => setOpenState(false);

  const onSubmit = async (dto: User) => {
    if (
      errors &&
      Object.keys(errors).length === 0 &&
      Object.getPrototypeOf(errors) === Object.prototype &&
      handleSubmitModal
    ) {
      handleSubmitModal(dto);
      handleClose();
    }
  };

  return (
    <div>
      <Modal show={openState} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form-login" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-outline mb-3">
              <label className="form-label" htmlFor={EMAIL_FIELD}>
                Email: <span className={'text-danger'}>*</span>
              </label>
              <input type="text" id={EMAIL_FIELD} className="form-control box-shadow-none" {...register(EMAIL_FIELD)} />
              <p className={'text-danger'}>{errors[EMAIL_FIELD]?.message}</p>
            </div>
            <div className="form-outline mb-3">
              <label className="form-label" htmlFor="fullname">
                Full Name: <span className={'text-danger'}>*</span>
              </label>
              <input type="text" id='fullname' className="form-control box-shadow-none" {...register('fullname')} />
              <p className={'text-danger'}>{errors?.fullname?.message}</p>
            </div>
            <div className="form-outline mb-3">
              <label className="form-label" htmlFor="phone">
                Phone: <span className={'text-danger'}>*</span>
              </label>
              <input type="text" id={'phone'} className="form-control box-shadow-none" {...register('phone')} />
              <p className={'text-danger'}>{errors?.phone?.message}</p>
            </div>
            <div className="form-outline mb-3">
              <label className="form-label" htmlFor="username">
                Username: <span className={'text-danger'}>*</span>
              </label>
              <input type="text" id={'username'} className="form-control box-shadow-none" {...register('username')} />
              <p className={'text-danger'}>{errors?.username?.message}</p>
            </div>
            <div className="form-outline mb-3">
              <label className="form-label" htmlFor={PASSWORD_FIELD}>
                Password: <span className={'text-danger'}>*</span>
              </label>
              <input type="password" id={PASSWORD_FIELD} className="form-control box-shadow-none" {...register(PASSWORD_FIELD)} />
              <p className={'text-danger'}>{errors[PASSWORD_FIELD]?.message}</p>
            </div>
            <div className="submit_btn d-flex justify-content-end">
              <Button className={'me-3'} variant="primary" type={'submit'}>
                Save
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
