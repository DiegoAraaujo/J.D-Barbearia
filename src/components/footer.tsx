import Link from "next/link"
import { FaInstagram, FaWhatsapp } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="border-t border-bone/10 bg-surface px-6 py-10 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="font-display text-3xl text-bone">J.D BARBEARIA</span>
          <p className="mt-2 max-w-sm text-sm text-bone/55">
            Corte, cuidado e um momento para você se sentir bem.
          </p>
        </div>

        <div className="flex flex-col gap-5 md:items-end">
          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-bone/60">
            <Link href="/#services" className="transition-colors hover:text-gold">Serviços</Link>
            <Link href="/#gallery" className="transition-colors hover:text-gold">Galeria</Link>
            <Link href="/#reviews" className="transition-colors hover:text-gold">Avaliações</Link>
            <Link href="/#contact" className="transition-colors hover:text-gold">Contato</Link>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram da J.D Barbearia"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/15 text-bone/60 transition-colors hover:border-gold/60 hover:bg-bone/5 hover:text-gold"
            >
              <FaInstagram className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/5588996553613"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp da J.D Barbearia"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/15 text-bone/60 transition-colors hover:border-gold/60 hover:text-gold"
            >
              <FaWhatsapp className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-bone/10 pt-5 text-xs text-bone/40">
        © {new Date().getFullYear()} J.D Barbearia. Todos os direitos reservados.
      </div>
    </footer>
  )
}

export default Footer
