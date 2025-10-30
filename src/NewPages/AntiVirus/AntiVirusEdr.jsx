import React from 'react'
import { useNavigate } from 'react-router-dom';

function AntiVirusEdr() {
    const navigate = useNavigate();
    const Card = ({ title, action, children, className = "", noPadding = false }) => (
        <div
            className={`rounded-lg border bg-gray-800 shadow-sm transition-shadow flex flex-col border-gray-700 ${className}`}
        >
            <div className="px-3 py-2 border-b bg-gray-800/50 flex-shrink-0 border-gray-700">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-100">{title}</h3>
                    {action}
                </div>
            </div>
            {/* If noPadding=true, skip padding */}
            <div className={`flex-1 overflow-hidden ${noPadding ? "" : "p-3"}`}>
                {children}
            </div>
        </div>
    );
    return (

        <div>
            <div className="bg-gray-900 p-4 ">
                <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-100">
                            Antivirus & EDR Scan
                        </h1>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-3 space-y-3">
                    <Card title="Quick Scan" className="h-full">
                        <p>Rapid Thread deduction on <br />critical system areas</p>
                        <p><b>Duration:</b>Variable
                        </p>
                        <p><b>Coverage:</b>System Files,Registry,Running Processes
                        </p>
                        <button
                            className="mb-4 mx-auto block px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg 
             hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 
             focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 
             disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
                            type="button"
                        >
                            Start Scan
                        </button>
                    </Card>
                </div>
                <div className="lg:col-span-3 space-y-3">
                    <Card title="Full System Scan" className="h-full">
                        <p>Comprehensive deep-dive<br />Security analysis</p>
                        <p><b>Duration:</b>Variable
                        </p>
                        <p><b>Coverage:</b>All Files
                        </p>
                        <button
                            className="mt-4 mx-auto block px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg 
             hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 
             focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 
             disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
                            type="button"
                        >
                            Start Scan
                        </button>
                    </Card>
                </div>
                <div className="lg:col-span-3 space-y-3">
                    <Card title="Targeted Drive Scan" className="h-full">
                        <p>Focused Analysis of specific<br />drives are directories</p>
                        <p><b>Duration:</b>Variable
                        </p>
                        <p><b>Coverage:</b>Selected Drive/Directory Only
                        </p>
                        <button
                            className="mt-4 mx-auto block px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg 
             hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 
             focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 
             disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
                            type="button"
                        >
                            Configure
                        </button>

                    </Card>
                </div>
                <div className="lg:col-span-3 space-y-3">
                    <Card title="Scheduled Scan" className="h-full">
                        <p>Automated recurring security<br />monitoring</p>
                        <p><b>Duration:</b>Recurring
                        </p>
                        <p><b>Coverage:</b>Configurable Scope
                        </p>
                        <button
                            className="mt-4 mx-auto block px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg 
             hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 
             focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 
             disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
                            type="button"
                        >
                            Configure
                        </button>
                    </Card>
                </div>
            </div>
        </div>
    );

}

export default AntiVirusEdr
