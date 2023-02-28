import { useAsync } from 'react-use';
import { TfiInfoAlt } from 'react-icons/tfi';
import { Get } from 'shared';
import { Error, Loading, Header } from '~/components';
import { useAuth, useFetch } from '~/hooks';
import { FetchMethod, profileUpdateSchema, ProfileUpdateForm, State } from '~/models';
import { API, CURRENT_PASSWORD_FIELD, EMAIL_FIELD, PASSWORD_CONFIRM_FIELD, PASSWORD_FIELD } from '~/constants';
import { TbArrowLeft } from 'react-icons/tb';
import { Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from '~/Routes';
import { IoIosLogOut } from 'react-icons/all';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import '~/styles/Profile.scss';
import { useNotify } from '~/hooks/useNotify';

export function Profile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdateForm>({
    resolver: yupResolver(profileUpdateSchema),
  });
  const { logout } = useAuth();
  const { api } = useFetch();
  const { showNotifications } = useNotify();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<State>({ error: null });
  const state = useAsync(async () => await api<Get['User']>(FetchMethod.GET, API.user.profile));
  const profile = state.value?.json;

  const onSubmit = async (dto: ProfileUpdateForm) => {
    const value = {
      email: profile?.email,
      name: profile?.fullname,
      currentPassword: dto[CURRENT_PASSWORD_FIELD],
      newPassword: dto[PASSWORD_CONFIRM_FIELD],
    };
    const { json, error } = await api(FetchMethod.PUT, API.user.updateInfo, value);
    if (error) {
      setFormState({ ...state, error });
      return;
    }
    showNotifications('Update account information successfully !', '', { type: 'success' });
    navigate(routes.home);
  };

  const renderBody = () => {
    if (state.loading) {
      return <Loading />;
    }
    if (state?.value?.error) {
      return <Error message={state.value.error} />;
    }

    if (profile == null) {
      return null;
    }

    return (
      <>
        <button
          className="link-primary d-block text-end w-100 bg-transparent p-0 outline-none border-0 mb-3"
          onClick={() => setIsEditing(!isEditing)}
        >
          Change password
        </button>
        <Row>
          <Col>
            {formState.error && (
              <strong>
                <p className="text-danger text-center">Error: {formState.error}</p>
              </strong>
            )}
            <form className="form-forgot-pass" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="password">
                  Email:{' '}
                  {isEditing ? (
                    <span className="text-danger">*</span>
                  ) : (
                    <span className={'text-primary'}>{profile[EMAIL_FIELD]}</span>
                  )}
                </label>
                {isEditing && (
                  <input
                    type="email"
                    autoComplete="on"
                    id={EMAIL_FIELD}
                    className="form-control outline-none box-shadow-none"
                    {...register(EMAIL_FIELD, { required: true })}
                    value={profile[EMAIL_FIELD]}
                    readOnly
                  />
                )}
                {isEditing && <p className="text-danger">{errors[EMAIL_FIELD]?.message}</p>}
              </div>
              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="password">
                  Name:{' '}
                  {isEditing ? (
                    <span className="text-danger">*</span>
                  ) : (
                    <span className={'text-primary'}>{profile.fullname}</span>
                  )}
                </label>
                {isEditing && (
                  <input
                    type="text"
                    id={'name'}
                    className="form-control outline-none box-shadow-none"
                    {...register('name', { required: true })}
                    value={profile.fullname}
                    readOnly
                  />
                )}
                {isEditing && <p className="text-danger">{errors?.name?.message}</p>}
              </div>

              {isEditing && (
                <>
                  <div className="form-outline mb-3">
                    <label className="form-label" htmlFor="password">
                      Current Password: <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      autoComplete="on"
                      id={CURRENT_PASSWORD_FIELD}
                      className="form-control outline-none box-shadow-none"
                      {...register(CURRENT_PASSWORD_FIELD, { required: true })}
                    />
                    <p className="text-danger">{errors[CURRENT_PASSWORD_FIELD]?.message}</p>
                  </div>
                  <div className="form-outline mb-3">
                    <label className="form-label" htmlFor="password">
                      Password: <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      autoComplete="on"
                      id={PASSWORD_FIELD}
                      className="form-control outline-none box-shadow-none"
                      {...register(PASSWORD_FIELD, { required: true })}
                    />
                    <p className="text-danger">{errors[PASSWORD_FIELD]?.message}</p>
                  </div>
                  <div className="form-outline mb-3">
                    <label className="form-label" htmlFor="password">
                      Confirm Password: <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      autoComplete="on"
                      id={PASSWORD_CONFIRM_FIELD}
                      className="form-control outline-none box-shadow-none"
                      {...register(PASSWORD_CONFIRM_FIELD, { required: true })}
                    />
                    <p className="text-danger">{errors[PASSWORD_CONFIRM_FIELD]?.message}</p>
                  </div>

                  <div className="submit_btn d-flex justify-content-end">
                    <button type={'submit'} className="btn btn-primary btn-block w-100 text-uppercase">
                      Submit
                    </button>
                  </div>
                </>
              )}
            </form>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <>
      <Header />
      <div className="p-4 content__wrap">
        <div className="profile-page">
          <div className="page-icon text-center">
            <TfiInfoAlt />
          </div>
          <h2 className="primary-color text-center"> User Information</h2>
          <Row>
            <Col>
              <Card className="my-3 user-account-card">
                <Card.Header as="h5">Profile Information</Card.Header>
                <Card.Body>{renderBody()}</Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="d-flex align-items-center justify-content-between back-home m-3">
            <Link className="btn btn-primary back-home-btn me-2" to={routes.home}>
              <TbArrowLeft /> Back to home
            </Link>
            <button
              className="btn btn-danger rounded-pill back-home-btn bg-danger"
              onClick={async () => {
                await api(FetchMethod.POST, API.auth.logout);
                logout();
                navigate(routes.login);
              }}
            >
              <IoIosLogOut /> Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
