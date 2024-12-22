import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function MainAppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
