import React from 'react';

interface TokenInputProps {
  tokenSymbol: string;
  setTokenSymbol: React.Dispatch<React.SetStateAction<string>>;
}

const TokenInput: React.FC<TokenInputProps> = ({ tokenSymbol, setTokenSymbol }) => {
  return (
    <div>
      <label>
        Token Symbol:
        <input
          type="text"
          value={tokenSymbol}
          onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
          placeholder="Token Symbol (e.g., SUI)"
        />
      </label>
    </div>
  );
};

export default TokenInput;
