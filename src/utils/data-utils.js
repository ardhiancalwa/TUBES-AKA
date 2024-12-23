// dataUtils.js

import Papa from "papaparse";

// Parse CSV file to structured data
export const parseCSV = (file, globalDivisor, onComplete) => {
  if (!file) return;
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
      onComplete(parsedData);
    },
  });
};

// Update divisor and recalculate modulo for all items
export const updateGlobalDivisor = (data, newDivisor) => {
  return data.map((item) => ({
    ...item,
    divisor: newDivisor,
    modulo: item.number % newDivisor,
  }));
};

// Update a specific item's number and recalculate modulo
export const updateNumber = (data, id, value) => {
  return data.map((item) =>
    item.id === id
      ? { ...item, number: value, modulo: value % item.divisor }
      : item
  );
};

// Update a specific item's divisor and recalculate modulo
export const updateRowDivisor = (data, id, value) => {
  return data.map((item) =>
    item.id === id
      ? { ...item, divisor: value, modulo: item.number % value }
      : item
  );
};

// Paginate data for current page
export const paginateData = (data, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  return data.slice(startIndex, endIndex);
};

// Generate chart data for top N modulo values
export const generateChartData = (data, topN = 10) => {
  const topData = data
    .sort((a, b) => b.modulo - a.modulo) // Sort in descending order of modulo
    .slice(0, topN); // Take top N largest modulo values

  return {
    labels: topData.map((item) => `ID ${item.id}`), // Display ID for each value
    datasets: [
      {
        label: `Top ${topN} Modulo Values`,
        data: topData.map((item) => item.modulo),
        backgroundColor: "rgba(75, 192, 192, 1)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
};

// Calculate total pages for pagination
export const calculateTotalPages = (dataLength, itemsPerPage) => {
  return Math.ceil(dataLength / itemsPerPage);
};
