import AboutContent from "@/app/containers/about-page/content-section";
import AboutHeader from "@/app/containers/about-page/header-section";
import Image from "next/image";

export default function About() {
  return (
    <main className="flex-grow  overflow-hidden bg-gray-500 ">
      <div className="container mx-auto md:max-w-screen-md lg:max-w-screen-xl md:my-6 lg:my-10 bg-white md:rounded-lg lg:rounded-xl ">
        <AboutHeader />
        <AboutContent />
      </div>
    </main>
  );
}
