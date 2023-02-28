import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaLocationArrow, FaPhone, FaEnvelope, FaChevronRight } from 'react-icons/fa';
import { routes, routesMenu } from '~/Routes';
import '~/styles/Footer.scss';
export function Footer() {
  return (
    <div className="footer-wrap">
      <Container>
        <Row>
          <Col lg style={{ paddingRight: '45px' }} className="d-print-none">
            <div className="mt-2">
              <Link to="/" className="text-decoration-none">
                <img alt="" src="/logo.png" width="60" height="60" className="d-inline-block align-top" />
                <span className="app-name">AbineBank</span>
              </Link>
            </div>
            <p className="text-intro">
              Abine is an internet banking application that allows you to quickly transfer money in minutes. You can
              transfer money internally, externally and there are many different facilities.
            </p>
          </Col>
          <Col lg className="d-print-none">
            <p className="text-category">Helpful Links</p>
            <div className="helpful-links">
              <ul className="helpful-links-list list-unstyled">
                {routesMenu.map((item, index) => (
                  <li key={index}>
                    <FaChevronRight />
                    <Link to={item.link} className="text-decoration-none">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col lg>
            <p className="text-category">Contact us</p>
            <div className="icon-ai">
              <FaLocationArrow />
              <span>227 Nguyen Van Cu W.4 D.5 Ho Chi Minh</span>
            </div>
            <div className="icon-ai">
              <FaPhone />
              <span>(+84) 0932982305</span>
            </div>
            <div className="icon-ai">
              <FaEnvelope />
              <span>Abinel@gmail.com</span>
            </div>
          </Col>
        </Row>
        <footer className="footer-copyright text-center">&copy;2022 Abine Internet Banking</footer>
      </Container>
    </div>
  );
}
