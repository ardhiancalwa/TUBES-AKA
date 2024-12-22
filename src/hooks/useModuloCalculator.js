"use client";

import { useState } from "react";

export default function useModuloCalculator() {
  const [remainder, setRemainder] = useState(null);
  const [calculation, setCalculation] = useState("");

  const calculateModulo = (a, b) => {
    if (b === 0) {
      alert("Division by zero is not allowed!");
      return;
    }

    let remainderValue = a;
    let quotient = 0;

    // Pengurangan berulang untuk menghitung modulus
    while (remainderValue >= b) {
      remainderValue -= b;
      quotient += 1;
    }

    // Menyusun perhitungan lengkap
    const fullCalc = `${a} = (${quotient} * ${b}) + ${remainderValue}`;
    setRemainder(remainderValue);
    setCalculation(fullCalc);
  };

  return { remainder, calculation, calculateModulo };
}
