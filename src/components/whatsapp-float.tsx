import { FaWhatsapp } from "react-icons/fa"

const WhatsAppFloat = () => {
  return (
    <a
      href="https://wa.me/5588996553613"
      target="_blank"
      rel="noreferrer"
      aria-label="Falar pelo WhatsApp"
      title="WhatsApp"
      className="fixed right-5 bottom-5 z-100 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366] md:right-8 md:bottom-8 md:h-16 md:w-16"
    >
      <FaWhatsapp aria-hidden="true" className="h-7 w-7 md:h-8 md:w-8" />
    </a>
  )
}

export default WhatsAppFloat
