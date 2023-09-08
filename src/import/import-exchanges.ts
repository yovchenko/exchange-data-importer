import { Client } from "pg";
import { Data, Exchange, Rate } from "../types/parsed-data";

export async function importData(jsObj: Data, client: Client) {
  try {
    await client.query("BEGIN"); // Start a transaction

    const exchangeOffices = jsObj["exchange-offices"]["exchange-office"];
    for (const office of exchangeOffices) {
      const { id, name, country, rates, exchanges } = office;
      await insertOrUpdateExchangeOffice(client, id, name, country);

      if (rates && Array.isArray(rates.rate))
        for (const rate of rates.rate) {
          await insertOrUpdateRate(client, id, rate);
        }

      if (exchanges && Array.isArray(exchanges.exchange))
        for (const exchange of exchanges.exchange) {
          await insertOrUpdateExchange(client, id, exchange);
        }
    }

    await client.query("COMMIT"); // Commit the transaction
    console.log("Data imported successfully!");
  } catch (error) {
    console.error("Error importing data:", error);
    await client.query("ROLLBACK"); // Rollback the transaction in case of an error
  }
}

async function insertOrUpdateExchangeOffice(
  client: Client,
  id: number,
  name: string,
  country: string
) {
  const checkQuery = `
      SELECT id FROM exchange_office WHERE id = $1
    `;
  const checkResult = await client.query(checkQuery, [id]);

  if (checkResult.rows.length === 0) {
    // The exchange_office does not exist, so insert it
    const insertQuery = `
        INSERT INTO exchange_office (id, name, country_code)
        VALUES ($1, $2, $3)
      `;
    await client.query(insertQuery, [id, name, country]);
  }
  // Otherwise, do nothing since the exchange_office already exists
}

async function insertOrUpdateRate(
  client: Client,
  exchangeOfficeId: number,
  rate: Rate
) {
  const { from, to, in: inRate, out, reserve, date } = rate;
  const query = `
      INSERT INTO rate (exchange_office_id, from_currency, to_currency, in_rate, out_rate, reserve, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

  await client.query(query, [
    exchangeOfficeId,
    from,
    to,
    inRate,
    out,
    reserve,
    date,
  ]);
}

async function insertOrUpdateExchange(
  client: Client,
  exchangeOfficeId: number,
  exchange: Exchange
) {
  const { from, to, ask, date } = exchange;
  const query = `
    INSERT INTO exchange (exchange_office_id, from_currency, to_currency, ask, date)
    VALUES ($1, $2, $3, $4, $5)
  `;

  await client.query(query, [exchangeOfficeId, from, to, ask, date]);
}
