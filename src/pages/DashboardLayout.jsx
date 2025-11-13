import { Outlet, Link, useLocation, Routes, Route } from "react-router-dom";
// import DrawerDemoPage from "./DrawerDemoPage";
import {
  Home,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  FileBarChart,
  Banknote,
  UserRound,
  Settings,
  ChevronDown,
  ChevronUp,
  CircleSmall,
  Users,
  LayoutDashboard,
  MapPin,
  Database,
  Wrench,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({ setIsAuthenticated }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({
    masters: false,
    atm: true,
    reports: false,
    Application: false,
    usb: false,
    policy:false
  });

  const location = useLocation();

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActiveLink = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const AccordionItem = ({
    title,
    icon: Icon,
    isOpen,
    onToggle,
    children,
    iconSize = 14,
  }) => (
    <div className="mb-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-1 text-gray-300 hover:bg-gray-700 hover:text-cyan-400 rounded-md transition-colors duration-200"
      >
        <div className="flex items-center gap-1.5">
          <Icon size={iconSize} />

          {!collapsed && <span className="font-medium text-sm">{title}</span>}
        </div>
        {!collapsed && (
          <div className="transition-transform duration-200">
            {isOpen ? <ChevronUp size={18} />: <ChevronDown size={18} />}
          </div>
        )}
      </button>
      {!collapsed && (
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pl-3 py-0 space-y-0">{children}</div>
        </div>
      )}
    </div>
  );

  const NavLink = ({ to, icon: Icon, children, badge }) => (
    <Link
      to={to}
      className={`flex items-center justify-between p-1 rounded-md text-sm transition-colors duration-200 ${
        isActiveLink(to)
          ? "bg-cyan-900/50 text-cyan-300 font-medium shadow-sm border-l-2 border-cyan-400"
          : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
      }`}
    >
      <div className="flex items-center gap-1">
        <Icon size={10} />
        <span>{children}</span>
      </div>
      {badge && (
        <span className="bg-red-600 text-white text-xs px-1 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );

  return (
    <div className="flex h-screen bg-gray-900">
      <aside
        className={`fixed md:static z-20 top-0 left-0 h-full bg-gray-800 shadow-2xl flex flex-col transform transition-all duration-300 border-r border-gray-700 items-center
       ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 
       ${collapsed ? "w-15" : "w-60"}`}
      >
        <div className="flex items-center justify-between p-1.5 border-b border-gray-700">
          {!collapsed && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-6 h-6 rounded-lg bg-gray-700 flex items-center justify-center shadow-lg border border-gray-600">
                <div className="w-4 h-4 bg-cyan-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
              </div>
              <div>
                <h2 className="text-xs font-bold text-gray-100">ScanPlus</h2>
                {/* <p className="text-xs text-cyan-400">ATM Security</p> */}
              </div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-0.5 rounded-md hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-200"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-0.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 p-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <Link
            to="/dashboard"
            className={`flex items-center gap-1.5 p-1.5 mb-1 rounded-md transition-colors duration-200 ${
              location.pathname === "/dashboard"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/25"
                : "text-gray-300 hover:bg-gray-700 hover:text-cyan-400"
            }`}
            title={collapsed ? "Dashboard" : ""}
          >
            <Home size={20} />
            {!collapsed && (
              <span className="font-medium text-sm">Main Dashboard </span>
            )}
          </Link>


            <AccordionItem
            title="Dashboards"
            icon={Database}
            iconSize={18}
            isOpen={openAccordions.masters}
            onToggle={() => toggleAccordion("masters")}
          >
            {/* <NavLink to="/dashboard/dynamicGraph" icon={LayoutDashboard }>
              Dynamic Dashboard
            </NavLink> */}

            <NavLink to="/dashboard/summaryDashboard" icon={Database}>
             Summary Dashboard
            </NavLink>

            
            <NavLink to="/dashboard/dashboard" icon={Database}>
             Dashboard
            </NavLink>
          </AccordionItem>

          {/* <AccordionItem
            title="Dynamic Form Data"
            icon={Database}
            iconSize={18}
            isOpen={openAccordions.masters}
            onToggle={() => toggleAccordion("masters")}
          >
            <NavLink to="/dashboard/dynamicGraph" icon={LayoutDashboard }>
              Dynamic Dashboard
            </NavLink>

            <NavLink to="/dashboard/addAntiVirusForm" icon={Settings}>
              Add Antivirus
            </NavLink>
          </AccordionItem> */}

          {/* <AccordionItem
            title="Listing On date"
            icon={Banknote}
              iconSize={18}
            isOpen={openAccordions.atm}
            onToggle={() => toggleAccordion("atm")}
          >
            <NavLink to="/dashboard/reportPanel" icon={AlertTriangle}>
              Report Panel
            </NavLink>

          
            <NavLink to="/dashboard/add-application-user" icon={UserRound}>
              Add Application User
            </NavLink>
          </AccordionItem> */}

          {/* <AccordionItem
            title="Dynamic Listings"
            icon={FileBarChart}
              iconSize={18}
            isOpen={openAccordions.reports}
            onToggle={() => toggleAccordion("reports")}
          >
            <NavLink to="/dashboard/reports" icon={FileBarChart}>
              Reports
            </NavLink>
            <NavLink to="/dashboard/virusListing" icon={FileBarChart}>
              Virus Listing
            </NavLink>
          </AccordionItem> */} 

          <AccordionItem
            title="Application Control"
            icon={Banknote}
              iconSize={18}
            isOpen={openAccordions.Application}
            onToggle={() => toggleAccordion("Application")}
          >
            <NavLink to="/dashboard/setMode" icon={CircleSmall}>
              Set Mode
            </NavLink>

            <NavLink to="/dashboard/viewMode" icon={CircleSmall}>
              View Mode
            </NavLink>

            <NavLink to="/dashboard/addApplication" icon={CircleSmall}>
              Add Application
            </NavLink>

            <NavLink to="/dashboard/viewApplication" icon={CircleSmall}>
              View Application
            </NavLink>

            <NavLink to="/dashboard/manageBlacklisted" icon={CircleSmall}>
              Manage Blacklisted
            </NavLink>

            <NavLink
              to="/dashboard/preventedApplicationReport"
              icon={CircleSmall}
            >
              Prevented Application Report
            </NavLink>

            <NavLink to="/dashboard/whitelistedApplication" icon={CircleSmall}>
              Whitelisted Application
            </NavLink>
          </AccordionItem>

          <AccordionItem
            title="USB Protection"
            icon={Banknote}
              iconSize={18}
            isOpen={openAccordions.usb}
            onToggle={() => toggleAccordion("usb")}
          >
            <NavLink to="/dashboard/externalUsb" icon={CircleSmall}>
              External USB
            </NavLink>
            <NavLink to="/dashboard/externalUsbReport" icon={CircleSmall}>
            External USB Report
            </NavLink>



             </AccordionItem>

             <AccordionItem
            title="Website Protection"
            icon={Banknote}
            isOpen={openAccordions.website}
            onToggle={() => toggleAccordion("website")}
          >
          
{/*            
            <NavLink to="/dashboard/WebsiteDashboard" icon={CircleSmall}>
            Website Dashboard
            </NavLink> */}

            <NavLink to="/dashboard/CaptureWebsiteHistory" icon={CircleSmall}>
            Capture Website History
            </NavLink>

            <NavLink to="/dashboard/WebsiteBlacklistHistory" icon={CircleSmall}>
            Website Blacklist History
            </NavLink>

            <NavLink to="/dashboard/WebsiteBlacklist" icon={CircleSmall}>
           Website Blacklist
            </NavLink>

            <NavLink to="/dashboard/WebsiteHistoryReport" icon={CircleSmall}>
            Website History Report
            </NavLink>

            <NavLink to="/dashboard/DownloadBrowserHistory" icon={CircleSmall}>
            Download Browser History
            </NavLink>
         
         
  
           
            
            
          </AccordionItem> 


          {/* <AccordionItem
            title="AntiVirus "
            icon={Banknote}
            isOpen={openAccordions.antivirus}
            onToggle={() => toggleAccordion("antivirus")}>

               <NavLink to="/dashboard/antivirusEdr" icon={CircleSmall}>
            Antivirus EDR
            </NavLink>

            </AccordionItem> */}
            
          <AccordionItem
            title="Application Blacklisting "
            icon={Banknote}
            isOpen={openAccordions.blacklisting}
            onToggle={() => toggleAccordion("blacklisting")}>

               <NavLink to="/dashboard/addBlacklistedapplication" icon={CircleSmall}>
             Add Application
            </NavLink>

             <NavLink to="/dashboard/ViewBlacklistedapplication" icon={CircleSmall}>
             View Application
            </NavLink>

             <NavLink to="/dashboard/managewhitelisted" icon={CircleSmall}>
             Manage Whitelisted
            </NavLink>

               <NavLink to="/dashboard/viewreport" icon={CircleSmall}>
            View Report
            </NavLink>
            </AccordionItem>
          <AccordionItem
            title="Policy"
            icon={Banknote}
            isOpen={openAccordions.policy}
            onToggle={() => toggleAccordion("policy")}>

        

             {/* <NavLink to="/test" icon={CircleSmall}>
          policy View 
            </NavLink>

             <NavLink to="/policy1" icon={CircleSmall}>
          policy View 1
            </NavLink>

             <NavLink to="/policy2" icon={CircleSmall}>
              policy View 2
            </NavLink> */}

               <NavLink to="/policy3" icon={CircleSmall}>
            Latest policy View
            </NavLink>
            </AccordionItem>

          
        </nav>

        <div className="p-1.5 border-t border-gray-700">
          <button
            onClick={() => {
              localStorage.removeItem("isAuthenticated");
              setIsAuthenticated(false);
            }}
            className="w-full flex items-center gap-1.5 p-1.5 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-md transition-colors duration-200"
            title={collapsed ? "Logout" : ""}
          >
          <LogOut size={12} />
            {!collapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 ">
        <header className="bg-gray-800/95 backdrop-blur-md shadow-lg px-3 py-1 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-1 rounded-md hover:bg-gray-700 text-gray-400 hover:text-gray-200"
            >
              <Menu size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-1 bg-green-900/30 text-green-400 px-2 py-1 rounded-full text-xs border border-green-700/50">
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
              System Online
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto  bg-gray-900 flex flex-col py-1 ">
          <div className="flex-1  ">
            <Outlet />
          </div>
          <footer className="mt-auto bg-gray-900 flex justify-center items-center gap-1 text-xs text-gray-500 border-t border-gray-700 pt-1 ">
            <div className="flex items-center gap-1.5 my-2">
              <div className="w-5 h-5 bg-cyan-500 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <span className="font-semibold text-gray-400 ">ScanPlus</span>
            </div>
            <p className="text-gray-400">
              © {new Date().getFullYear()} ScanPlus ATM Management. All rights
              reserved.
            </p>
          </footer>
        </main>
      </div>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-60 z-10 md:hidden"
        />
      )}
    </div>
  );
}
