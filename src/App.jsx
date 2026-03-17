import { useState } from "react";
import TraderDashboard from "./TraderDashboard";
import WhatsAppSimulator from "./WhatsAppSimulator";
import EmailSimulator from "./EmailSimulator";

// ── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  {
    id: "dashboard",
    label: "Trader Dashboard",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    label: "WhatsApp Confirmation",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347Z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.556 4.121 1.528 5.855L.057 23.215a.75.75 0 0 0 .918.932l5.485-1.437A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0Zm0 22c-1.854 0-3.6-.504-5.1-1.38l-.36-.214-3.733.978.997-3.645-.235-.374A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Z"/>
      </svg>
    ),
  },
  {
    id: "email",
    label: "Email Confirmation",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
         <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4l-8 5-8-5V6l8 5 8-5v2Z" />
      </svg>
    ),
  },
];

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex flex-col min-h-screen bg-[#060d1a]">

      {/* ── Global nav bar ── */}
      <nav className="sticky top-0 z-40 bg-[#060d1a]/95 backdrop-blur-md border-b border-slate-800 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center shadow">
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white tracking-tight hidden sm:block">
              TradingView
            </span>
          </div>

          {/* Tab group */}
          <div className="flex items-center gap-1 bg-slate-800/60 rounded-xl p-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                    }
                  `}
                >
                  <span className={isActive ? "text-slate-700" : ""}>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Right slot — placeholder for future actions */}
          <div className="w-24 hidden sm:block" />
        </div>
      </nav>

      {/* ── Page content (mount all, hide inactive so state is preserved) ── */}
      <main className="flex-1">
        <div className={activeTab === "dashboard" ? "block" : "hidden"}>
          <TraderDashboard />
        </div>
        <div className={activeTab === "whatsapp" ? "block" : "hidden"}>
          <WhatsAppSimulator />
        </div>
        <div className={activeTab === "email" ? "block" : "hidden"}>
          <EmailSimulator />
        </div>
      </main>
    </div>
  );
}
