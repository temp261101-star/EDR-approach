import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import { useEffect, useState } from "react";
import { getApi } from "../lib/api";
import PieChartComponent from "../components/DynamicGraphs/PieChartComponent";
import BarChartComponent from "../components/DynamicGraphs/BarChartComponent.jsx";
import DeviceSecurityPieChart2 from "../NewPages/DeviceSecurityPieChart2";
import { data } from "jquery";
import axios from "axios";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Eye,
  Shield,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Card from "../components/Cards/Card.jsx";
// import BarChartComponent from "../components/DynamicGraphs/BarChartComponentold";

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
const kpis = [
  {
    label: "Latest Signature",
    value: "27772",
    change: "+1.2M",
    up: true,
    icon: Activity,
  },
  {
    label: "Detected Malware",
    value: "45",
    change: "+68K",
    up: true,
    icon: Eye,
  },
  {
    label: "Remediation Count",
    value: "2",
    change: "-3%",
    up: false,
    icon: Shield,
  },
  {
    label: "Total EndPoint: 5",
    value: "516",
    change: "-4%",
    up: false,
    icon: AlertTriangle,
  },
  {
    label: "IOC Blocked Apps",
    value: "2",
    change: "-2%",
    up: false,
    icon: AlertCircle,
  },
  {
    label: "Files Remediation",
    value: "47",
    change: "+3%",
    up: true,
    icon: CheckCircle,
  },
];
const attackScenarioOverview = [
  { label: "Weak Version", count: 180, severity: "high" },
  { label: "Open Port", count: 127, severity: "medium" },
  { label: "Weak Security", count: 114, severity: "high" },
  { label: "Weak Auth", count: 97, severity: "medium" },
  { label: "Config Error", count: 73, severity: "low" },
  { label: "Missing Patch", count: 45, severity: "high" },
];
export default function Home() {
  const [deviceBreakdown, setDeviceBreakdown] = useState([]);
  const [open, setOpen] = useState(false);

  const [data, setData] = useState([]);
  const [getDeviceStatus, setGetDeviceStatus] = useState([]);
  const [getUSBStatus, setGetUSBStatus] = useState([]);

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
      const res = await axios.get(
        "http://182.48.194.218:9191/api/v1/dashboard/getHostStatus"
      );
      console.log("log api response in app", res);

      setData(res.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        "http://182.48.194.218:9191/api/v1/dashboard/getDeviceStatus"
      );
      console.log("log api response in app", res);

      setGetDeviceStatus(res.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        "http://182.48.194.218:9191/api/v1/dashboard/getUSBStatus"
      );
      console.log("log api response in app", res);

      setGetUSBStatus(res.data);
    };
    fetchData();
  }, []);

  console.log("data check for pie", data);

  // const Card = ({
  //   title,
  //   action,
  //   children,
  //   className = "",
  //   noPadding = false,
  // }) => (
  //   <div
  //     className={`rounded-lg border bg-gray-800 shadow-sm transition-shadow flex flex-col border-gray-700 ${className}`}
  //   >
  //     <div className="px-3 py-2 border-b bg-gray-800/50 flex-shrink-0 border-gray-700">
  //       <div className="flex items-center justify-between">
  //         <h3 className="text-sm font-bold text-gray-100">{title}</h3>
  //         {action}
  //       </div>
  //     </div>
  //     {/* If noPadding=true, skip padding */}
  //     <div className={`flex-1 overflow-hidden ${noPadding ? "" : "p-3"}`}>
  //       {children}
  //     </div>
  //   </div>
  // );

  const tooltipStyle = {
    background: darkPalette.cardBackground,
    border: `1px solid ${darkPalette.cardBorder}`,
    borderRadius: 8,
    fontSize: 12,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
    color: darkPalette.textPrimary,
  };

  const KPI = ({ kpi }) => {
    const IconComponent = kpi.icon;
    return (
      <div className="rounded-lg border bg-gray-800 p-3 shadow-sm hover:shadow-md transition-shadow border-gray-700 hover:border-gray-600">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-gray-400 font-medium">{kpi.label}</div>
          <IconComponent className="h-4 w-4 text-gray-500" />
        </div>
        <div className="flex items-end justify-between">
          <div className="text-xl font-bold text-gray-100">{kpi.value}</div>
          <div
            className={`flex items-center gap-1 text-xs font-semibold ${
              kpi.up ? "text-green-400" : "text-red-400"
            }`}
          >
            {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {kpi.change}
          </div>
        </div>
      </div>
    );
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">
        {kpis.map((k) => (
          <KPI key={k.label} kpi={k} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <div className="lg:col-span-1 space-y-3">
          <Card title="Host Details" className="h-[400px]">
            <PieChartComponent
              // onClick={() => setOpen(true)}
              data={data}
              // endpoint="demoChart"
              // title="Device Security Status"
              // action="somethinfg"
            />
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-3">
          <Card title="Device Status" className="h-[400px]">
            <PieChartComponent
              onClick={() => setOpen(true)}
              // query="SELECT IP_ADDRESS,AGENT_STATUS,COUNT(*) OVER() AS total_count FROM all_ipaddress"
              data={getDeviceStatus}
              // endpoint="demoChart"
              title="Device Security Status"
              action="somethinfg"
            />
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-3">
          <Card
            title="USB Detection"
            className="h-[400px]"
            noPadding
          >
            <div className="p-2 h-full flex flex-col">
              <BarChartComponent
                apiEndpoint="http://182.48.194.218:9191/api/v1/dashboard/getUSBStatus"
                dataKey="count"
                xAxisKey="label"
              />
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-3">
          <Card
            title="Threat Detection"
            className="h-[400px]"
            noPadding
          >
            <div className="p-2 h-full flex flex-col">
              <BarChartComponent
                apiEndpoint="http://182.48.194.218:9191/api/v1/dashboard/threatDetectionPiechart"
                dataKey="count"
                xAxisKey="label"
              />
            </div>
          </Card>
        </div>
        {/* <div className="lg:col-span-4 space-y-3">
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
        </div> */}
      </div>
    </div>
  );
}
