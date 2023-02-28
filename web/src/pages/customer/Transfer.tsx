import { Row, Col, Card, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { routes } from '~/Routes';
import '~/styles/Transfer.scss';
import { TbReportMoney, TbArrowLeft } from 'react-icons/tb';
import { useAsync } from 'react-use';
import { Get } from 'shared';
import { FetchMethod } from '~/models';
import { API } from '~/constants';
import { Error, Loading, Header } from '~/components';
import { useFetch } from '~/hooks';
import { ExternalTransferForm, InternalTransferForm } from '~/components/transfer';

export function Transfer() {
  const { api } = useFetch();

  const state = useAsync(async () => await api<Get['Customer']>(FetchMethod.GET, API.customer.profile));

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
      <Row>
        <Col>
          <Card className="m-3 originator-account__card">
            <Card.Header as="h5">Originator account</Card.Header>
            <Card.Body>
              <p className="d-none">{account.id}</p>
              <div className="account-filed mb-3 d-flex">
                <p className={'label mb-0 w-50 ms-auto'}>
                  <span className={'d-inline-block float-end'}>Account number:</span>
                </p>
                <p className={'value mb-0 w-50 text-start ms-2'}>{account.number}</p>
              </div>
              <div className="account-filed mb-3 d-flex">
                <p className={'label mb-0 w-50 ms-auto'}>
                  <span className={'d-inline-block float-end'}>Payment number:</span>
                </p>
                <p className={'value mb-0 w-50 text-start ms-2'}>{account.paymentNumber}</p>
              </div>
              <div className="account-filed d-flex">
                <p className={'label mb-0 w-50 '}>
                  <span className={'d-inline-block float-end'}>Balance:</span>
                </p>
                <p className={'value mb-0 w-50 text-start ms-2'}>
                  <span>{balance}</span>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };
  return (
    <>
      <Header />
      <div className="p-4 content__wrap">
        <div className="transfer-page">
          <div className="page-icon text-center">
            <TbReportMoney />
          </div>
          <h2 className="primary-color text-center">Transfer</h2>
          {renderBody()}
          {/* Tabs */}
          <Tabs defaultActiveKey="internal" id="justify-tab-example" className="mb-3 transfer__tabs" justify>
            {/* Internal Tab */}
            <Tab eventKey="internal" title="Internal">
              <h4 className="primary-color text-center align-middle">Internal Transfer</h4>
              <InternalTransferForm />
            </Tab>
            {/* External Tab */}
            <Tab eventKey="external" title="External">
              <h4 className="primary-color text-center">External Transfer</h4>
              <ExternalTransferForm />
            </Tab>
          </Tabs>
          {/* Back button */}
          <div className="back-home m-3">
            <Link className="btn btn-primary back-home-btn" to={routes.home}>
              <TbArrowLeft />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
