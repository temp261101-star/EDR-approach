import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Table = ({ rowsPerPage, title }) => {
  const data = [
    {
      city: "Mumbai",
      branch: "Andheri",
      atmId: "ATM001",
      oem: "NCR",
      ip: "192.168.1.10",
      drive: 85,
    },
    {
      city: "Delhi",
      branch: "Connaught Place",
      atmId: "ATM002",
      oem: "Diebold",
      ip: "192.168.1.11",
      drive: 65,
    },
    {
      city: "Bangalore",
      branch: "MG Road",
      atmId: "ATM003",
      oem: "Hitachi",
      ip: "192.168.1.12",
      drive: 30,
    },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="bg-[#0B1320] border border-[#9ca2f3] rounded-xl shadow-md w-full h-full flex flex-col">
      <div
        className="p-4
       border-b 
       border-[#1f2a48]
         "
      >
        <h3 className="text-gray-200 font-semibold">{title}</h3>
      </div>

      <div className="flex-grow overflow-y-auto overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="border-b border-b-gray-400 text-gray-300 text-xs uppercase pb-3">
            <tr>
              <th className="px-4 py-2 text-center"></th>
              <th className="px-4 py-2">City</th>
              <th className="px-4 py-2">Branch</th>
              <th className="px-4 py-2">ATM ID</th>
              <th className="px-4 py-2">OEM</th>
              <th className="px-4 py-2">IP Address</th>
              <th className="px-4 py-2">Drive</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((row, index) => (
              <React.Fragment key={index}>
                <tr
                  className="cursor-pointer border-[#1f2a48] hover:bg-[#1c2744] transition"
                  onClick={() => toggleRow(index)}
                >
                  {expandedRow === index ? (
                    <ChevronUp
                      size={16}
                      className="inline-block text-gray-400 mx-6 "
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      className="inline-block text-gray-400 mx-6"
                    />
                  )}

                  <td className="sm:px-4 px-4 py-2">{row.city}</td>
                  <td className="sm:px-4 px-4 py-2">{row.branch}</td>
                  <td className="sm:px-4 px-4 py-2">{row.atmId}</td>
                  <td className="sm:px-4 px-4 py-2">{row.oem}</td>
                  <td className="sm:px-4 px-4 py-2">{row.ip}</td>
                  <td className="sm:px-4 px-4 py-2">
                    <div className="flex items-center">
                      <div className="flex-grow h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            row.drive > 70
                              ? "bg-green-500"
                              : row.drive > 40
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${row.drive}%` }}
                        />
                      </div>
                      <span
                        className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded ${
                          row.drive > 70
                            ? "bg-green-900 text-green-300"
                            : row.drive > 40
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {row.drive}%
                      </span>
                    </div>
                  </td>
                  <td className="sm:px-4 px-4 py-2 text-center"></td>
                </tr>

                {expandedRow === index && row.details && (
                  <tr>
                    <td colSpan={7} className="px-4 py-2 bg-[#0f1a30]">
                      <div className="p-4 border rounded-md shadow-md bg-[#111F37]">
                        <h3 className="font-semibold text-gray-200 mb-2">
                          More Details
                        </h3>
                        <table className="w-full border border-gray-600 text-sm text-gray-300">
                          <thead>
                            <tr>
                              {Object.keys(row.details[0]).map((key) => (
                                <th
                                  key={key}
                                  className="border px-2 py-1 capitalize text-left"
                                >
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {row.details.map((detail, dIndex) => (
                              <tr key={dIndex}>
                                {Object.values(detail).map((val, vIndex) => (
                                  <td key={vIndex} className="border px-2 py-1">
                                    {val}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-[#1f2a48] flex justify-between items-center text-gray-400">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-[#111F37] disabled:opacity-50 hover:bg-[#1f2a48] transition"
        >
          Prev
        </button>
        <span>
          Page <strong className="text-gray-200">{currentPage}</strong> of{" "}
          {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-[#111F37] disabled:opacity-50 hover:bg-[#1f2a48] transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
