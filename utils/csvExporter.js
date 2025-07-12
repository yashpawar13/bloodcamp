import { Parser } from "json2csv";
import fs from "fs";
import path from "path";

export function exportToCSV(data, fileName = "export.csv") {
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(data);

  const filePath = path.join("exports", fileName);
  fs.writeFileSync(filePath, csv);

  return filePath;
}
