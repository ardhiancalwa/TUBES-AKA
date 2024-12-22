"use client";
import React from "react";
import useUploadCSV from "@/hooks/useUploadCSV";

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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Easy Modulo</h1>
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
                        handleNumberChange(item.id, parseInt(e.target.value, 10))
                      }
                      style={styles.input}
                    />
                  </td>
                  <td style={styles.td}>
                    <input
                      type="number"
                      value={item.divisor}
                      onChange={(e) =>
                        handleRowDivisorChange(item.id, parseInt(e.target.value, 10))
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
};

export default TableViewUploadCSV;
