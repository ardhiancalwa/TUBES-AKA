"use client";

import { useState, useEffect } from "react";

export default function useModuloAnalyzer() {
  const [remainder, setRemainder] = useState(null);
  const [calculation, setCalculation] = useState("");
  const [executionTimes, setExecutionTimes] = useState([]);
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("history");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const saveToLocalStorage = (newEntry) => {
    const storedHistory = JSON.parse(localStorage.getItem("history")) || [];
    const updatedHistory = [...storedHistory, newEntry];
    localStorage.setItem("history", JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };

  const resetHistory = () => {
    setHistory([]); // Clear the state
    localStorage.removeItem("history"); // Clear local storage
  };

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("moduloHistory")) || [];
    setHistory(storedHistory);
  }, []);

  // Function untuk perhitungan modulo
  const calculateModulo = (a, b) => {
    if (b === 0) {
      alert("Division by zero is not allowed!");
      return;
    }

    let remainderValue = a;
    let quotient = 0;

    while (remainderValue >= b) {
      remainderValue -= b;
      quotient += 1;
    }

    const fullCalc = `${a} = (${quotient} * ${b}) + ${remainderValue}`;
    setRemainder(remainderValue);
    setCalculation(fullCalc);

    return { remainderValue, fullCalc };  
  };

  // Function untuk mengukur eksekusi waktu
  const measureExecutionTime = (func, a, b) => {
    const start = performance.now();
    func(a, b);
    return performance.now() - start;
  };

  const analyzePerformance = (a, b) => {
    const moduloIterative = (a, b) => {
      let remainder = a;
      while (remainder >= b) remainder -= b;
      return remainder;
    };

    const moduloRecursive = (a, b) => {
      if (a < b) return a;
      return moduloRecursive(a - b, b);
    };

    const times = [
      measureExecutionTime(moduloIterative, a, b),
      measureExecutionTime(moduloRecursive, a, b),
    ];

    setExecutionTimes(times);

    const newEntry = {
      input: { a, b },
      result: { remainder, calculation },
      times,
    };
    saveToLocalStorage(newEntry);
  };

  const calculateAndAnalyze = (a, b) => {
    if (b === 0) {
      alert("Division by zero is not allowed!");
      return;
    }

    const result = calculateModulo(a, b);
    analyzePerformance(a, b);

    // Simpan kalkulasi jika valid
    if (result) {
      const newEntry = {
        input: { a, b },
        result,
        times: executionTimes,
      };
      saveToLocalStorage(newEntry);
    }
  };


  return {
    remainder,
    calculation,
    executionTimes,
    history,
    resetHistory,
    calculateAndAnalyze,
  };
}
