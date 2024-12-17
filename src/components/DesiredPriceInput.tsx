// components/DesiredPriceInput.tsx

import React, { CSSProperties } from 'react';

interface DesiredPriceInputProps {
  desiredPrice: string;
  setDesiredPrice: React.Dispatch<React.SetStateAction<string>>;
  setDesiredMarketCap: React.Dispatch<React.SetStateAction<string>>;
}

const DesiredPriceInput: React.FC<DesiredPriceInputProps> = ({
  desiredPrice,
  setDesiredPrice,
  setDesiredMarketCap,
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
        Desired Price (in USD):
        <input
          type="number"
          value={desiredPrice}
          onChange={(e) => {
            setDesiredPrice(e.target.value);
            setDesiredMarketCap(''); // Clear desiredMarketCap when desiredPrice is entered
          }}
          placeholder="Future Price in USD"
          style={inputStyle}
        />
      </label>
    </div>
  );
};

export default DesiredPriceInput;
