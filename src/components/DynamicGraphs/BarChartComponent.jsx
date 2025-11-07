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
import { ChevronDown } from "lucide-react";
import GenericPopupModal from "../MODAL/GenericPopupModal";
import Table from "../Table";
import api from "../../lib/api";

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

const colorPalette = [
  "#06B6D4",
  "#EC4899",
  "#8B5CF6",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#3B82F6",
  "#F97316",
  "#06D6A0",
  "#A78BFA",
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
  const [viewMode, setViewMode] = useState("both");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const handleOpenModal = (data) => {
    setSelectedData(data);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const extraData = [
    { label: "Quarantined", count: 12 },
    { label: "Resolved", count: 25 },
    { label: "Under Review", count: 8 },
    // { label: "Escalated", count: 5 },
    // { label: "Whitelisted", count: 3 },
    // { label: "Suspicious", count: 15 },
    // { label: "In Progress", count: 20 },
    // { label: "Failed", count: 6 },
    // { label: "Pending Review", count: 9 },
    // { label: "Detected & Ignored", count: 4 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (apiEndpoint) {
        try {
          setIsLoading(true);
          const apiData = await api.fetchResource({
            resource: apiEndpoint.replace(
              "http://182.48.194.218:9191/api/v1/",
              ""
            ),
          });
          console.log("Bar chart API response:", apiData);
        
          // setChartData(response.data);
          setChartData([...apiData, ...extraData]);
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
    borderRadius: 8,
    fontSize: 12,
    padding: "8px 12px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.6)",
    color: darkPalette.textPrimary,
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const color = payload[0].fill;
      return (
        <div
          style={{
            background: "rgba(17, 24, 39, 0.98)",
            border: "1px solid #374151",
            borderRadius: 8,
            fontSize: 12,
            padding: "8px 12px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.6)",
            color: darkPalette.textPrimary,
          }}
        >
          <p className="font-semibold mb-1 text-white text-[12px]">
            {payload[0].payload[xAxisKey]}
          </p>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <p className="text-[11px] font-medium text-gray-200">
              {dataKey}:{" "}
              <span className="font-bold text-white">{payload[0].value}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-gray-900">
        <div className="flex items-center justify-center flex-1 min-h-[200px]">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-3 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            <div className="text-gray-400 text-xs font-medium">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-gray-900">
        <div className="flex items-center justify-center flex-1 min-h-[200px]">
          <div className="text-red-400 text-xs font-medium">{error}</div>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex flex-col h-full bg-gray-900">
        <div className="flex items-center justify-center flex-1 min-h-[200px]">
          <div className="text-gray-400 text-xs font-medium">
            No data available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex items-center justify-between px-3 py-1">
        <div className="flex-1"></div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-gray-200 bg-gray-800 hover:bg-gray-700 rounded-md transition-all duration-200 border border-gray-700 hover:border-gray-600"
          >
            {viewMode === "chart" ? "📊" : viewMode === "table" ? "📋" : "📊📋"}
            <ChevronDown
              size={12}
              className={`transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-28 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20">
              <button
                onClick={() => {
                  setViewMode("both");
                  setDropdownOpen(false);
                }}
                className={`w-full px-2.5 py-1.5 text-left text-xs font-medium flex items-center gap-2 hover:bg-gray-700 transition-colors ${
                  viewMode === "both"
                    ? "text-blue-400 bg-gray-700/50"
                    : "text-gray-300"
                }`}
              >
                <span>📊📋</span> Both
              </button>
              <button
                onClick={() => {
                  setViewMode("chart");
                  setDropdownOpen(false);
                }}
                className={`w-full px-2.5 py-1.5 text-left text-xs font-medium flex items-center gap-2 hover:bg-gray-700 transition-colors border-t border-gray-700 ${
                  viewMode === "chart"
                    ? "text-blue-400 bg-gray-700/50"
                    : "text-gray-300"
                }`}
              >
                <span>📊</span> Chart
              </button>
              <button
                onClick={() => {
                  setViewMode("table");
                  setDropdownOpen(false);
                }}
                className={`w-full px-2.5 py-1.5 text-left text-xs font-medium flex items-center gap-2 hover:bg-gray-700 transition-colors border-t border-gray-700 ${
                  viewMode === "table"
                    ? "text-blue-400 bg-gray-700/50"
                    : "text-gray-300"
                }`}
              >
                <span>📋</span> Table
              </button>
            </div>
          )}
        </div>
      </div>

      {viewMode === "both" && (
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <div className="h-1/2 min-h-0 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 0, bottom: 30 }}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <defs>
                  {chartData.map((_, index) => {
                    const color = getBarColor(index);
                    return (
                      <linearGradient
                        key={`gradient-${index}`}
                        id={`gradient-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={color}
                          stopOpacity={0.95}
                        />
                        <stop
                          offset="100%"
                          stopColor={color}
                          stopOpacity={0.7}
                        />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(55, 65, 81, 0.2)"
                  vertical={false}
                />
                {/* <XAxis
                  dataKey={xAxisKey}
                  tickLine={false}
                  axisLine={{ stroke: darkPalette.cardBorder, strokeWidth: 1 }}
                  tick={{ fontSize: 10, fill: darkPalette.textMuted, fontWeight: 600 }}
                  angle={-35}
                  textAnchor="end"
                  // height={50}
                  interval={0}
                /> */}
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: darkPalette.cardBorder, strokeWidth: 1 }}
                  tick={{
                    fontSize: 10,
                    fill: darkPalette.textMuted,
                    fontWeight: 600,
                  }}
                  width={30}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
                />
                <Bar
                  dataKey={dataKey}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                  onMouseEnter={(_, index) => setHoveredIndex(index)}
                  onClick={(data) => handleOpenModal(data)}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#gradient-${index})`}
                      opacity={
                        hoveredIndex === null || hoveredIndex === index
                          ? 1
                          : 0.4
                      }
                      style={{
                        cursor: "pointer",
                        filter:
                          hoveredIndex === index
                            ? `drop-shadow(0 0 8px ${getBarColor(
                                index
                              )}40) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))`
                            : "none",
                        transition: "all 0.25s ease",
                        transform:
                          hoveredIndex === index ? "scaleY(1.05)" : "scaleY(1)",
                        transformOrigin: "bottom",
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="h-1/2 min-h-0 overflow-hidden flex flex-col  border-gray-700/40 ">
            <div className="overflow-y-auto scrollbar-hide flex-1 ">
              <table className="w-full">
                <thead className="sticky top-0  backdrop-blur-sm z-10">
                  <tr className="border-b border-white">
                    <th className="text-left py-1 px-1.5 font-bold text-gray-200 uppercase tracking-wider text-[10px]">
                      {xAxisKey.replace(/([A-Z])/g, " $1").trim()}
                    </th>
                    <th className="text-right py-1 px-1.5 font-bold text-gray-200 uppercase tracking-wider text-[10px]">
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
                        className="border-b border-gray-700/20 hover:bg-gray-800/60 transition-all duration-150 cursor-pointer group"
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => handleOpenModal(item)}
                      >
                        <td className="py-1 px-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className="w-2.5 h-2.5 rounded-full transition-all duration-200 shadow-md flex-shrink-0 group-hover:shadow-lg"
                              style={{
                                backgroundColor: barColor,
                                opacity: hoveredIndex === idx ? 1 : 0.7,
                                transform:
                                  hoveredIndex === idx
                                    ? "scale(1.3)"
                                    : "scale(1)",
                                boxShadow:
                                  hoveredIndex === idx
                                    ? `0 0 8px ${barColor}`
                                    : "none",
                              }}
                            />
                            <span className="truncate text-xs">
                              {item[xAxisKey]}
                            </span>
                          </div>
                        </td>
                        <td className="text-right py-1 px-1.5">
                          <span className="text-xs">{item[dataKey]}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {viewMode === "chart" && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 30 }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <defs>
                {chartData.map((_, index) => {
                  const color = getBarColor(index);
                  return (
                    <linearGradient
                      key={`gradient-${index}`}
                      id={`gradient-${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={color} stopOpacity={0.95} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(55, 65, 81, 0.2)"
                vertical={false}
              />
              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                axisLine={{ stroke: darkPalette.cardBorder, strokeWidth: 1 }}
                tick={{
                  fontSize: 10,
                  fill: darkPalette.textMuted,
                  fontWeight: 600,
                }}
                angle={-35}
                textAnchor="end"
                height={50}
                interval={0}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: darkPalette.cardBorder, strokeWidth: 1 }}
                tick={{
                  fontSize: 10,
                  fill: darkPalette.textMuted,
                  fontWeight: 600,
                }}
                width={30}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
              />
              <Bar
                dataKey={dataKey}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
                onMouseEnter={(_, index) => setHoveredIndex(index)}
                onClick={(data) => handleOpenModal(data)} // ✅ Add this
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#gradient-${index})`}
                    opacity={
                      hoveredIndex === null || hoveredIndex === index ? 1 : 0.4
                    }
                    style={{
                      cursor: "pointer",
                      filter:
                        hoveredIndex === index
                          ? `drop-shadow(0 0 8px ${getBarColor(
                              index
                            )}40) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))`
                          : "none",
                      transition: "all 0.25s ease",
                      transform:
                        hoveredIndex === index ? "scaleY(1.05)" : "scaleY(1)",
                      transformOrigin: "bottom",
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {viewMode === "table" && (
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col border-t border-gray-700/40">
          <div className="overflow-y-auto scrollbar-none flex-1">
            <table className="w-full">
              <thead className="sticky top-0  backdrop-blur-sm z-10">
                <tr className="border-b border-gray-700/60">
                  <th className="text-left py-1 px-1.5 font-bold text-gray-200 uppercase tracking-wider text-[12px]">
                    {xAxisKey.replace(/([A-Z])/g, " $1").trim()}
                  </th>
                  <th className="text-right py-1 px-1.5 font-bold text-gray-200 uppercase tracking-wider text-[12px]">
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
                      className="border-b border-gray-700/20 hover:bg-gray-800/60 transition-all duration-150 cursor-pointer group"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => handleOpenModal(item)} // ✅ Add this
                    >
                      <td className="py-1 px-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className="w-2.5 h-2.5 rounded-full transition-all duration-200 shadow-md flex-shrink-0 group-hover:shadow-lg"
                            style={{
                              backgroundColor: barColor,
                              opacity: hoveredIndex === idx ? 1 : 0.7,
                              transform:
                                hoveredIndex === idx
                                  ? "scale(1.3)"
                                  : "scale(1)",
                              boxShadow:
                                hoveredIndex === idx
                                  ? `0 0 8px ${barColor}`
                                  : "none",
                            }}
                          />
                          <span className="truncate">{item[xAxisKey]}</span>
                        </div>
                      </td>
                      <td className="text-right py-1 px-1.5">
                        <span>{item[dataKey]}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <GenericPopupModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={`Details for ${selectedData?.label || ""}`}
        >
          <div className="text-sm">
            <p>
              <strong>{xAxisKey}:</strong> {selectedData?.[xAxisKey]}
            </p>
            <p>
              <strong>{dataKey}:</strong> {selectedData?.[dataKey]}
            </p>
            <Table showCheckboxes={false} />
          </div>
        </GenericPopupModal>
      )}
    </div>
  );
};

export default BarChartComponent;
