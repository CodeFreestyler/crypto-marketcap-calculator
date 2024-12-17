import axios from 'axios';

// Function to get individual token data
export const getTokenData = async (symbol: string) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/token/${symbol}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching token data:', error);
    throw error;
  }
};

// Function to get global metrics (total market cap)
export const getGlobalMetrics = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/global-metrics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching global metrics:', error);
    throw error;
  }
};

// Function to get top 100 cryptocurrencies
export const getTopCryptocurrencies = async () => {
  try {
    console.log('Calling getTopCryptocurrencies...');
    const response = await axios.get('http://localhost:5000/api/top-cryptocurrencies');
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching top cryptocurrencies:', error);
    throw error;
  }
};

// Function to fetch probability
export const getProbability = async (
  symbol: string,
  targetPrice: string,
  daysIntoFuture: string
): Promise<number> => {
  try {
    const params = {
      targetPrice,
      daysIntoFuture,
    };

    const response = await axios.get(`http://localhost:5000/api/probability/${symbol}`, {
      params,
    });

    return response.data.probability;
  } catch (error) {
    console.error('Error fetching probability:', error);
    throw error;
  }
};