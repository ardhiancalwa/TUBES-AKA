"use client";
import { useState } from "react";
import Papa from "papaparse";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart elements
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const useUploadCSV = () => {
  const [data, setData] = useState([]);
  const [globalDivisor, setGlobalDivisor] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [runningTimes, setRunningTimes] = useState({
    mergeSortIterative: [],
    mergeSortRecursive: [],
    quickSortIterative: [],
    quickSortRecursive: [],
  });

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

  const handleSort = () => {
    const numbers = data.map((item) => item.number);
    const startTimes = {};
    const endTimes = {};

    // Record times for each sorting algorithm
    const recordRunningTime = (key, func) => {
      startTimes[key] = performance.now();
      const result = func([...numbers]);
      endTimes[key] = performance.now();
      return result;
    };

    const sortedData = {
      mergeSortIterative: recordRunningTime("mergeSortIterative", mergeSortIterative),
      mergeSortRecursive: recordRunningTime("mergeSortRecursive", mergeSortRecursive),
      quickSortIterative: recordRunningTime("quickSortIterative", quickSortIterative),
      quickSortRecursive: recordRunningTime("quickSortRecursive", quickSortRecursive),
    };

    // Convert results to ascending/descending
    const sortFn = sortOrder === "asc" ? (a, b) => a - b : (a, b) => b - a;
    const sortedNumbers = sortedData.mergeSortRecursive.sort(sortFn);

    // Update data and running times
    setData((prevData) =>
      prevData.map((item, index) => ({
        ...item,
        number: sortedNumbers[index],
      }))
    );

    setRunningTimes({
      mergeSortIterative: endTimes.mergeSortIterative - startTimes.mergeSortIterative,
      mergeSortRecursive: endTimes.mergeSortRecursive - startTimes.mergeSortRecursive,
      quickSortIterative: endTimes.quickSortIterative - startTimes.quickSortIterative,
      quickSortRecursive: endTimes.quickSortRecursive - startTimes.quickSortRecursive,
    });
  };

  // Calculate and update the chart data with only the top 50 largest modulo values
  const top50Data = data
    .sort((a, b) => b.modulo - a.modulo) // Sort in descending order of modulo
    .slice(0, 50); // Take top 50 largest modulo values

  const chartData = {
    labels: top50Data.map((item) => `ID ${item.id}`), // Display ID for each value
    datasets: [
      {
        label: "Modulo 50 Largest Values",
        data: top50Data.map((item) => item.modulo),
        backgroundColor: "rgba(75, 192, 192, 1)", // Bar color
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
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
    handleFirst,
    handleLast,
    handlePrevious,
    handleNext,
    handleFileUpload,
    handleDivisorChange,
    handleNumberChange,
    handleRowDivisorChange,
    handleSort,
    setSortOrder,
    sortOrder,
    runningTimes,
    currentData,
    totalPages,
    chartData,
  };
};

// Merge sort and quicksort implementations
const mergeSortRecursive = (arr) => { /* Recursive implementation */ };
const mergeSortIterative = (arr) => { /* Iterative implementation */ };
const quickSortRecursive = (arr) => { /* Recursive implementation */ };
const quickSortIterative = (arr) => { /* Iterative implementation */ };

export default useUploadCSV;
