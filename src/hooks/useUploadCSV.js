"use client";
import { useState } from "react";
import Papa from "papaparse";

const useUploadCSV = () => {
  const [data, setData] = useState([]);
  const [globalDivisor, setGlobalDivisor] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        delimiter: "\t",
        skipEmptyLines: true,
        complete: (result) => {
          const parsedData = result.data.map((row, index) => {
            const number = parseInt(row[0], 10);
            return {
              id: index + 1,
              number: number,
              divisor: globalDivisor,
              modulo: number % globalDivisor,
            };
          });
          setData(parsedData);
          setCurrentPage(1);
        },
      });
    }
  };

  const handleDivisorChange = (value) => {
    const newDivisor = value <= 0 ? 1 : value;
    setGlobalDivisor(newDivisor);
    setData((prevData) =>
      prevData.map((item) => ({
        ...item,
        divisor: newDivisor,
        modulo: item.number % newDivisor,
      }))
    );
  };

  const handleNumberChange = (id, value) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, number: value, modulo: value % item.divisor }
          : item
      )
    );
  };

  const handleRowDivisorChange = (id, value) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, divisor: value, modulo: item.number % value }
          : item
      )
    );
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFirst = () => setCurrentPage(1);
  const handleLast = () => setCurrentPage(totalPages);
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return {
    data,
    globalDivisor,
    currentPage,
    itemsPerPage,
    handleFileUpload,
    handleDivisorChange,
    handleNumberChange,
    handleRowDivisorChange,
    handleFirst,
    handleLast,
    handlePrevious,
    handleNext,
    currentData,
    totalPages,
  };
};

export default useUploadCSV;
