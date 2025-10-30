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
import AddExternalUSB from "./NewPages/addExternalUSB.jsx";
import SetMode from "./NewPages/ApplicationControl/SetMode.jsx";
import ViewMode from "./NewPages/ApplicationControl/ViewMode.jsx";
import AddApplication from "./NewPages/ApplicationControl/AddApplication.jsx";
import ViewApplication from "./NewPages/ApplicationControl/ViewApplication.jsx";
import ManageBlackListed from "./NewPages/ApplicationControl/ManageBlackListed.jsx";
import PreventedApplicationReport from "./NewPages/ApplicationControl/PreventedApplicationReport.jsx";
import WhiteListedApplication from "./NewPages/ApplicationControl/WhiteListedApplication.jsx";
import ViewApplicationList from "./NewPages/ApplicationControl/ViewApplicationList.jsx";
import SetModeReport from "./NewPages/ApplicationControl/SetModeReport.jsx";
import ExternalUsbList from "./NewPages/USBProtection/ExternalUsbList.jsx";
import ExternalUsbForm from "./NewPages/USBProtection/ExternalUsbForm.jsx";
import ExternalUsbReport from "./NewPages/USBProtection/ExternalUsbReport.jsx";




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
        <Route path="/dashboard/manageBlacklisted" element={<ManageBlackListed />} />
        <Route path="/dashboard/preventedApplicationReport" element={<PreventedApplicationReport />} />
        <Route path="/dashboard/whitelistedApplication" element={<WhiteListedApplication />} />
        <Route path="/dashboard/viewApplication/viewApplicationListing" element={<ViewApplicationList />} />
        <Route path="/dashboard/setMode/setModeReport" element={<SetModeReport />} />
        <Route path="/dashboard/externalusb" element={<ExternalUsbList />} />
        <Route path="/dashboard/externalusb/externalusbform" element={<ExternalUsbForm />} />
         <Route path="/dashboard/externalusbreport" element={<ExternalUsbReport />} />
      </Route>
    </Routes>

  );
}

export default App;
