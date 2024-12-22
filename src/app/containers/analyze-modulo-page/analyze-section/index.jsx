"use client";

import { useState } from "react";
import React from "react";
import useModuloAnalyzer from "@/hooks/useModuloAnalyzer";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ModuloAnalyzer() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [showHistory, setShowHistory] = useState(false); // State for toggling history visibility
  const { remainder, calculation, history, resetHistory, calculateAndAnalyze } =
    useModuloAnalyzer();

  const handleCalculate = () => {
    if (!a || !b) {
      alert("Both inputs are required!");
      return;
    }
    if (b === 0) {
      alert("Division by zero is not allowed!");
      return;
    }

    // Reset hasil lama sebelum eksekusi baru
    calculateAndAnalyze(Number(a), Number(b));
  };

  const handleResetHistory = () => {
    resetHistory();
  };

  const data = {
    labels: history.map((entry) => `${entry.input.a} % ${entry.input.b}`),
    datasets: [
      {
        label: "Execution Time (Iterative)",
        data: history.map((entry) => entry.times[0]),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Execution Time (Recursive)",
        data: history.map((entry) => entry.times[1]),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <main className="container mx-auto p-4">
      <div>
        <div className="bg-blue-950 p-2 rounded-lg">
          <h1 className="heading3 text-white text-center">
            Enter Your Calculation
          </h1>
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
              Calculate & Analyze
            </span>
          </button>
        </div>
      </div>

      {remainder !== null && (
        <div className="mt-4">
          <div className="bg-blue-950 p-2 rounded-lg">
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

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="text-center text-lg font-bold mb-4">
            Performance Analysis
          </h2>
          <Bar data={data} />
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)} // Toggle history visibility
              className="text-white bg-blue-900 hover:bg-blue-950 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              {showHistory ? "Hide History" : "View History"}
            </button>
            <button
              type="button"
              onClick={handleResetHistory}
              className="ml-4 text-white bg-red-800 hover:bg-red-900 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Reset History
            </button>
          </div>
          {showHistory && ( // Conditionally render the history table
            <div className="mt-4">
              <h3 className="text-center font-semibold">Calculation History</h3>
              <div className="overflow-x-auto mt-2">
                <table className="min-w-full bg-white border border-gray-200 text-sm text-left text-gray-500">
                  <thead className="bg-gray-50 text-gray-700 uppercase">
                    <tr>
                      <th scope="col" className="px-6 py-3 border">
                        #
                      </th>
                      <th scope="col" className="px-6 py-3 border">
                        Input A
                      </th>
                      <th scope="col" className="px-6 py-3 border">
                        Input B
                      </th>
                      <th scope="col" className="px-6 py-3 border">
                        Remainder
                      </th>
                      <th scope="col" className="px-6 py-3 border">
                        Algorithm
                      </th>
                      <th scope="col" className="px-6 py-3 border">
                        Execution Time (ms)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry, index) => (
                      <React.Fragment key={index}>
                        {/* Iterative */}
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-6 py-2 border">{index + 1}</td>
                          <td className="px-6 py-2 border">{entry.input.a}</td>
                          <td className="px-6 py-2 border">{entry.input.b}</td>
                          <td className="px-6 py-2 border">
                            {entry.result.remainderValue}
                          </td>
                          <td className="px-6 py-2 border">Iterative</td>
                          <td className="px-6 py-2 border">{entry.times[0]}</td>
                        </tr>
                        {/* Recursive */}
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-6 py-2 border"></td>
                          <td className="px-6 py-2 border"></td>
                          <td className="px-6 py-2 border"></td>
                          <td className="px-6 py-2 border"></td>
                          <td className="px-6 py-2 border">Recursive</td>
                          <td className="px-6 py-2 border">{entry.times[1]}</td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
