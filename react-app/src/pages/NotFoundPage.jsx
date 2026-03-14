import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="page-content bg-white">
      <section className="content-inner-2">
        <div className="container text-center">
          <h1>404</h1>
          <p>Page not found.</p>
          <Link to="/" className="site-button">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  )
}

export default NotFoundPage
