"use client";
import React from "react";
import { useState } from "react";
import useUploadCSV from "@/hooks/useUploadCSV";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);
const TableViewUploadCSV = () => {
  const {
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
  } = useUploadCSV();

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedData, setSortedData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const performSortingAnalysis = (dataset) => {
    setLoading(true);
    try {
      const executionTimes = {
        mergeSort: { iterative: [], recursive: [] },
        quickSort: { iterative: [], recursive: [] },
      };
    
      const measureExecutionTime = (sortingFn, arr) => {
        const start = performance.now();
        sortingFn(arr);
        const end = performance.now();
        return end - start;
      };
    
      const recursiveMergeSort = (arr) => {
        if (arr.length <= 1) return arr;
        const mid = Math.floor(arr.length / 2);
        const left = recursiveMergeSort(arr.slice(0, mid));
        const right = recursiveMergeSort(arr.slice(mid));
        return merge(left, right);
      };
    
      const iterativeMergeSort = (arr) => {
        let step = 1;
        while (step < arr.length) {
          for (let i = 0; i < arr.length; i += step * 2) {
            const left = arr.slice(i, i + step);
            const right = arr.slice(i + step, i + step * 2);
            merge(left, right);
          }
          step *= 2;
        }
      };
    
      const recursiveQuickSort = (arr) => {
        if (arr.length <= 1) return arr;
        const pivot = arr[arr.length - 1];
        const left = arr.filter((item) => item < pivot);
        const right = arr.filter((item) => item > pivot);
        return [...recursiveQuickSort(left), pivot, ...recursiveQuickSort(right)];
      };
    
      const iterativeQuickSort = (arr) => {
        const stack = [arr];
        const result = [];
        while (stack.length) {
          const curr = stack.pop();
          if (curr.length <= 1) {
            result.push(...curr);
            continue;
          }
          const pivot = curr.pop();
          const left = curr.filter((item) => item < pivot);
          const right = curr.filter((item) => item > pivot);
          stack.push(right, [pivot], left);
        }
        return result;
      };
    
      const merge = (left, right) => {
        const result = [];
        while (left.length && right.length) {
          result.push(left[0] < right[0] ? left.shift() : right.shift());
        }
        return [...result, ...left, ...right];
      };
    
      const moduloValues = dataset.map((item) => item.modulo);
    
      moduloValues.forEach((modulo) => {
        const filteredData = dataset.filter((item) => item.modulo === modulo).map((item) => item.number);
    
        executionTimes.mergeSort.iterative.push(
          measureExecutionTime(iterativeMergeSort, [...filteredData])
        );
        executionTimes.mergeSort.recursive.push(
          measureExecutionTime(recursiveMergeSort, [...filteredData])
        );
        executionTimes.quickSort.iterative.push(
          measureExecutionTime(iterativeQuickSort, [...filteredData])
        );
        executionTimes.quickSort.recursive.push(
          measureExecutionTime(recursiveQuickSort, [...filteredData])
        );
      });
    
      setChartData({
        labels: moduloValues,
        datasets: [
          {
            label: "Iterative MergeSort",
            data: executionTimes.mergeSort.iterative,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderWidth: 1,
            fill: false,
          },
          {
            label: "Recursive MergeSort",
            data: executionTimes.mergeSort.recursive,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderWidth: 1,
            fill: false,
          },
          {
            label: "Iterative QuickSort",
            data: executionTimes.quickSort.iterative,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 1,
            fill: false,
          },
          {
            label: "Recursive QuickSort",
            data: executionTimes.quickSort.recursive,
            borderColor: "rgba(153, 102, 255, 1)",
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            borderWidth: 1,
            fill: false,
          },
        ],
      });
    } catch (error) {
      console.error("Error processing sorting analysis:", error);
    } finally {
      setLoading(false); // Matikan loading setelah selesai
    }
  };

  const sortData = (method) => {
    const isAscending = sortOrder === "asc";
    const sorted = [...data].sort((a, b) =>
      isAscending ? a.number - b.number : b.number - a.number
    );
    setSortOrder(isAscending ? "desc" : "asc");
    setSortedData(sorted);
    performSortingAnalysis(sorted, method);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Easy Modulo with Sorting Analysis</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />

      {/* Input Divisor Global */}
      <div style={{ marginTop: "20px" }}>
        <label>Divisor Global: </label>
        <input
          type="number"
          value={globalDivisor}
          onChange={(e) => handleDivisorChange(parseInt(e.target.value, 10))}
          style={styles.input}
        />
      </div>

      <button
        style={styles.sortButton}
        onClick={() => sortData(sortOrder === "asc" ? "asc" : "desc")}
      >
        Sort {sortOrder === "asc" ? "Ascending" : "Descending"}
      </button>

      {data.length > 0 && (
        <div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Number</th>
                <th style={styles.th}>Divisor</th>
                <th style={styles.th}>Modulo</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id}>
                  <td style={styles.td}>{item.id}</td>
                  <td style={styles.td}>
                    <input
                      type="number"
                      value={item.number}
                      onChange={(e) =>
                        handleNumberChange(
                          item.id,
                          parseInt(e.target.value, 10)
                        )
                      }
                      style={styles.input}
                    />
                  </td>
                  <td style={styles.td}>
                    <input
                      type="number"
                      value={item.divisor}
                      onChange={(e) =>
                        handleRowDivisorChange(
                          item.id,
                          parseInt(e.target.value, 10)
                        )
                      }
                      style={styles.input}
                    />
                  </td>
                  <td style={styles.td}>{item.modulo}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={styles.pagination}>
            <button
              onClick={handleFirst}
              disabled={currentPage === 1}
              style={{
                ...styles.paginationButton,
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
            >
              First
            </button>
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              style={{
                ...styles.paginationButton,
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
            >
              Previous
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              style={{
                ...styles.paginationButton,
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
            >
              Next
            </button>
            <button
              onClick={handleLast}
              disabled={currentPage === totalPages}
              style={{
                ...styles.paginationButton,
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
            >
              Last
            </button>
          </div>

          {chartData && (
            <div style={{ marginTop: "40px" }}>
              <h2>Sorting Algorithm Analysis</h2>
              <Line data={chartData} options={styles.chartOptions} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    backgroundColor: "#f2f2f2",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
  },
  input: {
    width: "80px",
    padding: "5px",
    textAlign: "center",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  paginationButton: {
    padding: "8px 12px",
    margin: "0 5px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  sortButton: {
    marginTop: "20px",
    padding: "10px 20px",
    cursor: "pointer",
  },
  chartOptions: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        type: "category",
      },
      y: {
        beginAtZero: true,
      },
    },
  },
};

export default TableViewUploadCSV;
