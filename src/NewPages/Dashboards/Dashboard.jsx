import { useEffect, useState } from "react";
import api, { getApi } from "../../lib/api.js";
import PieChartComponent from "../../components/DynamicGraphs/PieChartComponent.jsx";
import DataCard from "../../components/Cards/DataCard.jsx";
import BarChartComponent from "../../components/DynamicGraphs/BarChartComponent.jsx";
import Card from "../../components/Cards/Card.jsx";
import Table from "../../components/Table.jsx";


export default function Dashboard() {
  const [deviceBreakdown, setDeviceBreakdown] = useState([]);
  const [data, setData] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
    const [selectedKpi, setSelectedKpi] = useState(null);

  const formatLabel = (key) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

    const getTableTitleForKpi = (kpiLabel) => {
    return `${kpiLabel} - Details`;
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

  return (
    <div className="bg-gray-900 p-4 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">
        {kpiData.map((kpi) => (
          <div>
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
              data={data}
            />
          </Card>
        </div>
        {/* Threat Detection */}
        <div className="lg:col-span-1 space-y-3">
          <Card title="Threat Detection" className="h-[400px]" noPadding>
            <div className="p-2 h-full flex flex-col">
              <BarChartComponent
                apiEndpoint="dashboard/threatDetectionPiechart"
                dataKey="count"
                xAxisKey="label" 
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
              <BarChartComponent
                apiEndpoint="http://182.48.194.218:9191/api/v1/dashboard/malwareStatusDistribution"
                dataKey="count"
                xAxisKey="label"
              />
            </div>
          </Card>
          </div>
          </div>

           {selectedKpi && (
                     <Table
                       tableTitle={getTableTitleForKpi(selectedKpi.label)}
                       showCheckboxes={false}
                       endpoint={getEndpointForKpi(selectedKpi.key)}
                       dataPath={getDataPathForKpi(selectedKpi.key)} // Changed from static "data"
                     />
                   )}

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
                               />
      
      
    </div>
  );
}
