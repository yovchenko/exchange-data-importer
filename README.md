# Currency Exchange System

This Node.js application serves as a currency exchange system that imports data from a database dump file and provides an API endpoint to retrieve the top 3 currency exchangers by profit for the last month in each of the three countries with the highest profit. The system also handles various scenarios and considerations.

## Table of Contents

- [Project Structure](#project-structure)
- [Task 1: Parser](#task-1-parser)
  - [How to Change the Code to Support Different File Format Versions?](#how-to-change-the-code-to-support-different-file-format-versions)
  - [How Will the Import System Change for Data from a Web API?](#how-will-the-import-system-change-for-data-from-a-web-api)
  - [How to Add National Bank Rates in the Future?](#how-to-add-national-bank-rates-in-the-future)
  - [Speeding Up Execution for Less Frequent Data Updates](#speeding-up-execution-for-less-frequent-data-updates)
- [Task 2: API Request](#task-2-api-request)

## Project Structure

- `index.ts`: Entry point of the application responsible for parsing data, validating it against a schema, and importing it into a PostgreSQL database. Also, it starts the Express.js server.
- `server.ts`: Express.js server configuration and API endpoint for retrieving top exchangers by profit.
- `import/import-exchanges.ts`: Module for importing exchange data into the database.
- `import/import-countries.ts`: Module for importing country data into the database.
- `db-config.ts`: Database configuration file.
- `tables.sql`: SQL script for creating database tables.
- `schema.json`: JSON schema for data validation.
- `types/parsed-data.ts`: Type definitions for parsed data.

## Task 1: Parser

### How to Change the Code to Support Different File Format Versions?

To support different file format versions, you can consider the following approaches:

1. **Flexible Schema Validation**: Make the schema validation more flexible by allowing optional fields and gracefully handling missing or extra fields. This way, the application can accommodate changes in the file structure without breaking.

2. **Versioning**: Introduce a versioning mechanism in the data file. Include a version number or identifier in the file, and adjust the parsing logic based on the detected version. Maintain separate parsing logic for each supported version.

3. **Configuration**: Use configuration files or environment variables to specify the expected file format version. Modify the parsing logic based on the specified version.

4. **Dynamic Schema Loading**: Load the schema dynamically based on the detected version. Store schemas for different versions and select the appropriate one during parsing.

### How Will the Import System Change for Data from a Web API?

To import data from a web API, you can make the following changes:

1. **HTTP Requests**: Replace the file reading logic with HTTP requests to the web API endpoints that provide the data.

2. **JSON Parsing**: If the API provides data in JSON format, modify the parsing logic to handle JSON data instead of XML. Update the schema validation accordingly.

3. **Authentication**: Implement authentication mechanisms if the API requires authentication for access.

4. **Error Handling**: Enhance error handling to deal with potential issues related to API requests, such as network errors or API rate limiting.

5. **Data Polling**: If the API provides real-time data, consider implementing data polling at regular intervals to keep the local database up to date.

## How to Add National Bank Rates in the Future?

To incorporate national bank rates into the system in the future, follow these steps:

1. **Data Source Integration**: Identify a reliable source of national bank exchange rates, such as an API provided by the national bank. Ensure that you have the necessary permissions or access to use this data.

2. **Data Retrieval**: Implement a mechanism to regularly fetch national bank exchange rate data. Depending on the source, you may need to make periodic API requests or download data files.

3. **Database Storage**: Create a new table in your PostgreSQL database to store the national bank exchange rate data. The schema of this table should match the structure of the data provided by the national bank.

4. **Data Import**: Develop an import process similar to the one used for other exchange rate data. Modify the import script to insert or update the national bank exchange rates in the new table.

5. **Calculation Logic**: When calculating exchange profits, include the national bank rates in your calculation logic. You may need to adjust the SQL queries to consider both exchange office rates and national bank rates when determining profits.

6. **Scheduling**: Schedule the data import process to run at regular intervals to keep the national bank exchange rate data up to date. Tools like cron jobs or task schedulers can help automate this.

7. **Error Handling**: Implement error handling and notifications to manage any issues that may arise during data retrieval or import from the national bank source.

## Speeding Up Execution for Less Frequent Data Updates

If the task allows you to update market data once a day or less frequently, you can optimize the system for performance. Here are some possible solutions:

1. **Caching**: Implement a caching mechanism to store frequently accessed data in memory. This can significantly reduce database query load and improve response times for read-heavy operations.

2. **Batch Processing**: Instead of processing data in real-time, schedule batch processes to perform calculations and aggregations during non-peak hours. Store precomputed results in the database for faster retrieval.

3. **Database Indexing**: Ensure that the database tables are properly indexed for the types of queries you perform frequently. Indexes can significantly improve query performance.

4. **Materialized Views**: Use materialized views in PostgreSQL to store precomputed query results. These views are updated periodically, reducing the need for complex calculations during each request.

5. **Data Partitioning**: If your database grows large, consider partitioning tables based on date ranges. This can improve query performance by limiting the data that needs to be scanned.

6. **Load Balancing**: Deploy your application on a load-balanced infrastructure to distribute incoming requests across multiple servers. This can help handle concurrent requests more efficiently.

7. **Query Optimization**: Periodically review and optimize your SQL queries. Use tools like PostgreSQL's query planner to identify performance bottlenecks.

8. **Data Archiving**: If historical data becomes less relevant, consider archiving older records to a separate storage system. This can reduce the size of the active database and improve query performance.

9. **Database Scaling**: If your application experiences high traffic, consider scaling your database by using replication, sharding, or database clustering to distribute the load.

10. **Content Delivery Network (CDN)**: Use a CDN to cache and serve static assets like images and stylesheets, reducing the load on your application server.

11. **Database Backups**: Implement regular database backups to ensure data integrity and provide a recovery mechanism in case of data loss or corruption.

By implementing these strategies, you can optimize the performance of your system for less frequent data updates while still providing fast and responsive services to your users.
