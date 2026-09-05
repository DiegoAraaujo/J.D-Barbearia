import Hero from "@/components/hero"
import About from "@/components/about"
import Gallery from "@/components/gallery"
import Reviews from "@/components/reviews"
import WhatsAppFloat from "@/components/whatsapp-float"
import Footer from "@/components/footer"
import Services from "@/components/services"
import Location from "@/components/location"
import Contact from "@/components/contact"

export const dynamic = "force-dynamic"

const Home = () => {
  return (
    <main>
      <Hero />
      <Services />
      <About />
      <Gallery />
      <Location />
      <Contact />
      <Reviews />
      <Footer />
      <WhatsAppFloat />
    </main>
  )
}

export default Home
