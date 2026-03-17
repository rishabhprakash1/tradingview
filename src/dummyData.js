/**
 * dummyData.js
 * Static seed data: 30 clients with realistic Indian names and
 * random portfolio values between ₹50,000 and ₹5,000,000.
 *
 * Status values:
 *   'idle'              – no active trade
 *   'waiting_for_user'  – trade proposed, awaiting client confirmation
 *   'user_confirmed'    – client confirmed, pending execution
 *   'executed'          – trade has been executed
 */

const clients = [
  // ── Seed rows (provided in the spec) ─────────────────────────────────────
  { id: 1,  name: "Aarav Sharma",    clientCode: "KOL-001", portfolioValue: 1250000, status: "idle", tradeDetails: null },
  { id: 2,  name: "Priya Patel",     clientCode: "KOL-002", portfolioValue:  850000, status: "idle", tradeDetails: null },
  { id: 3,  name: "Rahul Verma",     clientCode: "KOL-003", portfolioValue: 3400000, status: "idle", tradeDetails: null },
  { id: 4,  name: "Neha Gupta",      clientCode: "KOL-004", portfolioValue:  450000, status: "idle", tradeDetails: null },
  { id: 5,  name: "Vikram Singh",    clientCode: "KOL-005", portfolioValue: 2100000, status: "idle", tradeDetails: null },

  // ── Generated rows (ids 6 – 30) ──────────────────────────────────────────
  { id: 6,  name: "Ananya Joshi",    clientCode: "KOL-006", portfolioValue:  720000, status: "idle", tradeDetails: null },
  { id: 7,  name: "Rohan Mehta",     clientCode: "KOL-007", portfolioValue: 4850000, status: "idle", tradeDetails: null },
  { id: 8,  name: "Kavya Reddy",     clientCode: "KOL-008", portfolioValue:  195000, status: "idle", tradeDetails: null },
  { id: 9,  name: "Arjun Nair",      clientCode: "KOL-009", portfolioValue: 1675000, status: "idle", tradeDetails: null },
  { id: 10, name: "Divya Iyer",      clientCode: "KOL-010", portfolioValue:  310000, status: "idle", tradeDetails: null },
  { id: 11, name: "Siddharth Kumar", clientCode: "KOL-011", portfolioValue: 2980000, status: "idle", tradeDetails: null },
  { id: 12, name: "Meera Pillai",    clientCode: "KOL-012", portfolioValue:  560000, status: "idle", tradeDetails: null },
  { id: 13, name: "Aditya Rao",      clientCode: "KOL-013", portfolioValue: 4120000, status: "idle", tradeDetails: null },
  { id: 14, name: "Pooja Mishra",    clientCode: "KOL-014", portfolioValue:   80000, status: "idle", tradeDetails: null },
  { id: 15, name: "Karan Malhotra",  clientCode: "KOL-015", portfolioValue: 1390000, status: "idle", tradeDetails: null },
  { id: 16, name: "Shreya Bose",     clientCode: "KOL-016", portfolioValue:  940000, status: "idle", tradeDetails: null },
  { id: 17, name: "Nikhil Jain",     clientCode: "KOL-017", portfolioValue: 3760000, status: "idle", tradeDetails: null },
  { id: 18, name: "Riya Chaudhary",  clientCode: "KOL-018", portfolioValue:  215000, status: "idle", tradeDetails: null },
  { id: 19, name: "Manish Agarwal",  clientCode: "KOL-019", portfolioValue: 1820000, status: "idle", tradeDetails: null },
  { id: 20, name: "Tanvi Saxena",    clientCode: "KOL-020", portfolioValue:  670000, status: "idle", tradeDetails: null },
  { id: 21, name: "Yash Pandey",     clientCode: "KOL-021", portfolioValue: 2450000, status: "idle", tradeDetails: null },
  { id: 22, name: "Ishaan Chopra",   clientCode: "KOL-022", portfolioValue:  130000, status: "idle", tradeDetails: null },
  { id: 23, name: "Simran Kaur",     clientCode: "KOL-023", portfolioValue: 4990000, status: "idle", tradeDetails: null },
  { id: 24, name: "Abhishek Das",    clientCode: "KOL-024", portfolioValue:  375000, status: "idle", tradeDetails: null },
  { id: 25, name: "Pallavi Tiwari",  clientCode: "KOL-025", portfolioValue: 1150000, status: "idle", tradeDetails: null },
  { id: 26, name: "Varun Khanna",    clientCode: "KOL-026", portfolioValue:  890000, status: "idle", tradeDetails: null },
  { id: 27, name: "Nandini Desai",   clientCode: "KOL-027", portfolioValue: 3050000, status: "idle", tradeDetails: null },
  { id: 28, name: "Aniket Shah",     clientCode: "KOL-028", portfolioValue:   55000, status: "idle", tradeDetails: null },
  { id: 29, name: "Bhavna Tripathi", clientCode: "KOL-029", portfolioValue: 2700000, status: "idle", tradeDetails: null },
  { id: 30, name: "Gaurav Bansal",   clientCode: "KOL-030", portfolioValue:  490000, status: "idle", tradeDetails: null },
];

export default clients;
