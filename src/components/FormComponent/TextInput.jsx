export default function TextInput({ 
  name, 
  label, 
  required,
  error,
  type,
  'data-field': dataField, 
  ...rest 
}) {
  return (

    <div>
      <label className="block text-xs font-medium text-gray-300 mb-1">
        {label} {required && <span className="text-cyan-400">*</span>}
      </label>
      <input

        name={name}
        type={type}
        data-field={dataField || name}
         className={`w-full px-3 py-1 text-sm bg-gray-800 border rounded-lg text-gray-200 
          transition-all ${
            error
              ? "border-red-500 ring-1 ring-red-500/30"
              : "border-gray-600 focus:ring-1 focus:ring-cyan-500/30 focus:border-cyan-500"
          }`}
                       

        {...rest}
      />
      {error && (
        <div className="mt-1 text-xs text-red-400 flex items-center">
          <svg
            className="w-3 h-3 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0
                11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1
                0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}
    </div>

  );
}