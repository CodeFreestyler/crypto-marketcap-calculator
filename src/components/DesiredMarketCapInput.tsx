// components/DesiredMarketCapInput.tsx

import React, { CSSProperties } from 'react';

interface DesiredMarketCapInputProps {
  desiredMarketCap: string;
  setDesiredMarketCap: React.Dispatch<React.SetStateAction<string>>;
  setDesiredPrice: React.Dispatch<React.SetStateAction<string>>;
}

const DesiredMarketCapInput: React.FC<DesiredMarketCapInputProps> = ({
  desiredMarketCap,
  setDesiredMarketCap,
  setDesiredPrice,
}) => {
  const labelStyle: CSSProperties = {
    display: 'block',
    marginBottom: '10px',
  };

  const inputStyle: CSSProperties = {
    width: 'calc(100% - 20px)',
    padding: '8px',
    marginTop: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  return (
    <div>
      <label style={labelStyle}>
        Desired Market Cap (in USD Billions):
        <input
          type="number"
          value={desiredMarketCap}
          onChange={(e) => {
            setDesiredMarketCap(e.target.value);
            setDesiredPrice(''); // Clear desiredPrice when desiredMarketCap is entered
          }}
          placeholder="Future Market Cap in USD Billions"
          style={inputStyle}
        />
      </label>
    </div>
  );
};

export default DesiredMarketCapInput;
