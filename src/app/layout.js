import { Inter, Poppins } from "next/font/google";
import "./styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata = {
  title: "Easy Modulo | AKA",
  description: "Tugas Besar Analisis Kompleksitas Algoritma",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        {children}
        {/* <Toaster /> */}
      </body>
    </html>
  );
}
