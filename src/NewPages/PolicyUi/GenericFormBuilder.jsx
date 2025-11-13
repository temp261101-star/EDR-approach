

import React, { useState } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import GenericPopupModal from "../../components/MODAL/GenericPopupModal";
import { useWebSocket } from "../../lib/useWebSocket";

const GenericFormBuilder = ({ config }) => {
const [activeTab, setActiveTab] = useState(config.tabs?.[0]?.id || Object.keys(config.screens || {})[0] || "");
  const [policies, setPolicies] = useState([
    { id: 1, name: "Policy 1", data: {} },
    // to do ->> ad new policies using btn
  ]);
// const [editMode, setEditMode] = useState(false);
// const [editingId, setEditingId] = useState(null);


// WebSocket connection
  const { isConnected, sendMessage } = useWebSocket('to do ->> url for socket');

  const initializeFormWithDefaults = (config) => {
    const defaultData = {};

    Object.values(config.screens || {}).forEach((screen) => {
      if (screen.fields) {
        screen.fields.forEach((field) => {
          if (field.defaultValue !== undefined) {
            defaultData[field.name] = field.defaultValue;
          }
        });
      }
    });

    return defaultData;
  };

  const [formState, setFormState] = useState(() => {
    const initial = {};
    policies.forEach((p) => {
      initial[p.id] = initializeFormWithDefaults(config);
    });
    return initial;
  });

  const [selectedPolicyId, setSelectedPolicyId] = useState(policies[0]?.id);

const updateFormState = (path, value) => {
  setFormState((prev) => {
    const newState = { ...prev };
    const policyData = { ...newState[selectedPolicyId] };
    const keys = path.split(".");

    // Get previous value at the path
    let current = policyData;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    const prevValue = current[lastKey];

    //  If value is a function, evaluate it with previous value
    const resolvedValue =
      typeof value === "function" ? value(prevValue || {}) : value;

    current[lastKey] = resolvedValue;

    newState[selectedPolicyId] = policyData;
    return newState;
  });
};


  const getFormValue = (path, defaultValue = "") => {
    const policyData = formState[selectedPolicyId] || {};
    const keys = path.split(".");
    let current = policyData;

    for (const key of keys) {
      if (current === undefined || current === null) return defaultValue;
      current = current[key];
    }

    return current !== undefined ? current : defaultValue;
  };

  const renderInput = (field, basePath = "") => {
    const path = basePath ? `${basePath}.${field.name}` : field.name;
    const value = getFormValue(path, field.defaultValue);

    const inputClass =
      "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
    const labelClass = "block text-sm font-medium text-gray-300 mb-1.5";

    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number":
      case "url":
      case "tel":
        return (
          <div className="space-y-1">
            <label className={labelClass}>{field.label}</label>
            <input
              type={field.type}
              value={value || ""}
              onChange={(e) => updateFormState(path, e.target.value)}
              placeholder={
                field.placeholder || `Enter ${field.label.toLowerCase()}`
              }
              className={inputClass}
            />
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-1">
            <label className={labelClass}>{field.label}</label>
            <textarea
              value={value || ""}
              onChange={(e) => updateFormState(path, e.target.value)}
              rows={field.rows || 4}
              placeholder={
                field.placeholder || `Enter ${field.label.toLowerCase()}`
              }
              className={inputClass}
            />
          </div>
        );

      case "select":
        return (
          <div className="space-y-1">
            <label className={labelClass}>{field.label}</label>
            <div className="relative">
              <select
                value={value || ""}
                onChange={(e) => updateFormState(path, e.target.value)}
                className={`${inputClass} appearance-none pr-10`}
              >
                <option value="">Select {field.label.toLowerCase()}</option>
                {field.options?.map((opt) => (
                  <option
                    key={typeof opt === "object" ? opt.value : opt}
                    value={typeof opt === "object" ? opt.value : opt}
                  >
                    {typeof opt === "object" ? opt.label : opt}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={16}
              />
            </div>
          </div>
        );

      case "multiselect":
        return (
          <div className="space-y-1">
            <label className={labelClass}>{field.label}</label>
            <div className="space-y-2 bg-gray-800 border border-gray-700 rounded-lg p-3">
              {field.options?.map((opt) => {
                const optValue = typeof opt === "object" ? opt.value : opt;
                const optLabel = typeof opt === "object" ? opt.label : opt;
                // Use field.defaultValue as fallback for multiselect
                const currentValue = getFormValue(
                  path,
                  field.defaultValue || []
                );
                const checked =
                  Array.isArray(currentValue) &&
                  currentValue.includes(optValue);

                return (
                  <label
                    key={optValue}
                    className="flex items-center text-sm text-gray-300 hover:text-gray-100 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const current = Array.isArray(currentValue)
                          ? currentValue
                          : [];
                        const updated = e.target.checked
                          ? [...current, optValue]
                          : current.filter((v) => v !== optValue);
                        updateFormState(path, updated);
                      }}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <span className="ml-2">{optLabel}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      case "radio":
        return (
          <div className="space-y-1">
            <label className={labelClass}>{field.label}</label>
            <div className="space-y-2">
              {field.options?.map((opt) => {
                const optValue = typeof opt === "object" ? opt.value : opt;
                const optLabel = typeof opt === "object" ? opt.label : opt;

                return (
                  <label
                    key={optValue}
                    className="flex items-center text-sm text-gray-300 hover:text-gray-100 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={path}
                      checked={value === optValue}
                      onChange={() => updateFormState(path, optValue)}
                      className="w-4 h-4 border-gray-600 bg-gray-900 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <span className="ml-2">{optLabel}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      case "checkbox-group":
        return (
          <div className="space-y-1">
            <label className={labelClass}>{field.label}</label>
            <div className="space-y-2">
              {field.options?.map((opt) => {
                const optValue = typeof opt === "object" ? opt.value : opt;
                const optLabel = typeof opt === "object" ? opt.label : opt;
                // Use field.defaultValue as fallback for checkbox-group
                const currentValue = getFormValue(
                  path,
                  field.defaultValue || []
                );
                const checked =
                  Array.isArray(currentValue) &&
                  currentValue.includes(optValue);

                return (
                  <label
                    key={optValue}
                    className="flex items-center text-sm text-gray-300 hover:text-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const current = Array.isArray(currentValue)
                          ? currentValue
                          : [];
                        const updated = e.target.checked
                          ? [...current, optValue]
                          : current.filter((v) => v !== optValue);
                        updateFormState(path, updated);
                      }}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <span className="ml-2">{optLabel}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      case "date":
      case "datetime-local":
      case "time":
        return (
          <div className="space-y-1">
            <label className={labelClass}>{field.label}</label>
            <input
              type={field.type}
              value={value || ""}
              onChange={(e) => updateFormState(path, e.target.value)}
              className={inputClass}
            />
          </div>
        );

      case "file":
        return (
          <div className="space-y-1">
            <label className={labelClass}>{field.label}</label>
            <input
              type="file"
              multiple={field.multiple}
              accept={field.accept}
              onChange={(e) =>
                updateFormState(path, e.target.files?.[0]?.name || "")
              }
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
            />
          </div>
        );

      case "checkbox":
        return (
          <label className="flex items-center text-sm text-gray-300 hover:text-gray-100 cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => updateFormState(path, e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span className="ml-2">{field.label}</span>
          </label>
        );

      case "array":
        return renderArrayField(field, path);

      default:
        return (
          <div className="text-sm text-gray-500">
            Unsupported field type: {field.type}
          </div>
        );
    }
  };

  const renderArrayField = (field, path) => {
    const items = Array.isArray(getFormValue(path, []))
      ? getFormValue(path, [])
      : [];

    const addItem = () => {
      const newItem =
        field.itemSchema?.fields?.reduce((acc, f) => {
          acc[f.name] =
            f.type === "checkbox-group" || f.type === "multiselect" ? [] : "";
          return acc;
        }, {}) || {};
      updateFormState(path, [...items, newItem]);
    };

    const removeItem = (index) => {
      updateFormState(
        path,
        items.filter((_, i) => i !== index)
      );
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-300">
            {field.label}
          </label>
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Plus size={14} /> Add
          </button>
        </div>

        <div className="space-y-3">
          {items?.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {field.itemSchema?.fields?.map((subField) => (
                    <div key={subField.name}>
                      {renderInput(subField, `${path}.${index}`)}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {items?.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm bg-gray-800/50 rounded-lg border border-gray-700 border-dashed">
              No items yet. Click "Add" to create one.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderScreen = (screenConfig) => {
    if (!screenConfig)
      return <div className="text-gray-500">Screen not found</div>;

    // Handle array/list type screens
    if (screenConfig.type === "array" || screenConfig.type === "list") {
      return (
        <div>
          {screenConfig.title && (
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              {screenConfig.title}
            </h2>
          )}
          {renderArrayField(screenConfig, activeTab)}
        </div>
      );
    }

    // Handle form screens - REMOVE activeTab as basePath
    if (screenConfig.fields && Array.isArray(screenConfig.fields)) {
      return (
        <div>
          {screenConfig.title && (
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              {screenConfig.title}
            </h2>
          )}
          <div
            className={`grid gap-4 ${
              screenConfig.layout === "single"
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {screenConfig.fields.map((field) => (
              <div
                key={field.name}
                className={field.fullWidth ? "md:col-span-2" : ""}
              >
                {/* Remove activeTab from here - just pass the field */}
                {renderInput(field)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Handle custom content
    if (screenConfig.content) {
      return (
        <div>
          {screenConfig.title && (
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              {screenConfig.title}
            </h2>
          )}
          <div className="prose prose-invert max-w-none">
            {screenConfig.content}
          </div>
        </div>
      );
    }

   if (screenConfig.type === "custom" && screenConfig.customComponent) {
  return (
    <div>
      {screenConfig.title && (
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          {screenConfig.title}
        </h2>
      )}
      {React.cloneElement(screenConfig.customComponent({ 
        formData: getFormValue(activeTab, {}), 
        setFormData: (newData) => updateFormState(activeTab, newData),
        config: config  // Add this line to pass the config
      }))}
    </div>
  );
}

    return <div className="text-gray-500">Unknown screen configuration</div>;
  };

  const activeScreen = config.screens?.[activeTab];
const handleSubmit = () => {
    const mergedData = Object.values(formState || {}).reduce(
      (acc, tabData) => ({ ...acc, ...tabData }),
      {}
    );

    // Prepare data for WebSocket
    const wsData = {
      type: 'form_submission',
      timestamp: new Date().toISOString(),
      data: mergedData,
      policyCount: policies.length,
      activePolicy: selectedPolicyId
    };

    // Send via WebSocket
    sendMessage(wsData);

    // Also keep the console log for debugging
    console.log("Submit:", mergedData);
  };
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* for connection status of websocket */}
          <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Form Builder</h1>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          isConnected ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-300' : 'bg-red-300'
          }`}></div>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

        <div className=" lg:flex">
          <div className="lg:w-64 w-full bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              Policies
            </h2>
            <div className="space-y-2 flex-1 overflow-y-auto">
              {policies.map((policy) => (
                <button
                  key={policy.id}
                  onClick={() => setSelectedPolicyId(policy.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedPolicyId === policy.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {policy.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                const newId = policies.length + 1;
                setPolicies([
                  ...policies,
                  { id: newId, name: `Policy ${newId}`, data: {} },
                ]);
                setFormState((prev) => ({
                  ...prev,
                  [newId]: initializeFormWithDefaults(config),
                }));
              }}
              className="mt-4 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} /> New Policy
            </button>
          </div>

          <div className="bg-gray-900 w-full shadow-2xl overflow-hidden border border-gray-800">
            {/* Tabs */}
            {config.tabs && config.tabs.length > 0 && (
              <div className="border-b border-gray-800 bg-gray-900/50">
                <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                  {config.tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-400 bg-gray-800/50"
                          : "border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-800/30"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

      
            <div className="p-8">{renderScreen(activeScreen)}</div>

            
{config.tabs?.length > 0 && (
  <div className="border-t border-gray-800 bg-gray-900/50 px-8 py-4 flex justify-between">
    <button
      onClick={() => {
        const currentIndex = config.tabs?.findIndex((t) => t.id === activeTab) ?? -1;
        if (currentIndex > 0) {
          setActiveTab(config.tabs[currentIndex - 1].id);
        }
      }}
      disabled={!config.tabs || config.tabs?.findIndex((t) => t.id === activeTab) === 0}
      className="px-6 py-2.5 text-sm font-medium rounded-lg transition-colors bg-gray-700 hover:bg-gray-600 text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>

     <button
    onClick={handleSubmit}
    className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      config.tabs && config.tabs.findIndex((t) => t.id === activeTab) === config.tabs.length - 1
        ? "bg-green-600 hover:bg-green-700 text-white"
        : "bg-blue-600 hover:bg-blue-700 text-white"
    }`}
  >
      {config.tabs && config.tabs.findIndex((t) => t.id === activeTab) === config.tabs.length - 1
        ? "Submit"
        : "Next"}
    </button>
  </div>
)}

          </div>
        </div>

        {/* Debug Panel */}
        <div className="mt-6 bg-gray-900 rounded-lg border border-gray-800 p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">
            For JSON Testing (this will be send to backend)
          </h3>
          <pre className="text-xs text-gray-400 overflow-auto max-h-60 bg-gray-950 rounded p-3">
            {JSON.stringify(formState, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};




const GenericFormFields = ({ screenConfig, formData, setFormData }) => {
  if (!screenConfig?.fields) return null;

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {screenConfig.fields.map((field) => {
    const value = formData[field.name] || "";

    switch (field.type) {
  case "text":
  case "email":
  case "number":
  case "password":
  case "url":
  case "tel":
    return (
      <div key={field.name}>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          {field.label}
        </label>
        <input
          type={field.type}
          value={value}
          onChange={(e) => handleChange(field.name, e.target.value)}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-1 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
    );

  case "textarea":
    return (
      <div key={field.name}>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          {field.label}
        </label>
        <textarea
          value={value}
          onChange={(e) => handleChange(field.name, e.target.value)}
          rows={field.rows || 4}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-1 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
    );

  case "select":
    return (
      <div key={field.name}>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          {field.label}
        </label>
        <select
          value={value}
          onChange={(e) => handleChange(field.name, e.target.value)}
          className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-2 py-1 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        >
          <option value="">Select {field.label}</option>
          {field.options?.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      </div>
    );

  case "multiselect":
    return (
      <div key={field.name}>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          {field.label}
        </label>
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-2 space-y-1">
          {field.options?.map((opt) => {
            const val = opt.value || opt;
            const label = opt.label || opt;
            const checked = Array.isArray(value) && value.includes(val);
            return (
              <label key={val} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    let updated = Array.isArray(value) ? [...value] : [];
                    if (e.target.checked) updated.push(val);
                    else updated = updated.filter((v) => v !== val);
                    handleChange(field.name, updated);
                  }}
                />
                {label}
              </label>
            );
          })}
        </div>
      </div>
    );

  case "radio":
    return (
      <div key={field.name}>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          {field.label}
        </label>
        <div className="space-y-1">
          {field.options?.map((opt) => {
            const val = opt.value || opt;
            const label = opt.label || opt;
            return (
              <label key={val} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={field.name}
                  checked={value === val}
                  onChange={() => handleChange(field.name, val)}
                />
                {label}
              </label>
            );
          })}
        </div>
      </div>
    );

  case "checkbox":
    return (
      <label key={field.name} className="flex items-center gap-2 text-sm text-gray-200">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => handleChange(field.name, e.target.checked)}
        />
        {field.label}
      </label>
    );

  case "date":
  case "datetime-local":
  case "time":
    return (
      <div key={field.name}>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          {field.label}
        </label>
        <input
          type={field.type}
          value={value || ""}
          onChange={(e) => handleChange(field.name, e.target.value)}
          className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-1 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );

  case "file":
    return (
      <div key={field.name}>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          {field.label}
        </label>
        <input
          type="file"
          multiple={field.multiple}
          accept={field.accept}
          onChange={(e) =>
            handleChange(field.name, Array.from(e.target.files || []).map((f) => f.name))
          }
          className="block w-full text-sm text-gray-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
      </div>
    );

  default:
    return (
      <div key={field.name} className="text-gray-400 text-sm col-span-full">
        Unsupported: {field.type}
      </div>
    );
}

  })}
</div>
  );
};

function ExceptionsSection({ parentFormData, setParentFormData, config }) {
  const [exceptions, setExceptions] = useState(parentFormData?.Exceptions || []);
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);  

  // Use config.exceptionFormConfig instead of the separate exceptionFormConfig
  const exceptionConfig = config?.exceptionFormConfig?.screens?.ExceptionForm;


    if (!exceptionConfig || !exceptionConfig.fields) {
    return (
      <div className="text-red-500 p-4">
        Error: Exception form configuration not found. Please check your config.
      </div>
    );
  }
  // Helper to open modal for "Add"
  const openAdd = () => {
    setFormData({});
    setEditMode(false);
    setEditingId(null);
    setSelectedId(null);
    setIsModalOpen(true);
  };

  // Update all references in the component:
  const openEdit = () => {
    if (!selectedId) {
      alert("Please select a row to edit.");
      return;
    }

    const row = exceptions.find((r) => r.id === selectedId);
    if (!row) return;

    // Default all form fields to blank using the config
    const defaults = Object.fromEntries(
      exceptionConfig.fields.map(f => [f.name, ""])
    );

    setFormData({ ...defaults, ...row });
    setEditMode(true);
    setEditingId(selectedId);
    setIsModalOpen(true);
  };

  // Add or update
  const handleAddOrEditException = () => {
    if (editMode && editingId) {
      // update local list
      setExceptions((prev) =>
        prev.map((ex) => (ex.id === editingId ? { ...ex, ...formData } : ex))
      );

      // update parent form data
      setParentFormData((prev = {}) => ({
        ...prev,
        Exceptions: (prev.Exceptions || []).map((ex) =>
          ex.id === editingId ? { ...ex, ...formData } : ex
        ),
      }));
    } else {
      // add new
      const newException = { id: Date.now(), ...formData };
      setExceptions((prev) => [...prev, newException]);

      setParentFormData((prev = {}) => ({
        ...prev,
        Exceptions: [...(prev.Exceptions || []), newException],
      }));
    }

    // reset modal state
    setFormData({});
    setEditMode(false);
    setEditingId(null);
    setSelectedId(null);
    setIsModalOpen(false);
  };

  // Delete selected row(s) — here we delete the currently selected row
  const handleDelete = () => {
    if (!selectedId) {
      alert("Please select row(s) to delete.");
      return;
    }
    const ok = confirm("Delete selected exception?");
    if (!ok) return;

    setExceptions((prev) => prev.filter((r) => r.id !== selectedId));
    setParentFormData((prev = {}) => ({
      ...prev,
      Exceptions: (prev.Exceptions || []).filter((r) => r.id !== selectedId),
    }));
    setSelectedId(null);
  };

  // Row checkbox toggles selection (single-select)
  const toggleRowSelection = (id, checked) => {
    setSelectedId(checked ? id : null);
  };

  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="flex gap-3 flex-1">
        {/* TABLE */}
        <div className="flex-1 overflow-auto border dark:border-slate-700 rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-xs uppercase sticky top-0">
              <tr>
                <th className="px-2 py-2"></th>
                {/* Dynamically render column headers from config */}
                {exceptionConfig.fields.map((field) => (
                  <th key={field.name} className="px-2 py-2 text-left">
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {exceptions.length > 0 ? (
                exceptions.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      selectedId === row.id ? "bg-slate-800/40" : ""
                    }`}
                  >
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        checked={selectedId === row.id}
                        onChange={(e) => toggleRowSelection(row.id, e.target.checked)}
                      />
                    </td>
                    {/* Dynamically render table cells from config */}
                    {exceptionConfig.fields.map((field) => (
                      <td key={field.name} className="px-2 py-2">
                        {row[field.name] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={exceptionConfig.fields.length + 1}
                    className="text-center py-4 text-slate-500 text-sm"
                  >
                    No entries
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2">
          <button onClick={openAdd} className="px-3 py-1 rounded bg-slate-700 text-white text-sm cursor-pointer">
            Add
          </button>

          <button onClick={openEdit} className="px-3 py-1 rounded bg-slate-700 text-white text-sm">
            Edit
          </button>

          <button onClick={handleDelete} className="px-3 py-1 rounded bg-slate-700 text-white text-sm">
            Delete
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <GenericPopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="p-4 space-y-3">
            <h2 className="text-lg font-semibold text-gray-100 mb-2">
              {editMode ? "Edit Exception" : "Add Exception"}
            </h2>

            {/* Use the config for the form fields */}
            <GenericFormFields
              screenConfig={exceptionConfig}
              formData={formData}
              setFormData={setFormData}
            />

            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setIsModalOpen(false)} className="px-3 py-1 bg-slate-700 text-white rounded">
                Cancel
              </button>
              <button onClick={handleAddOrEditException} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded">
                {editMode ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </GenericPopupModal>
      )}
    </div>
  );
}

const dataForUi = {
  tabs: [
    { id: "general", label: "General Info" },
    { id: "preferences", label: "Preferences" },
    { id: "experience", label: "Experience" },
    { id: "Exceptions", label: "Exceptions Table" },
  ],

  screens: {
    general: {
      title: "User Registration",
      fields: [
        { name: "firstName", label: "First Name", type: "text", defaultValue: "Mansi" },
        { name: "lastName", label: "Last Name", type: "text", defaultValue: "Hajare" },
        { name: "email", label: "Email", type: "email", defaultValue: "mansi@example.com" },
        { name: "designation", label: "Designation", type: "text", defaultValue: "Developer" },
        { name: "age", label: "Age", type: "number", defaultValue: 25 },
        { name: "bio", label: "Bio", type: "textarea", fullWidth: true, defaultValue: "Default bio text" },
      ],
    },

    preferences: {
      title: "Your Preferences",
      fields: [
        { name: "gender", label: "Gender", type: "radio", options: ["Male", "Female", "Other"], defaultValue: "Female" },
        { name: "country", label: "Country", type: "select", options: ["India", "USA", "UK", "Canada"], defaultValue: "India" },
        { name: "languages", label: "Languages Known", type: "multiselect", options: ["English", "Hindi", "Marathi", "Spanish"], defaultValue: ["English", "Hindi"] },
      ],
    },

    experience: {
      type: "array",
      title: "Work Experience",
      label: "Work Experience",
      itemSchema: {
        fields: [
          { name: "company", label: "Company", type: "text", defaultValue: "Default Company" },
          { name: "position", label: "Position", type: "text", defaultValue: "Developer" },
          { name: "startDate", label: "Start Date", type: "date" },
          { name: "endDate", label: "End Date", type: "date" },
          { name: "description", label: "Description", type: "textarea", defaultValue: "Default description" },
        ],
      },
    },

    Exceptions: {
      type: "custom",
      title: "Exceptions Section",
      customComponent: ({ formData, setFormData, config }) => (
        <ExceptionsSection
          parentFormData={formData}
          setParentFormData={setFormData}
          config={config}
        />
      ),
    },
  },

  // Add exception form configuration here
  exceptionFormConfig: {
    screens: {
      ExceptionForm: {
        fields: [
          { name: "fullName", label: "Full Name", type: "text" },
          { name: "username", label: "Username", type: "text" },
          { name: "email", label: "Email Address", type: "email" },
          { name: "age", label: "Age", type: "number" },
          { name: "port", label: "Port Number", type: "number" },
          { name: "password", label: "Password", type: "password" },
          { name: "startDate", label: "Start Date", type: "date" },
          { name: "meetingTime", label: "Meeting Time", type: "time" },
          { name: "website", label: "Website URL", type: "url" },
          { name: "phone", label: "Phone Number", type: "tel" },
          { name: "action", label: "Action", type: "select", options: ["Allow", "Block", "Monitor"] },
          { name: "priority", label: "Priority", type: "select", options: ["Low", "Medium", "High", "Critical"] },
          { name: "status", label: "Status", type: "select", options: ["Active", "Inactive", "Pending"] },
          { name: "gender", label: "Gender", type: "radio", options: ["Male", "Female", "Other"] },
          { name: "accountType", label: "Account Type", type: "radio", options: ["Personal", "Business", "Enterprise"] },
          { name: "features", label: "Select Features", type: "multiselect", options: ["Analytics", "Reporting", "API Access", "Custom Branding"] },
          { name: "description", label: "Description", type: "textarea", rows: 4 },
          { name: "notes", label: "Additional Notes", type: "textarea", rows: 3 },
          { name: "isEnabled", label: "Enable Feature", type: "checkbox" },
        ]
      },
    },
  },

  actions: [
    { label: "Save Draft", variant: "secondary", onClick: (data) => console.log("Draft:", data) },
    { label: "Submit", variant: "success", onClick: (data) => console.log("Submit:", data) },
  ],
};

export default () => <GenericFormBuilder config={dataForUi} />;








