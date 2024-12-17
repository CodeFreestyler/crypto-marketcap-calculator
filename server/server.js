const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Apply CORS middleware
app.use(cors());

const CRYPTOCURRENCY_BASE_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency';
const GLOBAL_METRICS_BASE_URL = 'https://pro-api.coinmarketcap.com/v1/global-metrics/quotes';
const API_KEY = process.env.COINMARKETCAP_API_KEY;

// Custom randomNormal function using Box-Muller transform
function randomNormal(mean = 0, stdDev = 1) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // Avoid u = 0
  while (v === 0) v = Math.random(); // Avoid v = 0
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

// Endpoint to get token data
app.get('/api/token/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    const response = await axios.get(`${CRYPTOCURRENCY_BASE_URL}/quotes/latest`, {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
      },
      params: {
        symbol: symbol,
      },
    });
    res.json(response.data.data[symbol]);
  } catch (error) {
    console.error('Error fetching token data:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching token data' });
  }
});

// Endpoint to get total market cap data
app.get('/api/global-metrics', async (req, res) => {
  try {
    const response = await axios.get(`${GLOBAL_METRICS_BASE_URL}/latest`, {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
      },
    });

    // Extract the total market cap from the response
    if (response.data && response.data.data && response.data.data.quote && response.data.data.quote.USD) {
      const totalMarketCap = response.data.data.quote.USD.total_market_cap;
      res.json({ total_market_cap: totalMarketCap });
    } else {
      throw new Error('Unexpected response structure from CoinMarketCap');
    }
  } catch (error) {
    console.error('Error fetching global metrics from CoinMarketCap:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching global metrics' });
  }
});

// Endpoint to get top 100 cryptocurrencies data with market cap
app.get('/api/top-cryptocurrencies', async (req, res) => {
  try {
    const response = await axios.get(`${CRYPTOCURRENCY_BASE_URL}/listings/latest`, {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
      },
      params: {
        limit: 100,
        sort: 'market_cap',
      },
    });

    if (response.data && response.data.data) {
      // Extract relevant fields: rank, name, symbol, market_cap
      const cryptos = response.data.data.map(crypto => ({
        rank: crypto.cmc_rank,
        name: crypto.name,
        symbol: crypto.symbol,
        id: crypto.id,
        market_cap: crypto.quote.USD.market_cap,
      }));
      res.json(cryptos);
    } else {
      throw new Error('Unexpected response structure from CoinMarketCap');
    }
  } catch (error) {
    console.error('Error fetching top cryptocurrencies from CoinMarketCap:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching top cryptocurrencies' });
  }
});

// Cache for coin list
let coinList = null;
let lastCoinListUpdate = 0;
const COIN_LIST_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Function to get the coin list, with caching
async function getCoinList() {
  const now = Date.now();
  if (!coinList || now - lastCoinListUpdate > COIN_LIST_CACHE_DURATION) {
    // Fetch the coin list from CoinGecko
    const coinListResponse = await axios.get('https://api.coingecko.com/api/v3/coins/list');
    coinList = coinListResponse.data;
    lastCoinListUpdate = now;
  }
  return coinList;
}

// Endpoint to calculate the probability with refined logic
app.get('/api/probability/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const { targetPrice, daysIntoFuture } = req.query;

  if (!targetPrice || !daysIntoFuture) {
    return res.status(400).json({
      error: 'Please provide targetPrice and daysIntoFuture query parameters.',
    });
  }

  try {
    // Step 1: Map symbol to CoinGecko ID using cached coin list
    const coinList = await getCoinList();

    const coin = coinList.find(
      (coin) => coin.symbol.toLowerCase() === symbol.toLowerCase()
    );

    if (!coin) {
      return res.status(404).json({ error: `Coin with symbol '${symbol}' not found.` });
    }

    const coinId = coin.id; // Get the CoinGecko coin ID

    // Step 2: Fetch historical price data for the last 90 days
    const endDate = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const startDate = endDate - 90 * 24 * 60 * 60; // 90 days ago

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range`,
      {
        params: {
          vs_currency: 'usd',
          from: startDate,
          to: endDate,
        },
      }
    );

    const prices = response.data.prices.map((price) => price[1]);

    // Check if we have enough data
    if (prices.length < 2) {
      return res.status(500).json({ error: 'Not enough historical data for calculations.' });
    }

    // Step 3: Calculate log returns
    const logReturns = [];
    for (let i = 1; i < prices.length; i++) {
      const logReturn = Math.log(prices[i] / prices[i - 1]);
      logReturns.push(logReturn);
    }

    // Step 4: Estimate volatility using standard deviation
    const meanLogReturn =
      logReturns.reduce((a, b) => a + b, 0) / logReturns.length;
    const variance =
      logReturns.reduce((a, b) => a + Math.pow(b - meanLogReturn, 2), 0) /
      (logReturns.length - 1);
    const volatility = Math.sqrt(variance);

    // Estimate drift as the mean log return
    const drift = meanLogReturn;

    // Output debug information
    console.log('Volatility:', volatility);
    console.log('Drift:', drift);

    // Step 5: Simulate future price paths using Geometric Brownian Motion
    const S0 = prices[prices.length - 1]; // Current price
    const T = parseInt(daysIntoFuture); // Time horizon in days
    const steps = T;
    const simulations = 100000;
    const dt = 1; // Daily time step

    const pricePaths = [];

    for (let i = 0; i < simulations; i++) {
      let price = S0;
      let success = false;
      for (let j = 1; j <= steps; j++) {
        const randomShock = randomNormal();
        price = price * Math.exp(drift * dt + volatility * Math.sqrt(dt) * randomShock);

        // Check if price has reached or exceeded the target
        if (price >= parseFloat(targetPrice)) {
          success = true;
          break; // Early exit if target is reached
        }

        // Ensure price doesn't go negative
        if (price <= 0) {
          price = 0.0001;
        }
      }
      if (success) {
        pricePaths.push(1); // Success
      } else {
        pricePaths.push(0); // Failure
      }
    }

    // Step 6: Calculate probability
    const successCount = pricePaths.reduce((a, b) => a + b, 0);
    const probability = successCount / simulations;

    res.json({
      symbol: symbol,
      targetPrice: targetPrice,
      daysIntoFuture: daysIntoFuture,
      probability: probability,
    });
  } catch (error) {
    console.error(
      'Error calculating probability:',
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ error: 'Error calculating probability', details: error.message });
  }
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});