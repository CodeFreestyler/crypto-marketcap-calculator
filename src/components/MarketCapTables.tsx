import React from 'react';
import './../MarketCapCalculator.css';

export interface CryptoMapData {
  rank: number;
  name: string;
  symbol: string;
  id: number;
  market_cap: number;
}

export interface MarketCapTablesProps {
  marketCap: number | null;
  currentMarketCap: number | null;
  currentPrice: number | null;
  totalMarketCap: number | null;
  topCryptos: CryptoMapData[] | null;
  calculateRanking: () => string | number;
  desiredPrice: string;
  probability: number | null;
  holdings: number | null; // New prop to accept user holdings
}

const MarketCapTables: React.FC<MarketCapTablesProps> = ({
  marketCap,
  currentMarketCap,
  currentPrice,
  totalMarketCap,
  calculateRanking,
  desiredPrice,
  probability,
  holdings,
}) => {
  // Calculate the future holding value
  const futureHoldingValue =
    holdings && desiredPrice ? (holdings * parseFloat(desiredPrice)).toFixed(2) : 'N/A';

  return (
    <div>
      {/* Ranking Information */}
      <h3>Ranking Information</h3>
      <table className="market-cap-table">
        <tbody>
          <tr>
            <td>Estimated Ranking in Top 100 Coins:</td>
            <td>{calculateRanking()}</td>
          </tr>
        </tbody>
      </table>

      {/* Market Cap Information */}
      <h3>Market Cap Information</h3>
      <table className="market-cap-table">
        <tbody>
          {marketCap !== null && currentMarketCap !== null && currentPrice !== null ? (
            <>
              <tr>
                <td>Future Market Cap:</td>
                <td>
                  {marketCap >= 1_000_000_000_000
                    ? `$${(marketCap / 1_000_000_000_000).toFixed(2)}T`
                    : marketCap >= 1_000_000_000
                    ? `$${(marketCap / 1_000_000_000).toFixed(2)}B`
                    : `$${marketCap.toLocaleString()}`}
                </td>
              </tr>
              <tr>
                <td>Corresponding Price:</td>
                <td>{desiredPrice}</td>
              </tr>
              <tr>
                <td>Percentage Increase (Price):</td>
                <td>
                  {currentPrice && desiredPrice
                    ? `${(((parseFloat(desiredPrice) - currentPrice) / currentPrice) * 100).toFixed(
                        2
                      )}%`
                    : 'N/A'}
                </td>
              </tr>
              <tr>
                <td>Probability of Reaching Desired Price:</td>
                <td>{probability !== null ? `${(probability * 100).toFixed(2)}%` : 'N/A'}</td>
              </tr>
            </>
          ) : (
            <tr>
              <td colSpan={2}>We can't provide market cap information right now</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Future Holding Value */}
      <h3>Future Holding Value</h3>
      <table className="market-cap-table">
        <tbody>
          <tr>
            <td>Future Holding Value:</td>
            <td>{futureHoldingValue !== 'N/A' ? `$${futureHoldingValue}` : 'N/A'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MarketCapTables;
