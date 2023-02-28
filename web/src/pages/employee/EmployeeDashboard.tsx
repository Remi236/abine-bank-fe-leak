import { MouseEvent } from 'react';
import { Tab, Row, Col, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '~/styles/Dashboard.scss';
import logout_img from '~/assets/logout.png';
import { CreateAccount, TopUp, TransactionHistory } from '~/components/employee';
import { routes } from '~/Routes';
import { useAuth } from '~/hooks';
import { FaRegUserCircle, FaAddressCard, FaMoneyBillWave, FaHistory, FaSignOutAlt } from 'react-icons/fa';

export function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = (e: MouseEvent<Element>) => {
    e.preventDefault();
    logout();
    navigate(routes.employee.login);
  };
  return (
    <div className="manager-wrap">
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row className="m-0">
          <Col sm={2} className="manager-navbar">
            <div className="app-wrap text-center">
              <div className="app-logo">
                <img alt="logo" src="/white_logo.png" width="60" height="60" />
              </div>
              <span className="app-name text-center text-white ms-2">AbineBank</span>
            </div>
            <div className="text-white text-center">
              <FaRegUserCircle style={{ fontSize: '40px' }} />
              <p>{user?.fullname}</p>
            </div>
            <Nav variant="pills" className="flex-column manager__nav-items mt-4">
              <Nav.Item>
                <Nav.Link eventKey="first">
                  <FaAddressCard />
                  Create Account
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">
                  <FaMoneyBillWave />
                  Top Up
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">
                  <FaHistory />
                  Transaction History
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="logout">
                  <FaSignOutAlt />
                  Logout
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={10} className="manager-content">
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <CreateAccount />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <TopUp />
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <TransactionHistory />
              </Tab.Pane>
              <Tab.Pane eventKey="logout">
                <div className="logout-wrap text-center">
                  <div className="logout-icon ">
                    <img alt="logout" src={logout_img} width="40%" />
                  </div>
                  <div className="logout-text">
                    <h3>Are you sure you want to logout?</h3>
                    <Link to={routes.employee.login}>
                      <button className="btn btn-primary" onClick={(e) => handleLogout(e)}>
                        Logout
                      </button>
                    </Link>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}
