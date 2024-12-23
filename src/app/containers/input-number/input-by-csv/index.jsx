"use client";
import { useState } from "react";
import useUploadCSV from "@/hooks/useUploadCSV";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register Bar chart components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
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
    handleSort,
  } = useUploadCSV();

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedData, setSortedData] = useState(data);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const performSortingAnalysis = (dataset) => {
    setLoading(true);
    try {
      const executionTimes = {
        mergeSortIterative: 0,
        mergeSortRecursive: 0,
        quickSortIterative: 0,
        quickSortRecursive: 0,
      };

      const measureExecutionTime = (sortingFn, arr) => {
        const start = performance.now() / 1000;
        sortingFn([...arr]);
        const end = performance.now() / 1000;
        return end - start;
      };

      const numbers = dataset.map((item) => item.number);

      // Define sorting functions
      const recursiveMergeSort = (arr) => {
        if (arr.length <= 1) {
          return arr;
        } else {
          const mid = Math.floor(arr.length / 2);
          const left = recursiveMergeSort(arr.slice(0, mid));
          const right = recursiveMergeSort(arr.slice(mid));
          return merge(left, right);
        }
      };

      const iterativeMergeSort = (arr) => {
        if (arr.length <= 1) {
          return arr;
        } else {
          let step = 1;
          while (step < arr.length) {
            for (let i = 0; i < arr.length; i += step * 2) {
              const left = arr.slice(i, i + step);
              const right = arr.slice(i + step, i + step * 2);
              merge(left, right);
            }
            step *= 2;
          }
          return arr;
        }
      };

      const recursiveQuickSort = (arr) => {
        if (arr.length <= 1) {
          return arr;
        } else {
          const pivot = arr[arr.length - 1];
          const left = arr.filter((item) => item < pivot);
          const right = arr.filter((item) => item > pivot);
          return [
            ...recursiveQuickSort(left),
            pivot,
            ...recursiveQuickSort(right),
          ];
        }
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

      // Measure execution times
      executionTimes.mergeSortIterative = measureExecutionTime(
        iterativeMergeSort,
        numbers
      );
      executionTimes.mergeSortRecursive = measureExecutionTime(
        recursiveMergeSort,
        numbers
      );
      executionTimes.quickSortIterative = measureExecutionTime(
        iterativeQuickSort,
        numbers
      );
      executionTimes.quickSortRecursive = measureExecutionTime(
        recursiveQuickSort,
        numbers
      );
      const algorithmInfo = [
        {
          name: "MergeSort Iterative",
          executionTime: executionTimes.mergeSortIterative,
          complexity: "O(n log n)",
        },
        {
          name: "MergeSort Recursive",
          executionTime: executionTimes.mergeSortRecursive,
          complexity: "O(n log n)",
        },
        {
          name: "QuickSort Iterative",
          executionTime: executionTimes.quickSortIterative,
          complexity: "O(n log n)",
        },
        {
          name: "QuickSort Recursive",
          executionTime: executionTimes.quickSortRecursive,
          complexity: "O(n²) (worst case)",
        },
      ];

      setSortedData(algorithmInfo);
      // Prepare chart data
      setChartData({
        labels: [
          "MergeSort Iterative",
          "MergeSort Recursive",
          "QuickSort Iterative",
          "QuickSort Recursive",
        ],
        datasets: [
          {
            label: "Execution Time (ms)",
            data: [
              executionTimes.mergeSortIterative,
              executionTimes.mergeSortRecursive,
              executionTimes.quickSortIterative,
              executionTimes.quickSortRecursive,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error processing sorting analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortData = (method) => {
    const isAscending = sortOrder === "asc";
    const sorted = [...data].sort((a, b) =>
      isAscending ? a.modulo - b.modulo : b.modulo - a.modulo
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
        onClick={() => sortData(sortOrder === "asc")}
      >
        Analyze Sorting
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

          <h2>Algorithm Performance</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {sortedData.map((algorithm, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  width: "250px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3>{algorithm.name}</h3>
                <p>
                  <strong>Execution Time:</strong> {algorithm.executionTime}
                </p>
                <p>
                  <strong>Class Complexity:</strong> {algorithm.complexity}
                </p>
              </div>
            ))}
          </div>
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
