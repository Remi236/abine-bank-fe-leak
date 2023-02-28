import { Link, useNavigate } from 'react-router-dom';
import { Nav, Navbar, Container, Dropdown } from 'react-bootstrap';
import '~/styles/Header.scss';
import { routes, routesMenu } from '~/Routes';
import { useAuth, useDebtsSocket } from '~/hooks';
import { MouseEvent, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import { MdNotifications, MdNotificationsActive } from 'react-icons/md';

export function Header() {
  const { user, logout, isAuth } = useAuth();
  const navigate = useNavigate();
  useDebtsSocket({
    onNew: () => setHasNotification(true),
    onCancel: () => setHasNotification(true),
    onPaidOff: () => setHasNotification(true),
  });

  const [hasNotification, setHasNotification] = useState(false);

  const handleLogout = (e: MouseEvent<Element>) => {
    e.preventDefault();
    logout();
    navigate(routes.login);
  };

  return (
    <div>
      <Navbar
        collapseOnSelect
        fixed="top"
        expand="lg"
        className="pt-0"
        style={{
          backgroundColor: 'white',
          boxShadow: 'rgba(0, 0, 0, 0.25) 0px 25px 50px -12px',
        }}
      >
        <Container
          style={{
            backgroundColor: 'white',
          }}
        >
          <Link className="navbar-brand" to="/">
            <img alt="" src="/logo.png" width="60" height="60" className="d-inline-block align-top" />
            <span className="app-name">AbineBank</span>
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse className="navbar-center" id="responsive-navbar-nav">
            <Nav className="mr-auto">
              {routesMenu.map((item, index) => (
                <Link className="nav-link" to={item.link} key={index}>
                  {item.title}
                </Link>
              ))}
            </Nav>
            {isAuth ? (
              <div className="d-flex justify-content-center">
                <Dropdown className="dropdown-wrap">
                  <Dropdown.Toggle className="dropdown-btn">
                    <FaUserCircle className="user-icon" />
                    <span className="m-1">{user?.fullname}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Link className="dropdown-item" to={routes.profile}>
                      Profile
                    </Link>
                    <Link className="dropdown-item" to={routes.login} onClick={(e) => handleLogout(e)}>
                      Logout
                    </Link>
                  </Dropdown.Menu>
                </Dropdown>
                <Button
                  variant="primary"
                  className="notification-btn ms-1"
                  onClick={() => navigate(routes.debtReminder)}
                >
                  {hasNotification ? <MdNotificationsActive className="notifications-active" /> : <MdNotifications />}
                </Button>
              </div>
            ) : (
              <Nav className="ml-auto">
                <Link to={routes.login}>Login</Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
