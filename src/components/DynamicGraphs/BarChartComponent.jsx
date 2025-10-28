import React, { useEffect, useState, useMemo } from "react";
import { groupBy } from "lodash"; 
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getApi } from "../../../lib/api";

const BarChartComponent = ({query,endpoint,title}) => {
  const [anomalyOverview, setAnomalyOverview] = useState([]);
const [loading, setLoading] = useState(true);

  const darkPalette = {
    primary: "#3B82F6",
    accentGreen: "#10B981",
    accentRed: "#EF4444",
    background: "#111827",
    cardBackground: "#1F2937",
    cardBorder: "#374151",
    textPrimary: "#F9FAFB",
    textMuted: "#9CA3AF",
  };

  const tooltipStyle = {
    background: darkPalette.cardBackground,
    border: `1px solid ${darkPalette.cardBorder}`,
    borderRadius: 8,
    fontSize: 12,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
    color: darkPalette.textPrimary,
  };

  useEffect(() => {
    const fetchData = async () => {
   
      setLoading(true);
      try {
        // const anomalyRes = await getApi(query, endpoint);

            let anomalyRes = query ? await getApi(query, endpoint) : data;
console.log("date data : ",anomalyRes);

        const grouped = groupBy(anomalyRes, "date");
        const processed = Object.entries(grouped).map(([date, items]) => {
          return {
            date,
            weakCipher: items.filter((i) => i.weakCipher).length,
            weakAuth: items.filter((i) => i.weakAuth).length,
            misused: items.filter((i) => i.misused).length,
          };
        });

        // Optional: only keep last 30 days
        const limited = processed.slice(-30);

        setAnomalyOverview(limited);
      } catch (err) {
        console.error("Anomaly overview fetch failed:", err);
      }finally {
  setLoading(false);
}
    };
    fetchData();
  }, []);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 shadow-sm flex flex-col h-full">
     

     {loading ? (

    // <div className="rounded-lg border border-gray-700 bg-gray-900 shadow-sm flex items-center justify-center h-[260px] w-full">
    //   <div className="animate-pulse text-gray-400">Loading...</div>
    // </div>


    <div className="rounded-lg  bg-gray-900 shadow-sm p-4 w-full h-[260px] flex items-end space-x-2">
  {[...Array(26)].map((_, i) => (
    <div
      key={i}
      className="bg-gray-700 rounded w-1/6 animate-pulse"
      style={{ height: `${Math.floor(Math.random() * 60) + 40}%` }}
    ></div>
  ))}
</div>

  
  ):(<div className="h-full p-2" style={{ minHeight: "220px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={anomalyOverview}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }} 
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkPalette.cardBorder}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tick={{ fontSize: 11, fill: darkPalette.textMuted }}
            />
            <YAxis
              tickFormatter={(v) => v} 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: darkPalette.textMuted }}
            />
            <Tooltip
              formatter={(v, n) => [v, n]} 
              contentStyle={tooltipStyle}
            />
            <Legend
              verticalAlign="bottom"
              height={24}
              wrapperStyle={{
                fontSize: 11,
                color: darkPalette.textMuted,
              }}
            />
            <Bar
              dataKey="weakCipher"
              name="Weak cipher"
              stackId="a"
              fill={darkPalette.primary}
            />
            <Bar
              dataKey="weakAuth"
              name="Weak authentication"
              stackId="a"
              fill={darkPalette.accentGreen}
            />
            <Bar
              dataKey="misused"
              name="Misused protocol"
              stackId="a"
              fill={darkPalette.accentRed}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>)
}
      
    </div>
  );
};

export default BarChartComponent;