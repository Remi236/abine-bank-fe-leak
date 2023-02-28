import {useFetch} from "~/hooks";
import {useForm} from "react-hook-form";
import {createUserSchema, FetchMethod, ICreateUserForm} from "~/models";
import {yupResolver} from "@hookform/resolvers/yup";
import {log} from "shared";
import {API, EMAIL_FIELD, PASSWORD_FIELD} from "~/constants";
import {useNotify} from "~/hooks/useNotify";

export function CreateAccount() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateUserForm>({
    resolver: yupResolver(createUserSchema),
  });
  const {api} = useFetch();
  const {showNotifications} = useNotify();
  async function onSubmit(dto: ICreateUserForm) {
    const {json, error} = await api(FetchMethod.POST, API.customer.post, {...dto});
    if(error) {
      showNotifications('Create user unsuccessfully ', error, {type: "danger"});
    }
    log.info(json);
    showNotifications('Create user successfully ', '', {type: "success"});
  }

  return (
    <div className="create-account-page">
      <h2 className="primary-color text-center">Create Customer Account</h2>
      <div className="create-account__form">
        <form className="create-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-outline mb-2">
            <label className="form-label" htmlFor="username">
              User Name: <span className="text-danger">*</span>
            </label>
            <input type="text" id="username" className="form-control box-shadow-none" {...register('username', {required: true})} />
            <p className="text-danger">{errors?.username?.message}</p>
          </div>
          <div className="form-outline mb-2">
            <label className="form-label" htmlFor="fullname">
              Full Name: <span className="text-danger">*</span>
            </label>
            <input type="text" id="fullname" className="form-control box-shadow-none" {...register('fullname', {required: true})} />
            <p className="text-danger">{errors?.fullname?.message}</p>
          </div>
          <div className="form-outline mb-2">
            <label className="form-label" htmlFor="email">
              Email: <span className="text-danger">*</span>
            </label>
            <input type="email" id="email" className="form-control box-shadow-none" {...register(EMAIL_FIELD, {required: true})}/>
            <p className="text-danger">{errors[EMAIL_FIELD]?.message}</p>
          </div>
          <div className="form-outline mb-2">
            <label className="form-label" htmlFor="password">
              Password: <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              autoComplete="on"
              id="password"
              className="form-control outline-none box-shadow-none"
              {...register(PASSWORD_FIELD, {required: true})}
            />
            <p className="text-danger">{errors[PASSWORD_FIELD]?.message}</p>
          </div>
          <div className="form-outline mb-2">
            <label className="form-label" htmlFor="phone">
              Phone: <span className="text-danger">*</span>
            </label>
            <input type="text" id="phone" className="form-control box-shadow-none" {...register('phone', {required: true})}/>
            <p className="text-danger">{errors?.phone?.message}</p>
          </div>
          <div>
            <button className="btn btn-primary btn-block w-100 text-uppercase">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
