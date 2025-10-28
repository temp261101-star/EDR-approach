
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

const CheckBoxGroup = forwardRef(function CheckBoxGroup(
  {
    name,
    label,
    dataSource,
    dataDependsOn,
    options: initialOptions = [],
    value = [],
    sendAsArray = true,
    disabled = false,
    required = false,
    error,
    onChange,
    grid = 1, 
  },
  ref
) {
  const [options, setOptions] = useState(initialOptions);
  const [selected, setSelected] = useState(Array.isArray(value) ? value : []);
  const hiddenInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const el = hiddenInputRef.current;
    if (!el) return;

    const handler = (e) => {
      setIsLoading(true);
      const raw = Array.isArray(e.detail)
        ? e.detail
        : e.detail.data ?? [];

      const normalized = raw.map((d) => ({
        value: d.id ?? d.value ?? d,
        label: d.name ?? d.label ?? String(d),
      }));

      setOptions(normalized);
      setIsLoading(false);
    };

    el.addEventListener("optionsLoaded", handler);
    return () => el.removeEventListener("optionsLoaded", handler);
  }, []);

  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = sendAsArray
        ? JSON.stringify(selected)
        : selected.join(",");
      hiddenInputRef.current.dispatchEvent(
        new Event("change", { bubbles: true })
      );
    }
  }, [selected]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setSelected([]);
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = sendAsArray ? "[]" : "";
        hiddenInputRef.current.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      }
    },
  }));

  const handleCheck = (val) => {
    setSelected((prev) => {
      const newValues = prev.includes(val)
        ? prev.filter((v) => v !== val)
        : [...prev, val];
      onChange?.({ target: { name, value: newValues } });
      return newValues;
    });
  };

  return (
    <div className={`space-y-1 ${disabled ? "opacity-60" : ""}`}>
      {label && (
        <label className="block text-xs font-medium text-gray-300 mb-1">
          {label} {required && <span className="text-cyan-400">*</span>}
        </label>
      )}

      <div
        className={`
          p-3 rounded-lg border border-gray-700 bg-gray-800
          max-h-60 overflow-y-auto
        `}
      >
        {isLoading ? (
          <div className="text-gray-400 text-sm flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
            <span>Loading...</span>
          </div>
        ) : options.length > 0 ? (
          <div
            className={`grid gap-2 lg:grid-cols-${grid}  sm:grid-cols-2 md:grid-cols-2 ` }
          >
            {options.map((opt, i) => (
              <label
                key={i}
                className="flex items-center space-x-2 cursor-pointer text-sm text-gray-200 hover:text-cyan-400 transition"
              >
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={selected.includes(String(opt.value))}
                  onChange={() => handleCheck(String(opt.value))}
                  disabled={disabled}
                  className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-600 focus:ring-2"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm text-center">No options</div>
        )}
      </div>

      <input
        ref={hiddenInputRef}
        type="hidden"
        name={name}
        data-source={dataSource}
        data-depends-on={dataDependsOn}
      />

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
});

export default CheckBoxGroup;
