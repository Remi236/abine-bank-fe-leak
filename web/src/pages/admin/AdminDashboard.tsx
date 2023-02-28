import { MouseEvent } from 'react';
import { Tab, Row, Col, Nav, Accordion } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '~/styles/Dashboard.scss';
import logout_img from '~/assets/logout.png';
import { routes } from '~/Routes';
import { useAuth } from '~/hooks';
import {
  FaUsersCog,
  FaUserSecret,
  FaListAlt,
  FaSignOutAlt,
  FaClock,
  FaPiggyBank,
} from 'react-icons/fa';
import { EmployeeManager, ViewInTime, ViewByBank } from '~/components/admin';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = (e: MouseEvent<Element>) => {
    e.preventDefault();
    logout();
    navigate(routes.admin.login);
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
              <FaUserSecret style={{ fontSize: '40px' }} />
              <p>{user?.fullname}</p>
            </div>
            <Nav variant="pills" className="flex-column manager__nav-items mt-4">
              <Nav.Item>
                <Nav.Link eventKey="first">
                  <FaUsersCog />
                  Employee Manager
                </Nav.Link>
              </Nav.Item>
              <Accordion flush className="transaction-accordion">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <FaListAlt />
                    Transaction List
                  </Accordion.Header>
                  <Accordion.Body>
                    <Nav.Item>
                      <Nav.Link eventKey="second">
                        <FaClock />
                        View in time
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="third">
                        <FaPiggyBank />
                        View by bank
                      </Nav.Link>
                    </Nav.Item>

                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
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
                <EmployeeManager />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <ViewInTime />
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <ViewByBank />
              </Tab.Pane>
              <Tab.Pane eventKey="logout">
                <div className="logout-wrap text-center">
                  <div className="logout-icon ">
                    <img alt="logout" src={logout_img} width="40%" />
                  </div>
                  <div className="logout-text">
                    <h3>Are you sure you want to logout?</h3>
                    <Link to={routes.admin.login}>
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
