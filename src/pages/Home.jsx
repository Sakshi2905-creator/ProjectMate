import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Features />
        <CTA />
      </main>

      <Footer />
    </>
  )
}

export default Home