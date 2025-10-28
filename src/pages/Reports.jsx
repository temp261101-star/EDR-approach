import React, { useState, useMemo, useEffect } from "react";
import { Search, Calendar, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dummy Data
// const dummyData = [
//   {
//     city: "Mumbai",
//     branch: "Andheri East",
//     atmId: "ATM-1001",
//     oem: "NCR",
//     ip: "192.168.1.42",
//     status: "Active",
//     date: "01-09-2025",
//   },
//   {
//     city: "Delhi",
//     branch: "Connaught Place",
//     atmId: "ATM-1002",
//     oem: "Diebold",
//     ip: "192.168.1.11",
//     status: "Active",
//     date: "02-09-2025",
//   },
//   {
//     city: "Bangalore",
//     branch: "MG Road",
//     atmId: "ATM-1003",
//     oem: "Wincor",
//     ip: "192.168.1.12",
//     status: "Inactive",
//     date: "03-09-2025",
//   },
//   {
//     city: "Chennai",
//     branch: "Anna Nagar",
//     atmId: "ATM-1004",
//     oem: "NCR",
//     ip: "192.168.1.13",
//     status: "Active",
//     date: "04-09-2025",
//   },
//   {
//     city: "Kolkata",
//     branch: "Park Street",
//     atmId: "ATM-1005",
//     oem: "Diebold",
//     ip: "192.168.1.14",
//     status: "Active",
//     date: "05-09-2025",
//   },
// ];

const DatePicker = ({ value, onChange, placeholder, className = "" }) => {
  return (
    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`pl-10 pr-4 py-2 rounded-lg bg-gray-800/60 backdrop-blur-sm border border-gray-700 
                   text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 
                   focus:bg-gray-800 transition-all duration-300 ${className}`}
      />
    </div>
  );
};

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  // Policy Modal States
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [activeTab, setActiveTab] = useState("assign");
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [individualPolicies, setIndividualPolicies] = useState({});
  const [policySearchTerm, setPolicySearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://192.168.0.139:3000/api/policies", {
      method: "GET",
      headers: { "Cache-Control": "no-cache" },
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // Available EDR Policies
  const availablePolicies = [
    {
      id: "pol-001",
      name: "High Security Policy",
      description: "Maximum protection with real-time monitoring",
      level: "Critical",
    },
    {
      id: "pol-002",
      name: "Standard Security Policy",
      description: "Balanced security for daily operations",
      level: "Standard",
    },
    {
      id: "pol-003",
      name: "ATM Compliance Policy",
      description: "PCI-DSS compliant security measures",
      level: "Compliance",
    },
    {
      id: "pol-004",
      name: "Ransomware Protection",
      description: "Advanced ransomware detection and prevention",
      level: "Critical",
    },
    {
      id: "pol-005",
      name: "Network Monitoring Policy",
      description: "Comprehensive network traffic analysis",
      level: "Standard",
    },
    {
      id: "pol-006",
      name: "USB Device Control",
      description: "Restrict unauthorized USB device access",
      level: "Standard",
    },
    {
      id: "pol-007",
      name: "Application Whitelisting",
      description: "Allow only approved applications",
      level: "High",
    },
    {
      id: "pol-008",
      name: "Endpoint Encryption",
      description: "Full disk encryption policy",
      level: "Critical",
    },
  ];

  // Parse date function to handle different date formats
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes("-") && dateStr.split("-")[0].length === 2) {
      const [day, month, year] = dateStr.split("-");
      return new Date(year, month - 1, day);
    }
    return new Date(dateStr);
  };

  const formatDate = (dateStr) => {
    const date = parseDate(dateStr);
    if (!date) return dateStr;
    return date.toLocaleDateString("en-GB");
  };

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const filteredData = useMemo(() => {
    let filtered = data;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter((row) =>
        columns.some((col) => String(row[col]).toLowerCase().includes(lower))
      );
    }

    if (dateFrom || dateTo) {
      filtered = filtered.filter((row) => {
        const rowDate = parseDate(row.date);
        if (!rowDate) return false;

        const fromDate = dateFrom ? new Date(dateFrom) : null;
        const toDate = dateTo ? new Date(dateTo) : null;

        if (fromDate && toDate) {
          return rowDate >= fromDate && rowDate <= toDate;
        } else if (fromDate) {
          return rowDate >= fromDate;
        } else if (toDate) {
          return rowDate <= toDate;
        }
        return true;
      });
    }

    return filtered;
  }, [data, searchTerm, columns, dateFrom, dateTo]);

  const { paginatedData, totalPages, totalItems } = useMemo(() => {
    let dataToProcess = filteredData;

    if (sortConfig.key) {
      dataToProcess = [...dataToProcess].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === "date") {
          aVal = parseDate(aVal);
          bVal = parseDate(bVal);
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    const totalItems = dataToProcess.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = dataToProcess.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return { paginatedData, totalPages, totalItems };
  }, [filteredData, sortConfig, currentPage, itemsPerPage]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const toggleRow = (index) => {
    const globalIndex = (currentPage - 1) * itemsPerPage + index;
    setSelectedRows((prev) =>
      prev.includes(globalIndex)
        ? prev.filter((i) => i !== globalIndex)
        : [...prev, globalIndex]
    );
  };

  const toggleAll = () => {
    const currentPageIndices = paginatedData.map(
      (_, i) => (currentPage - 1) * itemsPerPage + i
    );
    const allSelected = currentPageIndices.every((index) =>
      selectedRows.includes(index)
    );

    if (allSelected) {
      setSelectedRows((prev) =>
        prev.filter((index) => !currentPageIndices.includes(index))
      );
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...currentPageIndices])]);
    }
  };

  const clearDateFilter = () => {
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  // Policy Management Functions
  // const handleOpenPolicyModal = () => {
  //   setShowPolicyModal(true);
  //   setActiveTab("assign");
  //   setSelectedPolicy("");
  //   const initialPolicies = {};
  //   selectedRows.forEach(rowIndex => {
  //     const device = filteredData[rowIndex];
  //     if (device) {
  //       initialPolicies[device.ip] = "";
  //     }
  //   });
  //   setIndividualPolicies(initialPolicies);
  // };
  const navigate = useNavigate();

  const handleOpenPolicyModal = () => {
    const selectedDevices = selectedRows.map((index) => filteredData[index]);
    const ips = selectedDevices.map((dev) => dev.ip);
    navigate("/dashboard/policy-setup", { state: { selectedIPs: ips } });
  };

  const handleClosePolicyModal = () => {
    setShowPolicyModal(false);
    setSelectedPolicy("");
    setIndividualPolicies({});
    setPolicySearchTerm("");
  };

  const handleApplyPolicies = () => {
    if (activeTab === "assign") {
      if (!selectedPolicy) {
        alert("Please select a policy to apply");
        return;
      }
      const selectedDevices = selectedRows.map((index) => filteredData[index]);
      console.log("Applying policy to devices:", {
        policy: availablePolicies.find((p) => p.id === selectedPolicy),
        devices: selectedDevices,
      });
      alert(
        `Successfully applied policy to ${selectedDevices.length} device(s)`
      );
    } else {
      const assignments = Object.entries(individualPolicies).filter(
        ([_, policyId]) => policyId
      );
      if (assignments.length === 0) {
        alert("Please assign at least one policy");
        return;
      }
      console.log("Applying individual policies:", assignments);
      alert(`Successfully applied policies to ${assignments.length} device(s)`);
    }
    handleClosePolicyModal();
    setSelectedRows([]);
  };

  const filteredPolicies = availablePolicies.filter(
    (policy) =>
      policy.name.toLowerCase().includes(policySearchTerm.toLowerCase()) ||
      policy.description.toLowerCase().includes(policySearchTerm.toLowerCase())
  );

  const getSelectedDevices = () => {
    return selectedRows.map((index) => filteredData[index]).filter(Boolean);
  };

  const hasActiveFilters = searchTerm || dateFrom || dateTo;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-900 rounded-lg shadow-2xl border border-gray-600 overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-black px-4 sm:px-6 py-4 border-b border-gray-600">
        <div className="absolute inset-0 bg-gray-800/20 backdrop-blur-sm"></div>
        <div className="relative flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
              ATM Reports
            </h2>
            <span className="px-2 py-1 bg-gray-700/60 rounded-full text-xs text-gray-300 font-medium">
              {totalItems} records
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-48">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 rounded-lg bg-gray-800/60 backdrop-blur-sm border border-gray-700 
                           text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-cyan-500 focus:bg-gray-800 transition-all duration-300 text-sm w-full"
                />
              </div>

              <button
                onClick={() => setShowDateFilter(!showDateFilter)}
                className={`px-3 py-2 rounded-lg backdrop-blur-sm border text-sm font-medium transition-all duration-300 
                           flex items-center gap-2 ${
                             showDateFilter || dateFrom || dateTo
                               ? "bg-cyan-600/20 border-cyan-600/50 text-cyan-400"
                               : "bg-gray-800/60 border-gray-700 text-gray-300 hover:bg-gray-700"
                           }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-2 rounded-lg bg-cyan-600/80 hover:bg-cyan-500 backdrop-blur-sm border border-cyan-600/30 text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                PDF
              </button>
              <button className="px-3 py-2 rounded-lg bg-cyan-600/80 hover:bg-cyan-500 backdrop-blur-sm border border-cyan-600/30 text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Excel
              </button>
            </div>
          </div>
        </div>

        {showDateFilter && (
          <div className="relative mt-4 p-4 bg-gray-800/40 backdrop-blur-sm rounded-lg border border-gray-700">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    From Date
                  </label>
                  <DatePicker
                    value={dateFrom}
                    onChange={(value) => {
                      setDateFrom(value);
                      setCurrentPage(1);
                    }}
                    placeholder="Select from date"
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    To Date
                  </label>
                  <DatePicker
                    value={dateTo}
                    onChange={(value) => {
                      setDateTo(value);
                      setCurrentPage(1);
                    }}
                    placeholder="Select to date"
                    className="w-full"
                  />
                </div>
              </div>
              <button
                onClick={clearDateFilter}
                disabled={!dateFrom && !dateTo}
                className="px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-900/30 text-cyan-300 rounded-full text-xs">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:text-cyan-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(dateFrom || dateTo) && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-900/30 text-cyan-300 rounded-full text-xs">
                Date: {dateFrom || "Start"} → {dateTo || "End"}
                <button
                  onClick={clearDateFilter}
                  className="hover:text-cyan-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto bg-gray-900">
        <table className="w-full border-collapse min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600">
              <th className="py-3 px-2 sm:px-3 text-center w-12">
                <label className="relative inline-block">
                  <input
                    type="checkbox"
                    onChange={toggleAll}
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((_, i) =>
                        selectedRows.includes(
                          (currentPage - 1) * itemsPerPage + i
                        )
                      )
                    }
                    className="sr-only"
                  />
                  <div className="w-4 h-4 bg-gray-700 border border-gray-500 rounded flex items-center justify-center cursor-pointer hover:border-cyan-400 transition-colors">
                    {paginatedData.length > 0 &&
                      paginatedData.every((_, i) =>
                        selectedRows.includes(
                          (currentPage - 1) * itemsPerPage + i
                        )
                      ) && (
                        <svg
                          className="w-3 h-3 text-cyan-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                  </div>
                </label>
              </th>
              <th className="py-3 px-2 sm:px-3 text-center w-12 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="py-3 px-2 sm:px-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:text-cyan-400 transition-colors"
                  onClick={() => handleSort(col)}
                >
                  <div className="flex items-center gap-1">
                    <span className="truncate">
                      {col === "atmId"
                        ? "ATM ID"
                        : col === "oem"
                        ? "OEM"
                        : col === "ip"
                        ? "IP Address"
                        : col
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                    </span>
                    <svg
                      className={`w-3 h-3 flex-shrink-0 ${
                        sortConfig.key === col
                          ? "text-cyan-400"
                          : "text-gray-500"
                      } transform ${
                        sortConfig.key === col &&
                        sortConfig.direction === "desc"
                          ? "rotate-180"
                          : ""
                      } transition-all`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {paginatedData.map((row, i) => (
              <tr
                key={i}
                className={`group transition-all duration-200 hover:bg-gray-800 ${
                  selectedRows.includes((currentPage - 1) * itemsPerPage + i)
                    ? "bg-gray-800 shadow-sm border-l-2 border-cyan-400"
                    : i % 2 === 0
                    ? "bg-gray-900"
                    : "bg-gray-850"
                }`}
              >
                <td className="py-3 px-2 sm:px-3 text-center">
                  <label className="relative inline-block">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(
                        (currentPage - 1) * itemsPerPage + i
                      )}
                      onChange={() => toggleRow(i)}
                      className="sr-only"
                    />
                    <div className="w-4 h-4 bg-gray-700 border border-gray-500 rounded flex items-center justify-center cursor-pointer hover:border-cyan-400 transition-colors">
                      {selectedRows.includes(
                        (currentPage - 1) * itemsPerPage + i
                      ) && (
                        <svg
                          className="w-3 h-3 text-cyan-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </label>
                </td>
                <td className="py-3 px-2 sm:px-3 text-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-700 text-gray-300 rounded-full text-xs font-medium">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </span>
                </td>
                {columns.map((col) => (
                  <td
                    key={col}
                    className="py-3 px-2 sm:px-3 text-gray-200 text-sm"
                  >
                    <div className="flex items-center">
                      <span
                        className={`truncate ${
                          col === "enabled"
                            ? row[col]
                              ? "text-green-400 bg-green-900/30 px-2 py-1 rounded-full text-xs font-medium"
                              : "text-red-400 bg-red-900/30 px-2 py-1 rounded-full text-xs font-medium"
                            : col === "ip"
                            ? "text-gray-300 text-xs"
                            : ""
                        }`}
                      >
                        {col === "enabled"
                          ? row[col]
                            ? "Enabled"
                            : "Disabled"
                          : col === "date"
                          ? formatDate(row[col])
                          : String(row[col] ?? "")}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}

            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium text-lg">
                        No records found
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        {hasActiveFilters
                          ? "Try adjusting your filters"
                          : "No data available"}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      <div className="px-4 sm:px-6 py-3 bg-gray-800 border-t border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-sm text-gray-400">
              {totalItems > 0 ? (
                <>
                  Showing{" "}
                  {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}{" "}
                  to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems} results
                </>
              ) : (
                "No results to display"
              )}
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 bg-gray-700 border border-gray-600 text-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded transition-colors"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded transition-colors"
              >
                Prev
              </button>

              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      currentPage === pageNum
                        ? "bg-cyan-600 text-white"
                        : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded transition-colors"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded transition-colors"
              >
                Last
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Selection footer */}
      {selectedRows.length > 0 && (
        <div className="px-4 sm:px-6 py-2 bg-gray-800 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-sm text-gray-300">
              <strong>{selectedRows.length}</strong> record
              {selectedRows.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleOpenPolicyModal}
                className="px-3 py-1 text-xs bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Assign Policies
              </button>
              <button
                className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                onClick={() => setSelectedRows([])}
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Policy Assignment Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Policy Assignment
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Assign security policies to {selectedRows.length} selected
                    device{selectedRows.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={handleClosePolicyModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700 bg-gray-800/50">
              <button
                onClick={() => setActiveTab("assign")}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "assign"
                    ? "text-cyan-400 border-b-2 border-cyan-400 bg-gray-800"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Same Policy for All
                </div>
              </button>
              <button
                onClick={() => setActiveTab("individual")}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "individual"
                    ? "text-cyan-400 border-b-2 border-cyan-400 bg-gray-800"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                  Individual Policies
                </div>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "assign" ? (
                <div className="space-y-6">
                  {/* Selected Devices Summary */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">
                      Selected Devices
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {getSelectedDevices().map((device, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-gray-400 bg-gray-800 rounded px-3 py-2"
                        >
                          <svg
                            className="w-4 h-4 text-cyan-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                            />
                          </svg>
                          <span className="font-mono">{device.ip}</span>
                          <span className="text-gray-500">•</span>
                          <span>{device.atmId}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Policy Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search policies..."
                      value={policySearchTerm}
                      onChange={(e) => setPolicySearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Policy Selection */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">
                      Select Policy
                    </h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                      {filteredPolicies.map((policy) => (
                        <label
                          key={policy.id}
                          className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedPolicy === policy.id
                              ? "border-cyan-500 bg-cyan-900/20"
                              : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="policy"
                              value={policy.id}
                              checked={selectedPolicy === policy.id}
                              onChange={(e) =>
                                setSelectedPolicy(e.target.value)
                              }
                              className="mt-1 w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 focus:ring-cyan-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white">
                                  {policy.name}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    policy.level === "Critical"
                                      ? "bg-red-900/30 text-red-400"
                                      : policy.level === "High"
                                      ? "bg-orange-900/30 text-orange-400"
                                      : policy.level === "Compliance"
                                      ? "bg-purple-900/30 text-purple-400"
                                      : "bg-blue-900/30 text-blue-400"
                                  }`}
                                >
                                  {policy.level}
                                </span>
                              </div>
                              <p className="text-sm text-gray-400 mt-1">
                                {policy.description}
                              </p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Individual Policy Assignment */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">
                      Individual Policy Assignment
                    </h4>
                    <p className="text-xs text-gray-400">
                      Assign different policies to each device based on specific
                      requirements
                    </p>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {getSelectedDevices().map((device, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <svg
                            className="w-4 h-4 text-cyan-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                            />
                          </svg>
                          <span className="font-mono text-sm text-gray-200">
                            {device.ip}
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="text-sm text-gray-400">
                            {device.atmId}
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="text-sm text-gray-400">
                            {device.city}
                          </span>
                        </div>
                        <select
                          value={individualPolicies[device.ip] || ""}
                          onChange={(e) =>
                            setIndividualPolicies((prev) => ({
                              ...prev,
                              [device.ip]: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="">Select a policy...</option>
                          {availablePolicies.map((policy) => (
                            <option key={policy.id} value={policy.id}>
                              {policy.name} ({policy.level})
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-700 bg-gray-800/50 flex justify-end gap-3">
              <button
                onClick={handleClosePolicyModal}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyPolicies}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Apply Policies
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
