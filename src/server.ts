import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;
import { Client } from "pg";

app.use(express.json());

export function startServer(client: Client) {
  app.get("/top-exchangers", async (req: Request, res: Response) => {
    try {
      // Calculate the last month's start date
      const lastMonthStartDate = new Date();
      lastMonthStartDate.setMonth(lastMonthStartDate.getMonth() - 1);

      // SQL query to calculate profits and retrieve top 3 exchangers per country
      const query = `
        WITH exchange_transactions AS (
          SELECT
            e.exchange_office_id,
            e.from_currency,
            e.to_currency,
            e.ask,
            e.date,
            r.in_rate,
            r.out_rate,
            eo.country_code,
            CASE
              WHEN e.from_currency = 'USD' THEN e.ask * r.in_rate
              ELSE e.ask / r.out_rate
            END AS profit
          FROM exchange AS e
          JOIN rate AS r ON e.from_currency = r.from_currency AND e.to_currency = r.to_currency
          JOIN exchange_office AS eo ON e.exchange_office_id = eo.id
          WHERE e.date >= $1
        ),
        country_total_profit AS (
          SELECT
            country_code,
            SUM(profit) AS total_profit
          FROM exchange_transactions
          GROUP BY country_code
          ORDER BY total_profit DESC
          LIMIT 3
        ),
        ranked_by_country AS (
          SELECT
            et.*,
            ROW_NUMBER() OVER (PARTITION BY et.country_code ORDER BY et.profit DESC) AS country_rank
          FROM exchange_transactions AS et
          WHERE et.country_code IN (SELECT country_code FROM country_total_profit)
        )
        SELECT
          et.country_code,
          et.exchange_office_id,
          et.from_currency,
          et.to_currency,
          et.ask,
          et.date,
          et.in_rate,
          et.out_rate,
          et.profit
        FROM ranked_by_country AS et
        WHERE et.country_rank <= 3
        ORDER BY et.country_code, et.country_rank;   
      `;

      // Execute the SQL query using the provided client
      const result = await client.query(query, [lastMonthStartDate]);

      // Process the query result and return the top exchangers data
      const topExchangers = result.rows;

      // Return the results as JSON
      res.json(topExchangers);
    } catch (error) {
      console.error("Error calculating top exchangers:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
