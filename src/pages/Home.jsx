import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { getApi } from "../../lib/api";
import PieChartComponent from "../components/DynamicGraphs/PieChartComponent";
import BarChartComponent from "../components/DynamicGraphs/BarChartComponent";
import DeviceSecurityPieChart2 from "../NewPages/DeviceSecurityPieChart2";
import { data } from "jquery";
import axios from "axios";

const darkPalette = {
  primary: "#3B82F6",
  accentGreen: "#10B981",
  accentRed: "#EF4444",
  accentYellow: "#F59E0B",
  accentPurple: "#8B5CF6",
  accentCyan: "#06B6D4",
  background: "#111827",
  cardBackground: "#1F2937",
  cardBorder: "#374151",
  textPrimary: "#F9FAFB",
  textSecondary: "#D1D5DB",
  textMuted: "#9CA3AF",
  hover: "#374151",
};

export default function Home() {
  const [deviceBreakdown, setDeviceBreakdown] = useState([]);
const [open, setOpen] = useState(false);

const [data,setData]=useState([]);
const [getDeviceStatus,setGetDeviceStatus]=useState([]);
const [getUSBStatus,setGetUSBStatus]=useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const query =
        "SELECT a.app_name, COUNT(c.cve_id) AS total_cves FROM dbo.cve_scan_result a JOIN dbo.app_cves c ON a.app_id = c.app_id GROUP BY a.app_name ORDER BY total_cves DESC;";

      const res = await getApi(query, "demoChart");
      console.log("log api response in app", res);

      setDeviceBreakdown(res);
    };
    fetchData();
  }, []);

  console.log("deviceBreakdown : ", deviceBreakdown);
 useEffect(() => {
    const fetchData = async () => {
      
      const res = await axios.get("http://192.168.0.156:9191/api/v1/dashboard/getHostStatus");
      console.log("log api response in app", res);

      setData(res.data);
    };
    fetchData();
  }, []);


 useEffect(() => {
    const fetchData = async () => {
      
      const res = await axios.get("http://192.168.0.156:9191/api/v1/dashboard/getDeviceStatus");
      console.log("log api response in app", res);

      setGetDeviceStatus(res.data);
    };
    fetchData();
  }, []);

 useEffect(() => {
    const fetchData = async () => {
      
      const res = await axios.get("http://192.168.0.156:9191/api/v1/dashboard/getUSBStatus");
      console.log("log api response in app", res);

      setGetUSBStatus(res.data);
    };
    fetchData();
  }, []);


  console.log("data check for pie",data);
  

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

  const tooltipStyle = {
    background: darkPalette.cardBackground,
    border: `1px solid ${darkPalette.cardBorder}`,
    borderRadius: 8,
    fontSize: 12,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
    color: darkPalette.textPrimary,
  };

  return (
    <div className="bg-gray-900 p-4 min-h-screen">
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">
            Security Operations Center
          </h1>
          <p className="text-sm text-gray-400">
            Real-time security monitoring and threat analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-green-900/30 px-3 py-1.5 text-xs font-semibold text-green-400 border border-green-700/50">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            System Online
          </div>
          <div className="rounded-lg border bg-gray-800 px-3 py-1.5 text-xs text-gray-300 shadow-sm border-gray-700">
            Last Updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-4 space-y-3">
          <Card title="Test" className="h-[320px]">
            <PieChartComponent
              onClick={() => setOpen(true)}
             data={data}
              endpoint="demoChart"
              title="Device Security Status"
              action="somethinfg"
            />
          </Card>
        </div>
        <div className="lg:col-span-4 space-y-3">
          <Card title="Device Status" className="h-[320px]">
            <PieChartComponent
              onClick={() => setOpen(true)}
              // query="SELECT IP_ADDRESS,AGENT_STATUS,COUNT(*) OVER() AS total_count FROM all_ipaddress"
              data={getDeviceStatus}
              endpoint="demoChart"
              title="Device Security Status"
              action="somethinfg"
            />
          </Card>
        </div>
        <div className="lg:col-span-4 space-y-3">
          <Card title="Spring boot Get USBStatus" className="h-[320px]">
            <PieChartComponent
              onClick={() => setOpen(true)}
              data={getUSBStatus}
              endpoint="demoChart"
              title="Device Security Status"
              action="somethinfg"
            />
          </Card>
        </div>
        <div className="lg:col-span-4 space-y-3">
          <Card title="Blacklisted Appplication" className="h-[320px]">
            <PieChartComponent
              onClick={() => setOpen(true)}
              query=" SELECT 
    ip_address, 
    malware_status, 
    COUNT(*) OVER() AS total_count
FROM 
    application_info_report_edr"
              endpoint="demoChart"
              title="Device Security Status"
              action="somethinfg"
            />
          </Card>
        </div>
        <div className="lg:col-span-4 space-y-3">
          <Card title="Device Security Data" className="h-[320px]">
            <PieChartComponent
              onClick={() => setOpen(true)}
              data={deviceBreakdown}
              endpoint="demoChart"
              title="Device Security Status"
              action="somethinfg"
            />
          </Card>
        </div>

        <div className="lg:col-span-4 ">
          <Card title="Device Security Status quiry" className="h-[320px]">
            <PieChartComponent
              onClick={() => setOpen(true)}
              query="SELECT status, COUNT(*) AS total_count FROM dbo.antivirus_scan GROUP BY status ORDER BY total_count DESC;"
              endpoint="demoChart"
              title="Device Security Status"
              action="somethinfg"
            />
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-3">
          <Card title="Security Anomaly Trends" className="h-[320px]">
            <BarChartComponent
              query="SELECT date AS date,
               antivirus_name AS antivirusName,
               scan_type AS scanType,
               system_name AS systemName,
               ip,
               status
              FROM dbo.antivirus_scan
              ORDER BY date;"
              endpoint="demoChartTwo"
            />
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-3">
          <Card title="Security Anomaly Trends" className="h-[320px]">
            <BarChartComponent
             data={getUSBStatus}
            />
          </Card>
        </div>
       
        <div className="lg:col-span-4 space-y-3">
          <DeviceSecurityPieChart2 />
        </div>
      </div>
    </div>
  );
}
