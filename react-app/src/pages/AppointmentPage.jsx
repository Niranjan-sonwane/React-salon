import { useState } from 'react'
import { services } from '../data/services'

function AppointmentPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    dzName: '',
    dzPhoneNumber: '',
    dzService: 'Nails',
    dzDate: '',
    dzTime: '',
    dzEmail: '',
    dzMessage: '',
  })

  const onChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    // Placeholder until backend API is connected.
    setSubmitted(true)
  }

  return (
    <main className="page-content bg-white">
      <section className="dlab-bnr-inr overlay-primary" style={{ backgroundImage: 'url(/images/banner/about.jpg)' }}>
        <div className="container">
          <div className="dlab-bnr-inr-entry">
            <h1 className="text-white">Book Appointment</h1>
          </div>
        </div>
      </section>

      <section className="content-inner-2">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <form className="dlab-form" onSubmit={onSubmit}>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="input-group m-b20">
                      <input
                        name="dzName"
                        type="text"
                        required
                        className="form-control"
                        placeholder="Name"
                        value={formData.dzName}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-group m-b20">
                      <input
                        name="dzPhoneNumber"
                        type="text"
                        required
                        className="form-control"
                        placeholder="Mobile No."
                        value={formData.dzPhoneNumber}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-group m-b20">
                      <select
                        className="form-control"
                        name="dzService"
                        required
                        value={formData.dzService}
                        onChange={onChange}
                      >
                        {services.map((service) => (
                          <option key={service.slug} value={service.title}>
                            {service.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-group m-b20">
                      <input
                        name="dzDate"
                        type="date"
                        required
                        className="form-control"
                        value={formData.dzDate}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-group m-b20">
                      <input
                        name="dzTime"
                        type="time"
                        required
                        className="form-control"
                        value={formData.dzTime}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="input-group m-b20">
                      <input
                        name="dzEmail"
                        type="email"
                        className="form-control"
                        required
                        placeholder="Enter Email"
                        value={formData.dzEmail}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <div className="input-group m-b20">
                      <textarea
                        name="dzMessage"
                        rows="4"
                        className="form-control"
                        required
                        placeholder="Type Message"
                        value={formData.dzMessage}
                        onChange={onChange}
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <button type="submit" className="btn site-button site-button-primary btn-block">
                      Submit
                    </button>
                  </div>
                </div>
              </form>

              {submitted && (
                <p className="m-t20">
                  Appointment request captured in UI. Next step is connecting this form to
                  a backend endpoint.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AppointmentPage
