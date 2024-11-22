const XLSX = require('xlsx');
const fs = require("fs");

const convertExcelToCsv = (excelFilePath, csvFilePath) => {
    const workbook = XLSX.readFile(excelFilePath);
  
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
  
    const csvData = XLSX.utils.sheet_to_csv(sheet);
  
    fs.writeFileSync(csvFilePath, csvData, 'utf8');
  };

  module.exports = {convertExcelToCsv}