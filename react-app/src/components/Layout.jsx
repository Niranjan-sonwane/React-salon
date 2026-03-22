import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'

const serviceLinks = [
  { to: '/nails', label: 'Nails' },
  { to: '/lashes', label: 'Lashes' },
  { to: '/skin', label: 'Skin' },
  { to: '/pedicure', label: 'Pedicure' },
  { to: '/manicure', label: 'Manicure' },
  { to: '/darklip-correction', label: 'DarkLip Correction' },
  { to: '/microblading', label: 'Microblading' },
  { to: '/waxing', label: 'Waxing' },
]

function Layout() {
  const navigate = useNavigate()
  return (
    <div className="page-wraper">
      <header className="site-header header center mo-left">
        <div className="sticky-header main-bar-wraper navbar-expand-lg">
          <div className="main-bar clearfix ">
            <div className="container clearfix">
              <div className="logo-header mostion">
                <Link to="/" className="dez-page">
                  <img src="/images/header.png" alt="Leela's Aesthetic Lounge" />
                </Link>
              </div>

              <button
                className="navbar-toggler collapsed navicon justify-content-end"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span></span> <span></span> <span></span>
              </button>

              <div
                className="header-nav navbar-collapse collapse justify-content-between"
                id="navbarNavDropdown"
              >
                <ul className="nav navbar-nav">
                  <li>
                    <NavLink to="/">Home</NavLink>
                  </li>
                  <li>
                    <NavLink to="/about">About</NavLink>
                  </li>
                  <li className="menu-item-has-children">
                    <Link to="/nails">
                      Services <i className="fa fa-chevron-down"></i>
                    </Link>
                    <ul className="sub-menu">
                      {serviceLinks.map((service) => (
                        <li key={service.to}>
                          <NavLink to={service.to} className="dez-page">
                            {service.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>

                <ul className="nav navbar-nav">
                  <li>
                    <NavLink to="/appointment">Appointment</NavLink>
                  </li>
                  <li>
                    <NavLink to="/portfolio">Portfolio</NavLink>
                  </li>
                  <li className="menu-btn">
                    <NavLink to="/contact">Contact</NavLink>
                  </li>
                </ul>
              </div>

              {/* Admin icon — navigates to login */}
              <button
                className="admin-nav-icon"
                onClick={() => navigate('/admin-login')}
                aria-label="Admin login"
                title="Admin Panel"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <Outlet />

      <footer className="site-footer text-uppercase footer-white">
        <div className="footer-top">
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                <div className="widget one">
                  <h6 className="m-b30">Stay in the Know</h6>
                  <p className="text-capitalize m-b20">
                    If you have any questions, contact us and we will get back to you.
                  </p>
                </div>
              </div>
              <div className="col-xl-3 col-lg-2 col-md-6 col-sm-3 col-12">
                <div className="widget widget_services border-0">
                  <h6 className="m-b20">Get in Touch</h6>
                  <ul className="foot-cont">
                    <li>
                      <a href="#">
                        Shop Number - 406 and 407, 4th Floor, Citadel PRISM Business Center,
                        PVS Kalalkunj Road, Kodialbail, Mangaluru-575003
                      </a>
                    </li>
                    <li className="mail">
                      <a href="mailto:leelasaestheticlounge@gmail.com">
                        leelasaestheticlounge@gmail.com
                      </a>
                    </li>
                  </ul>
                  <h5 className="number">
                    <a href="tel:+919980832431">+91 9980832431</a>
                  </h5>
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-12">
                <div className="widget widget_services border-0">
                  <h6 className="m-b20">Social</h6>
                  <ul>
                    <li>
                      <a href="#">Instagram</a>
                    </li>
                    <li>
                      <a href="#">Twitter</a>
                    </li>
                    <li>
                      <a href="#">Facebook</a>
                    </li>
                    <li>
                      <a href="#">Youtube</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-6 text-center text-md-left">
                <span>Copyright © 2026 Leela's Aesthetic Lounge. All Rights Reserved.</span>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6 text-center text-md-right ">
                <div className="widget-link ">
                  <ul>
                    <li>
                      <a href="#">Privacy Policy</a>
                    </li>
                    <li>
                      <a href="#">Terms and Conditions</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
