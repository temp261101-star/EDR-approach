import { useEffect, useState } from "react";
import api, { getApi } from "../../lib/api.js";
import axios from "axios";
import PieChartComponent from "../../components/DynamicGraphs/PieChartComponent.jsx";
import Table from "../../components/Table.jsx";
import DataCard from "../../components/Cards/DataCard.jsx";
import BarChartComponent from "../../components/DynamicGraphs/BarChartComponent.jsx";
import GenericPopupModal from "../../components/MODAL/GenericPopupModal.jsx";
import Card from "../../components/Cards/Card.jsx";

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
  const [data, setData] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState(null);


  const handleEdit = (row) => {
    console.log("Edit clicked for:", row);
    // Add your edit logic here
  };

  const handleDelete = (row) => {
    console.log("Delete clicked for:", row);
    // Add your delete logic here
  };

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
        const response = await api.fetchResource({
          resource: "dashboard/newDetection",
        });
        console.log("KPI API response:", response);

        if (response && response.length > 0) {
          const dataObj = response[0];
          const kpiArray = Object.keys(dataObj).map((key) => ({
            key: key,
            label: formatLabel(key),
            value: dataObj[key],
          }));
          console.log(kpiArray);
          setKpiData(kpiArray);
        }
      } catch (err) {
        console.error("Error fetching KPI data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKPIData();
  }, []);

  console.log("deviceBreakdown : ", deviceBreakdown);
  useEffect(() => {
    const fetchData = async () => {
      const res = await api.fetchResource({
        resource: "dashboard/getHostStatus",
      });
      console.log("log api response in app", res);
      setData(res);
    };
    fetchData();
  }, []);

  console.log("data check for pie", data);

  const handleOpenModal = (kpiData) => {
    console.log("data in handle : ", kpiData);
    setSelectedKpi(kpiData); // Store the clicked KPI data
    setOpenModal(true);
  };

  const getEndpointForKpi = (kpiKey) => {
    const endpointMap = {
      "Todays Detection": "dashboard/newDetection",
      "Prevented Attacks": "dashboard/PreventedAttacks",
      "Remediation Detection": "dashboard/getRemediationDetectionInfo",
      "BlackListed Application": "dashboard/TotalHunting",
      "End Point Affected": "dashboard/EndPointAffectedInfo",
      "Peripheral Detection": "dashboard/PeripheralDetection",
      // missing_patch: "dashboard/missingPatchList",
      // Add more mappings as needed for your KPIs
    };

    return endpointMap[kpiKey] || ""; // fallback
  };

  const getDataPathForKpi = (kpiKey) => {
    const dataPathMap = {
      "Todays Detection": "data.NewDetection",
      "Prevented Attacks": "data.PreventedAttacks",
      "Remediation Detection": "data.RemediationDetectionInfo",
      "BlackListed Application": "data.TotalHunting",
      "End Point Affected": "data.EndPointAffectedInfo",
      "Peripheral Detection": "data.PeripheralDetection",
      // missing_patch: "data.missingPatchList",
      // Add more mappings as needed for your KPIs
    };

    return dataPathMap[kpiKey] || "data"; // fallback
  };
  const getTableTitleForKpi = (kpiLabel) => {
    return `${kpiLabel} - Details`;
  };
  return (
    <div className="bg-gray-900 p-4 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">
        {kpiData.map((kpi) => (
          <div onClick={() => handleOpenModal(kpi)}>
            <DataCard
              key={kpi.key}
              label={kpi.label}
              value={kpi.value}
              isLoading={isLoading}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Host Details */}
        <div className="lg:col-span-1 space-y-3">
          <Card title="Host Details" className="h-[400px]">
            <PieChartComponent
              // onClick={() => setOpen(true)}
              data={data}
              // endpoint="demoChart"
              // title="Device Security Status"
            />
          </Card>
        </div>

        {/* Threat Detection */}
        <div className="lg:col-span-1 space-y-3">
          <Card title="Threat Detection" className="h-[400px]" noPadding>
            <div className="p-2 h-full flex flex-col">
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
                apiEndpoint="dashboard/threatDetectionPiechart"
                dataKey="count"
                xAxisKey="label" //req on bar chart
              />
            </div>
          </Card>
        </div>

        {/* Blacklisted Applications */}
        <div className="lg:col-span-1 space-y-3">
          <Card
            title="Blacklisted Applications"
            className="h-[400px]"
            noPadding
          >
            <div className="p-2 h-full flex flex-col">
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
                apiEndpoint="dashboard/malwareStatusDistribution"
                dataKey="count"
                xAxisKey="label"
              />
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-3">
          <Card
            title="Blacklisted Applications"
            className="h-[400px]"
            noPadding
          >
            <div className="p-2 h-full flex flex-col">

              {/* to check all the functionality of BarChartComponent */}
              
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
                apiEndpoint="http://182.48.194.218:9191/api/v1/dashboard/malwareStatusDistribution"
                dataKey="count"
                xAxisKey="label"
              />
            </div>
          </Card>
        </div>
      </div>
      <GenericPopupModal isOpen={openModal} onClose={() => setOpenModal(false)}>
        {selectedKpi && (
          <Table
            tableTitle={getTableTitleForKpi(selectedKpi.label)}
            showCheckboxes={false}
            endpoint={getEndpointForKpi(selectedKpi.key)}
            dataPath={getDataPathForKpi(selectedKpi.key)} // Changed from static "data"
          />
        )}
      </GenericPopupModal>
      {/* <Table tableTitle={"Recent File Data"} showCheckboxes={false} /> */}
      <Table
        tableTitle="Recent File Data"
        showCheckboxes={false}
        endpoint="dashboard/recentFileData"
        dataPath="data.recentFileData"
      />
    <Table
        tableTitle="Threat Detection Details"
        showCheckboxes={false}
        endpoint="dashboard/detectionList"
        dataPath="data.detectionList"
        showActions={true}
        actions={[
          { label: "Edit", onClick: handleEdit, variant: "primary" },
          { label: "Delete", onClick: handleDelete, variant: "danger" },
        ]}
      />
      {/* <Table tableTitle={"Threat Detection Details"} showCheckboxes={false} /> */}
    </div>
  );
}
