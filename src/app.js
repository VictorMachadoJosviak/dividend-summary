import XLSX from "xlsx";
import { toBrl } from "./utils.js";

const fields = {
  product: "Produto",
  value: "Valor líquido",
  type: "Tipo de Evento",
};

const inputFilePath = "proventos.xlsx";

const workbook = XLSX.readFile(inputFilePath);

const sheetName = workbook.SheetNames[0];

const sheet = workbook.Sheets[sheetName];

const data = XLSX.utils.sheet_to_json(sheet);

const groupedData = data.reduce((acc, item) => {
  const rawName = String(item[fields.product]);
  const productCode = rawName.split("-")[0];
  const value = Number(item[fields.value]);
  const eventType = String(item[fields.type]);

  if (isNaN(value) || productCode === "undefined") {
    return acc;
  }

  if (!acc[eventType]) {
    acc[eventType] = {};
  }

  if (!acc[eventType][productCode]) {
    acc[eventType][productCode] = {
      codigo: productCode,
      nome: rawName,
      total: 0,
    };
  }

  acc[eventType][productCode].tipo = eventType;
  acc[eventType][productCode].total += value;

  return acc;
}, {});

const result = Object.values(groupedData).reduce((acc, item) => {
  const values = Object.values(item).map((i) => {
    return {
      ...i,
      total: toBrl(i.total),
    };
  });

  return [...acc, ...values];
}, []);

const worksheet = XLSX.utils.json_to_sheet(result);

const newWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(newWorkbook, worksheet, "Resultados");

XLSX.writeFile(newWorkbook, "resultados.xlsx");
