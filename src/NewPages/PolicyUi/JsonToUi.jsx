import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function JsonToUi() {
  const [policies, setPolicies] = useState([]);
  const [selectedPolicyIndex, setSelectedPolicyIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("general");
  const [dark, setDark] = useState(true);

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
      rules: {
        type: "rules",
        rules: [],
      },

      matrix: {
        type: "matrix",
        rows: [],
        columns: [],
      },

      exceptions: {
        type: "exceptions",
        items: [],
      },

      preview: {
        type: "preview",
      },
    },
  };

  //  Load Initial Policy
  useEffect(() => {
    const data = [
      {
         id : (crypto?.randomUUID?.() ||
  Math.random().toString(36).substring(2, 10) + 
  Date.now().toString(36)),

        name: "Default Policy",
        ...blankPolicyJson,
        formData: {},
      },
    ];
    setPolicies(data);
  }, []);

  //  Add Policy
  const addPolicy = () => {
    const newPolicy = {
      id: crypto.randomUUID(),
      name: `New Policy ${policies.length + 1}`,
      ...blankPolicyJson,
      formData: {},
    };
    setPolicies([...policies, newPolicy]);
    setSelectedPolicyIndex(policies.length);
  };

  // Delete Policy
  const deletePolicy = (id) => {
    const updated = policies.filter((p) => p.id !== id);
    setPolicies(updated);
    setSelectedPolicyIndex(0);
  };

  //  Rename
  const renamePolicy = (index, newName) => {
    const updated = [...policies];
    updated[index].name = newName;
    setPolicies(updated);
  };

  const currentPolicy = policies[selectedPolicyIndex];
  const screen = currentPolicy?.screens[activeTab];

  return (
    <div
      className={`${
        dark ? "dark" : ""
      } min-h-screen bg-slate-50 dark:bg-slate-900 p-6`}
    >
      <div className="max-full mx-11">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold flex items-center gap-3">
            Policy Creator
          </h1>
          <button
            onClick={addPolicy}
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-600 text-white"
          >
            <span className="text-sm font-medium">+ Add Policy</span>
          </button>
        </header>

        <div className="bg-white/80 dark:bg-slate-800/70 rounded-2xl shadow p-4">
          <div className="flex items-start gap-4">
            <main className="flex-1">
              <div className="flex w-full h-full gap-4">
                {/* Sidebar */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="w-64 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="font-semibold">Policies</h2>
                    <button
                      onClick={addPolicy}
                      className="bg-blue-600 text-white px-2 py-1 text-sm rounded-md"
                    >
                      + Add
                    </button>
                  </div>

                  {policies.map((p, index) => (
                    <div
                      key={p.id}
                      className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                        selectedPolicyIndex === index
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setSelectedPolicyIndex(index)}
                    >
                      <input
                        className={`bg-transparent outline-none w-full ${
                          selectedPolicyIndex === index ? "text-white" : ""
                        }`}
                        value={p.name}
                        onChange={(e) => renamePolicy(index, e.target.value)}
                      />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePolicy(p.id);
                        }}
                        className="text-red-500 ml-2"
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </motion.div>

                {currentPolicy && (
                  <div className="flex-1 border rounded-xl p-4 mb-6">
                    {/* Tabs */}
                    <nav className="flex gap-2 mb-3 items-center">
                      {currentPolicy.tabs.map((t) => (
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

                    {/* Forms */}
                    <AnimatePresence mode="wait">
                      <motion.section
                        key={activeTab}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border p-8"
                      >
                     

                        {screen?.type === "form" && (
                          <FormRenderer schema={screen} />
                        )}
                        {screen?.type === "rules" && (
                          <RulesComponent data={screen} />
                        )}
                        {screen?.type === "matrix" && (
                          <MatrixComponent data={screen} />
                        )}
                        {screen?.type === "exceptions" && (
                          <ExceptionsComponent data={screen} />
                        )}
                        {screen?.type === "preview" && (
                          <PreviewComponent policy={currentPolicy} />
                        )}
                      </motion.section>
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>     
  );
}

const FormRenderer = ({ schema }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="space-y-3">
      <h2 className="text-lg font-bold mb-3">{schema.title}</h2>

      {schema.fields?.map((field) => {
        const commonProps = {
          name: field.name,
          value: formData[field.name] || "",
          onChange: (e) => handleChange(field.name, e.target.value),
          className: "border p-2 rounded w-full bg-white dark:bg-slate-700",
        };

        switch (field.type) {
          case "text":
          case "email":
          case "password":
          case "number":
          case "date":
            return (
              <div key={field.name}>
                <label className="block mb-1 text-sm font-medium">
                  {field.label}
                </label>
                <input type={field.type} {...commonProps} />
              </div>
            );

          case "textarea":
            return (
              <div key={field.name}>
                <label className="block mb-1 text-sm font-medium">
                  {field.label}
                </label>
                <textarea {...commonProps} rows={3} />
              </div>
            );

          case "select":
            return (
              <div key={field.name}>
                <label className="block mb-1 text-sm font-medium">
                  {field.label}
                </label>
                <select
                  {...commonProps}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                >
                  <option value="">Select</option>
                  {field.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            );

          case "radio":
            return (
              <div key={field.name}>
                <label className="block mb-1 text-sm font-medium">
                  {field.label}
                </label>
                <div className="flex gap-4">
                  {field.options.map((o) => (
                    <label key={o} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={field.name}
                        checked={formData[field.name] === o}
                        onChange={() => handleChange(field.name, o)}
                      />
                      {o}
                    </label>
                  ))}
                </div>
              </div>
            );

          case "checkbox":
            return (
              <div key={field.name} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!formData[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.checked)}
                />
                <label className="text-sm font-medium">{field.label}</label>
              </div>
            );

          case "checkbox-group":
            return (
              <div key={field.name}>
                <label className="block mb-1 text-sm font-medium">
                  {field.label}
                </label>
                <div className="flex gap-4 flex-wrap">
                  {field.options.map((o) => (
                    <label key={o} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={formData[field.name]?.includes(o) || false}
                        onChange={(e) => {
                          const selected = formData[field.name] || [];
                          if (e.target.checked) {
                            handleChange(field.name, [...selected, o]);
                          } else {
                            handleChange(
                              field.name,
                              selected.filter((x) => x !== o)
                            );
                          }
                        }}
                      />
                      {o}
                    </label>
                  ))}
                </div>
              </div>
            );

          case "multiselect":
            return (
              <div key={field.name}>
                <label className="block mb-1 text-sm font-medium">
                  {field.label}
                </label>

                <div className="space-y-1">
                  {field.options.map((option) => {
                    const selectedValues = formData[field.name] || [];

                    return (
                      <label
                        key={option}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedValues.includes(option)}
                          onChange={(e) => {
                            const newValues = e.target.checked
                              ? [...selectedValues, option]
                              : selectedValues.filter((val) => val !== option);

                            handleChange(field.name, newValues);
                          }}
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
              </div>
            );

          case "file":
            return (
              <div key={field.name}>
                <label className="block mb-1 text-sm font-medium">
                  {field.label}
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    handleChange(field.name, e.target.files?.[0])
                  }
                  className={commonProps.className}
                />
              </div>
            );

          default:
            return null;
        }
      })}

      <button
        type="button"
        className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
        onClick={() => console.log("Submit Data:", formData)}
      >
        Save
      </button>
    </form>
  );
};

const RulesComponent = ({ data }) => (
  <div>
    <h3 className="font-bold mb-2">Rules</h3>
    <button className="bg-blue-600 text-white px-3 py-1 rounded">
      + Add Rule
    </button>
  </div>
);

const MatrixComponent = ({ data }) => (
  <div>
    <h3 className="font-bold mb-2">Matrix</h3>
    <p>Table UI will go here</p>
  </div>
);

const ExceptionsComponent = ({ data }) => (
  <div>
    <h3 className="font-bold mb-2">Exceptions</h3>
    <button className="bg-blue-600 text-white px-3 py-1 rounded">
      + Add Exception
    </button>
  </div>
);

const PreviewComponent = ({ policy }) => (
  <div>
    <h3 className="font-bold mb-2">Preview</h3>
    <pre className="text-xs p-2 bg-gray-900 text-green-400 rounded">
      {JSON.stringify(policy, null, 2)}
    </pre>
  </div>
);
