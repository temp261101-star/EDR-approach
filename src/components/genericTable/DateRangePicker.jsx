import React, { useState } from "react";
import Swal from "sweetalert2";
import { fetchDataByDateRange } from "../../lib/api";
import { useReportData } from "../../context/DataContext";

export default function DateRangePicker() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { setReportData } = useReportData();

  const handleSubmit = async () => {
    if (!fromDate || !toDate) {
      Swal.fire({
        icon: "warning",
        title: "Missing dates",
        text: "Please select both From and To dates.",
      });
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      Swal.fire({
        icon: "error",
        title: "Invalid range",
        text: "From date cannot be after To date.",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await fetchDataByDateRange(
        "getTableListing",
        fromDate,
        toDate
      );
      setReportData(data);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data fetched successfully!",
      });

      console.log("API response:", data);
      setReportData(data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-lg mx-auto bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 mt-4">
      <h2 className="text-xl font-bold text-white mb-2 text-center">
        Select Date Range
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex flex-col w-full">
          <label className="text-gray-300 mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-1 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition "
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-gray-300 mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-1 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-1 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
          loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-cyan-600 hover:bg-cyan-500"
        }`}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}

