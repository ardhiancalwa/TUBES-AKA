"use client";

import { useState } from "react";
import useModuloCalculator from "@/hooks/useModuloCalculator";

export default function ModuloCalculator() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const { remainder, calculation, calculateModulo } = useModuloCalculator();

  const handleCalculate = () => {
    calculateModulo(a, b);
  };

  return (
    <main className="container mx-auto p-4">
      <div>
        <div className="bg-green-500 p-2 rounded-lg">
          <h1 className="heading3 text-white text-center">Enter your calculate</h1>
        </div>
        <div className="grid grid-cols-3 px-16 my-5">
          <input
            type="number"
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="bg-gray-200 text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-2.5"
          />
          <p className="text-center body1">%</p>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="bg-gray-200 text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-2.5"
          />
        </div>
        <div className="flex justify-center">
        <button
            type="button"
            onClick={handleCalculate}
            className="btn relative inline-flex items-center justify-start overflow-hidden font-medium transition-all bg-indigo-100 rounded hover:bg-white group py-1.5 px-2.5"
          >
            <span className="w-56 h-48 rounded bg-blue-900 absolute bottom-0 left-0 translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
            <span className="relative w-full text-left text-blue-950 transition-colors duration-300 ease-in-out group-hover:text-white">
              Calculate
            </span>
          </button>
        </div>
      </div>

      {remainder !== null && (
        <div className="mt-4">
          <div className="bg-green-500 p-2 rounded-lg">
            <h1 className="heading3 text-white text-center">Your Result</h1>
          </div>
          <div className="flex flex-row justify-center gap-x-4 my-5">
            <p className="subtitle1">Remainder</p>
            <div className="bg-gray-200 min-w-20 min-h-10 rounded-lg flex items-center justify-center p-2">
              {remainder}
            </div>
          </div>
          <div className="flex flex-row justify-center gap-x-4">
            <p className="subtitle1">Full Calculation</p>
            <div className="bg-gray-200 min-w-20 min-h-10 rounded-lg flex items-center justify-center p-2">
              {calculation}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
