import { clsx, type ClassValue } from "clsx";
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { useMemo } from 'react';
import { twMerge } from "tailwind-merge";
import type { Account, Chain, Client, Transport } from 'viem';
import { useConnectorClient, type Config } from 'wagmi';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateHash(address: string, startLength = 4, endLength = 4) {
  if (!address) return "";

  return `${address.substring(0, startLength)}...${address.substring(
    address.length - endLength
  )}`;
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client as any
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)
  return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId })
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}

/**
 * Format a number to K (thousands), M (millions), B (billions) format
 * @param value The number to format
 * @param decimals Number of decimal places (default: 1)
 * @returns Formatted string with appropriate suffix
 */
export function formatLargeNumber(value: number | string, decimals: number = 1): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return '0';

  const absValue = Math.abs(num);

  if (absValue >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(decimals).replace(/\.0+$/, '') + 'B';
  }

  if (absValue >= 1_000_000) {
    return (num / 1_000_000).toFixed(decimals).replace(/\.0+$/, '') + 'M';
  }

  if (absValue >= 1_000) {
    return (num / 1_000).toFixed(decimals).replace(/\.0+$/, '') + 'K';
  }

  return num.toFixed(decimals).replace(/\.0+$/, '');
}