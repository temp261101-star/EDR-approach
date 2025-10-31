import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ReactDOM from "react-dom";

const LockIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>
);

const Checkbox = ({ checked, onChange, indeterminate = false }) => {
  const checkboxRef = useRef(null);
  useEffect(() => {
    if (checkboxRef.current) checkboxRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={checkboxRef}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-cyan-400 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2"
    />
  );
};

const normalizeValue = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
};

const arraysEqual = (a, b) =>
  a.length === b.length && a.every((val, i) => val === b[i]);

const MultiSelect = forwardRef(function MultiSelect(
  {
    name,
    label,
    children,
    dataAuto,
    dataSource,
    dataDependsOn,
    error,
    sendAsArray,
    required,
    options: initialOptions = [],
    value,
    onChange,
    placeholder = "Select options",
    disabled = false,
    multiSelect = false,
    searchable = true,
    showSelectAll = true,
    ...rest
  },
  ref
) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValues, setSelectedValues] = useState(() =>
    normalizeValue(value)
  );
  const [options, setOptions] = useState(initialOptions);
  const dropdownRef = useRef(null);
  const hiddenInputRef = useRef(null);
  // const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is inside the dropdown ref OR inside the portal dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // For portal, we need to check if the click target is inside any dropdown element
        const isInsidePortalDropdown = event.target.closest(
          "[data-dropdown-portal]"
        );
        if (!isInsidePortalDropdown) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setSelectedValues([]);
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = multiSelect && sendAsArray ? "[]" : "";
        hiddenInputRef.current.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      }
    },
  }));
  const normalizeOptions = (apiOptions) => {
    return apiOptions.map((d) => {
      let value, name;

      if (d.value && typeof d.value === "object") {
        value = d.value.key ?? d.value.id ?? JSON.stringify(d.value);
      } else {
        value = d.key ?? d.value ?? "";
      }

      if (d.label && typeof d.label === "object") {
        name = d.label.label ?? d.label.name ?? JSON.stringify(d.label);
      } else {
        name = d.label ?? d.name ?? String(d);
      }

      return { value: String(value), name: String(name) };
    });
  };

  useEffect(() => {
    const validValues = selectedValues.filter((v) =>
      options.some((opt) => opt.value === v)
    );
    if (!arraysEqual(validValues, selectedValues)) {
      setSelectedValues(validValues);
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = sendAsArray
          ? JSON.stringify(validValues)
          : validValues.join(",");
        hiddenInputRef.current.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      }
    }
  }, [options]);

  useEffect(() => {
    const inputEl = hiddenInputRef.current;
    if (!inputEl) return;

    const handler = (e) => {
      setIsLoading(true);
      const rawOptions = Array.isArray(e.detail)
        ? e.detail
        : e.detail.data ?? [];
      const normalized = normalizeOptions(rawOptions);
      setOptions(normalized);
      setIsLoading(false);
    };

    inputEl.addEventListener("optionsLoaded", handler);
    return () => inputEl.removeEventListener("optionsLoaded", handler);
  }, []);

  const processedOptions = useMemo(() => {
    if (options.length > 0) return options;
    return (
      React.Children.map(children, (child) => {
        if (child?.props?.value) {
          return {
            id: child.props.value,
            name: child.props.children,
            value: child.props.value,
          };
        }
        return null;
      })?.filter(Boolean) || []
    );
  }, [options, children]);

  const filteredOptions = useMemo(
    () =>
      processedOptions.filter(
        (option) =>
          option?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option?.value?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [processedOptions, searchTerm]
  );

  useEffect(() => {
    const newValue = normalizeValue(value);

    setSelectedValues((prev) =>
      arraysEqual(prev, newValue) ? prev : newValue
    );
  }, [value]);
  useEffect(() => {
    if (dataDependsOn && selectedValues.length === 0) {
      setOptions([]);
      if (hiddenInputRef.current) {
        hiddenInputRef.current.dispatchEvent(
          new CustomEvent("optionsLoaded", { detail: [] })
        );
      }
    }
  }, [selectedValues, dataDependsOn]);
  const handleSingleSelect = useCallback(
    (option) => {
      setSelectedValues([option.value]);
      onChange?.({ target: { name, value: option.value } });

      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = sendAsArray
          ? JSON.stringify([option.value])
          : option.value;

        hiddenInputRef.current.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      }

      setIsOpen(false);
      setSearchTerm("");
    },
    [name, onChange, multiSelect, sendAsArray]
  );

  const handleMultiSelect = useCallback(
    (option) => {
      setSelectedValues((prev) => {
        const newValues = prev.includes(option.value)
          ? prev.filter((v) => v !== option.value)
          : [...prev, option.value];

        onChange?.({ target: { name, value: newValues } });

        if (hiddenInputRef.current) {
          hiddenInputRef.current.value = sendAsArray
            ? JSON.stringify(newValues)
            : newValues.join(",");

          hiddenInputRef.current.dispatchEvent(
            new Event("change", { bubbles: true })
          );
        }

        return newValues;
      });
    },
    [name, onChange, sendAsArray]
  );

  const handleSelectAll = useCallback(() => {
    setSelectedValues((prev) => {
      const allValues = filteredOptions.map((o) => o.value);
      const isAllSelected = allValues.every((v) => prev.includes(v));

      const newValues = isAllSelected
        ? prev.filter((v) => !allValues.includes(v))
        : [...new Set([...prev, ...allValues])];

      onChange?.({ target: { name, value: newValues } });

      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = sendAsArray
          ? JSON.stringify(newValues)
          : newValues.join(",");

        hiddenInputRef.current.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      }

      return newValues;
    });
  }, [filteredOptions, name, onChange, sendAsArray]);

  const clearSelection = (e) => {
    e.stopPropagation();
    setSelectedValues([]);
    onChange?.({ target: { name, value: multiSelect ? [] : "" } });

    if (hiddenInputRef.current) {
      // hiddenInputRef.current.value = multiSelect && sendAsArray ? "[]" : "";
      hiddenInputRef.current.value = sendAsArray ? "[]" : "";
      const changeEvent = new Event("change", { bubbles: true });
      hiddenInputRef.current.dispatchEvent(changeEvent);
    }
  };

  const getDisplayText = useMemo(() => {
    if (multiSelect) {
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.length === 1) {
        const option = processedOptions.find(
          (opt) => opt.value === selectedValues[0]
        );
        return option?.name || selectedValues[0];
      }
      return `${selectedValues.length} selected`;
    } else {
      if (selectedValues.length === 0) return placeholder;
      const option = processedOptions.find(
        (opt) => opt.value === selectedValues[0]
      );
      return option?.name || selectedValues[0];
    }
  }, [multiSelect, selectedValues, placeholder, processedOptions]);

  const attrs = useMemo(() => {
    const result = {};
    if (dataAuto) result["data-auto"] = dataAuto;
    if (dataSource) result["data-source"] = dataSource;
    if (dataDependsOn) result["data-depends-on"] = dataDependsOn;
    if (sendAsArray) result["data-send-array"] = "true";
    return result;
  }, [dataAuto, dataSource, dataDependsOn, sendAsArray]);
  return (
    <div
      className={`relative ${disabled ? "opacity-60" : ""}`}
      ref={dropdownRef}
    >
      {label && (
        <label className="block text-xs font-medium text-gray-300 mb-1">
          {label} {required && <span className="text-cyan-400">*</span>}
        </label>
      )}

      <div
        className={`relative border rounded-lg cursor-pointer transition-all duration-200 bg-gray-800  
            ${
              disabled
                ? "border-gray-700 cursor-not-allowed opacity-60"
                : selectedValues.length > 0
                ? "border-cyan-500 hover:border-cyan-400"
                : "border-gray-600 hover:border-gray-500 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500/30"
            }
            ${isOpen ? "border-cyan-500 ring-1 ring-cyan-500/30" : ""}
            ${error ? "border-red-500 ring-1 ring-red-500/30" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) setIsOpen(!isOpen);
        }}
      >
        <div className="flex items-center justify-between px-1 py-0.5  min-h-[28px]">
          <span
            className={`text-sm truncate  ${
              disabled
                ? "text-gray-500"
                : selectedValues.length > 0
                ? "text-gray-200"
                : "text-gray-400"
            }`}
          >
            {getDisplayText}
          </span>
          <div className="flex items-center space-x-1 ml-2">
            {selectedValues.length > 0 && !disabled && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  clearSelection(e);
                }}
                type="button"
                className="p-1 hover:bg-gray-700 rounded-full"
              >
                <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-200" />
              </button>
            )}
            <ChevronDownIcon
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {isOpen &&
        !disabled &&
        ReactDOM.createPortal(
          <div
            data-dropdown-portal="true"
            className="fixed bg-gray-800 border border-gray-600 rounded-lg shadow-2xl min-w-[200px] max-h-80 overflow-hidden z-[99999] origin-top"
            style={(() => {
              if (!dropdownRef.current) return {};

              const rect = dropdownRef.current.getBoundingClientRect();
              const viewportHeight = window.innerHeight;
              const spaceBelow = viewportHeight - rect.bottom;

              return {
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                transform:
                  spaceBelow < 300
                    ? "translateY(-100%) translateY(-8px)"
                    : "translateY(2px)",
                transformOrigin: spaceBelow < 300 ? "bottom" : "top",
              };
            })()}
          >
            {searchable && (
              <div className="p-3 border-b border-gray-700">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <div className="max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="px-3 py-3 text-gray-400 text-sm text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
                    <span>Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  {multiSelect &&
                    showSelectAll &&
                    filteredOptions.length > 0 && (
                      <div
                        onClick={handleSelectAll}
                        className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm border-b border-gray-700/50 flex items-center space-x-3"
                      >
                        <Checkbox
                          checked={filteredOptions.every((o) =>
                            selectedValues.includes(o.value)
                          )}
                          indeterminate={filteredOptions.some((o) =>
                            selectedValues.includes(o.value)
                          )}
                          onChange={() => {}}
                        />
                        <span className="font-medium text-cyan-400">
                          Select All
                        </span>
                      </div>
                    )}

                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt, i) => (
                      <div
                        key={opt.value || i}
                        onClick={() =>
                          multiSelect
                            ? handleMultiSelect(opt)
                            : handleSingleSelect(opt)
                        }
                        className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm border-b border-gray-700/50 flex items-center space-x-3"
                      >
                        {multiSelect && (
                          <Checkbox
                            checked={selectedValues.includes(opt.value)}
                            onChange={() => {}}
                          />
                        )}
                        <span
                          className={
                            selectedValues.includes(opt.value)
                              ? "text-cyan-400"
                              : "text-gray-200"
                          }
                        >
                          {opt.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-3 text-gray-400 text-sm text-center">
                      No options found
                    </div>
                  )}
                </>
              )}
            </div>
          </div>,
          document.body
        )}

      <input
        ref={hiddenInputRef}
        type="hidden"
        name={name}
        // value={
        //   multiSelect && sendAsArray
        //     ? JSON.stringify(selectedValues)
        //     : selectedValues[0] || ""
        // }
      value={
  sendAsArray
    ? JSON.stringify(selectedValues)
    : multiSelect
    ? selectedValues.join(",")
    : selectedValues[0] || ""
}
        {...attrs}
        {...rest}
      />

      {error && <div className="mt-1 text-xs text-red-400">{error}</div>}
    </div>
  );
  // }
});
export default MultiSelect;
