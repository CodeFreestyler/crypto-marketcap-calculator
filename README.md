# Crypto Price Probability Estimation

This project applies probability theory to estimate the likelihood of a cryptocurrency reaching a specific future price. The application uses historical price data, calculates volatility, and employs a log-normal distribution to estimate probabilities.

## Features
- Fetch historical price data using the CoinMarketCap API.
- Calculate daily returns and historical volatility.
- Estimate future price probabilities based on historical data.
- Predict the likelihood of a cryptocurrency reaching a target price.

## Core Components

### Services
- **`coinMarketCapService.ts`**: Fetches historical price data from the CoinMarketCap API.

### Utilities
- **`probabilityUtils.ts`**: Includes functions for:
  - Calculating daily returns.
  - Calculating historical volatility.
  - Estimating future price probabilities using a log-normal distribution.

### Main Script
- **`main.ts`**: Ties the application together by fetching data, calculating probabilities, and outputting results.

## How It Works
1. Fetch historical price data for a cryptocurrency.
2. Calculate daily returns from historical prices.
3. Use returns to calculate volatility.
4. Apply a log-normal distribution to estimate the probability of a future price based on the historical drift and volatility.
5. Output the estimated future price and probability.

## Folder Structure
```
project-root/
  ├── src/
  │     ├── services/
  │     │     ├── coinMarketCapService.ts
  │     ├── utils/
  │     │     ├── probabilityUtils.ts
  │     ├── main.ts
  ├── README.md
```

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   - Create a `.env` file in the project root and add your CoinMarketCap API key:
     ```env
     COINMARKETCAP_API_KEY=your-api-key-here
     ```

4. Run the application:
   ```bash
   npm start
   ```

## Usage
1. Edit the `main.ts` file to specify:
   - The cryptocurrency symbol (e.g., `BTC`).
   - The target price to evaluate (e.g., `$100,000`).
   - The forecast period (e.g., `365` days).

2. Run the script to get the estimated future price and probability:
   ```bash
   npm run start
   ```

Example output:
```
Estimated Future Price of BTC: $105432.00
Probability of BTC reaching $100000: 78.34%
```

## Dependencies
- [axios](https://github.com/axios/axios): For making HTTP requests to the CoinMarketCap API.
- [dotenv](https://github.com/motdotla/dotenv): For managing environment variables.
- [TypeScript](https://www.typescriptlang.org/): For type-safe development.

## Assumptions
- Historical prices follow a log-normal distribution.
- Volatility and drift are consistent over time.
- Simplified probability estimates using Z = 0 (most likely outcome).

## Future Improvements
- Implement Monte Carlo simulations for more robust probability estimation.
- Integrate external factors (e.g., market adoption, macroeconomic events).
- Build a front-end user interface to allow users to input parameters and visualize results.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
For questions or suggestions, contact [your-email@example.com].

