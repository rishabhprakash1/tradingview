/**
 * TradeContext.jsx
 *
 * Global state management for the TradingView application.
 *
 * Provides:
 *   • clients      – array of all client objects (sourced from dummyData.js)
 *   • updateClientTrade(clientId, newStatus, tradePayload?) – updates a
 *     single client's status and optional tradeDetails in one immutable step.
 *
 * Status lifecycle:
 *   idle  →  waiting_for_user  →  user_confirmed  →  executed
 *   (any status can be reset back to 'idle' by passing newStatus = 'idle')
 *
 * tradePayload shape (optional):
 *   { stockName: string, units: number }
 *
 * When newStatus is 'idle', tradeDetails is always cleared to null regardless
 * of any tradePayload passed in.
 */

import { createContext, useContext, useState, useCallback } from "react";
import initialClients from "./dummyData";

// ── Valid status values ──────────────────────────────────────────────────────
export const TRADE_STATUSES = Object.freeze({
  IDLE:               "idle",
  WAITING_FOR_USER:   "waiting_for_user",
  USER_CONFIRMED:     "user_confirmed",
  EXECUTED:           "executed",
});

// ── Context creation ─────────────────────────────────────────────────────────
const TradeContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────────────────────
export function TradeProvider({ children }) {
  const [clients, setClients] = useState(initialClients);

  /**
   * updateClientTrade
   *
   * @param {number}  clientId     – id of the client to update
   * @param {string}  newStatus    – one of the TRADE_STATUSES values
   * @param {object}  [tradePayload] – optional { stockName, units }
   */
  const updateClientTrade = useCallback((clientId, newStatus, tradePayload = null) => {
    setClients((prevClients) =>
      prevClients.map((client) => {
        if (client.id !== clientId) return client;

        // When resetting to idle, always clear tradeDetails
        const tradeDetails =
          newStatus === TRADE_STATUSES.IDLE
            ? null
            : tradePayload
            ? { stockName: tradePayload.stockName, units: tradePayload.units }
            : client.tradeDetails; // preserve existing details on status-only update

        return {
          ...client,
          status: newStatus,
          tradeDetails,
        };
      })
    );
  }, []);

  const contextValue = {
    clients,
    updateClientTrade,
  };

  return (
    <TradeContext.Provider value={contextValue}>
      {children}
    </TradeContext.Provider>
  );
}

// ── Custom hook ──────────────────────────────────────────────────────────────
/**
 * useTrade
 * Convenience hook – throws if used outside <TradeProvider>.
 *
 * @returns {{ clients: Array, updateClientTrade: Function }}
 */
export function useTrade() {
  const ctx = useContext(TradeContext);
  if (!ctx) {
    throw new Error("useTrade must be used within a <TradeProvider>.");
  }
  return ctx;
}

export default TradeContext;
