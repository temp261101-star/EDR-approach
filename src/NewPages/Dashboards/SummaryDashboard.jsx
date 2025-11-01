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
import { getApi } from "../../lib/api.js";
// import PieChartComponent from "../components/DynamicGraphs/PieChartComponent";
// import BarChartComponent from "../components/DynamicGraphs/BarChartComponent";
// import DeviceSecurityPieChart2 from "../NewPages/DeviceSecurityPieChart2";
import { data } from "jquery";
import axios from "axios";
import PieChartComponent from "../../components/DynamicGraphs/PieChartComponent.jsx";
// import BarChartComponent from "../../components/DynamicGraphs/BarChartComponentold.jsx";
import DeviceSecurityPieChart2 from "../DeviceSecurityPieChart2.jsx";
// import Table from "../../components/Table.jsx";
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
import DataCard from "../../components/Cards/DataCard.jsx";
import BarChartComponent from "../../components/DynamicGraphs/BarChartComponent.jsx";
import GenericPopupModal from "../../components/MODAL/GenericPopupModal.jsx";
import Table from "../../components/Table.jsx";

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

const attackScenarioOverview = [
  { label: "Weak Version", count: 180, severity: "high" },
  { label: "Open Port", count: 127, severity: "medium" },
  { label: "Weak Security", count: 114, severity: "high" },
  { label: "Weak Auth", count: 97, severity: "medium" },
  { label: "Config Error", count: 73, severity: "low" },
  { label: "Missing Patch", count: 45, severity: "high" },
];

export default function SummaryDashboard() {
  const [deviceBreakdown, setDeviceBreakdown] = useState([]);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal]= useState(false);

  const [data, setData] = useState([]);
  const [getDeviceStatus, setGetDeviceStatus] = useState([]);
  const [getUSBStatus, setGetUSBStatus] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  console.log("state for car change : ",openModal);
  
  const formatLabel = (key) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://192.168.0.156:9191/api/v1/dashboard/newDetection"
        );
        console.log("KPI API response:", response.data);

        // API returns array with single object
        if (response.data && response.data.length > 0) {
          const dataObj = response.data[0];
          // Convert object to array of {label, value} for mapping
          const kpiArray = Object.keys(dataObj).map((key) => ({
            key: key,
            label: formatLabel(key),
            value: dataObj[key],
          }));
          console.log(kpiArray);
          setKpiData(kpiArray);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching KPI data:", err);
        setError("Failed to load KPI data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchKPIData();
  }, []);

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
        "http://192.168.0.156:9191/api/v1/dashboard/getHostStatus"
      );
      console.log("log api response in app", res);

      setData(res.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        "http://192.168.0.156:9191/api/v1/dashboard/getDeviceStatus"
      );
      console.log("log api response in app", res);

      setGetDeviceStatus(res.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        "http://192.168.0.156:9191/api/v1/dashboard/getUSBStatus"
      );
      console.log("log api response in app", res);

      setGetUSBStatus(res.data);
    };
    fetchData();
  }, []);

  console.log("data check for pie", data);


  const handleOpenModal = (data)=>{
  console.log("data in hnadle : ",data);
  setOpenModal(!openModal)
  }

  const Card = ({
    title,
    action,
    children,
    className = "",
    noPadding = false,
  }) => (
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">
        {kpiData.map((kpi) => (
            <div  onClick={() => handleOpenModal(kpi)}>

          <DataCard
            key={kpi.key}
            label={kpi.label}
            value={kpi.value}
            isLoading={isLoading}
            
           
          />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Host Details */}
        <div className="lg:col-span-4 space-y-3">
          <Card title="Host Details" className="h-[400px]">
            <PieChartComponent
              onClick={() => setOpen(true)}
              data={data}
              endpoint="demoChart"
              title="Device Security Status"
            />
          </Card>
        </div>
        

        {/* Threat Detection */}
        <div className="lg:col-span-4 space-y-3">
          <Card title="Threat Detection" className="h-[400px]" noPadding>
            <div className="p-3 h-full flex flex-col">
              {/* <BarChartComponent
                apiEndpoint="http://192.168.0.156:9191/api/v1/dashboard/threatDetectionPiechart"
                dataKey="count"
                xAxisKey="label"
                barColor="#EF4444"
                barSize={40}
                height={165}
                xAxisAngle={-35}
              /> */}
              <BarChartComponent
                apiEndpoint="http://192.168.0.156:9191/api/v1/dashboard/threatDetectionPiechart"
                dataKey="count"
                xAxisKey="label"
              />
            </div>
          </Card>
        </div>

        {/* Blacklisted Applications */}
        <div className="lg:col-span-4 space-y-3">
          <Card
            title="Blacklisted Applications"
            className="h-[400px]"
            noPadding
          >
            <div className="p-3 h-full flex flex-col">
              {/* <BarChartComponent
                apiEndpoint="http://192.168.0.203:9191/api/v1/dashboard/malwareStatusDistribution"
                dataKey="count"
                xAxisKey="label"
                barColor="#F59E0B"
                barSize={50}
                height={165}
                xAxisAngle={-35}
              /> */}
              <BarChartComponent
                apiEndpoint="http://192.168.0.156:9191/api/v1/dashboard/malwareStatusDistribution"
                dataKey="count"
                xAxisKey="label"
              />
            </div>
          </Card>
        </div>
      </div>

     {/* {openModal && (
  <GenericPopupModal 
    isOpen={openModal} 
    onClose={() => setOpenModal(false)}
    title="KPI Details"
  >
    <div>this is a modal div to check the ui</div>
  </GenericPopupModal>
)} */}


<GenericPopupModal 
  isOpen={openModal} 
  onClose={() => setOpenModal(false)}
>
  <Table tableTitle="Recent File Data"
        showCheckboxes={false}
        endpoint="dashboard/recentFileData"
        dataPath="data.recentFileData"/>
</GenericPopupModal>


      {/* <Table tableTitle={"Recent File Data"} showCheckboxes={false} /> */}
      <Table
        tableTitle="Recent File Data"
        showCheckboxes={false}
        endpoint="dashboard/recentFileData"
        dataPath="data.recentFileData"
      />
      <Table tableTitle={"Threat Detection Details"} showCheckboxes={false} />
    </div>
  );
}
