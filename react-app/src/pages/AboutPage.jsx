function AboutPage() {
  return (
    <main className="page-content bg-white">
      <section className="dlab-bnr-inr overlay-primary" style={{ backgroundImage: 'url(/images/banner/about.jpg)' }}>
        <div className="container">
          <div className="dlab-bnr-inr-entry">
            <h1 className="text-white">About Us</h1>
          </div>
        </div>
      </section>

      <section className="about-inner sec-pad hair-services">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <img src="/images/resources/about.jpg" alt="About Leela's Aesthetic Lounge" />
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="section-head">
                <h2>Where Beauty is Crafted with Expertise and Skill</h2>
                <p>
                  We combine advanced beauty techniques with personalized service to make
                  every visit relaxing and result-driven.
                </p>
                <p>
                  Our team is focused on safety, premium products, and consistent quality
                  so your beauty experience feels refreshing and dependable every time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AboutPage
