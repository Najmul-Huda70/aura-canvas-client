import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";



const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
});

const fontMontserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

export const metadata = {
  title: "AuraCanvas | Elite Digital Art Marketplace",
  description: "A premium virtual haven empowering creators and connecting global connoisseurs with masterfully curated digital art.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning 
      className={`${cormorantGaramond.variable} ${fontMontserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FDFBF7] text-[#1A1A1A] dark:bg-[#0B0F19] dark:text-[#F3F4F6] transition-colors duration-300">
         
       <Toaster/>
           <Navbar/>
          <main className="grow">
            {children}
          </main>     
          <Footer />
      </body>
    </html>
  );
}