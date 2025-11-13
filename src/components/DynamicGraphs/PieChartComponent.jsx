import React, { useEffect, useState, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getApi } from "../../lib/api";
import GenericDrawerModal from "../MODAL/GenericDrawerModal";
import { ChevronDown } from "lucide-react";
import GenericPopupModal from "../MODAL/GenericPopupModal";
import Table from "../Table";

const PieChartComponent = React.memo(function PieChartComponent({
  query,
  endpoint,
  data,
  title,
}) {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [dataToSend, setDataToSend] = useState({});
  const [viewMode, setViewMode] = useState("both");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleOpenModal = useCallback((item) => {
    setIsOpen(true);
    setDataToSend(item);
  }, []);

  const handleCloseModal = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let res = query ? await getApi(query, endpoint) : data;

        const dynamicPalette = [
          "#22D3EE",
          "#FB923C",
          "#EC4899",
          "#06B6D4",
          "#F472B6",
          "#2DD4BF",
          "#C084FC",
          "#FB7185",
          "#14B8A6",
          "#F97316",
          "#A78BFA",
          "#60A5FA",
          "#3B82F6",
          "#10B981",
          "#EF4444",
          "#DC2626",
          "#F97316",
          "#14B8A6",
          "#C2410C",
          "#A855F7",
          "#71717A",
          "#991B1B",
          "#16A34A",
          "#DC2626",
          "#059669",
          "#0EA5E9",
          "#B91C1C",
        ];

        const statusColors = {
          Up: "#10B981",
          Down: "#EF4444",
          Complete: "#06B6D4",
          Deleted: "#C2410C",
          Quarantined: "#F59E0B",
          Pending: "#8B5CF6",
          Active: "#3B82F6",
          Inactive: "#64748B",
          Warning: "#F97316",
          Error: "#DC2626",
          Success: "#059669",
          Processing: "#0EA5E9",
          Failed: "#B91C1C",
          Paused: "#A855F7",
          Cancelled: "#71717A",
          Blocked: "#991B1B",
          Approved: "#16A34A",
          Rejected: "#DC2626",
          Cleaning: "#14B8A6",
          Infected: "#C2410C",
        };

        if (!Array.isArray(res)) res = [];

        const isNumeric = res.length > 0 && !isNaN(res[0].value);

        let formattedData;
        if (isNumeric) {
          formattedData = res.map((item, i) => ({
            ...item,
            color: dynamicPalette[i % dynamicPalette.length],
            value: Number(item.value),
          }));
        } else {
          const grouped = res.reduce((acc, curr) => {
            acc[curr.value] = (acc[curr.value] || 0) + 1;
            return acc;
          }, {});

          formattedData = Object.entries(grouped).map(([key, count], i) => ({
            name: key,
            value: count,
            color:
              statusColors[key] || dynamicPalette[i % dynamicPalette.length],
          }));
        }

        setApiData(formattedData);
      } catch (err) {
        console.error("PieChart fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, endpoint, data]);

  const total = useMemo(
    () => apiData.reduce((sum, d) => sum + d.value, 0),
    [apiData]
  );

  return (
    <div className="bg-gray-900 shadow-sm flex flex-col h-full w-full">
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

      {loading ? (
        <div className="mt-3 p-3 w-full flex gap-3 flex-1">
          <div className="flex-shrink-0 w-24 h-24 rounded-full bg-gray-700 animate-pulse" />
          <div className="flex-1 flex flex-col justify-center gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-3 bg-gray-700 rounded w-full animate-pulse"
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {viewMode === "both" && (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Chart Section - Top */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center py-2">
                <div className="w-36 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={apiData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        stroke="none"
                        onClick={(data) => handleOpenModal(data.payload)}
                      >
                        {apiData.map((d, i) => (
                          <Cell key={i} fill={d.color} />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={(v, n) => [`${v}`, n]}
                        contentStyle={{
                          background: "rgba(17, 24, 39, 0.95)",
                          border: "1px solid rgba(55, 65, 81, 0.8)",
                          borderRadius: "8px",
                          fontSize: "14px",
                          color: "#f9fafb",
                          padding: "12px 16px",
                          boxShadow:
                            "0 10px 25px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -2px rgba(0, 0, 0, 0.5)",
                          backdropFilter: "blur(8px)",
                          fontWeight: "500",
                        }}
                        labelStyle={{
                          color: "#d1d5db",
                          fontWeight: "600",
                          marginBottom: "4px",
                          fontSize: "13px",
                        }}
                        itemStyle={{
                          color: "#f9fafb",
                          fontSize: "13px",
                          padding: "2px 0",
                        }}
                        contentWrapper={{
                          outline: "none",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Table Section - Bottom */}
              <div className="flex-1 overflow-hidden flex flex-col min-h-0  pb-2">
                <div className="overflow-y-auto scrollbar-hide ">
                  <table className="w-full">
                    <thead className="sticky top-0 backdrop-blur-sm z-10">
                      <tr className="border-b border-white">
                        <th className="text-left py-1 px-1.5 font-bold text-gray-200 uppercase tracking-wider text-[10px]">
                          Status
                        </th>
                        <th className="text-right py-1 px-1.5 font-bold text-gray-200 uppercase tracking-wider text-[10px]">
                          Count
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiData.map((d) => {
                        const percent = ((d.value / total) * 100).toFixed(1);
                        return (
                          <tr
                            key={d.name}
                            className="border-b border-gray-700/20 hover:bg-gray-800/60 transition-all duration-150 cursor-pointer group"
                            onClick={() => handleOpenModal(d)}
                          >
                            <td className="py-1 px-1.5">
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className="w-2.5 h-2.5 rounded-full transition-all duration-200 shadow-md flex-shrink-0 group-hover:shadow-lg"
                                  style={{ background: d.color }}
                                />
                                <span className="text-gray-300 font-medium truncate text-xs group-hover:text-white transition-colors">
                                  {d.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-1 px-1.5 text-right">
                              <span className="text-xs font-semibold text-gray-200">
                                {d.value}{" "}
                                <span
                                  className="text-[11px] ml-1"
                                  style={{ color: d.color }}
                                >
                                  ({percent}%)
                                </span>
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
          )}

          {/* Chart View Only */}
          {viewMode === "chart" && (
            <div className="flex-1 flex flex-col items-center justify-center p-3 min-h-0">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={apiData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      stroke="none"
                      onClick={(data) => handleOpenModal(data.payload)}
                    >
                      {apiData.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v, n) => [`${v}`, n]}
                      contentStyle={{
                        background: "red",
                        border: "1px solid #374151",
                        borderRadius: 8,
                        fontSize: 12,
                        color: "#f9fafb",
                        padding: "8px 12px",
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.6)",
                      }}
                      contentWrapper={{ outline: "none" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Table View Only */}
          {viewMode === "table" && (
            <div className="flex-1 overflow-hidden flex flex-col min-h-0 p-2">
              <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
                <table className="w-full">
                  <thead className="sticky top-0 backdrop-blur-sm z-10">
                    <tr className="border-b border-gray-700/60">
                      <th className="text-left py-1 px-1.5 font-bold text-gray-200 uppercase tracking-wider text-[12px]">
                        Status
                      </th>
                      <th className="text-right py-1 px-1.5 font-bold text-gray-200 uppercase tracking-wider text-[12px]">
                        Count
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiData.map((d) => {
                      const percent = ((d.value / total) * 100).toFixed(1);
                      return (
                        <tr
                          key={d.name}
                          className="border-b border-gray-700/20 hover:bg-gray-800/60 transition-all duration-150 cursor-pointer group"
                          onClick={() => handleOpenModal(d)}
                        >
                          <td className="py-1 px-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="w-2.5 h-2.5 rounded-full transition-all duration-200 shadow-md flex-shrink-0 group-hover:shadow-lg"
                                style={{ background: d.color }}
                              />
                              <span className="text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                                {d.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-1 px-1.5 text-right">
                            <span className="font-semibold text-gray-200">
                              {d.value}{" "}
                              <span
                                className="text-sm ml-1"
                                style={{ color: d.color }}
                              >
                                ({percent}%)
                              </span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <GenericPopupModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title={title || "Details"}
      >
        <div className="space-y-2">
          {/* {Object.entries(dataToSend).map(([key, value]) => (
            <div key={key} className="text-sm text-gray-300">
              <strong className="text-gray-100">{key}</strong>: {value}
            </div>
          ))} */}
          <Table tableTitle="" showCheckboxes={false} endpoint="" dataPath="" />
        </div>
      </GenericPopupModal>
    </div>
  );
});

export default PieChartComponent;
