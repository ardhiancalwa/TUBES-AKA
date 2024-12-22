import AboutHeader from "@/app/containers/about-page/header-section";
import ModuloCalculator from "@/app/containers/modulo-calculate-page/modulo-calculator-section";

export default function Home() {
  return (
    <main className="flex-grow  overflow-hidden bg-gray-500 ">
      <div className="container max-w-screen-sm mx-auto md:max-w-screen-md lg:max-w-screen-xl md:my-6 lg:my-10 bg-white md:rounded-lg lg:rounded-xl ">
        <AboutHeader />
        <ModuloCalculator />
      </div>
    </main>
  );
}
