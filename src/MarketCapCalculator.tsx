// MarketCapCalculator.tsx

import React, { useState, useEffect } from 'react';
import {
  getTokenData,
  getGlobalMetrics,
  getTopCryptocurrencies,
  getProbability,
} from './services/coinService';
import TokenInput from './components/TokenInput';
import DesiredPriceInput from './components/DesiredPriceInput';
import DesiredMarketCapInput from './components/DesiredMarketCapInput';
import ProbabilityOptions from './components/ProbabilityOptions';
import MarketCapTables from './components/MarketCapTables';
import './MarketCapCalculator.css'; // Import the CSS file

interface TokenData {
  circulating_supply: number;
  quote: {
    USD: {
      market_cap: number;
      price: number;
    };
  };
}

interface GlobalMetricsData {
  total_market_cap: number;
}

interface CryptoMapData {
  rank: number;
  name: string;
  symbol: string;
  id: number;
  market_cap: number;
}

const MarketCapCalculator: React.FC = () => {
  // State variables
  const [tokenSymbol, setTokenSymbol] = useState<string>('SUI');
  const [desiredPrice, setDesiredPrice] = useState<string>('');
  const [desiredMarketCap, setDesiredMarketCap] = useState<string>('');
  const [marketCap, setMarketCap] = useState<number | null>(null);
  const [currentMarketCap, setCurrentMarketCap] = useState<number | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [totalMarketCap, setTotalMarketCap] = useState<number | null>(null);
  const [topCryptos, setTopCryptos] = useState<CryptoMapData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State variables for probability calculation
  const [probability, setProbability] = useState<number | null>(null);
  const [probabilityEnabled, setProbabilityEnabled] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<string>('0-1');

  useEffect(() => {
    const fetchTopCryptos = async () => {
      try {
        const topCryptosData: CryptoMapData[] = await getTopCryptocurrencies();
        setTopCryptos(topCryptosData);
      } catch (error) {
        console.error('Error fetching top 100 cryptocurrencies:', error);
        setError('Error fetching top 100 cryptocurrencies. Please try again later.');
        setTopCryptos(null);
      }
    };

    fetchTopCryptos();
  }, []);

  const calculateMarketCap = async () => {
    setLoading(true);
    setError(null);
    setProbability(null);

    try {
      const tokenData: TokenData = await getTokenData(tokenSymbol);
      const circulatingSupply = tokenData.circulating_supply;
      const currentCap = tokenData.quote.USD.market_cap;
      const currentTokenPrice = tokenData.quote.USD.price;
      setCurrentMarketCap(currentCap);
      setCurrentPrice(currentTokenPrice);

      let futureMarketCap: number | null = null;
      let futurePrice: number | null = null;

      if (desiredPrice && parseFloat(desiredPrice) > 0) {
        futurePrice = parseFloat(desiredPrice);
        futureMarketCap = circulatingSupply * futurePrice;
      } else if (desiredMarketCap && parseFloat(desiredMarketCap) > 0) {
        // Interpret desiredMarketCap as USD Billions
        futureMarketCap = parseFloat(desiredMarketCap) * 1_000_000_000; // Convert to USD
        futurePrice = futureMarketCap / circulatingSupply;
        setDesiredPrice(futurePrice.toString()); // Update desiredPrice with calculated price
      } else {
        alert('Please enter a valid desired price or desired market cap');
        setLoading(false);
        return;
      }

      setMarketCap(futureMarketCap);

      if (probabilityEnabled && futurePrice) {
        // Map timeframe to daysIntoFuture
        let daysIntoFuture = 0;
        switch (timeframe) {
          case '0-1':
            daysIntoFuture = 30;
            break;
          case '1-3':
            daysIntoFuture = 90;
            break;
          case '3-6':
            daysIntoFuture = 180;
            break;
          case '6-12':
            daysIntoFuture = 365;
            break;
          default:
            daysIntoFuture = 30;
        }

        // Fetch probability
        const probabilityValue = await getProbability(
          tokenSymbol,
          futurePrice.toString(),
          daysIntoFuture.toString()
        );
        setProbability(probabilityValue);
      } else {
        setProbability(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
      setCurrentMarketCap(null);
      setCurrentPrice(null);
      setProbability(null);
    }

    try {
      const globalMetricsData: GlobalMetricsData = await getGlobalMetrics();
      const currentTotalMarketCap = globalMetricsData.total_market_cap;
      setTotalMarketCap(currentTotalMarketCap);
    } catch (error) {
      console.error('Error fetching global metrics:', error);
      setError('Error fetching global metrics. Please try again later.');
      setTotalMarketCap(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateRanking = () => {
    if (marketCap !== null && topCryptos !== null) {
      const sortedCryptos = [...topCryptos].sort((a, b) => b.market_cap - a.market_cap);
      const futureRank = sortedCryptos.findIndex((crypto) => marketCap! > crypto.market_cap);
      return futureRank !== -1 ? futureRank + 1 : '>100';
    }
    return 'N/A';
  };

  return (
    <div className="market-cap-calculator">
      <h2>Market Cap Calculator</h2>
      {error && <div className="error-message">{error}</div>}
      <TokenInput tokenSymbol={tokenSymbol} setTokenSymbol={setTokenSymbol} />

      {/* Desired Price Input */}
      <DesiredPriceInput
        desiredPrice={desiredPrice}
        setDesiredPrice={setDesiredPrice}
        setDesiredMarketCap={setDesiredMarketCap}
      />

      {/* Desired Market Cap Input */}
      <DesiredMarketCapInput
        desiredMarketCap={desiredMarketCap}
        setDesiredMarketCap={setDesiredMarketCap}
        setDesiredPrice={setDesiredPrice}
      />

      <ProbabilityOptions
        probabilityEnabled={probabilityEnabled}
        setProbabilityEnabled={setProbabilityEnabled}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
      />
      <div>
        <button onClick={calculateMarketCap} disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate Market Cap'}
        </button>
      </div>
      <MarketCapTables
        marketCap={marketCap}
        currentMarketCap={currentMarketCap}
        currentPrice={currentPrice}
        totalMarketCap={totalMarketCap}
        topCryptos={topCryptos}
        calculateRanking={calculateRanking}
        desiredPrice={desiredPrice}
        probability={probability}
      />
    </div>
  );
};

export default MarketCapCalculator;
