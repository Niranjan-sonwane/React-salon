import { Link } from 'react-router-dom'
import { services } from '../data/services'

function HomePage() {
  return (
    <main className="page-content bg-white">
      <section className="about-hair-beauty" style={{ backgroundImage: 'url(/images/bg/about-bg.png)' }}>
        <div className="container-fluid">
          <div className="row d-flex align-items-center justify-content-between">
            <div className="col-lg-7 col-md-12 about-hair-content">
              <div className="section-head">
                <h4>About Us</h4>
                <h2>
                  Beauty is Crafted with
                  <br />
                  Expertise
                </h2>
              </div>
              <p>
                Leela's Aesthetic Lounge in Mangalore is a haven where beauty meets
                precision, offering luxurious services tailored to bring out your natural
                radiance.
              </p>
              <Link to="/about" className="site-button-link line-link black m-b20">
                Read More <span></span>
              </Link>
            </div>
            <div className="col-lg-4 col-md-12">
              <div className="about-hair-bx">
                <div>
                  <h2>
                    Specialized Nail
                    <br />
                    Artistry
                  </h2>
                  <h4>1000+ Happy Customers</h4>
                  <Link to="/appointment" className="site-button">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec-pad bg-white overlay-white-middle our-serv bg-brown">
        <div className="container">
          <div className="section-head text-center">
            <h2 className="m-b10">Our Services</h2>
            <h6 className="m-b10">You Will Like To Look Like Goddess Every Day</h6>
          </div>
          <div className="row">
            {services.map((service) => (
              <div className="col-lg-3 col-md-6 col-sm-6 m-b30" key={service.slug}>
                <div className="service-box text-center">
                  <Link to={`/${service.slug}`}>
                    <div className="service-images m-b20">
                      <img src={service.image} alt={service.title} />
                    </div>
                    <div className="service-content">
                      <h6 className="text-uppercase">{service.title}</h6>
                      <p>{service.shortDescription}</p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="paralax">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h6>
                Let our work inspire you and explore your beauty possibilities
              </h6>
              <Link to="/contact" className="site-button outline">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
