import { useState } from 'react'

function ContactPage() {
  const [formData, setFormData] = useState({
    dzName: '',
    dzEmail: '',
    dzPhone: '',
    dzMessage: '',
  })
  const [submitted, setSubmitted] = useState(false)

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
            <h1 className="text-white">Contact Us</h1>
          </div>
        </div>
      </section>

      <section className="content-inner-2">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 m-b30">
              <h4 className="m-b20">Send us a message</h4>
              <form onSubmit={onSubmit}>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-group">
                      <input
                        name="dzName"
                        type="text"
                        required
                        className="form-control"
                        placeholder="Your Name"
                        value={formData.dzName}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <input
                        name="dzEmail"
                        type="email"
                        required
                        className="form-control"
                        placeholder="Your Email"
                        value={formData.dzEmail}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <input
                        name="dzPhone"
                        type="text"
                        required
                        className="form-control"
                        placeholder="Your Phone Number"
                        value={formData.dzPhone}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <textarea
                        name="dzMessage"
                        rows="4"
                        required
                        className="form-control"
                        placeholder="Your Message"
                        value={formData.dzMessage}
                        onChange={onChange}
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <button type="submit" className="site-button">
                      <span>Submit</span>
                    </button>
                  </div>
                </div>
              </form>
              {submitted && (
                <p className="m-t20">
                  Thanks for your message. Connect a backend endpoint next to receive
                  submissions by email.
                </p>
              )}
            </div>
            <div className="col-lg-4 m-b30">
              <h4 className="m-b20">Visit Us</h4>
              <p>
                Shop Number - 406 and 407, 4th Floor, Citadel PRISM Business Center,
                PVS Kalalkunj Road, Kodialbail, Mangaluru-575003
              </p>
              <p>
                Email: leelasaestheticlounge@gmail.com
                <br />
                Phone: +91 9980832431
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ContactPage
