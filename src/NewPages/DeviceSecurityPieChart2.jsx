import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Globe, Activity, Clock } from "lucide-react";

import { NewWindowPortal } from "../../lib/useNewWindowPortal.jsx"; // Add this import
import IPDetailView from "./IPDetailView.jsx"; // Add this import

// Dummy data generator
const generateDummyData = () => {
  const ips = [
    "192.168.0.80",
    "192.168.0.255",
    "10.0.0.45",
    "172.16.0.100",
    "192.168.1.50",
    "10.10.10.25",
    "172.20.5.75",
    "192.168.2.150",
  ];

  const colors = [
    "#06b6d4",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#84cc16",
  ];

  return ips.slice(0, 8).map((ip, i) => ({
    ip,
    events: Math.floor(Math.random() * 3000) + 1000,
    color: colors[i],
    details: generateIPDetails(ip),
  }));
};

const generateIPDetails = (ip) => {
  const orgs = [
    "D-Vois Broadband Pvt Ltd",
    "Reliance Jio",
    "Airtel Networks",
    "BSNL India",
  ];
  const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"];
  const countries = ["India", "United States", "Singapore", "United Kingdom"];

  return {
    domainOrg: orgs[Math.floor(Math.random() * orgs.length)],
    domainAs: Math.floor(Math.random() * 50000) + 10000,
    domainCountry: countries[Math.floor(Math.random() * countries.length)],
    domainCity: cities[Math.floor(Math.random() * cities.length)],
    domainLatitude: (Math.random() * 60 + 10).toFixed(4),
    domainLongitude: (Math.random() * 100 + 40).toFixed(4),
    hourlyData: generateHourlyData(),
  };
};

const generateHourlyData = () => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0") + ":00";
    hours.push({
      time: hour,
      events: Math.floor(Math.random() * 4000) + 500,
    });
  }
  return hours;
};

const DeviceSecurityPieChart2 = ({
  endpoint = "deviceControl/deviceList",
  title = "Top 10 Source IP",
}) => {
  const [ipData, setIpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIP, setSelectedIP] = useState(null);
  const [isWindowOpen, setIsWindowOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call 
        await new Promise((resolve) => setTimeout(resolve, 500));

        // For now, always use dummy data
        // In future, replace this with actual API call
        const dummyData = generateDummyData();
        setIpData(dummyData);
        setLoading(false);
      } catch (err) {
        console.error("Data fetch failed:", err);
        // Fallback to dummy data on error
        setIpData(generateDummyData());
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  const handleItemClick = (item) => {
    console.log("Item clicked:", item);

    // Close existing window first if open
    if (isWindowOpen) {
      setIsWindowOpen(false);
      setTimeout(() => {
        setSelectedIP(item);
        setIsWindowOpen(true);
      }, 0);
    } else {
      setSelectedIP(item);
      setIsWindowOpen(true);
    }
  };

  const handleCloseWindow = () => {
    console.log("Closing window"); // Debug log
    setIsWindowOpen(false);
    setSelectedIP(null);
  };

  const total = ipData.reduce((sum, item) => sum + item.events, 0);
if (loading) {
  return (
    <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-sm text-slate-400">Loading...</div>
    </div>
  );
}

if (!loading && (!ipData || ipData.length === 0)) {
  return (
    <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center h-full p-4">
      <div className="text-sm text-slate-400 text-center">
        No data available
      </div>
    </div>
  );
}
  return (
    <>
      <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl flex flex-col h-auto max-h-[320px] w-full overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-700 bg-slate-900/50 backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              {title}
            </h3>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-full">
              {total.toLocaleString()} events
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1">
          {/* Pie Chart */}
          <div className="h-50 w-50 flex-shrink-0">
            <ResponsiveContainer width="90%" height="100%">
              <PieChart>
                <Pie
  data={ipData}
  dataKey="events"
  nameKey="ip"
  cx="50%"
  cy="50%"
  innerRadius={55}
  outerRadius={75}
  stroke="none"
  paddingAngle={2}
>
  {ipData && ipData.length > 0 && ipData.map((d, i) => (
    <Cell key={i} fill={d.color} />
  ))}
</Pie>

                <Tooltip
                  formatter={(v, n) => [`${v.toLocaleString()}`, n]}
                  contentStyle={{
                    background:
                      "linear-gradient(to bottom right, #1e293b, #0f172a)",
                    border: "1px solid #475569",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#f8fafc",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
                  }}
                  itemStyle={{ color: "#22d3ee", fontWeight: 600 }}
                  labelStyle={{ color: "#cbd5e1" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 w-full overflow-y-auto max-h-[280px] space-y-1">
            <div className="grid grid-cols-2 gap-x-4 text-xs font-semibold text-slate-400 px-3 py-2 border-b border-slate-700 sticky top-0 bg-slate-900/90 backdrop-blur">
              <span>Source IP</span>
              <span className="text-right">Events</span>
            </div>
            {ipData.map((d) => (
              <div
                key={d.ip}
                onClick={() => handleItemClick(d)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-700/50 transition-all cursor-pointer group border border-transparent hover:border-slate-600"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="h-3 w-3 rounded-full ring-2 ring-slate-900/60 flex-shrink-0 group-hover:ring-4 transition-all"
                    style={{ background: d.color }}
                  />
                  <span className="truncate text-slate-100 font-medium text-sm group-hover:text-cyan-400 transition-colors">
                    {d.ip}
                  </span>
                </span>
                <span className="text-slate-400 text-sm font-semibold group-hover:text-white transition-colors">
                  {d.events.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-700 bg-slate-900/50 backdrop-blur">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3" />
              Click any IP for details
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Updated {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
      {selectedIP && (
        <NewWindowPortal
          isOpen={isWindowOpen}
          onClose={handleCloseWindow}
          key={selectedIP.ip} // Add key to force remount on IP change
        >
          <IPDetailView ipData={selectedIP} onClose={handleCloseWindow} />
        </NewWindowPortal>
      )}
    </>
  );
};

export default DeviceSecurityPieChart2;
