import ModuloAnalyzer from "@/app/containers/analyze-modulo-page/analyze-section";
import Image from "next/image";

export default function AnalyzeAlgorithm() {
  return (
    <main className="flex-grow  overflow-hidden bg-gray-500 ">
      <div className="container max-w-screen-sm mx-auto md:max-w-screen-md lg:max-w-screen-xl md:my-6 lg:my-10 bg-white md:rounded-lg lg:rounded-xl ">
        <ModuloAnalyzer />
      </div>
    </main>
  );
}
