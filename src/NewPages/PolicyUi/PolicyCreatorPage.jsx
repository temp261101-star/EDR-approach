import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, SquarePen, Trash2, Download } from "lucide-react";

export default function PolicyCreatorPage() {
  const [showExceptionForm, setShowExceptionForm] = useState(false);
  const [exceptionFormData, setExceptionFormData] = useState(null);

  const [selectedExceptions, setSelectedExceptions] = useState([]);

  const toggleSelectException = (id) => {
    setSelectedExceptions((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  };

  const handleSaveException = () => {
    updateCurrent((p) => {
      if (!p.exceptions) p.exceptions = [];

      const index = p.exceptions.findIndex(
        (x) => x.id === exceptionFormData.id
      );
      if (index >= 0) p.exceptions[index] = exceptionFormData;
      else p.exceptions.push(exceptionFormData);

      return p;
    });

    setShowExceptionForm(false);
    setExceptionFormData(null);
  };

  const handleCloseException = () => {
    setShowExceptionForm(false);
    setExceptionFormData(null);
  };

  const [dark, setDark] = useState(true);

  // Tabs
  const tabs = [
    { id: "general", label: "General" },
    { id: "rules", label: "Rules" },
    { id: "notifications", label: "Notifications" },
    { id: "matrix", label: "Matrix Table" },    
    { id: "exceptions", label: "exceptions" },
    { id: "preview", label: "Preview & Submit" },
    
  ];

  const [activeTab, setActiveTab] = useState("general");

  // Form state for a single policy (we'll allow creating multiple policies by repeating this structure)
  const blankPolicy = {
    id: Date.now(),
    name: "",
    description: "",
    active: true,
    priority: 1,
    effectiveFrom: "",
    effectiveTo: "",
    owner: "",
    ownerOptionsSource: "api",
    ownerFromFrontend: "Team A",
    ownerFromApi: "",
    numericLimit: 50,
    rangeValue: 25,
    color: "#0ea5e9",
    notifications: {
      email: {
        enabled: false,
        recipients: ["ops@example.com"],
        selectAll: false,
      },
      sms: { enabled: false, recipients: [] },
    },
    rules: [{ id: 1, key: "rule-1", value: "allow" }],
    matrix: {
      columns: [
        { id: "col1", label: "Attribute" },
        { id: "col2", label: "Value" },
      ],
      rows: [{ id: "r1", values: { col1: "ip", col2: "10.0.0.1" } }],
    },
  };

  const [policies, setPolicies] = useState([
    JSON.parse(JSON.stringify(blankPolicy)),
  ]);
  const [selectedPolicyIndex, setSelectedPolicyIndex] = useState(0);

  // API select options (simulate with jsonplaceholder users)
  const [apiOptions, setApiOptions] = useState([]);
  useEffect(() => {
    let mounted = true;
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setApiOptions(
          data.map((u) => ({ value: u.id, label: u.name + " (API)" }))
        );
      })
      .catch(() => {
        if (!mounted) return;
        setApiOptions([]);
      });
    return () => (mounted = false);
  }, []);

  const frontendOwners = useMemo(
    () => [
      { value: "team-a", label: "Team A (Frontend)" },
      { value: "team-b", label: "Team B (Frontend)" },
      { value: "team-c", label: "Team C (Frontend)" },
    ],
    []
  );

  // Helpers to update current policy
  const updateCurrent = (updater) => {
    setPolicies((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[selectedPolicyIndex] = updater(copy[selectedPolicyIndex]);
      return copy;
    });
  };

  const addPolicy = () => {
    setPolicies((prev) => [
      ...prev,
      { ...JSON.parse(JSON.stringify(blankPolicy)), id: Date.now() },
    ]);
    // go to new
    setSelectedPolicyIndex(policies.length);
  };

  const removePolicy = (idx) => {
    setPolicies((prev) => prev.filter((_, i) => i !== idx));
    setSelectedPolicyIndex((s) => Math.max(0, s - 1));
  };

  // Table helpers
  const addColumn = (label = "New") => {
    updateCurrent((p) => {
      const id = "col" + Date.now();
      p.matrix.columns.push({ id, label });
      // add empty value to each row
      p.matrix.rows.forEach((r) => (r.values[id] = ""));
      return p;
    });
  };

  const addRow = () => {
    updateCurrent((p) => {
      const id = "r" + Date.now();
      const values = {};
      p.matrix.columns.forEach((c) => (values[c.id] = ""));
      p.matrix.rows.push({ id, values });
      return p;
    });
  };

  const updateCell = (rowId, colId, value) => {
    updateCurrent((p) => {
      const r = p.matrix.rows.find((x) => x.id === rowId);
      if (r) r.values[colId] = value;
      return p;
    });
  };

  const removeColumn = (colId) => {
    updateCurrent((p) => {
      p.matrix.columns = p.matrix.columns.filter((c) => c.id !== colId);
      p.matrix.rows.forEach((r) => delete r.values[colId]);
      return p;
    });
  };

  const removeRow = (rowId) => {
    updateCurrent((p) => {
      p.matrix.rows = p.matrix.rows.filter((r) => r.id !== rowId);
      return p;
    });
  };

  // Master checkbox for email recipients
  const toggleEmailSelectAll = (checked) => {
    updateCurrent((p) => {
      p.notifications.email.selectAll = checked;
      if (checked) {
        // if selecting all, copy recipients from a sample list
        p.notifications.email.recipients = [
          "ops@example.com",
          "security@example.com",
        ];
      } else {
        p.notifications.email.recipients = [];
      }
      return p;
    });
  };

  // Inline editable cell component
  function InlineEdit({ value: initial, onSave, small }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(initial ?? "");
    useEffect(() => setValue(initial ?? ""), [initial]);
    return (
      <div className="min-w-[70px]">
        {editing ? (
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
              setEditing(false);
              onSave(value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditing(false);
                onSave(value);
              }
            }}
            className={`w-full px-2 py-1 rounded text-sm bg-white/90 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600`}
          />
        ) : (
          <div
            onClick={() => setEditing(true)}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setEditing(true)}
            className={`cursor-text text-sm truncate px-2 py-1 rounded hover:bg-slate-100/60 dark:hover:bg-slate-800/60`}
            title={value}
          >
            {value || <span className="text-slate-400">—</span>}
          </div>
        )}
      </div>
    );
  }

  const current = policies[selectedPolicyIndex];

  // Submit all policies as single JSON
  const [submitResult, setSubmitResult] = useState(null);
  const handleSubmit = () => {
    const payload = { policies };
    // for demo, we just stringify and show result
    setSubmitResult(JSON.stringify(payload, null, 2));
  };

  return (
    <div
      className={`${
        dark ? "dark" : ""
      } min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6`}
    >
      <div className="max-full mx-11">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            Policy Creator
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={addPolicy}
              className="flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-600 text-white"
            >
              <Plus size={14} /> Add Policy
            </button>
          </div>
        </header>

        <div className="bg-white/80 dark:bg-slate-800/70 rounded-2xl shadow p-4">
          <div className="flex items-start gap-4">
            {/* Left: policy selector */}
            <aside className="w-52 pr-3 border-r border-slate-200 dark:border-slate-700">
              <div className="space-y-2">
                {policies.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPolicyIndex(idx)}
                    className={`w-full text-left rounded-md p-2 text-sm flex items-center justify-between ${
                      idx === selectedPolicyIndex
                        ? "bg-indigo-600 text-white"
                        : "hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className="truncate">
                      {p.name || `Policy ${idx + 1}`}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removePolicy(idx);
                        }}
                        title="Remove"
                        className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            {/* Main area */}
            <main className="flex-1">
              {/* Tabs */}
              <nav className="flex gap-2 mb-3 items-center">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      activeTab === t.id
                        ? "bg-slate-100 dark:bg-slate-700"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </nav>

              <div className="rounded-lg p-3">
                <AnimatePresence mode="wait">
                  {activeTab === "general" && (
                    // <motion.section key="general" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}>
                    //   <div className="grid grid-cols-12 gap-3">
                    //     <div className="col-span-6">
                    //       <label className="block text-xs font-medium mb-1">Policy Name</label>
                    //       <input value={current.name}
                    //         onChange={(e) => updateCurrent(p => ({ ...p, name: e.target.value }))}
                    //         className="w-full px-2 py-2 rounded text-sm bg-white dark:bg-slate-700 border dark:border-slate-600" />

                    //       <label className="block text-xs font-medium mt-3 mb-1">Description</label>
                    //       <textarea value={current.description}
                    //         onChange={(e) => updateCurrent(p => ({ ...p, description: e.target.value }))}
                    //         rows={3}
                    //         className="w-full px-2 py-2 rounded text-sm bg-white dark:bg-slate-700 border dark:border-slate-600" />

                    //       <div className="flex gap-2 mt-3">
                    //         <div className="flex items-center gap-2">
                    //           <input id="active" type="checkbox" checked={current.active}
                    //             onChange={(e) => updateCurrent(p => ({ ...p, active: e.target.checked }))}
                    //             className="accent-indigo-600" />
                    //           <label htmlFor="active" className="text-sm">Active</label>
                    //         </div>

                    //         <div className="flex items-center gap-2">
                    //           <label className="text-sm">Priority</label>
                    //           <input type="number" value={current.priority}
                    //             onChange={(e) => updateCurrent(p => ({ ...p, priority: Number(e.target.value) }))}
                    //             className="w-20 px-2 py-1 rounded text-sm bg-white dark:bg-slate-700 border dark:border-slate-600" />
                    //         </div>

                    //         <div className="flex items-center gap-2">
                    //           <label className="text-sm">Range</label>
                    //           <input type="range" min={0} max={100} value={current.rangeValue}
                    //             onChange={(e) => updateCurrent(p => ({ ...p, rangeValue: Number(e.target.value) }))}
                    //             className="w-40" />
                    //           <div className="text-xs w-10 text-right">{current.rangeValue}</div>
                    //         </div>
                    //       </div>

                    //     </div>

                    //     <div className="col-span-6">
                    //       <label className="block text-xs font-medium mb-1">Owner (Source)</label>
                    //       <div className="flex gap-2">
                    //         <select value={current.ownerOptionsSource} onChange={(e) => updateCurrent(p => ({ ...p, ownerOptionsSource: e.target.value }))}
                    //           className="px-2 py-1 rounded text-sm bg-white dark:bg-slate-700 border dark:border-slate-600">
                    //           <option value="api">API</option>
                    //           <option value="frontend">Frontend</option>
                    //         </select>

                    //         <div className="flex-1">
                    //           {current.ownerOptionsSource === "api" ? (
                    //             <select value={current.ownerFromApi} onChange={(e) => updateCurrent(p => ({ ...p, ownerFromApi: e.target.value }))}
                    //               className="w-full px-2 py-1 rounded text-sm bg-white dark:bg-slate-700 border dark:border-slate-600">
                    //               <option value="">Select owner (API)</option>
                    //               {apiOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    //             </select>
                    //           ) : (
                    //             <select value={current.ownerFromFrontend} onChange={(e) => updateCurrent(p => ({ ...p, ownerFromFrontend: e.target.value }))}
                    //               className="w-full px-2 py-1 rounded text-sm bg-white dark:bg-slate-700 border dark:border-slate-600">
                    //               {frontendOwners.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    //             </select>
                    //           )}
                    //         </div>
                    //       </div>

                    //       <label className="block text-xs font-medium mt-3 mb-1">Effective From / To</label>
                    //       <div className="flex gap-2">
                    //         <input type="date" value={current.effectiveFrom}
                    //           onChange={(e) => updateCurrent(p => ({ ...p, effectiveFrom: e.target.value }))}
                    //           className="px-2 py-1 rounded text-sm bg-white dark:bg-slate-700 border dark:border-slate-600" />
                    //         <input type="date" value={current.effectiveTo}
                    //           onChange={(e) => updateCurrent(p => ({ ...p, effectiveTo: e.target.value }))}
                    //           className="px-2 py-1 rounded text-sm bg-white dark:bg-slate-700 border dark:border-slate-600" />
                    //       </div>

                    //       <label className="block text-xs font-medium mt-3 mb-1">Color / Limit</label>
                    //       <div className="flex gap-2 items-center">
                    //         <input type="color" value={current.color}
                    //           onChange={(e) => updateCurrent(p => ({ ...p, color: e.target.value }))}
                    //           className="w-12 h-8 p-0 border rounded" />
                    //         <input type="number" value={current.numericLimit}
                    //           onChange={(e) => updateCurrent(p => ({ ...p, numericLimit: Number(e.target.value) }))}
                    //           className="px-2 py-1 rounded text-sm bg-white dark:bg-slate-700 border dark:border-slate-600" />
                    //       </div>

                    //     </div>
                    //   </div>
                    // </motion.section>
                    <motion.section
                      key="general"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8"
                    >
                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-6 space-y-6">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                              Policy Name
                            </label>
                            <input
                              value={current.name}
                              onChange={(e) =>
                                updateCurrent((p) => ({
                                  ...p,
                                  name: e.target.value,
                                }))
                              }
                              className="w-full px-4 py-3 rounded-lg text-sm bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/20 transition-all outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                              Description
                            </label>
                            <textarea
                              value={current.description}
                              onChange={(e) =>
                                updateCurrent((p) => ({
                                  ...p,
                                  description: e.target.value,
                                }))
                              }
                              rows={3}
                              className="w-full px-4 py-3 rounded-lg text-sm bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/20 transition-all outline-none resize-none"
                            />
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-5 space-y-4">
                            <div className="flex items-center gap-3">
                              <input
                                id="active"
                                type="checkbox"
                                checked={current.active}
                                onChange={(e) =>
                                  updateCurrent((p) => ({
                                    ...p,
                                    active: e.target.checked,
                                  }))
                                }
                                className="w-5 h-5 rounded accent-indigo-600 cursor-pointer"
                              />
                              <label
                                htmlFor="active"
                                className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                              >
                                Active
                              </label>
                            </div>

                            <div className="flex items-center gap-3">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Priority
                              </label>
                              <input
                                type="number"
                                value={current.priority}
                                onChange={(e) =>
                                  updateCurrent((p) => ({
                                    ...p,
                                    priority: Number(e.target.value),
                                  }))
                                }
                                className="w-24 px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/20 transition-all outline-none"
                              />
                            </div>

                            <div className="flex items-center gap-3">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Range
                              </label>
                              <input
                                type="range"
                                min={0}
                                max={100}
                                value={current.rangeValue}
                                onChange={(e) =>
                                  updateCurrent((p) => ({
                                    ...p,
                                    rangeValue: Number(e.target.value),
                                  }))
                                }
                                className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                              />
                              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-12 text-right">
                                {current.rangeValue}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-6 space-y-6">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                              Owner (Source)
                            </label>
                            <div className="flex gap-3">
                              <select
                                value={current.ownerOptionsSource}
                                onChange={(e) =>
                                  updateCurrent((p) => ({
                                    ...p,
                                    ownerOptionsSource: e.target.value,
                                  }))
                                }
                                className="px-4 py-3 rounded-lg text-sm bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/20 transition-all outline-none cursor-pointer"
                              >
                                <option value="api">API</option>
                                <option value="frontend">Frontend</option>
                              </select>

                              <div className="flex-1">
                                {current.ownerOptionsSource === "api" ? (
                                  <select
                                    value={current.ownerFromApi}
                                    onChange={(e) =>
                                      updateCurrent((p) => ({
                                        ...p,
                                        ownerFromApi: e.target.value,
                                      }))
                                    }
                                    className="w-full px-4 py-3 rounded-lg text-sm bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/20 transition-all outline-none cursor-pointer"
                                  >
                                    <option value="">Select owner (API)</option>
                                    {apiOptions.map((o) => (
                                      <option key={o.value} value={o.value}>
                                        {o.label}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <select
                                    value={current.ownerFromFrontend}
                                    onChange={(e) =>
                                      updateCurrent((p) => ({
                                        ...p,
                                        ownerFromFrontend: e.target.value,
                                      }))
                                    }
                                    className="w-full px-4 py-3 rounded-lg text-sm bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/20 transition-all outline-none cursor-pointer"
                                  >
                                    {frontendOwners.map((o) => (
                                      <option key={o.value} value={o.value}>
                                        {o.label}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                              Effective From / To
                            </label>
                            <div className="flex gap-3">
                              <input
                                type="date"
                                value={current.effectiveFrom}
                                onChange={(e) =>
                                  updateCurrent((p) => ({
                                    ...p,
                                    effectiveFrom: e.target.value,
                                  }))
                                }
                                className="flex-1 px-4 py-3 rounded-lg text-sm bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/20 transition-all outline-none"
                              />
                              <input
                                type="date"
                                value={current.effectiveTo}
                                onChange={(e) =>
                                  updateCurrent((p) => ({
                                    ...p,
                                    effectiveTo: e.target.value,
                                  }))
                                }
                                className="flex-1 px-4 py-3 rounded-lg text-sm bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/20 transition-all outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                              Color / Limit
                            </label>
                            <div className="flex gap-3 items-center">
                              <input
                                type="color"
                                value={current.color}
                                onChange={(e) =>
                                  updateCurrent((p) => ({
                                    ...p,
                                    color: e.target.value,
                                  }))
                                }
                                className="w-16 h-12 p-1 border-2 border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer"
                              />
                              <input
                                type="number"
                                value={current.numericLimit}
                                onChange={(e) =>
                                  updateCurrent((p) => ({
                                    ...p,
                                    numericLimit: Number(e.target.value),
                                  }))
                                }
                                className="flex-1 px-4 py-3 rounded-lg text-sm bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/20 transition-all outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.section>
                  )}

                  {activeTab === "rules" && (
                    <motion.section
                      key="rules"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium">Rules</h3>
                          <button
                            onClick={() =>
                              updateCurrent((p) => ({
                                ...p,
                                rules: [
                                  ...p.rules,
                                  { id: Date.now(), key: "", value: "" },
                                ],
                              }))
                            }
                            className="ml-auto px-2 py-1 rounded bg-emerald-600 text-white text-sm flex items-center gap-2"
                          >
                            <Plus size={14} /> Add rule
                          </button>
                        </div>

                        <div className="grid gap-2">
                          {current.rules.map((r, i) => (
                            <div
                              key={r.id}
                              className="grid grid-cols-12 gap-2 items-center"
                            >
                              <div className="col-span-5">
                                <input
                                  value={r.key}
                                  onChange={(e) =>
                                    updateCurrent((p) => {
                                      p.rules[i].key = e.target.value;
                                      return p;
                                    })
                                  }
                                  placeholder="Key"
                                  className="w-full px-2 py-1 rounded text-sm bg-white dark:bg-slate-700 border dark:border-slate-600"
                                />
                              </div>
                              <div className="col-span-5">
                                <input
                                  value={r.value}
                                  onChange={(e) =>
                                    updateCurrent((p) => {
                                      p.rules[i].value = e.target.value;
                                      return p;
                                    })
                                  }
                                  placeholder="Value"
                                  className="w-full px-2 py-1 rounded text-sm bg-white dark:bg-slate-700 border dark:border-slate-600"
                                />
                              </div>
                              <div className="col-span-2 flex gap-2">
                                <button
                                  onClick={() =>
                                    updateCurrent((p) => {
                                      p.rules.splice(i, 1);
                                      return p;
                                    })
                                  }
                                  className="px-2 py-1 rounded text-sm bg-red-600 text-white"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.section>
                  )}

                  {activeTab === "notifications" && (
                    <motion.section
                      key="notifications"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                    >
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-6">
                          <h4 className="text-sm font-medium">
                            Email Notifications
                          </h4>
                          <div className="flex items-center gap-2 mt-2">
                            <input
                              type="checkbox"
                              checked={current.notifications.email.enabled}
                              onChange={(e) =>
                                updateCurrent((p) => ({
                                  ...p,
                                  notifications: {
                                    ...p.notifications,
                                    email: {
                                      ...p.notifications.email,
                                      enabled: e.target.checked,
                                    },
                                  },
                                }))
                              }
                              className="accent-indigo-600"
                            />
                            <label className="text-sm">Enable Email</label>
                          </div>

                          <div className="mt-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={current.notifications.email.selectAll}
                                onChange={(e) =>
                                  toggleEmailSelectAll(e.target.checked)
                                }
                                className="accent-indigo-600"
                              />
                              <label className="text-sm">
                                Select all recipients
                              </label>
                            </div>

                            <div className="mt-2 space-y-1">
                              {current.notifications.email.recipients.map(
                                (r, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={true}
                                      readOnly
                                      className="accent-indigo-600"
                                    />
                                    <span className="truncate">{r}</span>
                                  </div>
                                )
                              )}
                              <div className="flex gap-2">
                                <input
                                  placeholder="add recipient"
                                  className="flex-1 px-2 py-1 rounded text-sm bg-white dark:bg-slate-700 border dark:border-slate-600"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      const v = e.currentTarget.value.trim();
                                      if (v)
                                        updateCurrent((p) => {
                                          p.notifications.email.recipients.push(
                                            v
                                          );
                                          return p;
                                        });
                                      e.currentTarget.value = "";
                                    }
                                  }}
                                />
                                <button
                                  onClick={() =>
                                    updateCurrent((p) => {
                                      p.notifications.email.recipients.push(
                                        "new@example.com"
                                      );
                                      return p;
                                    })
                                  }
                                  className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-sm"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-6">
                          <h4 className="text-sm font-medium">
                            SMS Notifications
                          </h4>
                          <div className="flex items-center gap-2 mt-2">
                            <input
                              type="checkbox"
                              checked={current.notifications.sms.enabled}
                              onChange={(e) =>
                                updateCurrent((p) => ({
                                  ...p,
                                  notifications: {
                                    ...p.notifications,
                                    sms: {
                                      ...p.notifications.sms,
                                      enabled: e.target.checked,
                                    },
                                  },
                                }))
                              }
                              className="accent-indigo-600"
                            />
                            <label className="text-sm">Enable SMS</label>
                          </div>

                          <div className="mt-3">
                            <label className="text-xs">Recipients</label>
                            <input
                              placeholder="phone number"
                              className="w-full px-2 py-1 rounded text-sm bg-white dark:bg-slate-700 border dark:border-slate-600"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const v = e.currentTarget.value.trim();
                                  if (v)
                                    updateCurrent((p) => {
                                      p.notifications.sms.recipients.push(v);
                                      return p;
                                    });
                                  e.currentTarget.value = "";
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.section>
                  )}

                  {activeTab === "matrix" && (
                    <motion.section
                      key="matrix"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-sm font-medium">Matrix Table</h3>
                        <button
                          onClick={() => addColumn()}
                          className="px-2 py-1 rounded bg-indigo-600 text-white text-sm flex items-center gap-2"
                        >
                          <Plus size={14} /> Add column
                        </button>
                        <button
                          onClick={() => addRow()}
                          className="px-2 py-1 rounded bg-emerald-600 text-white text-sm flex items-center gap-2"
                        >
                          <Plus size={14} /> Add row
                        </button>
                      </div>

                      <div className="overflow-auto rounded border border-slate-200 dark:border-slate-700">
                        <table className="min-w-full text-sm table-fixed">
                          <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                              {current.matrix.columns.map((c) => (
                                <th
                                  key={c.id}
                                  className="px-2 py-2 text-left border-b dark:border-slate-700"
                                >
                                  <div className="flex items-center gap-2">
                                    <InlineEdit
                                      value={c.label}
                                      onSave={(v) =>
                                        updateCurrent((p) => {
                                          const col = p.matrix.columns.find(
                                            (x) => x.id === c.id
                                          );
                                          if (col) col.label = v;
                                          return p;
                                        })
                                      }
                                    />
                                    <button
                                      onClick={() => removeColumn(c.id)}
                                      className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </th>
                              ))}
                              <th className="px-2 py-2 border-b dark:border-slate-700">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-slate-900">
                            {current.matrix.rows.map((r) => (
                              <tr
                                key={r.id}
                                className="hover:bg-slate-50 dark:hover:bg-slate-800"
                              >
                                {current.matrix.columns.map((c) => (
                                  <td
                                    key={c.id}
                                    className="px-2 py-1 align-top border-b dark:border-slate-700"
                                  >
                                    <InlineEdit
                                      value={r.values[c.id]}
                                      onSave={(v) => updateCell(r.id, c.id, v)}
                                    />
                                  </td>
                                ))}
                                <td className="px-2 py-1 border-b dark:border-slate-700">
                                  <div className="flex gap-2">
                                    <button
                                      title="Edit row"
                                      onClick={() => {
                                        // focus first cell: we trigger inline editing by toggling a small state change
                                        // simpler path: open a modal — for compact demo, we just prompt
                                        const newValues = { ...r.values };
                                        current.matrix.columns.forEach((c) => {
                                          const v = prompt(
                                            `Edit ${c.label}`,
                                            newValues[c.id] || ""
                                          );
                                          if (v !== null) newValues[c.id] = v;
                                        });
                                        updateCurrent((p) => {
                                          p.matrix.rows = p.matrix.rows.map(
                                            (rr) =>
                                              rr.id === r.id
                                                ? { ...rr, values: newValues }
                                                : rr
                                          );
                                          return p;
                                        });
                                      }}
                                      className="px-2 py-1 rounded bg-gray-500 text-white text-xs flex items-center gap-1"
                                    >
                                      <SquarePen size={12} />
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => removeRow(r.id)}
                                      className="px-2 py-1 rounded bg-red-600 text-white text-xs"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {current.matrix.rows.length === 0 && (
                              <tr>
                                <td
                                  colSpan={current.matrix.columns.length + 1}
                                  className="p-4 text-center text-sm text-slate-500"
                                >
                                  No rows — add one.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </motion.section>
                  )}

                  {activeTab === "exceptions" && (
                    <motion.section
                      key="exceptions"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      className="h-full"
                    >
                      <div className="space-y-3 h-full flex flex-col">
                        <h3 className="text-sm font-medium">Exceptions</h3>

                        <div className="flex gap-3 flex-1">
                          {/* TABLE */}
                          <div className="flex-1 overflow-auto border dark:border-slate-700 rounded">
                            <table className="min-w-full text-sm">
                              <thead className="bg-slate-100 dark:bg-slate-800 text-xs uppercase sticky top-0">
                                <tr>
                                  <th className="px-2 py-2"></th>
                                  <th className="px-2 py-2 text-left">
                                    Exception Name
                                  </th>
                                  <th className="px-2 py-2 text-left">
                                    Application
                                  </th>
                                  <th className="px-2 py-2 text-left">
                                    Protocol
                                  </th>
                                  <th className="px-2 py-2 text-left">
                                    Action
                                  </th>
                                </tr>
                              </thead>

                              <tbody className="divide-y dark:divide-slate-700">
                                {current.exceptions?.map((row) => (
                                  <tr
                                    key={row.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800"
                                  >
                                    <td className="px-2 py-2">
                                      <input type="checkbox" />
                                    </td>
                                    <td className="px-2 py-2">
                                      <button
                                        className="text-blue-600 dark:text-blue-400 underline"
                                        onClick={() => {
                                          setExceptionFormData(row);
                                          setShowExceptionForm(true);
                                        }}
                                      >
                                        {row.name}
                                      </button>
                                    </td>
                                    <td className="px-2 py-2">
                                      {row.application}
                                    </td>
                                    <td className="px-2 py-2">
                                      {row.protocol}
                                    </td>
                                    <td className="px-2 py-2">{row.action}</td>
                                  </tr>
                                ))}

                                {!current.exceptions?.length && (
                                  <tr>
                                    <td
                                      colSpan="5"
                                      className="text-center py-4 text-slate-500 text-sm"
                                    >
                                      No entries
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>

                          {/* RIGHT SIDE BUTTON BAR */}
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => {
                                setExceptionFormData({
                                  id: Date.now(),
                                  name: "",
                                  application: "",
                                  protocol: "",
                                  action: "",
                                });
                                setShowExceptionForm(true);
                              }}
                              className="px-3 py-1 rounded bg-slate-700 text-white text-sm"
                            >
                              Add
                            </button>

                            <button className="px-3 py-1 rounded bg-slate-700 text-white text-sm">
                              Delete
                            </button>
                            <button className="px-3 py-1 rounded bg-slate-700 text-white text-sm">
                              Import
                            </button>
                            <button className="px-3 py-1 rounded bg-slate-700 text-white text-sm">
                              Export
                            </button>

                            <button className="px-3 py-1 rounded bg-slate-700 text-white text-sm">
                              Move Up
                            </button>
                            <button className="px-3 py-1 rounded bg-slate-700 text-white text-sm">
                              Move Down
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.section>
                  )}

                  {activeTab === "preview" && (
                    <motion.section
                      key="preview"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                    >
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium">
                          Preview & Submit
                        </h3>
                        <div className="bg-slate-100 dark:bg-slate-800 rounded p-3 text-xs font-mono">
                          <pre className="max-h-72 overflow-auto text-[11px]">
                            {JSON.stringify(policies, null, 2)}
                          </pre>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSubmit}
                            className="px-3 py-1 rounded bg-indigo-600 text-white flex items-center gap-2"
                          >
                            <Download size={14} /> Submit JSON
                          </button>

                          {submitResult && (
                            <a
                              className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 text-sm"
                              href={URL.createObjectURL(
                                new Blob([submitResult], {
                                  type: "application/json",
                                })
                              )}
                              download={`policies-${Date.now()}.json`}
                            >
                              Download JSON
                            </a>
                          )}
                        </div>

                        {submitResult && (
                          <div className="mt-2 bg-white/80 dark:bg-slate-900 p-3 rounded text-xs">
                            <h5 className="text-sm font-medium mb-2">
                              Submission payload
                            </h5>
                            <pre className="max-h-48 overflow-auto text-[12px]">
                              {submitResult}
                            </pre>
                          </div>
                        )}
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>
              </div>
            </main>

            {/* Exception Modal */}
            {showExceptionForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-lg w-96 space-y-4 shadow-lg border dark:border-slate-700">
                  <h2 className="text-lg font-semibold">
                    {exceptionFormData?.id ? "Edit Exception" : "Add Exception"}
                  </h2>

                  <div className="space-y-2">
                    <input
                      className="w-full px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 border dark:border-slate-600"
                      placeholder="Exception Name"
                      value={exceptionFormData?.name ?? ""}
                      onChange={(e) =>
                        setExceptionFormData({
                          ...exceptionFormData,
                          name: e.target.value,
                        })
                      }
                    />

                    <input
                      className="w-full px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 border dark:border-slate-600"
                      placeholder="Application"
                      value={exceptionFormData?.application ?? ""}
                      onChange={(e) =>
                        setExceptionFormData({
                          ...exceptionFormData,
                          application: e.target.value,
                        })
                      }
                    />

                    <input
                      className="w-full px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 border dark:border-slate-600"
                      placeholder="Protocol (TCP/UDP)"
                      value={exceptionFormData?.protocol ?? ""}
                      onChange={(e) =>
                        setExceptionFormData({
                          ...exceptionFormData,
                          protocol: e.target.value,
                        })
                      }
                    />

                    <input
                      className="w-full px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 border dark:border-slate-600"
                      placeholder="Action (Allow/Deny)"
                      value={exceptionFormData?.action ?? ""}
                      onChange={(e) =>
                        setExceptionFormData({
                          ...exceptionFormData,
                          action: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCloseException}
                      className="px-3 py-1 rounded bg-slate-500 text-white"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSaveException}
                      className="px-3 py-1 rounded bg-emerald-600 text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
