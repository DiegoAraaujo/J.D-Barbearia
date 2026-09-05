import type { Metadata } from "next"
import { Manrope, Sora } from "next/font/google"
import MotionProvider from "@/components/motion-provider"
import "./globals.css"

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700"],
})

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "J.D Barbearia",
  description: "J.D Barbearia - tradição e precisão em cada corte",
}

const RootLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink font-sans text-bone">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}

export default RootLayout
