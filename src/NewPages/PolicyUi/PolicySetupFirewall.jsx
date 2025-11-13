import React, { useState } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import GenericPopupModal from "../../components/MODAL/GenericPopupModal";
import { useWebSocket } from "../../lib/useWebSocket";
const PolicySetupFirewall = ({ config }) => {
  console.log("config data : ", config);

  const [activeTab, setActiveTab] = useState(
    config.tabs?.[0]?.id || Object.keys(config.screens || {})[0] || ""
  );
  const [policies, setPolicies] = useState([
    { id: 1, name: "Policy 1", data: {} },
    // to do ->> ad new policies using btn
  ]);
  // const [editMode, setEditMode] = useState(false);
  // const [editingId, setEditingId] = useState(null);

  // WebSocket connection

  const initializeFormWithDefaults = (config) => {
    
    return JSON.parse(JSON.stringify(config.initialFormData || {}));
  };

  const [formState, setFormState] = useState(() => {
    const initial = {};
    policies.forEach((p) => {
      initial[p.id] = initializeFormWithDefaults(config);
    });
    return initial;
  });

  const [selectedPolicyId, setSelectedPolicyId] = useState(policies[0]?.id);
  const [selectedTabId, setTabPolicyId] = useState(policies[0]?.id);

  const updateFormState = (path, value) => {
    setFormState((prev) => {
      const newState = { ...prev };
      const policyData = { ...newState[selectedPolicyId] };
      const keys = path.split(".");


      let current = policyData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];
      const prevValue = current[lastKey];

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
          <label className="flex items-start gap-2 text-sm text-gray-200">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => {
                const newValue = e.target.checked;

                if (field.onBeforeChange) {
                  const shouldProceed = field.onBeforeChange(value, newValue);
                  if (!shouldProceed) return;
                }
                updateFormState(path, newValue);
              }}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 mt-0.5"
            />
            <div className="flex flex-col">
              <span>{field.label}</span>
              <div className="mb-2"></div>

              {field?.description && <div>{field?.description}</div>}
            </div>
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

    
    if (screenConfig.sections && Array.isArray(screenConfig.sections)) {
      return (
        <div className="">
          {screenConfig.title && (
            <h2 className="text-xl font-semibold text-gray-100 mb-6">
              {screenConfig.title}
            </h2>
          )}
          {renderScreenWithSections(screenConfig)}
        </div>
      );
    }


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
                {renderInput(field)}
              </div>
            ))}
          </div>
        </div>
      );
    }


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
        <div className="border border-yellow-400">
          {screenConfig.title && (
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              {screenConfig.title}
            </h2>
          )}
          {React.cloneElement(
            screenConfig.customComponent({
              formData: getFormValue(activeTab, {}),
              setFormData: (newData) => updateFormState(activeTab, newData),
              config: config,
            })
          )}
        </div>
      );
    }

    return <div className="text-gray-500">Unknown screen configuration</div>;
  };

  const renderScreenWithSections = (screenConfig) => {
    return (
      <div className="space-y-8">
        {screenConfig.sections.map((section, index) => (
          <div
            key={section.id || index}
            className="border-b border-gray-500 pb-4"
          >
            {section.title && (
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-1">
                  {section.title}
                </h3>
                <p className="text-sm font-light text-gray-300 mb-2">
                  {section?.subHeading}
                </p>
              </div>
            )}

   
            {section.type === "form" && section.fields && (
              <div
                className={`grid gap-4 ${
                  section.layout === "single"
                    ? "grid-cols-1"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-1"
                }`}
              >
                {section.fields.map((field) => (
                  <div
                    key={field.name}
                    className={field.fullWidth ? "md:col-span-2" : ""}
                  >
                    {renderInput(field)}
                  </div>
                ))}
              </div>
            )}

    
            {section.type === "cards" && section.cards && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.cards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-gray-900 border border-gray-700 rounded-lg p-4"
                  >
                    <h4 className="font-medium text-gray-100 mb-2">
                      {card.title}
                    </h4>
                    {card.description && (
                      <p className="text-sm text-gray-400 mb-3">
                        {card.description}
                      </p>
                    )}
                    <div className="space-y-2">
                      {card.fields?.map((field) => (
                        <div key={field.name}>{renderInput(field)}</div>
                      ))}
                      {card.options?.map((option) => (
                        <div key={option.name}>{renderInput(option)}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

     
            {section.type === "custom" && section.customComponent && (
              <div>
                {React.cloneElement(
                  section.customComponent({
                    formData: getFormValue(activeTab, {}),
                    setFormData: (newData) =>
                      updateFormState(activeTab, newData),
                    config: config,
                  })
                )}
              </div>
            )}

         
            {section.type === "content" && section.content && (
              <div className="prose prose-invert max-w-none">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  const activeScreen = config.screens?.[activeTab];
  const handleSubmit = () => {
    const mergedData = Object.values(formState || {}).reduce(
      (acc, tabData) => ({ ...acc, ...tabData }),
      {}
    );


    console.log("Submit:", mergedData);
  };
  return (
  <div className="h-full bg-gray-950 text-gray-100 p-6 ">
    {" "}
    {/* <div className="max-w-6xl mx-auto "> */}
    <div className="w-full max-w-full mx-auto px-4">
      {/* <div className="lg:flex  h-[70vh]   overflow-hidden"> */}
   <div className="lg:flex h-[70vh] overflow-hidden w-full">
        <div className="lg:w-64 w-full bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Policies
          </h2>
          <div className="space-y-2 flex-1 overflow-y-auto">
            {config?.tabs?.map((tab) => (
              <button
                key={tab.id}
               
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* <div className="bg-gray-900 w-full flex flex-col shadow-2xl "> */}
        <div className="bg-gray-900 flex-1 flex flex-col shadow-2xl min-w-0">
          {/* Tabs */}
          {config.tabs && config.tabs.length > 0 && (
            <div className="border-b border-gray-800 bg-gray-900/50"></div>
          )}

      
          <div className="flex-1 overflow-y-auto p-8 ">
            {renderScreen(activeScreen)}
          </div>

          {config.tabs?.length > 0 && (
            <div className="border-t border-gray-800 bg-gray-900/50 px-8 py-4 flex justify-end">
              <button
                onClick={handleSubmit}
                className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors  ${
                  config.tabs &&
                  config.tabs.findIndex((t) => t.id === activeTab) ===
                    config.tabs.length - 1
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "hidden"
                }`}
              >
                {config.tabs &&
                config.tabs.findIndex((t) => t.id === activeTab) ===
                  config.tabs.length - 1
                  ? "Submit"
                  : ""}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Debug Panel */}
      {/* <div className="mt-6 bg-gray-900 rounded-lg border border-gray-800 p-4 h-[calc(30vh-2rem)]">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">
          For JSON Testing (this will be send to backend)
        </h3>
        <pre className="text-xs text-gray-400 overflow-auto h-[calc(100%-2rem)] bg-gray-950 rounded p-3">
          {JSON.stringify(formState, null, 2)}
        </pre>
      </div> */}
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
    <div className="grid ${grid-cols-1} sm:grid-cols-2 gap-6 px-2">
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
                      <label
                        key={val}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            let updated = Array.isArray(value)
                              ? [...value]
                              : [];
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
                      <label
                        key={val}
                        className="flex items-center gap-2 text-sm"
                      >
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
              <label className="flex items-start gap-2 text-sm text-gray-200">
                <input
                  type="checkbox"
                  checked={!!value}
                  onChange={(e) => handleChange(field.name, e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 mt-0.5"
                />
                <div className="flex flex-col">
                  <span>{field.label}</span>
                  {field.description && (
                    <span className="text-xs text-gray-400 mt-1">
                      {field.description}
                    </span>
                  )}
                </div>
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
                    handleChange(
                      field.name,
                      Array.from(e.target.files || []).map((f) => f.name)
                    )
                  }
                  className="block w-full text-sm text-gray-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
              </div>
            );

          default:
            return (
              <div
                key={field.name}
                className="text-gray-400 text-sm col-span-full"
              >
                Unsupported: {field.type}
              </div>
            );
        }
      })}
    </div>
  );
};

function ExceptionsSection({ parentFormData, setParentFormData, config }) {
  const [exceptions, setExceptions] = useState(
    parentFormData?.Exceptions || []
  );
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const exceptionConfig = config?.exceptionFormConfig?.screens?.ExceptionForm;

  if (!exceptionConfig || !exceptionConfig.fields) {
    return (
      <div className="text-red-500 p-4">
        Error: Exception form configuration not found. Please check your config.
      </div>
    );
  }

  const openAdd = () => {
    setFormData({});
    setEditMode(false);
    setEditingId(null);
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const openEdit = () => {
    if (!selectedId) {
      alert("Please select a row to edit.");
      return;
    }

    const row = exceptions.find((r) => r.id === selectedId);
    if (!row) return;

    const defaults = Object.fromEntries(
      exceptionConfig.fields.map((f) => [f.name, ""])
    );

    setFormData({ ...defaults, ...row });
    setEditMode(true);
    setEditingId(selectedId);
    setIsModalOpen(true);
  };

  const handleAddOrEditException = () => {
    if (editMode && editingId) {
    
      setExceptions((prev) =>
        prev.map((ex) => (ex.id === editingId ? { ...ex, ...formData } : ex))
      );


      setParentFormData((prev = {}) => ({
        ...prev,
        Exceptions: (prev.Exceptions || []).map((ex) =>
          ex.id === editingId ? { ...ex, ...formData } : ex
        ),
      }));
    } else {

      const newException = { id: Date.now(), ...formData };
      setExceptions((prev) => [...prev, newException]);

      setParentFormData((prev = {}) => ({
        ...prev,
        Exceptions: [...(prev.Exceptions || []), newException],
      }));
    }


    setFormData({});
    setEditMode(false);
    setEditingId(null);
    setSelectedId(null);
    setIsModalOpen(false);
  };

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

  const toggleRowSelection = (id, checked) => {
    setSelectedId(checked ? id : null);
  };

  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="flex gap-3 flex-1 ">
        {/* TABLE */}
        <div className="flex-1 overflow-auto border dark:border-slate-700 rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-xs uppercase sticky top-0">
              <tr>
                <th className="px-2 py-2"></th>
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
                        onChange={(e) =>
                          toggleRowSelection(row.id, e.target.checked)
                        }
                      />
                    </td>
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
          <button
            onClick={openAdd}
            className="px-3 py-1 rounded bg-slate-700 text-white text-sm cursor-pointer"
          >
            Add
          </button>

          <button
            onClick={openEdit}
            className="px-3 py-1 rounded bg-slate-700 text-white text-sm"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="px-3 py-1 rounded bg-slate-700 text-white text-sm"
          >
            Delete
          </button>
        </div>
      </div>

   
      {isModalOpen && (
        <GenericPopupModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <div className="p-4 space-y-3">
            <h2 className="text-lg font-semibold text-gray-100 mb-2">
              {editMode ? "Edit Exception" : "Add Exception"}
            </h2>

     
            <GenericFormFields
              screenConfig={exceptionConfig}
              formData={formData}
              setFormData={setFormData}
            />

            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 bg-slate-700 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrEditException}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                {editMode ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </GenericPopupModal>
      )}
    </div>
  );
}

const AdvancedDeviceControl = ({ formData, setFormData, config }) => {
  const [activeView, setActiveView] = useState("deviceTypes");

  const advancedControlData =
    formData.advancedDeviceControl ||
    JSON.parse(
      JSON.stringify(config.initialFormData?.advancedDeviceControl || {})
    );

  const updateAdvancedControl = (newData) => {
    setFormData({
      ...formData,
      advancedDeviceControl: newData,
    });
  };

  const updateDeviceSetting = (category, device, value) => {
    const updated = {
      ...advancedControlData,
      deviceTypes: {
        ...advancedControlData.deviceTypes,
        [category]: {
          ...advancedControlData.deviceTypes[category],
          devices: {
            ...advancedControlData.deviceTypes[category].devices,
            [device]: value,
          },
        },
      },
    };
    updateAdvancedControl(updated);
  };
  const toggleCategory = (category) => {
    const updated = {
      ...advancedControlData,
      deviceTypes: {
        ...advancedControlData.deviceTypes,
        [category]: {
          ...advancedControlData.deviceTypes[category],
          enabled: !advancedControlData.deviceTypes[category]?.enabled,
        },
      },
    };
    updateAdvancedControl(updated);
  };
  const getDeviceValue = (category, device) => {
    return (
      advancedControlData.deviceTypes[category]?.devices?.[device] || "allow"
    );
  };

  const deviceCategories = config.deviceCategories || [];

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
   
      <div className="mb-6">
        <label className="flex items-center text-sm font-medium text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={advancedControlData.enabled}
            onChange={(e) =>
              updateAdvancedControl({
                ...advancedControlData,
                enabled: e.target.checked,
              })
            }
            className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          <span className="ml-2">Enable Advanced Device Control</span>
        </label>
      </div>

    
      <div className="flex space-x-6 border-b border-gray-700 mb-6">
        <button
          onClick={() => setActiveView("deviceTypes")}
          className={`pb-2 text-sm font-medium transition-colors ${
            activeView === "deviceTypes"
              ? "text-blue-400 border-b-2 border-blue-500"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Device Types
        </button>
        <button
          onClick={() => setActiveView("exceptions")}
          className={`pb-2 text-sm font-medium transition-colors ${
            activeView === "exceptions"
              ? "text-blue-400 border-b-2 border-blue-500"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Exceptions
        </button>
      </div>

      {activeView === "deviceTypes" && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-4">
            Select Access Policy for Device Types
          </h4>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {deviceCategories.map((category) => (
              <div
                key={category.id}
                className={`bg-gray-800 rounded-lg p-4 ${
                  !advancedControlData.enabled ? "opacity-60" : ""
                }`}
              >
       
                <label className="flex items-center text-sm font-medium text-gray-300 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={
                      advancedControlData.deviceTypes[category.id]?.enabled ||
                      false
                    }
                    onChange={() => toggleCategory(category.id)}
                    disabled={!advancedControlData.enabled}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="ml-2">{category.label}</span>
                </label>

              
                <div
                  className={`space-y-3 ml-6 ${
                    !advancedControlData.deviceTypes[category.id]?.enabled
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  {category.devices.map((device) => (
                    <div
                      key={device.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="text-sm text-gray-300 flex-1">
                        {device.label}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="relative">
                          <select
                            value={getDeviceValue(category.id, device.id)}
                            onChange={(e) =>
                              updateDeviceSetting(
                                category.id,
                                device.id,
                                e.target.value
                              )
                            }
                            disabled={
                              !advancedControlData.enabled ||
                              !advancedControlData.deviceTypes[category.id]
                                ?.enabled
                            }
                            className="appearance-none bg-gray-900 border border-gray-600 rounded px-3 py-1 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 pr-8"
                          >
                            <option value="allow">Allow</option>
                            <option value="block">Block</option>
                          </select>
                          <ChevronDown
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={14}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === "exceptions" && (
        <div className="text-center py-8 text-gray-500 text-sm">
          Exceptions configuration will be implemented here
        </div>
      )}
    </div>
  );
};
const WebCategoriesSection = ({ formData, setFormData, config }) => {
  const webCategories = config.webCategories || [];


  const isEnabled = formData?.RestrictCategories || false;

  const categoriesData = formData?.webCategories || {};

  const toggleCategory = (categoryId, action) => {
    const updatedCategories = {
      ...categoriesData,
      [categoryId]: action,
    };

    setFormData({
      ...formData,
      webCategories: updatedCategories,
    });
  };

  const getCategoryStatus = (categoryId) => {
    return categoriesData[categoryId] || "deny";
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center text-sm font-medium text-gray-300 cursor-pointer mb-4">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={(e) =>
            setFormData({
              ...formData,
              RestrictCategories: e.target.checked,
            })
          }
          className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500"
        />
        <span className="ml-2">
          Restrict access to particular categories of website
        </span>
      </label>


      <div
        className={`bg-gray-800 rounded-lg border border-gray-700 overflow-hidden ${
          !isEnabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {" "}
        <table className="min-w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Category
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-300 w-64">
                Access Control
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {webCategories.map((category) => {
              const status = getCategoryStatus(category.id);
              const isAllowed = status === "allow";

              return (
                <tr key={category.id} className="hover:bg-gray-750">
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {category.label}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center ">
           
                      <button
                        onClick={() => toggleCategory(category.id, "allow")}
                        className={`px-4  text-xs font-medium rounded-l-lg border border-r-0 transition-colors ${
                          isAllowed
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-gray-700 text-gray-400 border-gray-600 hover:bg-gray-600"
                        }`}
                      >
                        Allow
                      </button>

                      <button
                        onClick={() => toggleCategory(category.id, "deny")}
                        className={`px-4  text-xs font-medium rounded-r-lg border border-l-0 transition-colors ${
                          !isAllowed
                            ? "bg-red-500 text-white border-red-500"
                            : "bg-gray-700 text-gray-400 border-gray-600 hover:bg-gray-600"
                        }`}
                      >
                        Deny
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UrlExceptionsSection = ({ formData, setFormData, config }) => {
  const [urlExceptions, setUrlExceptions] = useState(
    formData?.urlExceptions || []
  );
  const [modalFormData, setModalFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const urlConfig = config?.urlExceptionsConfig?.screens?.UrlExceptionForm;

  if (!urlConfig || !urlConfig.fields) {
    return (
      <div className="text-red-500 p-4">
        Error: URL exceptions configuration not found.
      </div>
    );
  }

  const openAddModal = () => {
    setModalFormData({});
    setEditMode(false);
    setEditingId(null);
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const openEditModal = () => {
    if (!selectedId) {
      alert("Please select a URL to edit.");
      return;
    }

    const row = urlExceptions.find((r) => r.id === selectedId);
    if (!row) return;

    setModalFormData({ ...row });
    setEditMode(true);
    setEditingId(selectedId);
    setIsModalOpen(true);
  };

  const handleAddOrEditUrl = () => {
    if (editMode && editingId) {
      const updated = urlExceptions.map((ex) =>
        ex.id === editingId ? { ...ex, ...modalFormData } : ex
      );
      setUrlExceptions(updated);
      setFormData({ ...formData, urlExceptions: updated });
    } else {
      // Add new
      const newUrl = { id: Date.now(), ...modalFormData };
      const updated = [...urlExceptions, newUrl];
      setUrlExceptions(updated);
      setFormData({ ...formData, urlExceptions: updated });
    }

    setModalFormData({});
    setEditMode(false);
    setEditingId(null);
    setSelectedId(null);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!selectedId) {
      alert("Please select a URL to delete.");
      return;
    }

    const ok = confirm("Delete selected URL?");
    if (!ok) return;

    const updated = urlExceptions.filter((r) => r.id !== selectedId);
    setUrlExceptions(updated);
    setFormData({ ...formData, urlExceptions: updated });
    setSelectedId(null);
  };

  const toggleRowSelection = (id, checked) => {
    setSelectedId(checked ? id : null);
  };

  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="flex gap-3 flex-1">
      
        <div className="flex-1 overflow-auto border dark:border-slate-700 rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-xs uppercase sticky top-0">
              <tr>
                <th className="px-2 py-2 w-10"></th>
                <th className="px-2 py-2 text-left">URL</th>
                <th className="px-2 py-2 text-left">Block Subdomains</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {urlExceptions.length > 0 ? (
                urlExceptions.map((row) => (
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
                        onChange={(e) =>
                          toggleRowSelection(row.id, e.target.checked)
                        }
                      />
                    </td>
                    <td className="px-2 py-2 text-gray-300">{row.url || ""}</td>
                    <td className="px-2 py-2 text-gray-300">
                      {row.blockSubdomains ? "Yes" : "No"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-4 text-slate-500 text-sm ml-2"
                  >
                    No URL exceptions added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={openAddModal}
            className="px-3 py-1 rounded bg-slate-700 text-white text-sm cursor-pointer"
          >
            Add
          </button>
          <button
            onClick={openEditModal}
            className="px-3 py-1 rounded bg-slate-700 text-white text-sm"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 rounded bg-slate-700 text-white text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {isModalOpen && (
        <GenericPopupModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <div className="p-4 space-y-3">
            <h2 className="text-lg font-semibold text-gray-100 mb-2">
              {editMode ? "Edit URL Exception" : "Add URL Exception"}
            </h2>

            <GenericFormFields
              screenConfig={urlConfig}
              formData={modalFormData}
              setFormData={setModalFormData}
            />

            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 bg-slate-700 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrEditUrl}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                {editMode ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </GenericPopupModal>
      )}
    </div>
  );
};
const FirewallRulesSection = ({ formData, setFormData, config }) => {
  const [firewallRules, setFirewallRules] = useState(formData?.firewallRules || []);
  const [modalFormData, setModalFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const firewallConfig = config?.firewallRulesConfig?.screens?.FirewallRuleForm;
  const isMultiStep = firewallConfig?.type === "multi-step";
  
  // Get all fields from all steps for table headers
  const allFields = isMultiStep 
    ? firewallConfig.steps.flatMap(step => step.fields)
    : firewallConfig?.fields || [];

  if (!firewallConfig || !allFields.length) {
    return (
      <div className="text-red-500 p-4">
        Error: Firewall rules configuration not found.
      </div>
    );
  }

  const openAddModal = () => {
    setModalFormData({});
    setEditMode(false);
    setEditingId(null);
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const openEditModal = () => {
    if (!selectedId) {
      alert("Please select a rule to edit.");
      return;
    }

    const row = firewallRules.find((r) => r.id === selectedId);
    if (!row) return;

    setModalFormData({ ...row });
    setEditMode(true);
    setEditingId(selectedId);
    setIsModalOpen(true);
  };

  const handleAddOrEditRule = () => {
    if (editMode && editingId) {
      const updated = firewallRules.map((rule) =>
        rule.id === editingId ? { ...rule, ...modalFormData } : rule
      );
      setFirewallRules(updated);
      setFormData({ ...formData, firewallRules: updated });
    } else {
      // Add new
      const newRule = { id: Date.now(), ...modalFormData };
      const updated = [...firewallRules, newRule];
      setFirewallRules(updated);
      setFormData({ ...formData, firewallRules: updated });
    }

    setModalFormData({});
    setEditMode(false);
    setEditingId(null);
    setSelectedId(null);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!selectedId) {
      alert("Please select a rule to delete.");
      return;
    }

    const ok = confirm("Delete selected firewall rule?");
    if (!ok) return;

    const updated = firewallRules.filter((r) => r.id !== selectedId);
    setFirewallRules(updated);
    setFormData({ ...formData, firewallRules: updated });
    setSelectedId(null);
  };

  const toggleRowSelection = (id, checked) => {
    setSelectedId(checked ? id : null);
  };

  return (
    <div className="space-y-3 w-4xl h-full flex flex-col ">
      <div className="flex gap-3">
        <div className="flex-1 overflow-auto border dark:border-slate-700 rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-xs uppercase sticky top-0">
              <tr>
                <th className="px-2 py-2 w-10"></th>
                {allFields.map((field) => (
                  <th key={field.name} className="px-2 py-2 text-left">
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {firewallRules.length > 0 ? (
                firewallRules.map((row) => (
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
                        onChange={(e) =>
                          toggleRowSelection(row.id, e.target.checked)
                        }
                      />
                    </td>
                    {allFields.map((field) => (
                      <td key={field.name} className="px-2 py-2 text-gray-300">
                        {row[field.name] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={allFields.length + 1} className="text-center py-4 text-slate-500 text-sm">
                    No firewall rules added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={openAddModal}
            className="px-3 py-1 rounded bg-slate-700 text-white text-sm cursor-pointer"
          >
            Add
          </button>
          <button
            onClick={openEditModal}
            className="px-3 py-1 rounded bg-slate-700 text-white text-sm"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 rounded bg-slate-700 text-white text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {isModalOpen && (
        <MultiStepFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setModalFormData({});
          }}
          screenConfig={firewallConfig}
          formData={modalFormData}
          setFormData={setModalFormData}
          onSubmit={(finalData) => {
            if (editMode && editingId) {
              const updated = firewallRules.map((rule) =>
                rule.id === editingId ? { ...rule, ...finalData } : rule
              );
              setFirewallRules(updated);
              setFormData({ ...formData, firewallRules: updated });
            } else {
              const newRule = { id: Date.now(), ...finalData };
              const updated = [...firewallRules, newRule];
              setFirewallRules(updated);
              setFormData({ ...formData, firewallRules: updated });
            }
            setEditMode(false);
            setEditingId(null);
            setSelectedId(null);
          }}
        />
      )}
    </div>
  );
};


const MultiStepFormModal = ({ isOpen, onClose, screenConfig, formData, setFormData, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [localFormData, setLocalFormData] = useState(formData || {});

  const steps = screenConfig?.steps || [];
  const currentStepConfig = steps[currentStep];

  // Custom form field renderer for the modal with consistent styling
  const renderField = (field) => {
    const value = localFormData[field.name] || field.defaultValue || '';

    const handleChange = (newValue) => {
      setLocalFormData(prev => ({
        ...prev,
        [field.name]: newValue
      }));
    };

    // Use the same styling as GenericFormFields
    const inputClass = "w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-1 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
    const labelClass = "block text-sm font-medium text-gray-200 mb-1";

    switch (field.type) {
      case "text":
      case "number":
      case "email":
        return (
          <div key={field.name}>
            <label className={labelClass}>{field.label}</label>
            <input
              type={field.type}
              value={value || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              className={inputClass}
            />
          </div>
        );

      case "textarea":
        return (
          <div key={field.name}>
            <label className={labelClass}>{field.label}</label>
            <textarea
              value={value || ''}
              onChange={(e) => handleChange(e.target.value)}
              rows={field.rows || 4}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              className={`${inputClass} resize-vertical`}
            />
          </div>
        );

      case "select":
        return (
          <div key={field.name}>
            <label className={labelClass}>{field.label}</label>
            <select
              value={value || ''}
              onChange={(e) => handleChange(e.target.value)}
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

      case "radio":
        return (
          <div key={field.name}>
            <label className={labelClass}>{field.label}</label>
            <div className="space-y-1">
              {field.options?.map((opt) => {
                const val = opt.value || opt;
                const label = opt.label || opt;
                return (
                  <label key={val} className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="radio"
                      name={field.name}
                      checked={value === val}
                      onChange={() => handleChange(val)}
                      className="w-4 h-4 border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      case "checkbox":
        return (
          <label key={field.name} className="flex items-start gap-2 text-sm text-gray-200">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleChange(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 mt-0.5"
            />
            <div className="flex flex-col">
              <span>{field.label}</span>
              {field.description && (
                <span className="text-xs text-gray-400 mt-1">{field.description}</span>
              )}
            </div>
          </label>
        );

      default:
        return (
          <div key={field.name} className="text-gray-400 text-sm">
            Unsupported field type: {field.type}
          </div>
        );
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step - submit
      onSubmit(localFormData);
      onClose();
      setCurrentStep(0);
      setLocalFormData({});
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <GenericPopupModal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 space-y-4 w-4xl">
        {/* Step Progress */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-100">
            {currentStepConfig?.title || `Step ${currentStep + 1}`}rerer
          </h2>
          <span className="text-sm text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>

        {/* Form Fields for Current Step - using same grid as GenericFormFields */}
        <div className="min-h-[200px]">
          <div className="grid lg:grid-cols-1 sm:grid-cols-2 gap-6 px-2">
            {currentStepConfig?.fields?.map((field) => (
              <div 
                key={field.name} 
                className={field.fullWidth ? "sm:col-span-2" : ""}
              >
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-700 gap-6">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>

        </div>
      </div>
    </GenericPopupModal>
  );
};
const dataForUi = {
  tabs: [
    { id: "antivirus", label: "Anti Virus" },
    { id: "ApplicationControl", label: "Application Control" },
    { id: "USB", label: "USB Control" },
    { id: "Website", label: "Website Control" },
    { id: "Firewall", label: "Firewall" },
  ],

  deviceCategories: [
    {
      id: "storage",
      label: "Storage Devices",
      devices: [
        { id: "usbStorage", label: "USB Storage Device" },
        { id: "cdDvd", label: "CD/DVD" },
        { id: "internalCardReader", label: "Internal Card Reader" },
        { id: "internalFloppy", label: "Internal Floppy Drive" },
        { id: "zipDrive", label: "ZIP Drive" },
      ],
    },
    {
      id: "wireless",
      label: "Wireless",
      devices: [
        { id: "wifi", label: "Wi-Fi" },
        { id: "bluetooth", label: "Bluetooth" },
      ],
    },
    {
      id: "Interface",
      label: "Interface",
      devices: [
        { id: "FirewireBus", label: "Firewire Bus" },
        { id: "SerialPort", label: "Serial Port" },
        { id: "SataController", label: "Sata Controller" },
        { id: "ThunderBolt", label: "Thunder Bolt" },
        { id: "PCMCIA", label: "PCMCIA Device" },
        { id: "USB", label: "USB" },
      ],
    },
    {
      id: "cardReaders",
      label: "Card Readers",
      devices: [
        { id: "mtdReader", label: "Card Reader Device (MTD)" },
        { id: "scsiReader", label: "Card Reader Device (SCSI)" },
      ],
    },
    {
      id: "mobile",
      label: "Mobile & Portable Devices",
      devices: [
        { id: "windowsPortable", label: "Windows Portable Device" },
        { id: "iphone", label: "iPhone" },
        { id: "ipad", label: "iPad" },
        { id: "ipod", label: "iPod" },
        { id: "blackberry", label: "BlackBerry" },
      ],
    },
    {
      id: "camera",
      label: "Camera",
      devices: [{ id: "webCam", label: "Webcam" }],
    },
    {
      id: "others",
      label: "Others",
      devices: [
        { id: "localPrinters", label: "Local Printers" },
        { id: "TeensyBoard", label: "Teensy Board" },
        { id: "NetworkShare", label: "Network Share" },
        { id: "UnknownDevice", label: "Unknown Device" },
      ],
    },
  ],

  initialFormData: {
    advancedDeviceControl: {
      enabled: false,
      deviceTypes: {
        storage: {
          enabled: true,
          devices: {
            usbStorage: "allow",
            cdDvd: "allow",
            internalCardReader: "allow",
            internalFloppy: "allow",
            zipDrive: "allow",
          },
        },
        wireless: {
          enabled: false,
          devices: {
            wifi: "allow",
            bluetooth: "allow",
          },
        },
        Interface: {
          enabled: false,
          devices: {
            FirewireBus: "allow",
            SerialPort: "allow",
            SataController: "allow",
            ThunderBolt: "allow",
            PCMCIA: "allow",
            USB: "allow",
          },
        },
        cardReaders: {
          enabled: false,
          devices: {
            mtdReader: "allow",
            scsiReader: "allow",
          },
        },
        mobile: {
          enabled: false,
          devices: {
            windowsPortable: "allow",
            iphone: "allow",
            ipad: "allow",
            ipod: "allow",
            blackberry: "allow",
          },
        },
        camera: {
          enabled: false,
          devices: {
            webCam: "allow",
          },
        },
        others: {
          enabled: false,
          devices: {
            localPrinters: "allow",
            TeensyBoard: "allow",
            NetworkShare: "allow",
            UnknownDevice: "allow",
          },
        },
      },
    },
  },

  screens: {
    ApplicationControl: {
      type: "custom",
      title: "Application Control Section",
      sections: [
        {
          id: "basic-settings",
          type: "form",
          title: "Basic Application Rules",
          fields: [
            {
              name: "mode",
              label: "Application Mode",
              type: "radio",
              options: ["Learning", "Protection"],
              defaultValue: "Learning",
            },
          ],
        },
        {
          id: "application-control-section",
          type: "custom",
          title: "Application Management",
          customComponent: ({ formData, setFormData, config }) => (
            <ExceptionsSection
              parentFormData={formData}
              setParentFormData={setFormData}
              config={config}
            />
          ),
        },
      ],
    },
    USB: {
      title: "USB Control Settings",
      sections: [
        {
          id: "advanced-device-control",
          type: "custom",
          title: "Advanced Device Control",
          customComponent: ({ formData, setFormData, config }) => (
            <AdvancedDeviceControl
              formData={formData}
              setFormData={setFormData}
              config={config}
            />
          ),
        },
      ],
    },

    Website: {
      title: "Website Protection Settings",
      sections: [
        {
          id: "website-security",
          type: "form",
          title: "Website Security",
          fields: [
            {
              name: "BrowsingProtection",
              label: "Browsing Protection",
              type: "checkbox",
              defaultValue: false,
            },
            {
              name: "PhishingProtection",
              label: "Phishing Protection",
              type: "checkbox",
              defaultValue: false,
            },
          ],
        },
        {
          id: "alert-settings",
          type: "form",
          fields: [
            {
              name: "DisplayAlertOnBlock",
              label: "Display alert message when website is blocked",
              type: "checkbox",
              defaultValue: false,
            },
          ],
        },
        {
          id: "web-categories",
          type: "custom", 
          title: "Web Categories",
          customComponent: ({ formData, setFormData, config }) => (
            <WebCategoriesSection
              formData={formData}
              setFormData={setFormData}
              config={config}
            />
          ),
        },
        {
          id: "url-exceptions",
          type: "custom",
          title: "URL Exceptions",
          subHeading: "List of restricted websites / urls ",
          customComponent: ({ formData, setFormData, config }) => (
            <UrlExceptionsSection
              formData={formData}
              setFormData={setFormData}
              config={config}
            />
          ),
        },
      ],
    },
    Firewall: {
      title: "Firewall Protection Settings",
      sections: [
        {
          id: "firewall-security",
          type: "form",
          title: "Firewall Security",
          fields: [
            {
              name: "enableFirewall",
              label: "Enable Firewall",
              type: "checkbox",
              defaultValue: false,
              onBeforeChange: (currentValue, newValue) => {
                if (newValue === true) {
                  return window.confirm(
                    "This action will disable Windows Firewall on your endpoint. Do you want to continue?"
                  );
                }
                return true;
              },
            },
          ],
        },

        {
          id: "level",
          type: "form",
          title: "Level",
          fields: [
            {
              name: "firewallMode",
              label: "Firewall Mode",
              type: "radio",
              options: [
                { label: "Block All", value: "all" },
                { label: "High Security", value: "high" },
                { label: "Medium Security", value: "medium" },
                { label: "Low Security", value: "low" },
              ],
              defaultValue: "medium",
            },
          ],
        },
        {
          id: "wifi-configuration",
          type: "form",
          title: "WiFi Configuration",
          fields: [
            {
              name: "MonitorWiFinetworks",
              label: "Monitor WiFi networks",
              type: "checkbox",
              defaultValue: false,
            },
          ],
        },
        {
          id: "firewallViolationAlert",
          type: "form",
          fields: [
            {
              name: "firewallViolationAlertMsg",
              label: "Display alert message when firewall violation occure",
              type: "checkbox",
              defaultValue: false,
            },
            {
              name: "firewallReports",
              label: "Enable firewall reports",
              type: "checkbox",
              description:
                "Enabling this option will generate reports for all blocked traffic. If the firewall policy & set as Block All or High then firewall wil block all traffic and wil generate many reports. In this case you may observe increase in network trafic.",
              defaultValue: false,
            },
          ],
        },
        {
          id: "firewall-rules",
          type: "custom",
          title: "Exceptions",
          customComponent: ({ formData, setFormData, config }) => (
            <FirewallRulesSection
              formData={formData}
              setFormData={setFormData}
              config={config}
            />
          ),
        },
      ],
    },
  },

  urlExceptionsConfig: {
    screens: {
      UrlExceptionForm: {
        fields: [
          {
            name: "url",
            label: "URL",
            type: "text",
            placeholder: "Enter website URL (e.g., example.com)",
          },
          {
            name: "blockSubdomains",
            label: "Block Subdomains",
            description:
              "Enabling this option will also blobk subdomain . E.g. if you add xyz.com and enable the checkbox also block subdomains then mail.xyz.com will also be blocked.",
            type: "checkbox",
            defaultValue: false,
          },
        ],
      },
    },
  },
  exceptionFormConfig: {
    screens: {
      ExceptionForm: {
        fields: [
          {
            name: "applicationType",
            label: "Application Type",
            type: "select",
            options: ["Allow", "Prevent"],
          },
          {
            name: "signatureType",
            label: "Signature Type",
            type: "select",
            options: ["SHA256", "SHA512", "MD5"],
          },
          { name: "filePath", label: "File Path", type: "text" },
          { name: "sha", label: "SHA", type: "text" },
        ],
      },
    },
  },

firewallRulesConfig: {
  screens: {
    FirewallRuleForm: {
      type: "multi-step",
      steps: [
        {
          title: "Exceptions",
          fields: [
            {
              name: "exceptionName",
              label: "Exception Name",
              type: "text",
              placeholder: "Enter rule name",
              required: true
            },
            {
              name: "protocol",
              label: "Select Protocol",
              type: "radio",
              options: [
                { label: "TCP", value: "TCP" },
                { label: "UDP", value: "UDP" },
                { label: "ICMP", value: "ICMP" }
              ],
              defaultValue: "TCP"
            },
            {
              name: "Application Allow",
              label: "Enable Rule Immediately",
              type: "radio",
               options: [
                { label: "All", value: "All Application that meet specific condition" },
                { label: "specific", value: "Specific application Path" },],
              defaultValue: true
            }
          ]
        },
        {
          title: "Directions",
          fields: [
             {name: "direction",
              label: "Select Direction",
              type: "radio",
              options: [
                { label: "Inbound Connections", value: "inbound" },
                { label: "Outbound Connections", value: "outbound" },
                { label: "Inbound-Outbound", value: "both" }
              ],
            }
          
          ]
        },
        {
      title:"Actions",
        fields: [
             {name: "Actions",
              label: "Select Direction",
              type: "radio",
              options: [
                { label: "Allow", value: "Allow" },
                { label: "Deny", value: "Deny" },
              ],
            },
          
          ]
        },
      
      ]
    }
  }
},

  webCategories: [
    { id: "education", label: "Education" },
    { id: "shopping", label: "Shopping" },
    { id: "finance", label: "Finance & Banking" },
    { id: "social", label: "Social Media" },
    { id: "entertainment", label: "Entertainment" },
    { id: "gaming", label: "Gaming" },
    { id: "news", label: "News & Media" },
    { id: "technology", label: "Technology" },
    { id: "travel", label: "Travel" },
    { id: "health", label: "Health & Fitness" },
  ],

  actions: [
    {
      label: "Save Draft",
      variant: "secondary",
      onClick: (data) => console.log("Draft:", data),
    },
    {
      label: "Submit",
      variant: "success",
      onClick: (data) => console.log("Submit:", data),
    },
  ],
};

export default () => <PolicySetupFirewall config={dataForUi} />;
