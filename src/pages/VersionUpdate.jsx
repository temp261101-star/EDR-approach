// // AddATM.jsx - Dark Cybersecurity Theme
// import React, { useState, useRef, useEffect } from 'react';
// import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
// import MultiSelect from '../components/MultiSelect';

// // Lock Icon
// const LockIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
//   </svg>
// );

// // Dark Themed SearchableSelect Component
// const SearchableSelect = ({
//   label,
//   options,
//   value,
//   onChange,
//   placeholder,
//   disabled = false,
//   required = false,
//   error = '',
//   dependsOn = ''
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showError, setShowError] = useState(false);
//   const dropdownRef = useRef(null);

//   const filteredOptions = options.filter(option =>
//     option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (option.code && option.code.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//         setSearchTerm('');
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (error) {
//       setShowError(true);
//       const timer = setTimeout(() => setShowError(false), 2500);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   const handleSelect = (option) => {
//     onChange(option);
//     setIsOpen(false);
//     setSearchTerm('');
//   };

//   const clearSelection = (e) => {
//     e.stopPropagation();
//     onChange(null);
//   };

//   const getDisabledMessage = () => {
//     if (dependsOn) return `Select ${dependsOn} first`;
//     return 'Disabled';
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <label className="block text-xs font-medium text-gray-300 mb-1">
//         {label} {required && <span className="text-cyan-400">*</span>}
//       </label>

//       <div
//         className={`
//           relative border rounded-lg cursor-pointer transition-all duration-200
//           ${disabled
//             ? 'bg-gray-800 border-gray-700 cursor-not-allowed opacity-60'
//             : value
//               ? 'bg-gray-800 border-cyan-500 hover:border-cyan-400 shadow-sm shadow-cyan-500/20'
//               : 'bg-gray-800 border-gray-600 hover:border-gray-500 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500/30'
//           }
//           ${isOpen ? 'border-cyan-500 ring-1 ring-cyan-500/30 z-[100]' : 'z-10'}
//           ${error ? 'border-red-500 ring-1 ring-red-500/30' : ''}
//         `}
//         onClick={() => !disabled && setIsOpen(!isOpen)}
//       >
//         <div className="flex items-center justify-between px-3 py-2">
//           <div className="flex-1 flex items-center min-w-0">
//             {disabled && (
//               <LockIcon className="w-4 h-4 text-gray-500 mr-2" />
//             )}
//             {value ? (
//               <span className={`text-sm font-medium truncate ${disabled ? 'text-gray-500' : 'text-gray-200'}`}>
//                 {value.name} {value.code && <span className="text-cyan-400">({value.code})</span>}
//               </span>
//             ) : (
//               <span className={`text-sm truncate ${disabled ? 'text-gray-500' : 'text-gray-400'}`}>
//                 {disabled ? getDisabledMessage() : placeholder}
//               </span>
//             )}
//           </div>
//           <div className="flex items-center space-x-1 ml-2">
//             {value && !disabled && (
//               <button
//                 onClick={clearSelection}
//                 className="p-1 hover:bg-gray-700 rounded-full transition-colors"
//               >
//                 <XMarkIcon className="w-4 h-4 text-gray-400" />
//               </button>
//             )}
//             <ChevronDownIcon
//               className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
//                 isOpen ? 'rotate-180' : ''
//               }`}
//             />
//           </div>
//         </div>

//         {isOpen && !disabled && (
//           <div className="absolute z-[101] w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl max-h-64 overflow-hidden">
//             <div className="p-2 border-b border-gray-700">
//               <div className="relative">
//                 <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                <MultiSelect

//                />
//               </div>
//             </div>

//             <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
//               {filteredOptions.length > 0 ? (
//                 filteredOptions.map((option) => (
//                   <div
//                     key={option.id}
//                     onClick={() => handleSelect(option)}
//                     className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm border-b border-gray-700/50 last:border-b-0 transition-colors"
//                   >
//                     <span className="font-medium text-gray-200">{option.name}</span>
//                     {option.code && (
//                       <span className="ml-2 text-cyan-400">({option.code})</span>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="px-3 py-2 text-gray-400 text-sm">No results found</div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Error Message */}
//       {error && showError && (
//         <div className="mt-1 text-xs text-red-400 flex items-center">
//           <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//           </svg>
//           {error}
//         </div>
//       )}
//     </div>
//   );
// };

// // Main Dark Themed AddATM Component
// export default function VersionUpdate() {
//   const [formData, setFormData] = useState({
//     region: null,
//     state: null,
//     city: null,
//     branch: null,
//     oem: null,
//     atmType: 'Favourite',
//     atmId: '',
//     ipAddress: ''
//   });

//   const [availableOptions, setAvailableOptions] = useState({
//     regions: dummyData.regions,
//     states: [],
//     cities: [],
//     branches: [],
//     oems: dummyData.oems
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Update available options based on selections
//   useEffect(() => {
//     if (formData.region) {
//       setAvailableOptions(prev => ({
//         ...prev,
//         states: dummyData.states[formData.region.id] || []
//       }));
//       setFormData(prev => ({ ...prev, state: null, city: null, branch: null }));
//     } else {
//       setAvailableOptions(prev => ({ ...prev, states: [] }));
//     }
//   }, [formData.region]);

//   useEffect(() => {
//     if (formData.state) {
//       setAvailableOptions(prev => ({
//         ...prev,
//         cities: dummyData.cities[formData.state.id] || []
//       }));
//       setFormData(prev => ({ ...prev, city: null, branch: null }));
//     } else {
//       setAvailableOptions(prev => ({ ...prev, cities: [] }));
//     }
//   }, [formData.state]);

//   useEffect(() => {
//     if (formData.city) {
//       setAvailableOptions(prev => ({
//         ...prev,
//         branches: dummyData.branches[formData.city.id] || []
//       }));
//       setFormData(prev => ({ ...prev, branch: null }));
//     } else {
//       setAvailableOptions(prev => ({ ...prev, branches: [] }));
//     }
//   }, [formData.city]);

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.region) newErrors.region = 'Please select a region/zone';
//     if (!formData.state) newErrors.state = 'Please select a state';
//     if (!formData.city) newErrors.city = 'Please select a city';
//     if (!formData.branch) newErrors.branch = 'Please select a branch';
//     if (!formData.oem) newErrors.oem = 'Please select an OEM';
//     if (!formData.atmId.trim()) newErrors.atmId = 'ATM ID is required';
//     if (!formData.ipAddress.trim()) newErrors.ipAddress = 'IP Address is required';
//     else if (!/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(formData.ipAddress)) {
//       newErrors.ipAddress = 'Please enter a valid IP address';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       const submitBtn = document.getElementById('submit-btn');
//       submitBtn.classList.add('animate-pulse');
//       setTimeout(() => submitBtn.classList.remove('animate-pulse'), 500);
//       return;
//     }

//     setIsSubmitting(true);

//     setTimeout(() => {
//       console.log('Form submitted:', formData);
//       alert('🎉 ATM details submitted successfully!');
//       setIsSubmitting(false);
//     }, 1500);
//   };

//   const handleReset = () => {
//     setFormData({
//       region: null,
//       state: null,
//       city: null,
//       branch: null,
//       oem: null,
//       atmType: 'Favourite',
//       atmId: '',
//       ipAddress: ''
//     });
//     setErrors({});
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 p-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
//           {/* Header */}
//           <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
//             <div className="flex items-center space-x-3">
//               <div className="w-2 h-8 bg-cyan-500 rounded-full"></div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-100">Add New ATM</h1>
//                 <p className="text-gray-400 text-sm">Configure and register a new ATM location</p>
//               </div>
//             </div>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="p-6">
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
//               <SearchableSelect
//                 label="Region/Zone"
//                 options={availableOptions.regions}
//                 value={formData.region}
//                 onChange={(value) => handleInputChange('region', value)}
//                 placeholder="Select Region/Zone"
//                 required
//                 error={errors.region}
//               />

//               <SearchableSelect
//                 label="State"
//                 options={availableOptions.states}
//                 value={formData.state}
//                 onChange={(value) => handleInputChange('state', value)}
//                 placeholder="Select State"
//                 disabled={!formData.region}
//                 required
//                 error={errors.state}
//                 dependsOn="Region/Zone"
//               />

//               <SearchableSelect
//                 label="City"
//                 options={availableOptions.cities}
//                 value={formData.city}
//                 onChange={(value) => handleInputChange('city', value)}
//                 placeholder="Select City"
//                 disabled={!formData.state}
//                 required
//                 error={errors.city}
//                 dependsOn="State"
//               />

//               <SearchableSelect
//                 label="Branch"
//                 options={availableOptions.branches}
//                 value={formData.branch}
//                 onChange={(value) => handleInputChange('branch', value)}
//                 placeholder="Select Branch"
//                 disabled={!formData.city}
//                 required
//                 error={errors.branch}
//                 dependsOn="City"
//               />

//               <SearchableSelect
//                 label="OEM"
//                 options={availableOptions.oems}
//                 value={formData.oem}
//                 onChange={(value) => handleInputChange('oem', value)}
//                 placeholder="Select OEM"
//                 required
//                 error={errors.oem}
//               />

//               {/* ATM Type */}
//               <div>
//                 <label className="block text-xs font-medium text-gray-300 mb-1">
//                   ATM Type <span className="text-cyan-400">*</span>
//                 </label>
//                 <div className="flex space-x-4 px-3 py-2 border border-gray-600 rounded-lg bg-gray-800">
//                   <label className="flex items-center cursor-pointer">
//                     <input
//                       type="radio"
//                       name="atmType"
//                       value="Favourite"
//                       checked={formData.atmType === 'Favourite'}
//                       onChange={(e) => handleInputChange('atmType', e.target.value)}
//                       className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 focus:ring-cyan-500 focus:ring-2"
//                     />
//                     <span className="ml-2 text-sm font-medium text-gray-200">Favourite</span>
//                   </label>
//                   <label className="flex items-center cursor-pointer">
//                     <input
//                       type="radio"
//                       name="atmType"
//                       value="VIP ATM"
//                       checked={formData.atmType === 'VIP ATM'}
//                       onChange={(e) => handleInputChange('atmType', e.target.value)}
//                       className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 focus:ring-cyan-500 focus:ring-2"
//                     />
//                     <span className="ml-2 text-sm font-medium text-gray-200">VIP ATM</span>
//                   </label>
//                 </div>
//               </div>

//               {/* ATM ID */}
//               <div>
//                 <label className="block text-xs font-medium text-gray-300 mb-1">
//                   ATM ID <span className="text-cyan-400">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.atmId}
//                   onChange={(e) => handleInputChange('atmId', e.target.value)}
//                   placeholder="Enter ATM ID"
//                   className={`w-full px-3 py-2 text-sm bg-gray-800 border rounded-lg text-gray-200 placeholder-gray-400 transition-all ${
//                     errors.atmId
//                       ? 'border-red-500 ring-1 ring-red-500/30'
//                       : formData.atmId
//                         ? 'border-cyan-500 ring-1 ring-cyan-500/30 shadow-sm shadow-cyan-500/20'
//                         : 'border-gray-600 focus:ring-1 focus:ring-cyan-500/30 focus:border-cyan-500'
//                   }`}
//                 />
//                 {errors.atmId && (
//                   <div className="mt-1 text-xs text-red-400 flex items-center">
//                     <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     {errors.atmId}
//                   </div>
//                 )}
//               </div>

//               {/* IP Address */}
//               <div>
//                 <label className="block text-xs font-medium text-gray-300 mb-1">
//                   IP Address <span className="text-cyan-400">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.ipAddress}
//                   onChange={(e) => handleInputChange('ipAddress', e.target.value)}
//                   placeholder="192.168.1.100"
//                   className={`w-full px-3 py-2 text-sm bg-gray-800 border rounded-lg text-gray-200 placeholder-gray-400 transition-all ${
//                     errors.ipAddress
//                       ? 'border-red-500 ring-1 ring-red-500/30'
//                       : formData.ipAddress
//                         ? 'border-cyan-500 ring-1 ring-cyan-500/30 shadow-sm shadow-cyan-500/20'
//                         : 'border-gray-600 focus:ring-1 focus:ring-cyan-500/30 focus:border-cyan-500'
//                   }`}
//                 />
//                 {errors.ipAddress && (
//                   <div className="mt-1 text-xs text-red-400 flex items-center">
//                     <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     {errors.ipAddress}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-700">
//               <button
//                 id="submit-btn"
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
//               >
//                 {isSubmitting ? (
//                   <div className="flex items-center">
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Submitting...
//                   </div>
//                 ) : (
//                   'Submit ATM Details'
//                 )}
//               </button>
//               <button
//                 type="button"
//                 onClick={handleReset}
//                 className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 text-sm font-medium hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
//               >
//                 Reset
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// AddATM.jsx - Dark Cybersecurity Theme
import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import MultiSelect from "../components/MultiSelect";
import FormController from "../../lib/FormController";
import Form from "../components/Form";
import Select from "../components/Select";
import api from "../../lib/api";
import TextInput from "../components/TextInput";
import RadioGroup from "../components/RadioGroup";

// Lock Icon
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

// Main Dark Themed AddATM Component
export default function VersionUpdate() {
  const formRef = useRef(null);
  const branchRef = useRef();
  const oemRef = useRef();
  const stateRef = useRef();
  const cityRef = useRef();
  const regionRef = useRef();
  const [reloadTable, setReloadTable] = useState(0);

  const [showApplicationFields, setShowApplicationFields] = useState(false);

  useEffect(() => {
    if (!formRef.current) return;

    const controller = new FormController(formRef.current, {
      sources: {
        fetchResource: async ({ resource, parentKey, parentValue }) => {
          const res = await api.fetchResource({
            resource,
            parentKey,
            parentValue,
          });
          // res is already ["NA", "vashi"]

          if (Array.isArray(res)) {
            return res.map((branch) => ({
              value: branch,
              label: branch,
            }));
          }

          if (res?.branches) {
            return res.branches.map((b) => ({
              value: b.id,
              label: b.name,
            }));
          }

          return [];
        },
      },

      actions: {
        addTrustedApp: async (payload) => {
          return api.createResource("setReactAddApplication", payload);
        },
      },

      hooks: {
        onSuccess: () => {
          // alert("Trusted Application Added!");
          toast.success("Trusted Application Added!");
          formRef.current.reset();
          branchRef.current?.reset();
          oemRef.current?.reset();
          stateRef.current?.reset();
          cityRef.current?.reset();
          regionRef.current?.reset();
          setShowApplicationFields(false);
          setReloadTable((prev) => prev + 1);
        },
      },
    });

    return () => controller.destroy();
  }, []);

  const handleApplicationTypeChange = (event) => {
    const value = event.target.value;
    setShowApplicationFields(!!value);
  };

  function handleReset() {
    if (formRef.current) {
      formRef.current.reset();
    }
    branchRef.current?.reset();
    oemRef.current?.reset();
    stateRef.current?.reset();
    cityRef.current?.reset();
    regionRef.current?.reset();
    setShowApplicationFields(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-8 bg-cyan-500 rounded-full"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-100">Add New ATM</h1>
                <p className="text-gray-400 text-sm">
                  Configure and register a new ATM location
                </p>
              </div>
            </div>
          </div>

          <Form
            ref={formRef}
            apiAction="addTrustedApp"
            data-api="addTrustedApp"
            className="space-y-6 p-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
              <MultiSelect
                placeholder="Select Region/Zone"
                name="region"
                label="Region/Zone"
                dataSource="getRegion"
                sendAsArray={true}
                data-key="region"
                data-extra='{"query":"SELECT region_id , region_name FROM region"}'
                ref={regionRef}
              />

              <MultiSelect
                placeholder="Select State"
                name="stateName"
                label="State"
                ref={stateRef}
                dataSource="stateApi"
                dataDependsOn="region"
                data-param="region"
                data-key="State"
                
              />

              <MultiSelect
                placeholder="Select City"
                name="cityName"
                label="City"
                ref={cityRef}
                dataSource="cityApi"
                dataDependsOn="state"
                data-param="state"
                data-key="city"
              />

              <MultiSelect
                name="branch"
                label="Branch"
                dataSource="getReactBranchName"
                data-key="branch"
                dataDependsOn="city"
                ref={branchRef}
              />

              <MultiSelect
                placeholder="Select OEM"
                name="oem"
                label="Select OEM"
                dataSource="getOem"
                data-key="oem"
                ref={oemRef}
              />

              <div>
                <RadioGroup
  name="atmType"
  label="ATM Type"
   error = ""
  options={[
    { label: "Favourite", value: "fav" },
    { label: "VIP ATM", value: "vip" },
  ]}
  defaultValue="Favourite"
/>

              </div>

              <TextInput
                label=" ATM ID"
                name="atmId"
                placeholder="Enter ATM ID"
                required
                className={`w-full px-3 py-1 text-sm bg-gray-800 border  rounded-lg text-gray-200 placeholder-gray-400 transition-all `}
              />

              <TextInput
                label="IP Address"
                name="ipAddress"
                placeholder="Enter IP Address"
                required
                className={`w-full px-3 py-1 text-sm bg-gray-800 border rounded-lg text-gray-200 placeholder-gray-400 transition-all `}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-700">
              <button
                id="submit-btn"
                type="submit"
                // disabled={isSubmitting}
                className="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
              >
                submit
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 text-sm font-medium hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
              >
                Reset
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
