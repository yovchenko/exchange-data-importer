import { Client } from "pg";
import { Data } from "../types/parsed-data";

export async function importCountries(jsObj: Data, client: Client) {
  try {
    const countries = jsObj.countries.country;

    for (const country of countries) {
      const { "#text": code, name } = country.code;

      // Check if the country already exists in the "country" table
      const existsQuery = "SELECT 1 FROM country WHERE code = $1";
      const existsResult = await client.query(existsQuery, [code]);

      if (existsResult.rows.length === 0) {
        // Country doesn't exist, perform the INSERT operation
        const insertQuery = "INSERT INTO country (code, name) VALUES ($1, $2)";
        await client.query(insertQuery, [code, name]);
      }
    }

    console.log("Countries imported successfully!");
  } catch (error) {
    console.error("Error importing countries:", error);
  }
}
