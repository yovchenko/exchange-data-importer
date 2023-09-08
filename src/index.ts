import * as fs from "fs";
import * as pug from "pug";
import Ajv from "ajv";
import { Client } from "pg";
import { X2jOptions, XMLParser } from "fast-xml-parser";
import schema from "./schema.json";
import { importCountries } from "./import/import-countries";
import { importData } from "./import/import-exchanges";
import { dbConfig } from "./db-config";
import { startServer } from "./server"; // Import the startServer function

const alwaysArray = [
  "exchange-offices.exchange-office.rates.rate",
  "countries.country",
];

const options = {
  ignoreDeclaration: true,
  isArray: (name: string, jpath: string) => {
    if (alwaysArray.indexOf(jpath) !== -1) return true;
  },
};

const data = fs.readFileSync("sample-data.txt", "utf8");
const cleanedData = data.replace(/=/g, "");
const pugOutput = pug.render(cleanedData);

const parser = new XMLParser(options as Partial<X2jOptions>);
let jsObj = parser.parse(`<?xml version="1.0"?>` + pugOutput);

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);
const valid = validate(jsObj);

if (valid !== true) {
  console.error("Data is not valid according to the schema.");
} else {
  async function runImportProcess() {
    const client = new Client(dbConfig);

    try {
      await client.connect();
      await importCountries(jsObj, client);
      await importData(jsObj, client);
      console.log("Data imported successfully!");

      // Now that data import is complete, start the server
      startServer(client); // Pass the client instance to the server
    } catch (error) {
      console.error("Import process failed:", error);
    }
  }

  runImportProcess();
}
