import {useForm} from "react-hook-form";
import {FetchMethod, ITopUpForm, topUpSchema, TransferResponse} from "~/models";
import {yupResolver} from "@hookform/resolvers/yup";
import {useFetch} from "~/hooks";
import {useNotify} from "~/hooks/useNotify";
import {API} from "~/constants";
// import {log} from "shared";
import {removeEmptyValueKey} from "~/helpers/form";

export function TopUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ITopUpForm>({
    resolver: yupResolver(topUpSchema),
  });
  const {api} = useFetch();
  const {showNotifications} = useNotify();

  async function onSubmit(dto: ITopUpForm) {
    const {json, error} = await api<TransferResponse>(FetchMethod.POST, API.customer.topUp, removeEmptyValueKey(dto));

    if(json?.success) {
      showNotifications('Top up successfully ', '', {type: "success"});
      return;
    }
    showNotifications('Top up unsuccessfully ', error || 'Unknown Error', {type: "danger"});
  }

  return (
    <div className="topup-page">
      <h2 className="primary-color text-center">Top Up</h2>
      <div className="topup__form">
        <form className="create-form"  onSubmit={handleSubmit(onSubmit)}>
          <div className="form-outline mb-2">
            <label className="form-label" htmlFor="userName">
              User Name: <span className="text-danger">*</span>
            </label>
            <input type="text" id="userName" className="form-control box-shadow-none" {...register('username', {required: true})}  />
            <p className="text-danger">{errors?.username?.message}</p>
          </div>
          <div className="form-outline mb-2">
            <label className="form-label" htmlFor="number">
              Number: <span className="text-danger">*</span>
            </label>
            <input type="text" autoComplete="on" id="number" className="form-control outline-none box-shadow-none" {...register('number', {required: true})} />
            <p className="text-danger">{errors?.number?.message}</p>
          </div>
          <div className="form-outline mb-2">
            <label className="form-label" htmlFor="amount">
              Amount: <span className="text-danger">*</span>
            </label>
            <input type="text" id="amount" className="form-control box-shadow-none" {...register('amount', {required: true})} />
            <p className="text-danger">{errors?.amount?.message}</p>
          </div>
          <div>
            <button className="btn btn-primary btn-block w-100 text-uppercase">Top Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}
