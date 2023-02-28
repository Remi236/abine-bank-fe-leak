import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '~/styles/UserAccount.scss';
import { useAuth, useFetch } from '~/hooks';
import { CLoseResponse, FetchMethod } from '~/models';
import { API } from '~/constants';
import { routes } from '~/Routes';
import { useAsync } from 'react-use';
import { Get } from 'shared';
import { TbCoin, TbArrowLeft, TbCashBanknoteOff } from 'react-icons/tb';
import { Loading, Error, Header } from '~/components';
import { useNotify } from '~/hooks/useNotify';

export function UserAccount() {
  const { logout } = useAuth();
  const { api } = useFetch();
  const { showNotifications } = useNotify();
  const navigate = useNavigate();
  const state = useAsync(async () => await api<Get['Customer']>(FetchMethod.GET, API.customer.profile));

  const disableAccount = async () => {
    const { json, error } = await api<CLoseResponse>(FetchMethod.POST, API.customer.close);
    if (error) {
      showNotifications(`Your action is unsuccessfully !`, error, { type: 'danger' });
    } else if (json?.isClosed) {
      showNotifications(`Your action is successfully`, '', { type: 'success' });
      await api(FetchMethod.POST, API.auth.logout);
      logout();
      navigate(routes.login);
    }
  };

  const renderBody = () => {
    if (state.loading) {
      return <Loading />;
    }

    if (state?.value?.error) {
      return <Error message={state.value.error} />;
    }

    const account = state.value?.json?.Account;
    if (account == null) {
      return null;
    }

    const balance = account?.balance
      ? account?.balance?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
      : 0;

    return (
      <>
        <p className="d-none">{account.id}</p>
        <Card.Text>Account number: {account.number}</Card.Text>
        <Card.Text>Payment number: {account.paymentNumber}</Card.Text>
        <Card.Text>
          Balance: <span>{balance}</span>
        </Card.Text>
      </>
    );
  };

  return (
    <>
      <Header />
      <div className="p-4 content__wrap">
        <div className="user-account-page">
          <div className="page-icon text-center">
            <TbCoin />
          </div>
          <h2 className="primary-color text-center">Account Information</h2>
          <Row>
            <Col>
              <Card className="my-3 user-account-card">
                <Card.Header as="h5">Payment account</Card.Header>
                <Card.Body>{renderBody()}</Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="text-center back-home m-3">
            <Link className="m-2 btn btn-primary back-home-btn" to={routes.home}>
              <TbArrowLeft /> Back to home
            </Link>
            <Button className="m-2 btn btn-primary back-home-btn" onClick={disableAccount}>
              <TbCashBanknoteOff /> Close Account
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
