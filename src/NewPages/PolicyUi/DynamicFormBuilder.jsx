import React, { useState } from 'react';
import { ChevronRight, Plus, Trash2, Eye, FileText } from 'lucide-react';

const DynamicFormBuilder = ({ config }) => {
  const [activeTab, setActiveTab] = useState(config.tabs[0]?.id || '');
  const [formData, setFormData] = useState({});
  const [rules, setRules] = useState([]);
  const [matrixData, setMatrixData] = useState({ rows: [], columns: [] });
  const [exceptions, setExceptions] = useState([]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderField = (field) => {
    const baseInputClass = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
    const labelClass = "block text-sm font-medium text-gray-300 mb-1.5";

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <div key={field.name} className="mb-4">
            <label className={labelClass}>{field.label}</label>
            <input
              type={field.type}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={baseInputClass}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="mb-4">
            <label className={labelClass}>{field.label}</label>
            <textarea
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              rows={4}
              className={baseInputClass}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="mb-4">
            <label className={labelClass}>{field.label}</label>
            <select
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={baseInputClass}
            >
              <option value="">Select {field.label.toLowerCase()}</option>
              {field.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        );

      case 'multiselect':
        return (
          <div key={field.name} className="mb-4">
            <label className={labelClass}>{field.label}</label>
            <div className="space-y-2">
              {field.options?.map(opt => (
                <label key={opt} className="flex items-center text-sm text-gray-300 hover:text-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData[field.name] || []).includes(opt)}
                    onChange={(e) => {
                      const current = formData[field.name] || [];
                      const updated = e.target.checked
                        ? [...current, opt]
                        : current.filter(v => v !== opt);
                      handleInputChange(field.name, updated);
                    }}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="ml-2">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'radio':
        return (
          <div key={field.name} className="mb-4">
            <label className={labelClass}>{field.label}</label>
            <div className="space-y-2">
              {field.options?.map(opt => (
                <label key={opt} className="flex items-center text-sm text-gray-300 hover:text-gray-100 cursor-pointer">
                  <input
                    type="radio"
                    name={field.name}
                    checked={formData[field.name] === opt}
                    onChange={() => handleInputChange(field.name, opt)}
                    className="w-4 h-4 border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="ml-2">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'checkbox-group':
        return (
          <div key={field.name} className="mb-4">
            <label className={labelClass}>{field.label}</label>
            <div className="space-y-2">
              {field.options?.map(opt => (
                <label key={opt} className="flex items-center text-sm text-gray-300 hover:text-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData[field.name] || []).includes(opt)}
                    onChange={(e) => {
                      const current = formData[field.name] || [];
                      const updated = e.target.checked
                        ? [...current, opt]
                        : current.filter(v => v !== opt);
                      handleInputChange(field.name, updated);
                    }}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="ml-2">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'date':
        return (
          <div key={field.name} className="mb-4">
            <label className={labelClass}>{field.label}</label>
            <input
              type="date"
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={baseInputClass}
            />
          </div>
        );

      case 'file':
        return (
          <div key={field.name} className="mb-4">
            <label className={labelClass}>{field.label}</label>
            <input
              type="file"
              onChange={(e) => handleInputChange(field.name, e.target.files?.[0])}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
            />
          </div>
        );

      default:
        return null;
    }
  }; 

  const renderFormScreen = (screen) => (
    <div className="space-y-1">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">{screen.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {screen.fields?.map(renderField)}
      </div>
    </div>
  );

  const renderRulesScreen = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-100">Business Rules</h2>
        <button
          onClick={() => setRules([...rules, { id: Date.now(), condition: '', action: '' }])}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Rule
        </button>
      </div>
      <div className="space-y-3">
        {rules.map((rule, idx) => (
          <div key={rule.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Condition</label>
                  <input
                    type="text"
                    placeholder="e.g., age > 18"
                    value={rule.condition}
                    onChange={(e) => {
                      const updated = [...rules];
                      updated[idx].condition = e.target.value;
                      setRules(updated);
                    }}
                    className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Action</label>
                  <input
                    type="text"
                    placeholder="e.g., show additional fields"
                    value={rule.action}
                    onChange={(e) => {
                      const updated = [...rules];
                      updated[idx].action = e.target.value;
                      setRules(updated);
                    }}
                    className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={() => setRules(rules.filter(r => r.id !== rule.id))}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {rules.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No rules defined. Click "Add Rule" to create one.
          </div>
        )}
      </div>
    </div>
  );

  const renderMatrixScreen = () => (
    <div>
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Matrix Configuration</h2>
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rows</label>
            <input
              type="text"
              placeholder="Enter row labels (comma-separated)"
              onChange={(e) => setMatrixData(prev => ({ ...prev, rows: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Columns</label>
            <input
              type="text"
              placeholder="Enter column labels (comma-separated)"
              onChange={(e) => setMatrixData(prev => ({ ...prev, columns: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {matrixData.rows.length > 0 && matrixData.columns.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 px-3 text-left text-gray-400 font-medium"></th>
                  {matrixData.columns.map(col => (
                    <th key={col} className="py-2 px-3 text-left text-gray-300 font-medium">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixData.rows.map(row => (
                  <tr key={row} className="border-b border-gray-700/50">
                    <td className="py-2 px-3 text-gray-300 font-medium">{row}</td>
                    {matrixData.columns.map(col => (
                      <td key={col} className="py-2 px-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderExceptionsScreen = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-100">Exceptions</h2>
        <button
          onClick={() => setExceptions([...exceptions, { id: Date.now(), name: '', description: '' }])}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Exception
        </button>
      </div>
      <div className="space-y-3">
        {exceptions.map((exc, idx) => (
          <div key={exc.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  placeholder="Exception name"
                  value={exc.name}
                  onChange={(e) => {
                    const updated = [...exceptions];
                    updated[idx].name = e.target.value;
                    setExceptions(updated);
                  }}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Description"
                  rows={2}
                  value={exc.description}
                  onChange={(e) => {
                    const updated = [...exceptions];
                    updated[idx].description = e.target.value;
                    setExceptions(updated);
                  }}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setExceptions(exceptions.filter(e => e.id !== exc.id))}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {exceptions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No exceptions defined. Click "Add Exception" to create one.
          </div>
        )}
      </div>
    </div>
  );

  const renderPreviewScreen = () => (
    <div>
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Review & Submit</h2>
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <FileText size={16} /> Form Data
            </h3>
            <pre className="bg-gray-900 rounded-lg p-4 text-xs text-gray-300 overflow-auto max-h-60">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Rules ({rules.length})</h3>
            <div className="text-sm text-gray-400">{rules.length} rule(s) configured</div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Exceptions ({exceptions.length})</h3>
            <div className="text-sm text-gray-400">{exceptions.length} exception(s) configured</div>
          </div>
        </div>
        <button className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
          Submit Policy
        </button>
      </div>
    </div>
  );

  const renderScreen = () => {
    const screen = config.screens[activeTab];
    if (!screen) return null;

    switch (screen.type) {
      case 'form':
        return renderFormScreen(screen);
      case 'rules':
        return renderRulesScreen();
      case 'matrix':
        return renderMatrixScreen();
      case 'exceptions':
        return renderExceptionsScreen();
      case 'preview':
        return renderPreviewScreen();
      default:
        return <div className="text-gray-400">Unknown screen type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800">
          {/* Tabs */}
          <div className="border-b border-gray-800 bg-gray-900/50">
            <div className="flex overflow-x-auto">
              {config.tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400 bg-gray-800/50'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {renderScreen()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo with your JSON
const blankPolicyJson = {
  tabs: [
    { id: "general", label: "General", type: "form" },
    { id: "rules", label: "Rules", type: "rules" },
    { id: "notifications", label: "Notifications", type: "form" },
    { id: "matrix", label: "Matrix Table", type: "matrix" },
    { id: "exceptions", label: "Exceptions", type: "exceptions" },
    { id: "preview", label: "Preview & Submit", type: "preview" },
  ],
  screens: {
    general: {
      type: "form",
      title: "User Registration",
      fields: [
        { name: "firstName", label: "First Name", type: "text" },
        { name: "lastName", label: "Last Name", type: "text" },
        { name: "email", label: "Email", type: "email" },
        { name: "password", label: "Password", type: "password" },
        { name: "age", label: "Age", type: "number" },
        {
          name: "gender",
          label: "Gender",
          type: "radio",
          options: ["Male", "Female", "Other"],
        },
        {
          name: "hobbies",
          label: "Hobbies",
          type: "checkbox-group",
          options: ["Sports", "Music", "Reading"],
        },
        {
          name: "country",
          label: "Country",
          type: "select",
          options: ["India", "USA", "UK"],
        },
        {
          name: "user",
          label: "Select User",
          type: "select",
          options: ["user1", "user2", "user3"],
        },
        {
          name: "languages",
          label: "Languages Known",
          type: "multiselect",
          options: ["English", "Hindi", "Marathi"],
        },
        { name: "bio", label: "Bio", type: "textarea" },
        { name: "dob", label: "Date of Birth", type: "date" },
        { name: "resume", label: "Upload Resume", type: "file" },
      ],
    },
    notifications: {
      type: "form",
      title: "Notification Preferences",
      fields: [
        { name: "emailNotif", label: "Email Notifications", type: "radio", options: ["Enabled", "Disabled"] },
        { name: "smsNotif", label: "SMS Notifications", type: "radio", options: ["Enabled", "Disabled"] },
      ],
    },
    rules: { type: "rules", rules: [] },
    matrix: { type: "matrix", rows: [], columns: [] },
    exceptions: { type: "exceptions", items: [] },
    preview: { type: "preview" },
  },
};

export default () => <DynamicFormBuilder config={blankPolicyJson} />;