/**
 * WhatsAppSimulator.jsx
 *
 * Renders a mobile-phone framed WhatsApp-style chat UI.
 *
 * Logic:
 *  - Reads clients from TradeContext.
 *  - Finds the FIRST client whose status is 'waiting_for_user'.
 *  - If none found → blank chat screen.
 *  - If found → shows an incoming message bubble with the trade details
 *    and green Accept / red Reject action buttons.
 *  - Accept → updateClientTrade(id, 'user_confirmed')
 *  - Reject  → updateClientTrade(id, 'idle')  [resets the trade]
 */

import { useTrade, TRADE_STATUSES } from "./TradeContext";

// ── Verified check icon (inline SVG) ────────────────────────────────────────
function VerifiedIcon() {
  return (
    <svg
      className="inline-block ml-1.5 h-4 w-4 text-white flex-shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label="Verified"
    >
      <path d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-.497 3.842 3.745 3.745 0 0 1-3.842.497A3.745 3.745 0 0 1 12 21a3.745 3.745 0 0 1-3.068-1.593 3.745 3.745 0 0 1-3.842-.497 3.745 3.745 0 0 1-.497-3.842A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 .497-3.842 3.745 3.745 0 0 1 3.842-.497A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.842.497 3.745 3.745 0 0 1 .497 3.842A3.745 3.745 0 0 1 21 12Z" />
    </svg>
  );
}

// ── Timestamp helper ─────────────────────────────────────────────────────────
function nowTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// ── Blank chat screen ────────────────────────────────────────────────────────
function BlankChat() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 px-6 text-center">
      {/* WhatsApp-style lock icon */}
      <div className="bg-white/70 rounded-full p-3 mb-1 shadow-sm">
        <svg className="h-6 w-6 text-[#075E54]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      </div>
      <p className="text-xs text-[#667781] leading-relaxed">
        Messages are end-to-end encrypted.{" "}
        <span className="text-[#025144] font-medium">No pending trade confirmations.</span>
      </p>
    </div>
  );
}

// ── Message bubble with Accept / Reject ──────────────────────────────────────
function TradeBubble({ client, onAccept, onReject }) {
  const { stockName, units } = client.tradeDetails;
  const time = nowTime();

  return (
    <div className="flex flex-col items-start px-3 pt-3 gap-2">
      {/* Bubble */}
      <div className="bg-white rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-sm max-w-[90%] overflow-hidden">
        {/* Message text */}
        <div className="px-3 pt-3 pb-1">
          {/* Sender label */}
          <p className="text-xs font-semibold text-[#075E54] mb-1">Krijuna Research</p>
          <p className="text-sm text-[#111B21] leading-snug">
            Krijuna Research wants to purchase{" "}
            <span className="font-semibold text-[#075E54]">{units} units</span>{" "}
            of{" "}
            <span className="font-semibold text-[#075E54]">{stockName}</span>.
          </p>
          {/* Timestamp */}
          <p className="text-right text-[10px] text-[#667781] mt-1">{time}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E9EDEF] mx-0" />

        {/* Action buttons */}
        <div className="flex divide-x divide-[#E9EDEF]">
          <button
            id={`reject-trade-${client.id}`}
            onClick={onReject}
            className="flex-1 py-2.5 text-sm font-semibold text-[#E53935] hover:bg-red-50 active:bg-red-100 transition-colors"
          >
            Reject
          </button>
          <button
            id={`accept-trade-${client.id}`}
            onClick={onAccept}
            className="flex-1 py-2.5 text-sm font-semibold text-[#075E54] hover:bg-green-50 active:bg-green-100 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>

      {/* Client info chip */}
      <div className="flex items-center gap-1.5 ml-1">
        <div className="h-5 w-5 rounded-full bg-[#075E54] flex items-center justify-center flex-shrink-0">
          <span className="text-[8px] font-bold text-white">
            {client.name.charAt(0)}
          </span>
        </div>
        <span className="text-[10px] text-[#667781]">
          {client.name} · {client.clientCode}
        </span>
      </div>
    </div>
  );
}

// ── WhatsAppSimulator (main export) ─────────────────────────────────────────
export default function WhatsAppSimulator() {
  const { clients, updateClientTrade } = useTrade();

  // First client whose status is 'waiting_for_user'
  const pendingClient = clients.find(
    (c) => c.status === TRADE_STATUSES.WAITING_FOR_USER
  ) ?? null;

  const handleAccept = () => {
    updateClientTrade(pendingClient.id, TRADE_STATUSES.USER_CONFIRMED);
  };

  const handleReject = () => {
    updateClientTrade(pendingClient.id, TRADE_STATUSES.IDLE);
  };

  return (
    /* ── Outer page wrapper ── */
    <div className="flex items-center justify-center min-h-screen bg-[#111827] p-6">
      {/* ── Phone frame ── */}
      <div className="relative w-full max-w-sm bg-white border-8 border-[#1a1a1a] rounded-[2.5rem] shadow-2xl overflow-hidden"
           style={{ minHeight: "640px" }}>

        {/* ── Notch ── */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1a1a1a] rounded-b-2xl z-10" />

        {/* ── Phone inner screen ── */}
        <div className="flex flex-col h-full" style={{ minHeight: "624px" }}>

          {/* ── WhatsApp-style status bar ── */}
          <div className="bg-[#075E54] pt-7 pb-0 flex items-center justify-between px-4">
            <span className="text-[10px] text-white/80 font-medium">9:41</span>
            <div className="flex items-center gap-1.5 text-white/80">
              {/* Signal bars */}
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <rect x="1"  y="14" width="4" height="10" rx="1"/>
                <rect x="7"  y="10" width="4" height="14" rx="1"/>
                <rect x="13" y="6"  width="4" height="18" rx="1"/>
                <rect x="19" y="2"  width="4" height="22" rx="1"/>
              </svg>
              {/* WiFi */}
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.5 8.5a17.25 17.25 0 0 1 21 0M5.25 12.25a11.25 11.25 0 0 1 13.5 0M9 16a6 6 0 0 1 6 0M12 20h.009"/>
              </svg>
              {/* Battery */}
              <svg className="h-3 w-4" viewBox="0 0 24 24" fill="currentColor">
                <rect x="1" y="7" width="18" height="10" rx="2" fillOpacity="0.4"/>
                <rect x="2" y="8" width="13" height="8" rx="1.5"/>
                <path d="M20 10h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1v-4Z"/>
              </svg>
            </div>
          </div>

          {/* ── Chat header ── */}
          <div className="bg-[#075E54] flex items-center gap-3 px-3 py-2.5 shadow-md">
            {/* Back arrow */}
            <svg className="h-5 w-5 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>

            {/* Avatar */}
            <div className="h-9 w-9 rounded-full bg-[#128C7E] flex items-center justify-center flex-shrink-0 shadow-inner">
              <span className="text-sm font-bold text-white">KR</span>
            </div>

            {/* Name + subtitle */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span className="text-sm font-semibold text-white truncate leading-tight">
                  Krijuna Research
                </span>
                <VerifiedIcon />
              </div>
              <p className="text-[10px] text-white/70 leading-tight mt-0.5">
                {pendingClient ? "online" : "tap here for contact info"}
              </p>
            </div>

            {/* Header icons */}
            <div className="flex items-center gap-3 text-white/90">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25 1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C9.61 21 3 14.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57-.09.36-.01.74.25 1.01l-2.7 2.21Z"/>
              </svg>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5"  r="1.5"/>
                <circle cx="12" cy="12" r="1.5"/>
                <circle cx="12" cy="19" r="1.5"/>
              </svg>
            </div>
          </div>

          {/* ── Chat body ── */}
          <div
            className="flex-1 flex flex-col overflow-y-auto py-2"
            style={{ background: "#ECE5DD" }}
          >
            {/* Date pill */}
            <div className="flex justify-center my-2">
              <span className="bg-white/70 text-[#667781] text-[10px] px-3 py-0.5 rounded-full shadow-sm">
                TODAY
              </span>
            </div>

            {pendingClient ? (
              <TradeBubble
                client={pendingClient}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ) : (
              <BlankChat />
            )}
          </div>

          {/* ── Message input bar ── */}
          <div className="bg-[#F0F2F5] flex items-center gap-2 px-2 py-2 border-t border-[#E9EDEF]">
            {/* Emoji icon */}
            <button className="text-[#54656F] p-1.5 rounded-full hover:bg-[#E9EDEF] transition">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <circle cx="12" cy="12" r="9"/>
                <path strokeLinecap="round" d="M8.5 14s1 1.5 3.5 1.5 3.5-1.5 3.5-1.5M9 9.5h.009M15 9.5h.009"/>
              </svg>
            </button>

            {/* Input pill */}
            <div className="flex-1 bg-white rounded-full px-4 py-1.5 text-sm text-[#8696A0] shadow-sm select-none">
              Message
            </div>

            {/* Mic button */}
            <button className="bg-[#075E54] text-white p-2 rounded-full shadow hover:bg-[#128C7E] transition">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4Z"/>
                <path fillRule="evenodd" d="M5 11a1 1 0 0 1 1 1 6 6 0 0 0 12 0 1 1 0 1 1 2 0 8 8 0 0 1-7 7.938V22h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-3.062A8 8 0 0 1 4 12a1 1 0 0 1 1-1Z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>

          {/* ── Home indicator ── */}
          <div className="bg-white flex justify-center py-1.5">
            <div className="w-24 h-1 bg-black/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
