import { useState, useEffect } from "react";
import { Client, AccountId } from "@hashgraph/sdk";
import { getHbarUsdPrice } from "@/utils";

// Hook for managing account balance
export const useAccountBalance = (accountId: string) => {
  const [balance, setBalance] = useState<string>("0");
  const [balanceInUSD, setBalanceInUSD] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!accountId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Implement balance fetching logic here
        const hbarPrice = await getHbarUsdPrice();
        // Mock balance for now
        const mockBalance = "100";
        setBalance(mockBalance);
        setBalanceInUSD((parseFloat(mockBalance) * hbarPrice).toFixed(2));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch balance"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [accountId]);

  return { balance, balanceInUSD, isLoading, error };
};

// Hook for EVM wallet integration
export const useEvmWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    if (!window.ethereum) {
      setError("No Ethereum wallet found");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const chainIdHex = await window.ethereum.request({
        method: "eth_chainId",
      });

      setAccount(accounts[0]);
      setChainId(parseInt(chainIdHex, 16));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setChainId(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });

      window.ethereum.on("chainChanged", (chainId: string) => {
        setChainId(parseInt(chainId, 16));
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  return {
    account,
    chainId,
    isConnecting,
    error,
    connect,
    disconnect,
  };
};

// Export wallet utilities and types
export const createHederaClient = (accountId: string, privateKey: string) => {
  // Implement Hedera client creation logic
  return null;
};

export const formatAccountId = (accountId: string) => {
  try {
    return AccountId.fromString(accountId).toString();
  } catch {
    return accountId;
  }
};
