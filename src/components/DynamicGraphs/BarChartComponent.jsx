import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import axios from "axios";

const darkPalette = {
  primary: "#3B82F6",
  accentGreen: "#10B981",
  accentRed: "#EF4444",
  accentYellow: "#F59E0B",
  accentPurple: "#8B5CF6",
  accentCyan: "#06B6D4",
  accentPink: "#EC4899",
  accentOrange: "#F97316",
  cardBackground: "#1F2937",
  cardBorder: "#374151",
  textPrimary: "#F9FAFB",
  textMuted: "#9CA3AF",
};

// Vibrant color palette for bars
const colorPalette = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#EC4899", // Pink
  "#F97316", // Orange
  "#14B8A6", // Teal
  "#A855F7", // Violet
];

const BarChartComponent = ({
  data = null,
  apiEndpoint = null,
  dataKey = "count",
  xAxisKey = "label",
}) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (apiEndpoint) {
        try {
          setIsLoading(true);
          const response = await axios.get(apiEndpoint);
          console.log("Bar chart API response:", response.data);
          setChartData(response.data);
          setError(null);
        } catch (err) {
          console.error("Error fetching bar chart data:", err);
          setError("Failed to load data");
        } finally {
          setIsLoading(false);
        }
      } else if (data) {
        setChartData(data);
      }
    };

    fetchData();
  }, [apiEndpoint, data]);

  const getBarColor = (index) => {
    return colorPalette[index % colorPalette.length];
  };

  const tooltipStyle = {
    background: "rgba(17, 24, 39, 0.98)",
    border: `1px solid ${darkPalette.cardBorder}`,
    borderRadius: 10,
    fontSize: 13,
    padding: "10px 14px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.6)",
    color: darkPalette.textPrimary,
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const color = payload[0].fill;
      return (
        <div style={tooltipStyle}>
          <p className="font-semibold mb-1.5 text-white">{payload[0].payload[xAxisKey]}</p>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: color }}
            />
            <p className="text-sm font-medium text-gray-200">
              {dataKey}: <span className="font-bold text-white">{payload[0].value}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center flex-1">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            <div className="text-gray-400 text-sm font-medium">Loading chart...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center flex-1">
          <div className="text-red-400 text-sm font-medium">{error}</div>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center flex-1">
          <div className="text-gray-400 text-sm font-medium">No data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chart Section */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              {chartData.map((_, index) => {
                const color = getBarColor(index);
                return (
                  <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(55, 65, 81, 0.25)"
              vertical={false}
            />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={{ stroke: darkPalette.cardBorder, strokeWidth: 2 }}
              tick={{ fontSize: 11, fill: darkPalette.textMuted, fontWeight: 600 }}
              angle={-40}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: darkPalette.cardBorder, strokeWidth: 2 }}
              tick={{ fontSize: 11, fill: darkPalette.textMuted, fontWeight: 600 }}
              width={40}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: "rgba(59, 130, 246, 0.08)" }} 
            />
            <Bar
              dataKey={dataKey}
              radius={[8, 8, 0, 0]}
              maxBarSize={55}
              onMouseEnter={(_, index) => setHoveredIndex(index)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient-${index})`}
                  opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.45}
                  style={{
                    filter: hoveredIndex === index ? "brightness(1.15) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))" : "none",
                    transition: "all 0.25s ease",
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Enhanced Table Section */}
      <div className="mt-4 flex-1 min-h-0 overflow-hidden border-t border-gray-700/40">
        <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-gray-800/98 backdrop-blur-sm z-10">
              <tr className="border-b border-gray-700/50">
                <th className="text-left py-2 px-3 font-bold text-gray-200 uppercase tracking-wider text-[10px]">
                  {xAxisKey.replace(/([A-Z])/g, " $1").trim()}
                </th>
                <th className="text-right py-2 px-3 font-bold text-gray-200 uppercase tracking-wider text-[10px]">
                  {dataKey.replace(/([A-Z])/g, " $1").trim()}
                </th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, idx) => {
                const barColor = getBarColor(idx);
                return (
                  <tr
                    key={idx}
                    className="border-b border-gray-700/20 hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <td className="py-2 px-3 text-gray-300 group-hover:text-white transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-2 h-2 rounded-full transition-all duration-200 shadow-sm"
                          style={{
                            backgroundColor: barColor,
                            opacity: hoveredIndex === idx ? 1 : 0.7,
                            transform: hoveredIndex === idx ? "scale(1.5)" : "scale(1)",
                            boxShadow: hoveredIndex === idx ? `0 0 8px ${barColor}` : "none",
                          }}
                        />
                        <span className="truncate text-[11px] font-medium">{item[xAxisKey]}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right font-medium group-hover:text-white transition-colors">
                      <span
                        className="inline-block px-2.5 py-1 rounded-md text-[11px] transition-all duration-200 font-semibold"
                        style={{
                          backgroundColor: hoveredIndex === idx ? `${barColor}25` : "transparent",
                          color: hoveredIndex === idx ? barColor : darkPalette.textMuted,
                          border: hoveredIndex === idx ? `1px solid ${barColor}40` : "1px solid transparent",
                        }}
                      >
                        {item[dataKey]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BarChartComponent;