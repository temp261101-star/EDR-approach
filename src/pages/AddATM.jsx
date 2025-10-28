"use client"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search, X, Lock } from "lucide-react"

// Dummy data with hierarchical structure
const dummyData = {
  regions: [
    { id: 1, name: "North Zone", code: "NZ" },
    { id: 2, name: "South Zone", code: "SZ" },
    { id: 3, name: "East Zone", code: "EZ" },
    { id: 4, name: "West Zone", code: "WZ" },
    { id: 5, name: "Central Zone", code: "CZ" }
  ],
  states: {
    1: [
      { id: 1, name: "Punjab", code: "PB" },
      { id: 2, name: "Haryana", code: "HR" },
      { id: 3, name: "Delhi", code: "DL" },
      { id: 4, name: "Uttar Pradesh", code: "UP" }
    ],
    2: [
      { id: 5, name: "Tamil Nadu", code: "TN" },
      { id: 6, name: "Karnataka", code: "KA" },
      { id: 7, name: "Kerala", code: "KL" },
      { id: 8, name: "Andhra Pradesh", code: "AP" }
    ],
    3: [
      { id: 9, name: "West Bengal", code: "WB" },
      { id: 10, name: "Odisha", code: "OD" },
      { id: 11, name: "Jharkhand", code: "JH" },
      { id: 12, name: "Bihar", code: "BR" }
    ],
    4: [
      { id: 13, name: "Maharashtra", code: "MH" },
      { id: 14, name: "Gujarat", code: "GJ" },
      { id: 15, name: "Rajasthan", code: "RJ" },
      { id: 16, name: "Goa", code: "GA" }
    ],
    5: [
      { id: 17, name: "Madhya Pradesh", code: "MP" },
      { id: 18, name: "Chhattisgarh", code: "CG" }
    ]
  },
  cities: {
    1: [{ id: 1, name: "Ludhiana" }, { id: 2, name: "Amritsar" }, { id: 3, name: "Jalandhar" }],
    2: [{ id: 4, name: "Gurugram" }, { id: 5, name: "Faridabad" }, { id: 6, name: "Panipat" }],
    3: [{ id: 7, name: "New Delhi" }, { id: 8, name: "Central Delhi" }, { id: 9, name: "South Delhi" }],
    4: [{ id: 10, name: "Noida" }, { id: 11, name: "Ghaziabad" }, { id: 12, name: "Lucknow" }],
    5: [{ id: 13, name: "Chennai" }, { id: 14, name: "Coimbatore" }, { id: 15, name: "Madurai" }],
    6: [{ id: 16, name: "Bangalore" }, { id: 17, name: "Mysore" }, { id: 18, name: "Hubli" }],
    7: [{ id: 19, name: "Kochi" }, { id: 20, name: "Thiruvananthapuram" }, { id: 21, name: "Kozhikode" }],
    8: [{ id: 22, name: "Hyderabad" }, { id: 23, name: "Vijayawada" }, { id: 24, name: "Visakhapatnam" }],
    9: [{ id: 25, name: "Kolkata" }, { id: 26, name: "Howrah" }, { id: 27, name: "Durgapur" }],
    13: [{ id: 28, name: "Mumbai" }, { id: 29, name: "Pune" }, { id: 30, name: "Nagpur" }, { id: 31, name: "Nashik" }],
    14: [{ id: 32, name: "Ahmedabad" }, { id: 33, name: "Surat" }, { id: 34, name: "Vadodara" }],
    15: [{ id: 35, name: "Jaipur" }, { id: 36, name: "Jodhpur" }, { id: 37, name: "Udaipur" }]
  },
  branches: {
    1: [{ id: 1, name: "Ludhiana Main Branch" }, { id: 2, name: "Ludhiana City Center" }],
    4: [{ id: 3, name: "Gurugram Sector 14" }, { id: 4, name: "Gurugram Cyber City" }],
    7: [{ id: 5, name: "Connaught Place" }, { id: 6, name: "Karol Bagh" }],
    10: [{ id: 7, name: "Noida Sector 18" }, { id: 8, name: "Greater Noida" }],
    16: [{ id: 9, name: "Bangalore MG Road" }, { id: 10, name: "Bangalore Koramangala" }],
    28: [{ id: 11, name: "Mumbai Fort" }, { id: 12, name: "Mumbai Andheri" }],
    29: [{ id: 13, name: "Pune FC Road" }, { id: 14, name: "Pune Kothrud" }],
    32: [{ id: 15, name: "Ahmedabad CG Road" }, { id: 16, name: "Ahmedabad Satellite" }]
  },
  oems: [
    { id: 1, name: "NCR Corporation", code: "NCR" },
    { id: 2, name: "Diebold Nixdorf", code: "DN" },
    { id: 3, name: "Wincor Nixdorf", code: "WN" },
    { id: 4, name: "Hitachi-Omron", code: "HO" },
    { id: 5, name: "GRG Banking", code: "GRG" }
  ]
};

const AddATM = () => {
  const [formData, setFormData] = useState({
    region: null,
    state: null,
    city: null,
    branch: null,
    oem: null,
    atmType: "Favourite",
    atmId: "",
    ipAddress: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableOptions, setAvailableOptions] = useState({
    regions: dummyData.regions,
    states: [],
    cities: [],
    branches: [],
    oems: dummyData.oems
  })

  // Update available options based on selections
  useEffect(() => {
    if (formData.region) {
      setAvailableOptions(prev => ({
        ...prev,
        states: dummyData.states[formData.region.id] || []
      }));
      setFormData(prev => ({ ...prev, state: null, city: null, branch: null }));
    } else {
      setAvailableOptions(prev => ({ ...prev, states: [] }));
    }
  }, [formData.region]);

  useEffect(() => {
    if (formData.state) {
      setAvailableOptions(prev => ({
        ...prev,
        cities: dummyData.cities[formData.state.id] || []
      }));
      setFormData(prev => ({ ...prev, city: null, branch: null }));
    } else {
      setAvailableOptions(prev => ({ ...prev, cities: [] }));
    }
  }, [formData.state]);

  useEffect(() => {
    if (formData.city) {
      setAvailableOptions(prev => ({
        ...prev,
        branches: dummyData.branches[formData.city.id] || []
      }));
      setFormData(prev => ({ ...prev, branch: null }));
    } else {
      setAvailableOptions(prev => ({ ...prev, branches: [] }));
    }
  }, [formData.city]);

  const handleInputChange = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.region) newErrors.region = 'Please select a region/zone';
    if (!formData.state) newErrors.state = 'Please select a state';
    if (!formData.city) newErrors.city = 'Please select a city';
    if (!formData.branch) newErrors.branch = 'Please select a branch';
    if (!formData.oem) newErrors.oem = 'Please select an OEM';
    if (!formData.atmId.trim()) newErrors.atmId = 'ATM ID is required';
    if (!formData.ipAddress.trim()) newErrors.ipAddress = 'IP Address is required';
    else if (!/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(formData.ipAddress)) {
      newErrors.ipAddress = 'Please enter a valid IP address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const submitBtn = document.getElementById('submit-btn');
      submitBtn.classList.add('animate-pulse');
      setTimeout(() => submitBtn.classList.remove('animate-pulse'), 500);
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log('Form submitted:', formData);
      alert(' ATM details submitted successfully!');
      setIsSubmitting(false);
    }, 1500);
  }

  const handleReset = () => {
    setFormData({
      region: null,
      state: null,
      city: null,
      branch: null,
      oem: null,
      atmType: "Favourite",
      atmId: "",
      ipAddress: "",
    })
    setErrors({})
  }

  const getDisabledMessage = (dependsOn) => {
    if (dependsOn) return `Select ${dependsOn} first`;
    return "Disabled"
  }

  return (
    <div className="min-h-screen bg-gray-900 p-1">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 overflow-visible">
          <div className="bg-gray-800 border-b border-gray-700 px-3 py-1.5">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-5 bg-cyan-500 rounded-full"></div>
              <div>
                <h1 className="text-base font-bold text-gray-100">Add New ATM</h1>
                <p className="text-gray-400 text-xs">Configure and register a new ATM location</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-2 overflow-visible">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-1.5 mb-2">
              <SearchableSelect
                label="Region/Zone"
                options={availableOptions.regions}
                value={formData.region}
                onChange={(value) => handleInputChange("region", value)}
                placeholder="Select Region/Zone"
                required
                error={errors.region}
              />
  
              <SearchableSelect
                label="State"
                options={availableOptions.states}
                value={formData.state}
                onChange={(value) => handleInputChange("state", value)}
                placeholder="Select State"
                disabled={!formData.region}
                required
                error={errors.state}
                dependsOn="Region/Zone"
              />

              <SearchableSelect
                label="City"
                options={availableOptions.cities}
                value={formData.city}
                onChange={(value) => handleInputChange("city", value)}
                placeholder="Select City"
                disabled={!formData.state}
                required
                error={errors.city}
                dependsOn="State"
              />

              <SearchableSelect
                label="Branch"
                options={availableOptions.branches}
                value={formData.branch}
                onChange={(value) => handleInputChange("branch", value)}
                placeholder="Select Branch"
                disabled={!formData.city}
                required
                error={errors.branch}
                dependsOn="City"
              />

              <SearchableSelect
                label="OEM"
                options={availableOptions.oems}
                value={formData.oem}
                onChange={(value) => handleInputChange("oem", value)}
                placeholder="Select OEM"
                required
                error={errors.oem}
              />

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-0.5">
                  ATM Type <span className="text-cyan-400">*</span>
                </label>
                <div className="flex space-x-2 px-2 py-1 border border-gray-600 rounded-md bg-gray-800">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="atmType"
                      value="Favourite"
                      checked={formData.atmType === "Favourite"}
                      onChange={(e) => handleInputChange("atmType", e.target.value)}
                      className="w-3 h-3 text-cyan-500 bg-gray-700 border-gray-600 focus:ring-cyan-500 focus:ring-1"
                    />
                    <span className="ml-1 text-xs font-medium text-gray-200">Favourite</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="atmType"
                      value="VIP ATM"
                      checked={formData.atmType === "VIP ATM"}
                      onChange={(e) => handleInputChange("atmType", e.target.value)}
                      className="w-3 h-3 text-cyan-500 bg-gray-700 border-gray-600 focus:ring-cyan-500 focus:ring-1"
                    />
                    <span className="ml-1 text-xs font-medium text-gray-200">VIP ATM</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-0.5">
                  ATM ID <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.atmId}
                  onChange={(e) => handleInputChange("atmId", e.target.value)}
                  placeholder="Enter ATM ID"
                  className={`w-full px-2 py-2 text-xs bg-gray-800 border rounded-md text-gray-200 placeholder-gray-400 transition-all ${
                    errors.atmId
                      ? "border-red-500 ring-1 ring-red-500/30"
                      : formData.atmId
                        ? "border-cyan-500 ring-1 ring-cyan-500/30 shadow-sm shadow-cyan-500/20"
                        : "border-gray-600 focus:ring-1 focus:ring-cyan-500/30 focus:border-cyan-500"
                  }`}
                />
                {errors.atmId && (
                  <div className="mt-0.5 text-xs text-red-400 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.atmId}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-0.5">
                  IP Address <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ipAddress}
                  onChange={(e) => handleInputChange("ipAddress", e.target.value)}
                  placeholder="192.168.1.100"
                  className={`w-full px-2 py-2 text-xs bg-gray-800 border rounded-md text-gray-200 placeholder-gray-400 transition-all ${
                    errors.ipAddress
                      ? "border-red-500 ring-1 ring-red-500/30"
                      : formData.ipAddress
                        ? "border-cyan-500 ring-1 ring-cyan-500/30 shadow-sm shadow-cyan-500/20"
                        : "border-gray-600 focus:ring-1 focus:ring-cyan-500/30 focus:border-cyan-500"
                  }`}
                />
                {errors.ipAddress && (
                  <div className="mt-0.5 text-xs text-red-400 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.ipAddress}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-1.5 justify-end pt-1.5 border-t border-gray-700">
              <button
                id="submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="px-3 py-1 bg-cyan-600 text-white text-xs font-medium rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  'Submit ATM Details'
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1 border border-gray-600 rounded-md text-gray-300 text-xs font-medium hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const SearchableSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  error = "",
  dependsOn = "",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showError, setShowError] = useState(false)
  const dropdownRef = useRef(null)

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.code && option.code.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (error) {
      setShowError(true)
      const timer = setTimeout(() => setShowError(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [error])

  const clearSelection = (e) => {
    e.stopPropagation()
    onChange(null)
  }

  const handleSelect = (option) => {
    onChange(option)
    setIsOpen(false)
    setSearchTerm('')
  }

  const getDisabledMessage = () => {
    if (dependsOn) return `Select ${dependsOn} first`
    return "Disabled"
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-medium text-gray-300 mb-0.5">
        {label} {required && <span className="text-cyan-400">*</span>}
      </label>

      <div
        className={`
          relative border rounded-md cursor-pointer transition-all duration-200
          ${
            disabled
              ? "bg-gray-800 border-gray-700 cursor-not-allowed opacity-60"
              : value
                ? "bg-gray-800 border-cyan-500 hover:border-cyan-400 shadow-sm shadow-cyan-500/20"
                : "bg-gray-800 border-gray-600 hover:border-gray-500 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500/30"
          }
          ${isOpen ? "border-cyan-500 ring-1 ring-cyan-500/30 z-[100]" : "z-10"}
          ${error ? "border-red-500 ring-1 ring-red-500/30" : ""}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex-1 flex items-center min-w-0">
            {disabled && <Lock className="w-3 h-3 text-gray-500 mr-1" />}
            {value ? (
              <span className={`text-xs font-medium truncate ${disabled ? "text-gray-500" : "text-gray-200"}`}>
                {value.name} {value.code && <span className="text-cyan-400">({value.code})</span>}
              </span>
            ) : (
              <span className={`text-xs truncate ${disabled ? "text-gray-500" : "text-gray-400"}`}>
                {disabled ? getDisabledMessage() : placeholder}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-0.5 ml-1">
            {value && !disabled && (
              <button onClick={clearSelection} className="p-0.5 hover:bg-gray-700 rounded-full transition-colors">
                <X className="w-3 h-3 text-gray-400" />
              </button>
            )}
            <ChevronDown
              className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-[101] w-full mt-0.5 bg-gray-800 border border-gray-600 rounded-md shadow-2xl max-h-40 overflow-hidden">
            <div className="p-1 border-b border-gray-700">
              <div className="relative">
                <Search className="absolute left-1.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-6 pr-2 py-0.5 text-xs bg-gray-700 border border-gray-600 rounded-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div className="max-h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => handleSelect(option)}
                    className="px-2 py-1 hover:bg-gray-700 cursor-pointer text-xs border-b border-gray-700/50 last:border-b-0 transition-colors"
                  >
                    <span className="font-medium text-gray-200">{option.name}</span>
                    {option.code && <span className="ml-1 text-cyan-400">({option.code})</span>}
                  </div>
                ))
              ) : (
                <div className="px-2 py-1 text-gray-400 text-xs">No results found</div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && showError && (
        <div className="mt-0.5 text-xs text-red-400 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  )
}

export default AddATM