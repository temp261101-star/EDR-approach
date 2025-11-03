import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import Reports from "./pages/Reports.jsx";
import Home from "./pages/Home.jsx";
import ApplicationUser from "./components/ApplicationUser.jsx";
import ReportPanel from "./components/ReportPanel.jsx";
import DynamicGraphPage from "./components/DynamicGraphs/DynamicGraphPage.jsx";
import PolicySetup from "./pages/PolicySetup.jsx";
import AddAntivirus from "./NewPages/AddAntivirus.jsx";
import VirusListing from "./NewPages/VirusListing.jsx";
import PolicySetupPage from "./NewPages/PolicySetupPage.jsx";
import VirusDashboard from "./NewPages/VirusDashboard.jsx";
import AddExternalUSB from "./NewPages/AddExternalUSB.jsx";

import SetMode from "./NewPages/ApplicationControl/SetMode.jsx";
import ViewMode from "./NewPages/ApplicationControl/ViewMode.jsx";
import AddApplication from "./NewPages/ApplicationControl/AddApplication.jsx";
import ViewApplication from "./NewPages/ApplicationControl/ViewApplication.jsx";
import ManageBlackListed from "./NewPages/ApplicationControl/ManageBlackListed.jsx";
import PreventedApplicationReport from "./NewPages/ApplicationControl/PreventedApplicationReport.jsx";
import WhiteListedApplication from "./NewPages/ApplicationControl/WhiteListedApplication.jsx";
import SummaryDashboard from "./NewPages/Dashboards/SummaryDashboard.jsx";
import ViewApplicationList from "./NewPages/ApplicationControl/ViewApplicationList.jsx";
import SetModeReport from "./NewPages/ApplicationControl/SetModeReport.jsx";

import ExternalUsbForm from "./NewPages/USB Protection/ExternalUsbForm.jsx";

import ViewPreventedApplication from "./NewPages/ApplicationControl/ViewPreventedApplication.jsx";
import WhitelistedApplicationReport from "./NewPages/ApplicationControl/WhitelistedApplicationReport.jsx";
import ManageBlackListedResult from "./NewPages/ApplicationControl/ManageBlackListedResult.jsx";
import WebsiteDashboard from "./NewPages/WebsiteProtection/WebsiteDashboard.jsx";
import CaptureWebsiteHistory from "./NewPages/WebsiteProtection/CaptureWebsiteHistory.jsx";
import WebsiteBlacklistHistory from "./NewPages/WebsiteProtection/WebsiteBlacklistHistory.jsx";
import WebsiteBlacklisting from "./NewPages/WebsiteProtection/WebsiteBlacklisting.jsx";
import WebsiteHistoryReport from "./NewPages/WebsiteProtection/WebsiteHistoryReport.jsx";
import DownloadBrowserHistoryReport from "./NewPages/WebsiteProtection/DownloadBrowserHistoryReport.jsx";
import WebsiteBlacklistingForm from "./NewPages/WebsiteProtection/WebsiteBlacklistingForm.jsx";

import ExternalUsbReportList from "./NewPages/USB Protection/ExternalUsbReportList.jsx";
import AntiVirusEdr from "./NewPages/AntiVirus/AntiVirusEdr.jsx";
import ExternalUsbReport from "./NewPages/USB Protection/ExternalUsbReport.jsx";
import ExternalUsbList from "./NewPages/USB Protection/ExternalUsbList.jsx";




function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true"
  );

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" />
          ) : (
            <Login setIsAuthenticated={setIsAuthenticated} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <DashboardLayout setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <Navigate to="/" />
          )
        }
      >
        <Route index element={<Home />} />
        <Route path="/dashboard/summaryDashboard" element={<SummaryDashboard />} />
        <Route path="/dashboard/reportPanel" element={<ReportPanel />} />
        <Route
          path="/dashboard/add-application-user"
          element={<ApplicationUser />}
        />
        <Route path="/dashboard/addAntiVirusForm" element={<AddAntivirus />} />
        <Route path="dynamicGraph" element={<DynamicGraphPage />} />
        <Route path="reports" element={<Reports />} />
        <Route path="/dashboard/policy-setup" element={<PolicySetup />} />
        {/* <Route path="/dashboard/externalUsb" element={<AddExternalUSB />} /> */}
        <Route path="/dashboard/PolicySetup" element={<PolicySetupPage />} />
        <Route path="/dashboard/virusListing" element={<VirusListing />} />
        <Route path="/dashboard/virusDashboard" element={<VirusDashboard />} />
        <Route path="/dashboard/setMode" element={<SetMode />} />
        <Route path="/dashboard/viewMode" element={<ViewMode />} />
        <Route path="/dashboard/addApplication" element={<AddApplication />} />
        <Route path="/dashboard/viewApplication" element={<ViewApplication />} />
      
        <Route path="/dashboard/preventedApplicationReport" element={<PreventedApplicationReport />} />
        <Route path="/dashboard/preventedApplicationReport/viewpreventedApplication" element={<ViewPreventedApplication />} />
        <Route path="/dashboard/whitelistedApplication" element={<WhiteListedApplication />} />
        <Route path="/dashboard/whitelistedApplication/WhitelistedApplicationReport" element={<WhitelistedApplicationReport />} />
         <Route path="/dashboard/manageBlacklisted" element={<ManageBlackListed />} />
        <Route path="/dashboard/manageBlacklisted/manageBlacklistedResult" element={<ManageBlackListedResult />} />
        <Route path="/dashboard/viewApplication/viewApplicationListing" element={<ViewApplicationList />} />
        <Route path="/dashboard/WebsiteDashboard" element={<WebsiteDashboard />} />
        <Route path="/dashboard/CaptureWebsiteHistory" element={<CaptureWebsiteHistory />} />
        <Route path="/dashboard/WebsiteBlacklistHistory" element={<WebsiteBlacklistHistory />} />
        <Route path="/dashboard/WebsiteBlacklist" element={<WebsiteBlacklisting />} />
        <Route path="/dashboard/WebsiteHistoryReport" element={<WebsiteHistoryReport />} />
        <Route path="/dashboard/DownloadBrowserHistory" element={<DownloadBrowserHistoryReport />} />
        <Route path="/dashboard/WebsiteBlacklist/WebsiteBlacklistForm" element={<WebsiteBlacklistingForm />} />
        <Route path="/dashboard/externalusb" element={<ExternalUsbList />} />
        <Route path="/dashboard/externalusb/externalusbform" element={<ExternalUsbForm />} />
        <Route path="/dashboard/externalUsbReport" element={<ExternalUsbReport />} />
        <Route path="/dashboard/externalUsbReportlist" element={<ExternalUsbReportList />} />
        <Route path="/dashboard/antivirusEdr" element={<AntiVirusEdr />} />

      </Route>
    </Routes>

  );
}

export default App;
