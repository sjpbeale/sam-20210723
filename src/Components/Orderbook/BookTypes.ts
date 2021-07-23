/**
 * Orderbook Type Definitions
 */
import { ReactNode } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

// Orders
export type Order = [number, number];
export type Orders = Order[];
export type OrdersUpdate = {
  orders: Orders,
  hasUpdate: boolean,
  levels: number,
};

// Processed Orders
export type ProcessedOrder = {
  price: number,
  size: number,
  total: number,
  percent: number,
};
export type ProcessedOrders = ProcessedOrder[];

// Process Orders Reducer State / Data
export type ProcessedState = {
  bids: ProcessedOrders,
  asks: ProcessedOrders,
};
export type ProcessData = {
  bids: Orders,
  asks: Orders,
  group: number,
  limit: number,
};

// Book Context
export interface IBookContext {
  group: number;
  setGroup: (group: number) => void;
  groupOptions: number[];
  bookData: ProcessedState;
}

// Book Context Provider
export interface IBookProvider {
  socket: ReconnectingWebSocket | undefined;
  mobile: boolean;
  children: ReactNode;
}
