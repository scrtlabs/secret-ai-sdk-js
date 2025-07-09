/**
 * Module: secret enables interactions with Secret worker management smart contract
 */

import { SecretNetworkClient, Wallet } from 'secretjs';
import * as bip39 from 'bip39';
import * as cfg from './config';
import { SecretAISecretValueMissingError } from './exceptions';

export class Secret {
  public chainId: string;
  public nodeUrl: string;
  public secretClient: SecretNetworkClient;
  public smartContract: string;

  /**
   * Secret supports interactions with the worker management smart contract
   */
  constructor(chainId?: string, nodeUrl?: string) {
    // Set chain ID from parameter, environment variable, or default
    if (!chainId) {
      this.chainId = process.env[cfg.SECRET_CHAIN_ID] || cfg.SECRET_CHAIN_ID_DEFAULT;
      if (!this.chainId) {
        throw new SecretAISecretValueMissingError(cfg.SECRET_CHAIN_ID);
      }
    } else {
      this.chainId = chainId;
    }

    // Set node URL from parameter, environment variable, or default
    if (!nodeUrl) {
      this.nodeUrl = process.env[cfg.SECRET_NODE_URL] || cfg.SECRET_NODE_URL_DEFAULT;
      if (!this.nodeUrl) {
        throw new SecretAISecretValueMissingError(cfg.SECRET_NODE_URL);
      }
    } else {
      this.nodeUrl = nodeUrl;
    }

    // Initialize Secret Network client
    this.secretClient = new SecretNetworkClient({
      chainId: this.chainId,
      url: this.nodeUrl,
    });

    // Set smart contract address from environment variable or default
    this.smartContract = process.env[cfg.SECRET_WORKER_SMART_CONTRACT] || cfg.SECRET_WORKER_SMART_CONTRACT_DEFAULT;
  }

  /**
   * Method get_priv_key_from_mnemonic returns a base16 encoded private key
   *
   * @param mnemonic - mnemonic as string
   * @returns hex encoded private key
   */
  getPrivKeyFromMnemonic(mnemonic: string): string {
    // Validate mnemonic
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonic provided');
    }

    // Create wallet from mnemonic
    const wallet = new Wallet(mnemonic);
    
    // Return the private key as hex string
    return Buffer.from(wallet.privateKey).toString('hex');
  }

  /**
   * Method get_models returns a list of models known to the worker management smart contract
   *
   * @returns Promise<string[]> - a list of models known to the smart contract
   */
  async getModels(): Promise<string[]> {
    const query = { get_models: {} };
    
    try {
      const result = await this.secretClient.query.compute.queryContract({
        contract_address: this.smartContract,
        query: query,
      });
      
      return (result as any).models;
    } catch (error) {
      throw new Error(`Failed to query models: ${error}`);
    }
  }

  /**
   * Method get_urls returns a list of urls known to Secret worker management 
   * smart contract that host the given model
   *
   * @param model - a model to use when searching for the urls that host it
   * @returns Promise<string[]> - a list of urls that match the model search criteria, if provided,
   *                              or all urls known to Secret smart contract
   */
  async getUrls(model?: string): Promise<string[]> {
    const query = model 
      ? { get_u_r_ls: { model: model } }
      : { get_u_r_ls: {} };
    
    try {
      const result = await this.secretClient.query.compute.queryContract({
        contract_address: this.smartContract,
        query: query,
      });
      
      return (result as any).urls;
    } catch (error) {
      throw new Error(`Failed to query URLs: ${error}`);
    }
  }
} 