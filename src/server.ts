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
        WITH ranked_exchangers AS (
          SELECT
            e.exchange_office_id,
            e.from_currency,
            e.to_currency,
            e.ask,
            e.date,
            r.in_rate,
            r.out_rate,
            eo.country_code, -- Corrected column reference
            (
              CASE
                WHEN e.from_currency = 'USD' THEN e.ask * r.in_rate
                ELSE e.ask / r.out_rate
              END
            ) AS profit
          FROM exchange AS e
          JOIN rate AS r ON e.from_currency = r.from_currency AND e.to_currency = r.to_currency
          JOIN exchange_office AS eo ON e.exchange_office_id = eo.id
          WHERE e.date >= $1
        ),
        ranked_by_country AS (
          SELECT
            country_code,
            exchange_office_id,
            from_currency,
            to_currency,
            ask,
            date,
            in_rate,
            out_rate,
            profit,
            RANK() OVER (PARTITION BY country_code ORDER BY profit DESC) AS country_rank
          FROM ranked_exchangers
        )
        SELECT
          country_code,
          exchange_office_id,
          from_currency,
          to_currency,
          ask,
          date,
          in_rate,
          out_rate,
          profit
        FROM ranked_by_country
        WHERE country_rank <= 3
        ORDER BY country_code, country_rank;      
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

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
