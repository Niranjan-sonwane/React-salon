import { Link, useParams } from 'react-router-dom'
import { services } from '../data/services'

function ServicePage() {
  const { slug } = useParams()
  const normalizedSlug = (slug || '').toLowerCase()
  const service = services.find(
    (item) => item.slug === normalizedSlug || item.aliases?.includes(normalizedSlug),
  )

  if (!service) {
    return (
      <main className="page-content bg-white">
        <section className="content-inner-2">
          <div className="container text-center">
            <h2>Service not found</h2>
            <Link to="/" className="site-button m-t20">
              Back to Home
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="page-content bg-white">
      <section
        className="dlab-bnr-inr overlay-primary"
        style={{ backgroundImage: `url(${service.bannerImage || '/images/banner/about.jpg'})` }}
      >
        <div className="container">
          <div className="dlab-bnr-inr-entry">
            <h1 className="text-white">{service.title}</h1>
          </div>
        </div>
      </section>

      <section className="services-inner sec-pad hair-services">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 m-b30">
              <img src={service.detailImage || service.image} alt={service.title} />
            </div>
            <div className="col-lg-6 m-b30">
              <h2>{service.title}</h2>
              {service.descriptions?.map((text) => (
                <p key={text}>{text}</p>
              ))}
              <Link to="/appointment" className="site-button">
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ServicePage
