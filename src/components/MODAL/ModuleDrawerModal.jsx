import React, { useEffect, useState } from "react";
import {
  XMarkIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const AccordionDrawer = ({ title, options, selected, onChange }) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen((prev) => !prev);

  const handleCheckbox = (option, checked, parentLabel = null) => {
    const updated = { ...selected };

    if (!updated[title]) updated[title] = [];

    if (parentLabel) {
      const parentObjIndex = updated[title].findIndex(
        (o) => typeof o === "object" && o[parentLabel]
      );
      if (parentObjIndex !== -1) {
        const childrenArr = updated[title][parentObjIndex][parentLabel];
        if (checked && !childrenArr.includes(option)) {
          childrenArr.push(option);
        } else if (!checked) {
          updated[title][parentObjIndex][parentLabel] = childrenArr.filter(
            (c) => c !== option
          );

          if (updated[title][parentObjIndex][parentLabel].length === 0) {
            updated[title].splice(parentObjIndex, 1);
          }
        }
      } else if (checked) {
        updated[title].push({ [parentLabel]: [option] });
      }
    } else {
      if (typeof option === "string") {
        if (checked && !updated[title].includes(option)) {
          updated[title].push(option);
        } else if (!checked) {
          updated[title] = updated[title].filter((o) => o !== option);
        }
      } else if (option.label && option.children) {
        if (checked) {
          updated[title].push({ [option.label]: [] });
        } else {
          updated[title] = updated[title].filter(
            (o) => !(typeof o === "object" && o[option.label])
          );
        }
      }
    }

    onChange(updated);
  };

  const getSelectedCount = () => {
    if (!selected[title]) return 0;
    let count = 0;
    selected[title].forEach((item) => {
      if (typeof item === "string") {
        count++;
      } else if (typeof item === "object") {
        Object.values(item).forEach((arr) => (count += arr.length));
      }
    });
    return count;
  };

  const selectedCount = getSelectedCount();

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden">
      <button
        type="button"
        onClick={toggleDrawer}
        className="flex justify-between items-center w-full px-5 py-2 bg-gradient-to-r from-gray-800 to-gray-750 hover:from-gray-750 hover:to-gray-700 transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <div className="text-gray-100 font-semibold text-sm">{title}</div>
          {selectedCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-600 text-cyan-100 border border-cyan-500">
              {selectedCount} selected
            </span>
          )}
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 group-hover:text-gray-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-5 py-4 space-y-3 bg-gray-800 border-t border-gray-700">
          {options.map((opt, idx) =>
            typeof opt === "string" ? (
              <label
                key={idx}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-150 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selected[title]?.includes(opt)}
                    onChange={(e) => handleCheckbox(opt, e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      selected[title]?.includes(opt)
                        ? "bg-cyan-600 border-cyan-600"
                        : "border-gray-500 group-hover:border-gray-400"
                    }`}
                  >
                    {selected[title]?.includes(opt) && (
                      <CheckIcon className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors duration-150">
                  {opt}
                </span>
              </label>
            ) : (
              <div key={idx} className="ml-2">
                <ParentGroup
                  label={opt.label}
                  childrenOptions={opt.children}
                  title={title}
                  selected={selected}
                  handleCheckbox={handleCheckbox}
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

const ParentGroup = ({
  label,
  childrenOptions,
  title,
  selected,
  handleCheckbox,
}) => {
  const [open, setOpen] = useState(false);

  const getSelectedChildrenCount = () => {
    const parentObj = selected[title]?.find(
      (o) => typeof o === "object" && o[label]
    );
    return parentObj ? parentObj[label].length : 0;
  };

  const selectedChildrenCount = getSelectedChildrenCount();

  return (
    <div className="border border-gray-600 rounded-lg overflow-hidden bg-gray-750">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex justify-between items-center w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-150 group"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-200 group-hover:text-gray-100">
            {label}
          </span>
          {selectedChildrenCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-600 text-emerald-100 border border-emerald-500">
              {selectedChildrenCount}
            </span>
          )}
        </div>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 group-hover:text-gray-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-4 py-3 space-y-2 bg-gray-800 border-t border-gray-600">
          {childrenOptions.map((child) => (
            <label
              key={child}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors duration-150 cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selected[title]?.some(
                    (o) => typeof o === "object" && o[label]?.includes(child)
                  )}
                  onChange={(e) =>
                    handleCheckbox(child, e.target.checked, label)
                  }
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    selected[title]?.some(
                      (o) => typeof o === "object" && o[label]?.includes(child)
                    )
                      ? "bg-emerald-600 border-emerald-600"
                      : "border-gray-500 group-hover:border-gray-400"
                  }`}
                >
                  {selected[title]?.some(
                    (o) => typeof o === "object" && o[label]?.includes(child)
                  ) && <CheckIcon className="w-3 h-3 text-white" />}
                </div>
              </div>
              <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-150">
                {child}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ModuleDrawerModal({ isOpen, onClose, onSave, reset }) {
  const [role, setRole] = useState("scope");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSave = () => {
    onSave(selectedOptions);
    onClose();
  };

  useEffect(() => {
    if (reset) {
      setSelectedOptions({});
    }
  }, [reset]);

  if (!isOpen) return null;

  const roleOptions =
   [
    { label: "Manage Scope", key: "scope", icon: "🎯" },
    { label: "Manage Reports", key: "reports", icon: "📊" },
    { label: "Manage Tab", key: "tab", icon: "📋" },
  ];

  const roleDrawers = {
    scope: [
      {
        title: "Dashboard",
        options: [
          "Policy Management",
          "Risk-Wise Dashboard",
          "EPS TSS",
          "TSS Summary",
        ],
      },
      {
        title: "End Point Performance",
        options: [
          "Health Monitoring",
          "CPU Utilization Graph",
          "RAM Graph",
          "Drive Graph",
        ],
      },
      {
        title: "OS Hardening",
        options: [
          {
            label: "Full Hard Drive Encryption",
            children: [
              "Hard Drive Encryption",
              "Add Drive",
              "Drive Encryption Report",
              "Drive Status Report",
            ],
          },
          "Service and Rights Assignment",
          "Create OS Policy",
          "Windows Policy",
          "View Policy",
          "Maintenance Policy Report",
        ],
      },
      {
        title: "End Point Security",
        options: [
          {
            label: "Application Whitelisting",
            children: [
              "Set Mode",
              "View Mode",
              "Add Application",
              "View Application",
              "Manage Blacklisted Application",
              "View Report",
            ],
          },
          {
            label: "Application Blacklisting",
            children: [
              "Add Application",
              "View Application",
              "Manage Whitelisted Application",
              "Blacklist Report",
            ],
          },
          "External USB",
          "Capture Pendrive Copy",
          "Website Restrict",
          "Clipboard Monitoring",
          "Autorun USB",
          "View Autorun USB",
        ],
      },
      {
        title: "Asset Management",
        options: [
          {
            label: "User Asset Mapping",
            children: [
              "Asset Details",
              "Add Domain User",
              "View Domain User",
              "Map User Asset",
              "Multiple Map User Asset",
              "View User Asset Mapping",
              "User Asset Mapping Report",
              "User Wise Report",
              "Device Wise Report",
            ],
          },
          "Unused Assets",
          "Suspicious User Login",
          "Geo-Tagging Location of Asset",
          "Connected Device (Serial / USB)",
          "Compliance Report",
        ],
      },
      {
        title: "Asset Accuracy",
        options: ["Assets Expiry Details"],
      },
      {
        title: "Predictive Analysis",
        options: [
          {
            label: "Print Screen Monitoring",
            children: ["Print Screen Dashboard", "Print Screen Report"],
          },
          {
            label: "Battery Monitoring",
            children: [
              "Dashboard",
              "Battery Summary",
              "Battery Log Report",
              "Battery Report",
            ],
          },
          {
            label: "USB Whitelisting",
            children: [
              "Set Whitelist State",
              "View USB State Mode",
              "View Whitelisted Device",
              "Whitelist Device Report",
              "Add Blacklist Device",
              "View Blacklist Device",
              "Manage Blacklisted Device",
              "Device Access Report",
            ],
          },
          {
            label: "Events Management",
            children: [
              "Dashboard",
              "Windows Event Policy",
              "Pull Event",
              "Pull Event Report",
            ],
          },
          {
            label: "Windows Firewall",
            children: ["All Open Ports"],
          },
          "Bad Sectors Of HDD",
          "I/O Reads & Writes",
          "Network Utilization",
          "USB Access Status",
          "Antivirus Status",
          "Admin Access Control Status",
          "Unexpected Shutdown",
          "Current System Status",
          "Set Wake-On-LAN",
        ],
      },
      {
        title: "Auto Config & Heal",
        options: [
          "Set Parameter for Check Disk",
          "Enable / Disable Features",
          "Computer Event",
          "Batch Script",
          "Custom Script",
          "Add Custom Script",
        ],
      },
      {
        title: "Raised Request",
        options: ["Raised Requests", "View Raised Requests"],
      },
      {
        title: "Helpdesk & Support",
        options: ["Raise Ticket", "Ticket Generation Tool"],
      },
      {
        title: "Chat bot",
        options: ["Login To Chat Bot"],
      },
      {
        title: "Parameter Setting",
        options: [
          "Health Parameter",
          "I/O Thread",
          "Threshold Bad Sector",
          "Service Monitoring",
          "Drive Monitoring",
          "Discover Multiple Devices",
          "Bandwidth Settings",
          "Thread Sleep",
          "Battery Threshold",
          "Manage Module",
          "Parameter History",
          "Add Activity Command",
          "External USB",
          "Capture Pendrive Copy",
          "Website Restrict",
          "Clipboard Monitoring",
          "Windows Event Policy",
          "Create OS Policy",
          "Set Wake-On-LAN",
          "Autorun USB",
        ],
      },
    ],
    "Manage Reports": [
      {
        title: "Health Report",
        options: [
          "CPU Report",
          "RAM Report",

          "Drives Report",
          "Antivirus Report",
          "System Logs Report",
          "LAN Report",
        ],
      },
      {
        policyReports: {
          title: "Policy Reports",
          options: [
            "Application Control Report",
            "Website Control Report",
            "Parameter Changes Report",
            "DLP and Content Report",
            "USB Details Report",
            "USB Copy Content Report",
            "Drive Monitoring Report",
            "Service Monitoring Report",
            "Internet Connection Report",
            "Remote Access Report",
            "Unauthorized Login Report",
            "Particular Machine Report",
            "BadSector Threshold Report",
            "Bandwidth Threshold Report",
            "IO Threshold Report",
            "Install Uninstall Report",
            "Run Command Report",
            "Suspicious User Log Report",
            "Password Log Report",
            "Up Down Log Report",
            "Up Time Report",
            "User Whitelist Report",
          ],
        },
      },
      {
        graphs: {
          title: "Graphs",
          options: [
            "CPU Graph",
            "RAM Graph",
            "Drive Graph",
            "Current CPU Utilization Graph",
            "Antivirus Graph",
            "Up Down Devices Graph",
            "Up Time Graph",
          ],
        },
      },
    ],

    reports: [
      {
        title: "Health Report",
        options: [
          "CPU Report",
          "RAM Report",
          "Drives Report",
          "Antivirus Report",
          "System Logs Report",
          "LAN Report",
        ],
      },
      {
        title: "Policy Reports",
        options: [
          "Application Control Report",
          "Website Control Report",
          "Parameter Changes Report",
          "DLP and Content Report",
          "USB Details Report",
          "USB Copy Content Report",
          "Drive Monitoring Report",
          "Service Monitoring Report",
          "Internet Connection Report",
          "Remote Access Report",
          "Unauthorized Login Report",
          "Particular Machine Report",
          "BadSector Threshold Report",
          "Bandwidth Threshold Report",
          "IO Threshold Report",
          "Install Uninstall Report",
          "Run Command Report",
          "Suspicious User Log Report",
          "Password Log Report",
          "Up Down Log Report",
          "Up Time Report",
          "User Whitelist Report",
        ],
      },
      {
        title: "Compliance Reports",
        options: [
          "IT Asset and H/W Inventory",
          "S/W Inventory Report",
          "Search S/W Inventory Report",
          "S/W Inventory for specific machine Report",
        ],
      },
      {
        title: "Graphs",
        options: [
          "CPU Graph",
          "RAM Graph",
          "Drive Graph",
          "Current CPU Utilization Graph",
          "Antivirus Graph",
          "Up Down Devices Graph",
          "Up Time Graph",
        ],
      },
    ],
    tab: [
      {
        title: "Compliance Reports",
        options: ["PCI DSS", "HIPAA", "ISO 27001"],
      },
    ],
  };
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60  z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-md shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-750 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-100">
              Manage Application User Modules
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Configure user permissions and access controls
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <XMarkIcon className="w-6 h-6 text-gray-400 hover:text-gray-200" />
          </button>
        </div>

        {/* Role Selection */}
        <div className="px-6 py-4 bg-gray-900 border-b border-gray-700">
          <div className="flex flex-wrap gap-3">
            {roleOptions.map((r) => (
              <label
                key={r.key}
                className={`flex items-center gap-3 px-4 py-0.5 rounded-xl border-1 cursor-pointer transition-all duration-200 ${
                  role === r.key
                    ? "border-cyan-500 bg-cyan-600/20 text-cyan-100"
                    : "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-750"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={r.key}
                  checked={role === r.key}
                  onChange={() => setRole(r.key)}
                  className="sr-only"
                />
                <span className="text-lg">{r.icon}</span>
                <span className="font-medium text-sm">{r.label}</span>
                {role === r.key && (
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
          {/* <CHANGE> Added items-start to prevent cards from stretching to match tallest card height */}
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 items-start">
            {roleDrawers[role].map((drawer) => (
              <AccordionDrawer
                key={drawer.title}
                title={drawer.title}
                options={drawer.options}
                selected={selectedOptions}
                onChange={setSelectedOptions}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-2 bg-gray-800 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            {Object.keys(selectedOptions).length > 0 && (
              <span>
                {Object.keys(selectedOptions).length} module
                {Object.keys(selectedOptions).length !== 1 ? "s" : ""}{" "}
                configured
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-1.5 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 hover:border-gray-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-1.5 text-sm font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-500/50 transition-all duration-200 shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
     