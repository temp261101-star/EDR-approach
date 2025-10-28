import React, { useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Globe,
  Globe2,
  Activity,
  Building2,
  Hash,
  MapPin,
} from "lucide-react";

const IPDetailView = ({ ipData, onClose }) => {
  const { ip, events, color, details } = ipData;

  useEffect(() => {
    console.log('IPDetailView mounted with data:', ipData);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full animate-pulse"
                style={{ background: color }}
              />
              <div>
                <h1 className="text-lg font-bold text-white">
                  {ip}
                </h1>
                <p className="text-xs text-slate-400">
                  {events.toLocaleString()} events
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Compact Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* Event Summary Cards - Compact */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">Total Events</div>
            <div className="text-lg font-bold text-cyan-400">
              {events.toLocaleString()}
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">Peak Hour</div>
            <div className="text-lg font-bold text-purple-400">
              {
                details.hourlyData.reduce((max, h) =>
                  h.events > max.events ? h : max
                ).time
              }
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">Avg/Hour</div>
            <div className="text-lg font-bold text-green-400">
              {Math.floor(events / 24).toLocaleString()}
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">Status</div>
            <div className="text-lg font-bold text-emerald-400">Active</div>
          </div>
        </div>

        {/* Domain Info and Chart Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Domain Information - Compact */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h2 className="text-sm font-semibold mb-3 text-cyan-400 flex items-center gap-2">
              <Globe2 className="w-4 h-4" />
              Domain Information
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900/50 rounded p-2 border border-slate-700/50">
                <div className="text-slate-400 text-xs mb-0.5 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  Org
                </div>
                <div className="text-white font-medium text-sm truncate">
                  {details.domainOrg}
                </div>
              </div>
              <div className="bg-slate-900/50 rounded p-2 border border-slate-700/50">
                <div className="text-slate-400 text-xs mb-0.5 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  AS
                </div>
                <div className="text-white font-medium text-sm truncate">
                  {details.domainAs}
                </div>
              </div>
              <div className="bg-slate-900/50 rounded p-2 border border-slate-700/50">
                <div className="text-slate-400 text-xs mb-0.5 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Country
                </div>
                <div className="text-white font-medium text-sm truncate">
                  {details.domainCountry}
                </div>
              </div>
              <div className="bg-slate-900/50 rounded p-2 border border-slate-700/50">
                <div className="text-slate-400 text-xs mb-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  City
                </div>
                <div className="text-white font-medium text-sm truncate">
                  {details.domainCity}
                </div>
              </div>
              <div className="bg-slate-900/50 rounded p-2 border border-slate-700/50">
                <div className="text-slate-400 text-xs mb-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Latitude
                </div>
                <div className="text-white font-medium text-sm">
                  {details.domainLatitude}
                </div>
              </div>
              <div className="bg-slate-900/50 rounded p-2 border border-slate-700/50">
                <div className="text-slate-400 text-xs mb-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Longitude
                </div>
                <div className="text-white font-medium text-sm">
                  {details.domainLongitude}
                </div>
              </div>
            </div>
          </div>

          {/* Hourly Events Chart - Compact */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h2 className="text-sm font-semibold mb-3 text-cyan-400 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Events Per Hour
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={details.hourlyData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="time"
                    stroke="#94a3b8"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} width={40} />
                  <Tooltip
                    contentStyle={{
                      background: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "#cbd5e1" }}
                    itemStyle={{ color: "#22d3ee" }}
                  />
                  <Bar dataKey="events" fill={color} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 to-slate-800 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <div>© 2025 IP Security Analytics</div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live
              </span>
              <span className="text-slate-500">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPDetailView;