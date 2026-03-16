import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { services } from '../data/services'

function HomePage() {
  useEffect(() => {
    const $ = window.jQuery || window.$
    if (!$ || !$.fn || !$.fn.owlCarousel) {
      return
    }

    const initCarousel = (selector, options) => {
      const element = $(selector)
      if (!element.length || element.hasClass('owl-loaded')) {
        return
      }
      element.owlCarousel(options)
    }

    initCarousel('.homeslider-carousel', {
      loop: true,
      autoplaySpeed: 3000,
      navSpeed: 3000,
      smartSpeed: 3000,
      autoplay: 3000,
      margin: 30,
      nav: false,
      dots: true,
      responsive: {
        0: { items: 1 },
        480: { items: 1 },
        1024: { items: 1 },
        1200: { items: 1 },
      },
    })

    initCarousel('.img-carousel', {
      loop: true,
      margin: 30,
      autoplaySpeed: 3000,
      navSpeed: 3000,
      smartSpeed: 3000,
      autoplay: 3000,
      nav: true,
      dots: true,
      navText: ['<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>'],
      responsive: {
        0: { items: 1 },
        480: { items: 2 },
        1024: { items: 3 },
        1200: { items: 4 },
      },
    })

    initCarousel('.testimonial-one', {
      loop: true,
      autoplaySpeed: 3000,
      navSpeed: 3000,
      smartSpeed: 3000,
      autoplay: 3000,
      margin: 30,
      nav: false,
      dots: true,
      responsive: {
        0: { items: 1 },
        480: { items: 1 },
        767: { items: 1 },
        1000: { items: 1 },
      },
    })

    initCarousel('.carousel-gallery', {
      loop: true,
      autoplaySpeed: 3000,
      navSpeed: 3000,
      smartSpeed: 3000,
      autoplay: 3000,
      margin: 0,
      nav: false,
      dots: false,
      responsive: {
        0: { items: 2 },
        480: { items: 2 },
        1024: { items: 5 },
        1200: { items: 6 },
      },
    })

    const dragSlider = (dragElement, resizeElement, container) => {
      dragElement.on('mousedown touchstart', (event) => {
        dragElement.addClass('draggablle')
        resizeElement.addClass('resizable')
        const startX = event.pageX || event.originalEvent.touches[0].pageX
        const dragWidth = dragElement.outerWidth()
        const posX = dragElement.offset().left + dragWidth - startX
        const containerOffset = container.offset().left
        const containerWidth = container.outerWidth()
        const minLeft = containerOffset + 10
        const maxLeft = containerOffset + containerWidth - dragWidth - 10

        dragElement
          .parents()
          .on('mousemove touchmove', (moveEvent) => {
            const moveX = moveEvent.pageX || moveEvent.originalEvent.touches[0].pageX
            let leftValue = moveX + posX - dragWidth

            if (leftValue < minLeft) {
              leftValue = minLeft
            } else if (leftValue > maxLeft) {
              leftValue = maxLeft
            }

            const widthValue =
              ((leftValue + dragWidth / 2 - containerOffset) * 100) / containerWidth + '%'

            $('.draggablle')
              .css('left', widthValue)
              .on('mouseup touchend touchcancel', function onStopDrag() {
                $(this).removeClass('draggablle')
                resizeElement.removeClass('resizable')
              })

            $('.resizable').css('width', widthValue)
          })
          .on('mouseup touchend touchcancel', () => {
            dragElement.removeClass('draggablle')
            resizeElement.removeClass('resizable')
          })

        event.preventDefault()
      })
    }

    $('.ba-slider').each(function initCompareSlider() {
      const current = $(this)
      const width = `${current.width()}px`
      current.find('.resize img').css('width', width)
      dragSlider(current.find('.handle'), current.find('.resize'), current)
    })

    $(window).on('resize.home', () => {
      $('.ba-slider').each(function updateCompareSlider() {
        const current = $(this)
        current.find('.resize img').css('width', `${current.width()}px`)
      })
    })

    return () => {
      $(window).off('resize.home')
    }
  }, [])

  const heroSlides = [
    {
      id: 'hero-1',
      desktop: '/images/slider/1.jpg',
      mobile: '/images/mob/1.jpg',
      title: 'Beauty Salon Printing and Industry',
      text: 'Leela\'s Aesthetic Lounge in Mangalore is a haven where beauty meets precision, offering luxurious services tailored to bring out your natural radiance.',
    },
    {
      id: 'hero-2',
      desktop: '/images/slider/2.jpg',
      mobile: '/images/mob/2.jpg',
      title: 'You Will Like To Look Like Goddess Every Day',
      text: 'Our expert team is trained in the latest beauty trends and techniques, ensuring every treatment is performed with exceptional care and detail.',
    },
    {
      id: 'hero-3',
      desktop: '/images/slider/3.jpg',
      mobile: '/images/mob/3.jpg',
      title: 'Come Experience the Real Delight',
      text: 'We believe in a personalized approach to beauty, focusing on enhancing your unique features with services that are safe and effective.',
    },
    {
      id: 'hero-4',
      desktop: '/images/slider/4.jpg',
      mobile: '/images/mob/4.jpg',
      title: 'Begin Your Beauty Journey Here',
      text: 'With our passion for aesthetics and commitment to excellence, Leela\'s Aesthetic Lounge is your trusted destination for beauty transformations.',
    },
  ]

  const testimonials = [
    {
      name: 'Sneha P',
      text: 'Not only was the end result beautiful, but it also gave me a sense of confidence and satisfaction. The staff ensured every detail was smooth and polished.',
    },
    {
      name: 'Ayisha',
      text: 'Leela\'s Aesthetic Lounge transformed my look with unmatched care and detail. The result was natural, defined, and exactly what I wanted.',
    },
    {
      name: 'Kshipra',
      text: 'I tried microblading with ombre shading, and the result was fantastic. The team made the whole experience comfortable and precise.',
    },
  ]

  const homePortfolio = [
    '/images/portfolio/1.jpg',
    '/images/portfolio/13.jpeg',
    '/images/portfolio/14.jpeg',
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
  ]

  const serviceShapes = [
    '/images/shape/3.png',
    '/images/shape/4.png',
    '/images/shape/5.png',
    '/images/shape/6.png',
    '/images/shape/7.png',
    '/images/shape/8.png',
    '/images/shape/9.png',
    '/images/shape/10.png',
  ]

  return (
    <main className="page-content bg-white">
      <section>
        <div className="homeslider-carousel owl-carousel owl-theme owl-none owl-dots-primary-big">
          {heroSlides.map((slide) => (
            <div className="item" key={slide.id}>
              <img src={slide.desktop} className="w-100 desk" alt={slide.title} />
              <img src={slide.mobile} className="w-100 mob" alt={slide.title} />
              <div className="slider-content">
                <div className="container">
                  <div className="row">
                    <div className="col-md-7">
                      <h2>{slide.title}</h2>
                      <p>{slide.text}</p>
                      <Link to="/contact" className="site-button">
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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
            <h6 className="m-b10">You Will Like To Look Like Goddess Every Day!</h6>
            <div className="dlab-separator-outer m-b0">
              <div className="dlab-separator style-icon">
                <i className="flaticon-spa"></i>
              </div>
            </div>
          </div>
          <div className="img-carousel owl-carousel owl-theme owl-none owl-dots-primary-big owl-btn-center-lr owl-loade m-b30">
            {services.map((service, index) => (
              <div className="item" key={service.slug}>
                <div className="service-box text-center">
                  <Link to={`/${service.slug}`}>
                    <div className="service-images m-b20">
                      <img src={service.image} alt={service.title} />
                      <i>
                        <img src={serviceShapes[index]} alt="" />
                      </i>
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
          <div className="text-center">
            <Link to="/nails" className="site-button outline">
              See all Services
            </Link>
          </div>
        </div>
      </section>

      <section className="service-section sec-pad animation-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12 col-12">
              <div className="before-content">
                <div className="section-head">
                  <h6>Our Speciality</h6>
                  <h2 className="m-b10">
                    Unveil Your Beauty with <br /> Flawless Precision
                  </h2>
                </div>
                <p>
                  We pride ourselves on delivering personalized beauty treatments that use
                  premium products selected to suit diverse preferences and enhance your
                  comfort.
                </p>
                <Link to="/contact" className="site-button outline">
                  Know More About Us
                </Link>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-12 image-container">
              <div>
                <div className="ba-slider">
                  <div>
                    <img src="/images/home/whychooseus.jpg" alt="After treatment" />
                    <p className="mb-0">
                      <span className="w3-tag w3-white after-lable">After</span>
                    </p>
                    <div className="resize" style={{ width: '40%' }}>
                      <img src="/images/home/whychooseus.jpg" alt="Before treatment" />
                      <p className="mb-0">
                        <span className="w3-tag w3-white before-lable">Before</span>
                      </p>
                    </div>
                  </div>
                  <span className="handle" style={{ left: '40%' }}></span>
                </div>
                <div className="back-div"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="why-home bg-white sec-pad"
        style={{ backgroundImage: 'url(/images/background/bg7.jpg)', backgroundSize: 'cover' }}
      >
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5 m-b30 align-self-center">
              <div className="dis-tbl-cell m-b30">
                <div className="section-head">
                  <h2>
                    Your Beauty Deserves <br /> Expertise Care
                  </h2>
                  <h6>
                    Choosing Leela's Aesthetic Lounge means choosing a team dedicated to
                    precision, safety, and the art of beauty.
                  </h6>
                </div>
                <ul className="list-angle-right">
                  <li>Customized to meet your unique needs</li>
                  <li>We use highest-quality products</li>
                  <li>Ensure lasting and flawless results</li>
                  <li>More creative with smoothness and flexibility</li>
                  <li>Our every service exceeds your expectations</li>
                </ul>
                <Link to="/appointment" className="site-button m-r15">
                  Appointment <i className="ti-arrow-right m-l10"></i>
                </Link>
                <Link to="/portfolio" className="site-button-secondry">
                  Portfolio <i className="ti-arrow-right m-l10"></i>
                </Link>
              </div>
            </div>
            <div className="col-lg-5 offset-lg-1">
              <div className="img-collage">
                <div className="coll-1">
                  <img src="/images/home/why1.jpg" alt="Why choose us 1" />
                </div>
                <div className="coll-2">
                  <img src="/images/home/why2.jpg" alt="Why choose us 2" />
                </div>
                <div className="coll-3">
                  <img src="/images/home/why3.jpg" alt="Why choose us 3" />
                </div>
                <div className="coll-4">
                  <img src="/images/home/why4.jpg" alt="Why choose us 4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="paralax">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h6>
                Let our work inspire you the <br /> beauty possibilities
              </h6>
              <Link to="/contact" className="site-button outline">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="we-process sec-pad">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-lg-5">
              <div className="section-head">
                <h6>Experience Seamless Results</h6>
                <h2 className="m-b10">
                  Quality products to ensure <br /> Flawless results
                </h2>
              </div>
            </div>
            <div className="col-lg-6">
              <img src="/images/home/we-process.png" alt="Our process" />
            </div>
          </div>
        </div>
      </section>

      <section className="sec-pad spa-testimonial">
        <div className="container">
          <div className="section-head text-center">
            <h2 className="m-b10">Our Testimonial</h2>
          </div>
          <div className="testimonial-one owl-carousel owl-btn-center-lr owl-btn-3 owl-theme">
            {testimonials.map((testimonial) => (
              <div className="item" key={testimonial.name}>
                <div className="testimonial-1">
                  <div className="testimonial-text">
                    <p>{testimonial.text}</p>
                  </div>
                  <div className="testimonial-detail">
                    <strong className="testimonial-name">{testimonial.name}</strong>
                    <span className="testimonial-position">Client</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="portfolio-gallery">
        <div className="container-fluid">
          <div className="row">
            <div className="carousel-gallery dots-none owl-none owl-carousel owl-btn-center-lr owl-btn-3 owl-theme owl-btn-center-lr owl-btn-1 mfp-gallery">
              {homePortfolio.map((image) => (
                <div className="item dlab-box" key={image}>
                  <Link
                    to="/portfolio"
                    className="mfp-link dlab-media dlab-img-overlay3"
                    title="Portfolio"
                  >
                    <img width="205" height="184" src={image} alt="Portfolio" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="call-to-action-section sec-pad">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="contact">
                <div className="media">
                  <svg height="35" viewBox="0 0 512.00003 512.00003" width="35">
                    <path d="m256 0c-107.941406 0-195.765625 87.824219-195.765625 195.765625v180.703125c0 24.914062 20.265625 45.179688 45.175781 45.179688 24.914063 0 45.179688-20.265626 45.179688-45.179688v-150.585938c0-24.910156-20.265625-45.175781-45.179688-45.175781-5.070312 0-9.867187 1.027344-14.425781 2.574219 6.425781-85.511719 77.902344-153.164062 165.015625-153.164062 87.066406 0 158.523438 67.589843 165.007812 153.042968-4.53125-1.550781-9.355468-2.453125-14.417968-2.453125-24.914063 0-45.179688 20.265625-45.179688 45.175781v150.585938c0 24.914062 20.265625 45.179688 45.179688 45.179688 5.304687 0 10.324218-1.085938 15.058594-2.773438v17.832031c0 8.308594-6.765626 15.058594-15.058594 15.058594h-108.1875c-6.238282-17.492187-22.796875-30.117187-42.402344-30.117187-24.910156 0-45.175781 20.265624-45.175781 45.175781 0 24.910156 20.265625 45.175781 45.175781 45.175781 19.605469 0 36.164062-12.628906 42.402344-30.117188h108.1875c24.910156 0 45.175781-20.265624 45.175781-45.175781 0-90.578125 0-150.265625 0-240.941406 0-107.941406-87.824219-195.765625-195.765625-195.765625zm0 0"></path>
                    <path d="m481.882812 213.597656v175.15625c17.488282-6.234375 30.117188-22.792968 30.117188-42.402344v-90.351562c0-19.605469-12.628906-36.164062-30.117188-42.402344zm0 0"></path>
                    <path d="m0 256v90.351562c0 19.609376 12.628906 36.167969 30.117188 42.402344v-175.15625c-17.488282 6.238282-30.117188 22.796875-30.117188 42.402344zm0 0"></path>
                  </svg>
                  <div className="media-body">
                    <h6 className="mt-0">Call us</h6>
                    <p>+9980832431</p>
                  </div>
                </div>
                <div className="newsletter">
                  <div className="news-contain">
                    <h6 className="mt-0">Connect with us</h6>
                    <p>Get In Touch to Begin Your Beauty Journey</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="email-container">
                <div>
                  <div className="email-box">
                    <input type="email" name="email" className="email" placeholder="Enter your email" />
                    <button type="button" className="submit-btn">
                      <i className="fa fa-envelope-o" aria-hidden="true"></i>
                      Enquire
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
