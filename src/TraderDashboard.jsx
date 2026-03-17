/**
 * TraderDashboard.jsx
 *
 * Displays the full client table and handles the "Execute New Trade" modal flow.
 *
 * Status → Action column mapping:
 *   idle             → Blue  "Execute New Trade" button   (opens modal)
 *   waiting_for_user → Grey, disabled "Waiting for user confirmation"
 *   user_confirmed   → Green "User confirmation Received - Execute Trade"
 *   executed         → Muted "Trade Executed" badge
 */

import { useState } from "react";
import { useTrade, TRADE_STATUSES } from "./TradeContext";

// ── Constants ──────────────────────────────────────────────────────────────
const NIFTY_STOCKS = [
  "RELIANCE",
  "TCS",
  "HDFC",
  "INFY",
  "ICICIBANK",
  "SBI",
  "BHARTIARTL",
  "ITC",
  "LT",
  "KOTAKBANK",
];

const EMPTY_FORM = { stockName: NIFTY_STOCKS[0], units: "" };

// ── Helper: format portfolio value in Indian locale ────────────────────────
const formatINR = (value) =>
  "₹" + value.toLocaleString("en-IN");

// ── TradeModal ─────────────────────────────────────────────────────────────
function TradeModal({ client, onConfirm, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const units = Number(form.units);
    if (!form.units || units <= 0 || !Number.isInteger(units)) {
      setError("Please enter a valid whole number of units (≥ 1).");
      return;
    }
    onConfirm({ stockName: form.stockName, units });
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      {/* Modal card — stop click propagation so clicking inside doesn't close */}
      <div
        className="relative w-full max-w-md mx-4 bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-700/60">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-1">
            New Trade
          </p>
          <h2 className="text-lg font-bold text-white leading-tight">
            {client.name}
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {client.clientCode} &nbsp;·&nbsp; Portfolio: {formatINR(client.portfolioValue)}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Stock dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              NIFTY Stock
            </label>
            <div className="relative">
              <select
                value={form.stockName}
                onChange={(e) => setForm({ ...form, stockName: e.target.value })}
                className="w-full appearance-none bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
              >
                {NIFTY_STOCKS.map((stock) => (
                  <option key={stock} value={stock}>
                    {stock}
                  </option>
                ))}
              </select>
              {/* Chevron icon */}
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Units input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Units
            </label>
            <input
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 50"
              value={form.units}
              onChange={(e) => {
                setError("");
                setForm({ ...form, units: e.target.value });
              }}
              className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {error && (
              <p className="mt-1.5 text-xs text-red-400">{error}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-600 text-slate-300 text-sm font-medium hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold transition shadow-lg shadow-blue-900/40"
            >
              Confirm with user
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── ActionButton ───────────────────────────────────────────────────────────
function ActionButton({ client, onExecuteClick, onExecuteTrade }) {
  switch (client.status) {
    case TRADE_STATUSES.IDLE:
      return (
        <button
          onClick={() => onExecuteClick(client)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold transition shadow-md shadow-blue-900/30 whitespace-nowrap"
        >
          Execute New Trade
        </button>
      );

    case TRADE_STATUSES.WAITING_FOR_USER:
      return (
        <button
          disabled
          className="px-4 py-2 rounded-lg bg-slate-700 text-slate-400 text-xs font-semibold cursor-not-allowed whitespace-nowrap"
        >
          Waiting for user confirmation
        </button>
      );

    case TRADE_STATUSES.USER_CONFIRMED:
      return (
        <button
          onClick={() => onExecuteTrade(client)}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold transition shadow-md shadow-emerald-900/30 whitespace-nowrap"
        >
          User confirmation Received — Execute Trade
        </button>
      );

    case TRADE_STATUSES.EXECUTED:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-600 text-slate-400 text-xs font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-500 inline-block" />
          Trade Executed
        </span>
      );

    default:
      return null;
  }
}

// ── StatusBadge (inline pill shown next to status in its own column) ───────
function StatusBadge({ status }) {
  const map = {
    [TRADE_STATUSES.IDLE]:             { label: "Idle",             cls: "bg-slate-700/60 text-slate-400" },
    [TRADE_STATUSES.WAITING_FOR_USER]: { label: "Awaiting Client",  cls: "bg-amber-900/40 text-amber-400" },
    [TRADE_STATUSES.USER_CONFIRMED]:   { label: "Confirmed",        cls: "bg-emerald-900/40 text-emerald-400" },
    [TRADE_STATUSES.EXECUTED]:         { label: "Executed",         cls: "bg-blue-900/40 text-blue-400" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-slate-700 text-slate-400" };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

// ── TraderDashboard (main export) ──────────────────────────────────────────
export default function TraderDashboard() {
  const { clients, updateClientTrade } = useTrade();
  const [modalClient, setModalClient] = useState(null); // client being traded

  /** Called when modal's "Confirm with user" is submitted */
  const handleConfirm = ({ stockName, units }) => {
    updateClientTrade(modalClient.id, TRADE_STATUSES.WAITING_FOR_USER, {
      stockName,
      units,
    });
    setModalClient(null);
  };

  /**
   * Called when the green "User confirmation Received — Execute Trade" button
   * is clicked. Fires an alert then resets the client back to idle.
   */
  const handleExecuteTrade = (client) => {
    alert(`Trade executed successfully!`);
    updateClientTrade(client.id, TRADE_STATUSES.EXECUTED);
  };

  return (
    <div className="min-h-screen bg-[#060d1a] text-white">

      {/* ── Main content ── */}
      <main className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Client Portfolio</h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage and execute trades across your client book.
          </p>
        </div>

        {/* ── Table card ── */}
        <div className="rounded-2xl border border-slate-800 overflow-hidden shadow-2xl shadow-black/40">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              {/* Head */}
              <thead>
                <tr className="bg-slate-800/60 border-b border-slate-700">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-widest text-slate-400 w-8">
                    #
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Client Name
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Client Code
                  </th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Portfolio Value
                  </th>
                  <th className="text-center px-5 py-3.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Status
                  </th>
                  <th className="text-center px-5 py-3.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {clients.map((client, idx) => (
                  <tr
                    key={client.id}
                    className={`border-b border-slate-800 transition-colors hover:bg-slate-800/30 ${
                      idx % 2 === 0 ? "bg-[#080f1e]" : "bg-[#060d1a]"
                    }`}
                  >
                    {/* Row number */}
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-xs">
                      {String(idx + 1).padStart(2, "0")}
                    </td>

                    {/* Client Name */}
                    <td className="px-5 py-3.5 font-semibold text-white">
                      {client.name}
                      {client.tradeDetails && (
                        <span className="ml-2 text-xs text-slate-500 font-normal">
                          {client.tradeDetails.stockName} · {client.tradeDetails.units} units
                        </span>
                      )}
                    </td>

                    {/* Client Code */}
                    <td className="px-5 py-3.5 font-mono text-slate-400 text-xs">
                      {client.clientCode}
                    </td>

                    {/* Portfolio Value */}
                    <td className="px-5 py-3.5 text-right font-mono text-emerald-400 font-semibold">
                      {formatINR(client.portfolioValue)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 text-center">
                      <StatusBadge status={client.status} />
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5 text-center">
                      <ActionButton
                        client={client}
                        onExecuteClick={setModalClient}
                        onExecuteTrade={handleExecuteTrade}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-5 py-3 bg-slate-800/30 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
            <span>Showing {clients.length} of {clients.length} clients</span>
            <span>All values in INR (₹)</span>
          </div>
        </div>
      </main>

      {/* ── Modal ── */}
      {modalClient && (
        <TradeModal
          client={modalClient}
          onConfirm={handleConfirm}
          onCancel={() => setModalClient(null)}
        />
      )}
    </div>
  );
}
