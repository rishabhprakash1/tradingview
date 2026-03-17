import { useTrade, TRADE_STATUSES } from "./TradeContext";

function EmailThread({ client, onAccept, onReject }) {
  const { stockName, units } = client.tradeDetails;
  const status = client.status;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6 overflow-hidden">
      {/* ── Email Header ── */}
      <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Action Required: Trade Confirmation
        </h3>
        <div className="flex justify-between items-start text-sm text-slate-500">
          <div className="flex flex-col gap-0.5">
            <p>
              <span className="font-medium text-slate-700">From:</span> Krijuna
              Research &lt;invest@krijuna.com&gt;
            </p>
            <p>
              <span className="font-medium text-slate-700">To:</span>{" "}
              {client.name} &lt;{client.clientCode.toLowerCase()}@client.com&gt;
            </p>
          </div>
          <p className="text-xs whitespace-nowrap hidden sm:block">
            {new Date().toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* ── Main Email Body ── */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="text-slate-700 mb-5 leading-relaxed">
          <p className="mb-3">Dear {client.name},</p>
          <p className="mb-3">
            We are proposing a purchase of <strong>{units} units</strong> of{" "}
            <strong>{stockName}</strong> for your portfolio.
          </p>
          <p>
            Please confirm if you would like to proceed with this trade by
            clicking one of the options below.
          </p>
        </div>

        {status === TRADE_STATUSES.WAITING_FOR_USER && (
          <div className="flex gap-3">
            <button
              onClick={() => onAccept(client)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
            >
              Confirm Trade
            </button>
            <button
              onClick={() => onReject(client)}
              className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {/* ── Replies Thread ── */}
      {status !== TRADE_STATUSES.WAITING_FOR_USER && (
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 sm:pl-10 border-l-4 border-l-slate-400">
          <p className="text-sm text-slate-500 mb-2">
            <span className="font-medium text-slate-700">From:</span>{" "}
            {client.name} &lt;{client.clientCode.toLowerCase()}@client.com&gt;
          </p>
          <p className="text-slate-800 text-sm font-medium">
            I confirm this trade. Please proceed with the execution.
          </p>
        </div>
      )}

      {(status === TRADE_STATUSES.USER_CONFIRMED ||
        status === TRADE_STATUSES.EXECUTED) && (
        <div className="px-5 py-4 border-b border-slate-100 bg-green-50/50 sm:pl-10 border-l-4 border-l-green-500">
          <p className="text-sm text-green-700 mb-1 flex items-center gap-1.5 font-semibold">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
               <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" clipRule="evenodd"/>
            </svg>
            System Notification
          </p>
          <p className="text-green-800 text-sm bg-green-100/50 inline-block px-2.5 py-1 rounded">
            Broker has been notified.
          </p>
        </div>
      )}

      {status === TRADE_STATUSES.EXECUTED && (
        <div className="px-5 py-4 border-b border-slate-100 bg-blue-50/50 sm:pl-10 border-l-4 border-l-blue-600">
          <p className="text-sm text-blue-700 mb-1 flex items-center gap-1.5 font-semibold">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
               <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" clipRule="evenodd"/>
            </svg>
            System Notification
          </p>
          <p className="text-blue-900 text-sm bg-blue-100/50 inline-block px-2.5 py-1 rounded">
            Trade Executed Successfully.
          </p>
        </div>
      )}
    </div>
  );
}

// ── EmailSimulator (main export) ─────────────────────────────────────────────
export default function EmailSimulator() {
  const { clients, updateClientTrade } = useTrade();

  // Find all clients that have an active or completed trade
  const activeTradeClients = clients.filter(
    (c) =>
      c.status === TRADE_STATUSES.WAITING_FOR_USER ||
      c.status === TRADE_STATUSES.USER_CONFIRMED ||
      c.status === TRADE_STATUSES.EXECUTED
  );

  const handleAccept = (client) => {
    updateClientTrade(client.id, TRADE_STATUSES.USER_CONFIRMED);
  };

  const handleReject = (client) => {
    updateClientTrade(client.id, TRADE_STATUSES.IDLE);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Gmail-style Header */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200">
          <div className="bg-red-500 h-10 w-10 flex items-center justify-center rounded-xl shadow-sm text-white">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">Mailbox</h2>
            <p className="text-sm text-slate-500">Client Trade Confirmations</p>
          </div>
        </div>

        {/* threads iteration */}
        {activeTradeClients.length > 0 ? (
          activeTradeClients.map((client) => (
            <EmailThread
              key={client.id}
              client={client}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
            <svg className="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-sm font-medium text-slate-900">Inbox Zero</h3>
            <p className="mt-1 text-sm text-slate-500">No pending trade confirmations through email.</p>
          </div>
        )}
      </div>
    </div>
  );
}
