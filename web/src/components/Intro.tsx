import pay_img from '../assets/pay.png';
import about_img from '../assets/about.png';
import simple_img from '../assets/simple.png';
import team_img from '../assets/team.png';
import { Link } from 'react-router-dom';
import {
  FaAddressCard,
  FaMoneyBillWave,
  FaMobileAlt,
  FaCheck,
  FaCoffee,
  FaDrumstickBite,
  FaGlassMartiniAlt,
} from 'react-icons/fa';
import '~/styles/Intro.scss';
export function Intro() {
  return (
    <div className="intro-page mt-5">
      <section className="pay-wrap">
        <div className="container">
          <div className="row gx-5 align-items-center">
            <div className="col-md-6">
              <div className="pay-img-wrap">
                <img src={pay_img} alt="pay-img" style={{ width: '105%' }} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="pay__content">
                <span>Instant Money Transfer</span>
                <h1>Online Banking Pay In Your Hand</h1>
                <p>
                  Abine is an internet banking application that allows you to quickly transfer money in minutes. You can
                  transfer money internally, externally and there are many different facilities. Let&apos;s get started!
                </p>
                <Link to="/login" className="btn btn-primary">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="service-wrap mt-4">
        <div className="container">
          <div className="section-title text-center">
            <span>Our Services</span>
            <h2>Payment Services</h2>
          </div>
          <div className="services-card text-center row justify-content-center">
            <div className="col-xl-4 col-lg-6 col-md-6">
              <div className="feature-card">
                <div className="feature-info">
                  <div className="feature-title">
                    <div className="page-icon text-center">
                      <FaAddressCard />
                    </div>
                    <h3>Protect Your Card</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6">
              <div className="feature-card">
                <div className="feature-info">
                  <div className="feature-title">
                    <div className="page-icon text-center">
                      <FaMoneyBillWave />
                    </div>
                    <h3>Send Money</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6">
              <div className="feature-card">
                <div className="feature-info">
                  <div className="feature-title">
                    <div className="page-icon text-center">
                      <FaMobileAlt />
                    </div>
                    <h3>Online Banking</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="about-wrap">
        <div className="container">
          <div className="row gx-5 align-items-center">
            <div className="col-lg-6 col-12">
              <div className="about-content">
                <div className="content-title ">
                  <span>Reliable Online Payment Platform</span>
                  <h2>Anytime Anywhere Money Can Be Deposited</h2>
                </div>
                <ul className="content-feature-list list-style">
                  <li>
                    <FaCheck />
                    Powerful Web App
                  </li>
                  <li>
                    <FaCheck />
                    Free Plan Available
                  </li>
                  <li>
                    <FaCheck />
                    Commitment Free
                  </li>
                  <li>
                    <FaCheck />
                    100% Transparent Cost
                  </li>
                  <li>
                    <FaCheck />
                    Full Data Privacy Compliance
                  </li>
                  <li>
                    <FaCheck />
                    Debit Mastercard Included
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6 col-12">
              <div className="about-img-wrap">
                <img src={about_img} alt="about-img" style={{ width: '105%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="simple-wrap">
        <div className="container">
          <div className="row gx-5 align-items-center">
            <div className="col-lg-6 col-12">
              <div className="simple-img-wrap">
                <img src={simple_img} alt="simple-img" style={{ width: '105%' }} />
              </div>
            </div>
            <div className="col-lg-6 col-12">
              <div className="simple-content">
                <div className="content-title">
                  <span>Protect Your Money</span>
                  <h2>We Do Our Best To Keep Customer&apos;s Money Safe</h2>
                </div>
                <ul className="content-feature-list list-unstyled">
                  <li>
                    <FaCheck />
                    Security In Bank Level
                  </li>
                  <li>
                    <FaCheck />
                    Investments Best In Class
                  </li>
                  <li>
                    <FaCheck />
                    Secure Watch Asset
                  </li>
                  <li>
                    <FaCheck />
                    Address Information
                  </li>
                  <li>
                    <FaCheck />
                    Personal Details
                  </li>
                  <li>
                    <FaCheck />
                    Identification
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="team-wrap">
        <div className="container">
          <div className="row gx-5 align-items-center">
            <div className="col-lg-6 col-12">
              <div className="team-content">
                <div className="content-title">
                  <span>Our Team</span>
                  <h2>Meet Our Team</h2>
                </div>
                <ul className="content-team-list list-unstyled">
                  <li>
                    <FaCoffee />
                    21424002 - Huỳnh Ngọc Ninh Bình
                  </li>
                  <li>
                    <FaDrumstickBite />
                    21424062 - Quách Hải Trung
                  </li>
                  <li>
                    <FaGlassMartiniAlt />
                    21424064 - Đào Anh Tú
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6 col-12">
              <div className="team-img-wrap">
                <img src={team_img} alt="team-img" style={{ width: '105%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
