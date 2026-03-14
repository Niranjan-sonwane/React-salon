function PortfolioPage() {
  const items = [
    '/images/portfolio/1.jpg',
    '/images/portfolio/2.jpg',
    '/images/portfolio/3.PNG',
    '/images/portfolio/4.jpg',
    '/images/portfolio/5.jpg',
    '/images/portfolio/6.jpg',
    '/images/portfolio/7.PNG',
    '/images/portfolio/8.PNG',
    '/images/portfolio/9.jpg',
    '/images/portfolio/10.png',
    '/images/portfolio/11.jpg',
    '/images/portfolio/12.jpg',
    '/images/inner-images/1.PNG',
    '/images/inner-images/2.JPG',
    '/images/inner-images/3.PNG',
    '/images/inner-images/4.PNG',
    '/images/inner-images/5.PNG',
  ]

  return (
    <main className="page-content bg-white">
      <section className="dlab-bnr-inr overlay-primary" style={{ backgroundImage: 'url(/images/banner/about.jpg)' }}>
        <div className="container">
          <div className="dlab-bnr-inr-entry">
            <h1 className="text-white">Portfolio</h1>
          </div>
        </div>
      </section>

      <section className="content-inner-2">
        <div className="container">
          <div className="section-head text-center m-b20">
            <h2 className="m-b10">Our Portfolio</h2>
            <p>
              From intricate nail designs to flawless skin treatments, every image
              reflects our detail, precision, and care.
            </p>
          </div>
          <div className="row">
            {items.map((src, index) => (
              <div className="col-lg-3 col-md-4 col-sm-6 m-b30" key={src}>
                <img src={src} alt={`Portfolio ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default PortfolioPage
