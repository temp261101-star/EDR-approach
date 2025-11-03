// import React from 'react'
// import { useNavigate } from 'react-router-dom';

// function AntiVirusEdr() {
//     const navigate = useNavigate();
//     const Card = ({ title, action, children, className = "", noPadding = false }) => (
//         <div
//             className={`rounded-lg border bg-gray-800 shadow-sm transition-shadow flex flex-col border-gray-700 ${className}`}
//         >
//             <div className="px-3 py-2 border-b bg-gray-800/50 flex-shrink-0 border-gray-700">
//                 <div className="flex items-center justify-between">
//                     <h3 className="text-sm font-bold text-gray-100">{title}</h3>
//                     {action}
//                 </div>
//             </div>
//             {/* If noPadding=true, skip padding */}
//             <div className={`flex-1 overflow-hidden ${noPadding ? "" : "p-3"}`}>
//                 {children}
//             </div>
//         </div>
//     );
//     return (

//         <div>
//             <div className="bg-gray-900 p-4 ">
//                 <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-100">
//                             Antivirus & EDR Scan
//                         </h1>
//                     </div>
//                 </div>
//             </div>
//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
//                 <div className="lg:col-span-3 space-y-3">
//                     <Card title="Quick Scan" className="h-full">
//                         <p>Rapid Thread deduction on <br />critical system areas</p>
//                         <p><b>Duration:</b>Variable
//                         </p>
//                         <p><b>Coverage:</b>System Files,Registry,Running Processes
//                         </p>
//                         <button
//                             className="mb-4 mx-auto block px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg 
//              hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 
//              focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 
//              disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
//                             type="button"
//                         >
//                             Start Scan
//                         </button>
//                     </Card>
//                 </div>
//                 <div className="lg:col-span-3 space-y-3">
//                     <Card title="Full System Scan" className="h-full">
//                         <p>Comprehensive deep-dive<br />Security analysis</p>
//                         <p><b>Duration:</b>Variable
//                         </p>
//                         <p><b>Coverage:</b>All Files
//                         </p>
//                         <button
//                             className="mt-4 mx-auto block px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg 
//              hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 
//              focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 
//              disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
//                             type="button"
//                         >
//                             Start Scan
//                         </button>
//                     </Card>
//                 </div>
//                 <div className="lg:col-span-3 space-y-3">
//                     <Card title="Targeted Drive Scan" className="h-full">
//                         <p>Focused Analysis of specific<br />drives are directories</p>
//                         <p><b>Duration:</b>Variable
//                         </p>
//                         <p><b>Coverage:</b>Selected Drive/Directory Only
//                         </p>
//                         <button
//                             className="mt-4 mx-auto block px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg 
//              hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 
//              focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 
//              disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
//                             type="button"
//                         >
//                             Configure
//                         </button>

//                     </Card>
//                 </div>
//                 <div className="lg:col-span-3 space-y-3">
//                     <Card title="Scheduled Scan" className="h-full">
//                         <p>Automated recurring security<br />monitoring</p>
//                         <p><b>Duration:</b>Recurring
//                         </p>
//                         <p><b>Coverage:</b>Configurable Scope
//                         </p>
//                         <button
//                             className="mt-4 mx-auto block px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg 
//              hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 
//              focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 
//              disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
//                             type="button"
//                         >
//                             Configure
//                         </button>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     );

// }

// export default AntiVirusEdr



























import React from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ShieldCheck, HardDrive, CalendarDays } from "lucide-react";

function AntiVirusEdr() {
  const navigate = useNavigate();

  const Card = ({ icon: Icon, title, children, buttonText }) => (
    <div
      className="rounded-xl border border-gray-700 bg-gray-800 shadow-md 
      hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 p-5 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-cyan-600/20 p-2 rounded-lg">
            <Icon className="text-cyan-400 w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
        </div>
        <div className="text-gray-400 text-sm space-y-2">
          {children}
        </div>
      </div>

      <button
        className="mt-5 w-full px-5 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg 
        hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 
        transition-all duration-200 shadow-md shadow-cyan-500/20"
        type="button"
      >
        {buttonText}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 px-5 py-6">
      <div className="mb-6 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-cyan-400">
          Antivirus & EDR Scan
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card
          icon={Zap}
          title="Quick Scan"
          buttonText="Start Scan"
        >
          <p>Rapid threat detection on critical system areas</p>
          <p><b className="text-gray-200">Duration:</b> Variable</p>
          <p><b className="text-gray-200">Coverage:</b> System Files, Registry, Running Processes</p>
        </Card>

        <Card
          icon={ShieldCheck}
          title="Full System Scan"
          buttonText="Start Scan"
        >
          <p>Comprehensive deep-dive security analysis</p>
          <p><b className="text-gray-200">Duration:</b> Variable</p>
          <p><b className="text-gray-200">Coverage:</b> All Files</p>
        </Card>

        <Card
          icon={HardDrive}
          title="Targeted Drive Scan"
          buttonText="Configure"
        >
          <p>Focused analysis of specific drives or directories</p>
          <p><b className="text-gray-200">Duration:</b> Variable</p>
          <p><b className="text-gray-200">Coverage:</b> Selected Drive/Directory Only</p>
        </Card>

        <Card
          icon={CalendarDays}
          title="Scheduled Scan"
          buttonText="Configure"
        >
          <p>Automated recurring security monitoring</p>
          <p><b className="text-gray-200">Duration:</b> Recurring</p>
          <p><b className="text-gray-200">Coverage:</b> Configurable Scope</p>
        </Card>
      </div>
    </div>
  );
}

export default AntiVirusEdr;
