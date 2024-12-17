import React from 'react';

interface ProbabilityOptionsProps {
  probabilityEnabled: boolean;
  setProbabilityEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  timeframe: string;
  setTimeframe: React.Dispatch<React.SetStateAction<string>>;
}

const ProbabilityOptions: React.FC<ProbabilityOptionsProps> = ({
  probabilityEnabled,
  setProbabilityEnabled,
  timeframe,
  setTimeframe,
}) => {
  return (
    <div className="probability-options-container">
      <label>
        Enable Probability Calculation
        <input
          type="checkbox"
          checked={probabilityEnabled}
          onChange={(e) => setProbabilityEnabled(e.target.checked)}
        />
      </label>
      {probabilityEnabled && (
        <div>
          <p>Select Timeframe:</p>
          <div className="timeframe-options">
            <label>
              <input
                type="radio"
                value="0-1"
                checked={timeframe === '0-1'}
                onChange={(e) => setTimeframe(e.target.value)}
              />
              0-1 months
            </label>
            <label>
              <input
                type="radio"
                value="1-3"
                checked={timeframe === '1-3'}
                onChange={(e) => setTimeframe(e.target.value)}
              />
              1-3 months
            </label>
            <label>
              <input
                type="radio"
                value="3-6"
                checked={timeframe === '3-6'}
                onChange={(e) => setTimeframe(e.target.value)}
              />
              3-6 months
            </label>
            <label>
              <input
                type="radio"
                value="6+"
                checked={timeframe === '6+'}
                onChange={(e) => setTimeframe(e.target.value)}
              />
              6+ months
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProbabilityOptions;
