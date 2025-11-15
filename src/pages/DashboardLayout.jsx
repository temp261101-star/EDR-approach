import { Outlet, Link, useLocation, Routes, Route } from "react-router-dom";
// import DrawerDemoPage from "./DrawerDemoPage";
import {
  Home,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  FileBarChart,
  Database,
  Settings,
  ChevronDown,
  ChevronUp,
  CircleSmall,
  Users,
  LayoutDashboard,
  Wrench,
  Shield,
  Usb,
  Globe,
  AppWindow,
  Ban,
} from "lucide-react";

import { useEffect, useState } from "react";

export default function DashboardLayout({ setIsAuthenticated }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [openAccordions, setOpenAccordions] = useState({
    dashboards: true,
    controls: false,
    Application: false,
    usb: false,
    website: false,
    blacklisting: false,
    policy: false,
    group: false,
  });

  const location = useLocation();

  useEffect(() => {
    // Auto-open parent accordions based on current route
    const path = location.pathname;

    // Application Control routes
    const appControlRoutes = [
      "/dashboard/setMode",
      "/dashboard/viewMode",
      "/dashboard/addApplication",
      "/dashboard/viewApplication",
      "/dashboard/manageBlacklisted",
      "/dashboard/preventedApplicationReport",
      "/dashboard/whitelistedApplication",
    ];

    // USB Protection routes
    const usbRoutes = [
      "/dashboard/externalUsb",
      "/dashboard/externalUsbReport",
    ];

    // Website Protection routes
    const websiteRoutes = [
      "/dashboard/CaptureWebsiteHistory",
      "/dashboard/WebsiteBlacklistHistory",
      "/dashboard/WebsiteBlacklist",
      "/dashboard/WebsiteHistoryReport",
      "/dashboard/DownloadBrowserHistory",
    ];

    // Blacklisting routes
    const blacklistRoutes = [
      "/dashboard/addBlacklistedapplication",
      "/dashboard/ViewBlacklistedapplication",
      "/dashboard/managewhitelisted",
      "/dashboard/viewreport",
    ];

    if (appControlRoutes.some((route) => path.startsWith(route))) {
      setOpenAccordions({ controls: true, Application: true });
    } else if (usbRoutes.some((route) => path.startsWith(route))) {
      setOpenAccordions({ controls: true, usb: true });
    } else if (websiteRoutes.some((route) => path.startsWith(route))) {
      setOpenAccordions({ controls: true, website: true });
    } else if (blacklistRoutes.some((route) => path.startsWith(route))) {
      setOpenAccordions({ controls: true, blacklisting: true });
    }
  }, [location.pathname]);

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  // This function closes siblings at the SAME level only
  const toggleParentAccordion = (key) => {
    setOpenAccordions((prev) => {
      const newState = { ...prev };

      // Define parent-level accordions (top level only)
      const parentKeys = ["dashboards", "controls", "policy", "group"];

      // If it's a parent accordion, close other parents
      if (parentKeys.includes(key)) {
        parentKeys.forEach((parentKey) => {
          if (parentKey !== key) {
            newState[parentKey] = false;
          }
        });
      }

      // Toggle the clicked accordion
      newState[key] = !prev[key];

      return newState;
    });
  };

  // const isActiveLink = (path) => {
  //   return (
  //     location.pathname === path || location.pathname.startsWith(path + "/")
  //   );
  // };
  const isActiveLink = (path) => {
    // Special handling for main dashboard to avoid always being active
    if (path === "/dashboard") {
      return (
        location.pathname === "/dashboard" ||
        location.pathname === "/dashboard/"
      );
    }
    // For all others, allow nested matching
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  // Check if any child route is active for parent highlighting
  const isParentActive = (parentPaths) => {
    // Special case: don't highlight dashboard accordion unless exactly on those routes
    const isDashboardAccordion = parentPaths.includes("/dashboard");

    if (isDashboardAccordion) {
      return parentPaths.some((path) => location.pathname === path);
    }

    return parentPaths.some(
      (path) =>
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
    childPaths = [],
  }) => {
    const isActive = isParentActive(childPaths);

    return (
      <div className="mb-0">
        <button
          onClick={onToggle}
          className={`w-full flex ${collapsed && " justify-center"} items-center justify-between p-1 rounded-md transition-colors duration-200   ${
            isActive
              ? "bg-cyan-900/50 text-cyan-300 font-medium "
              : "text-gray-300 hover:bg-gray-700 hover:text-cyan-400"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Icon size={iconSize} className={isActive ? "text-cyan-400" : ""} />
            {!collapsed && <span className="font-medium text-sm">{title}</span>}
          </div>
          {!collapsed && (
            <div className="transition-transform duration-200">
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          )}
        </button>
        {!collapsed && (
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 "
            }`}
          >
            <div className="pl-3 py-0 space-y-0">{children}</div>
          </div>
        )}
      </div>
    );
  };
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
        className={`fixed md:static z-20 top-0 left-0 h-full bg-gray-800 shadow-2xl flex flex-col transform transition-all duration-300 border-r border-gray-700
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 
          ${collapsed ? "w-15" : "w-60"}`}
      >
   
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700 bg-gray-800">
          {/* Logo + Title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">S+</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-tight">
                <h2 className="text-sm font-bold text-gray-100">ScanPlus</h2>
                <p className="text-[10px] text-gray-400">Security Console</p>
              </div>
            )}
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {/* Dashboards */}
          {/* Dashboards */}
          <AccordionItem
            title="Dashboards"
            icon={LayoutDashboard}
            iconSize={25}
            isOpen={openAccordions.dashboards}
            onToggle={() => toggleParentAccordion("dashboards")} // Changed here
            childPaths={["/dashboard", "/dashboard/summaryDashboard"]}
          >
            <NavLink to="/dashboard" icon={Home}>
              Main Dashboard
            </NavLink>
            <NavLink to="/dashboard/summaryDashboard" icon={Database}>
              Summary Dashboard
            </NavLink>
          </AccordionItem>

          {/* Controls */}
          <AccordionItem
            title="Controls"
            icon={Wrench}
            iconSize={25}
            isOpen={openAccordions.controls}
            onToggle={() => toggleParentAccordion("controls")}
            childPaths={[
              "/dashboard/setMode",
              "/dashboard/viewMode",
              "/dashboard/addApplication",
              "/dashboard/viewApplication",
              "/dashboard/manageBlacklisted",
              "/dashboard/preventedApplicationReport",
              "/dashboard/whitelistedApplication",
              "/dashboard/externalUsb",
              "/dashboard/externalUsbReport",
              "/dashboard/CaptureWebsiteHistory",
              "/dashboard/WebsiteBlacklistHistory",
              "/dashboard/WebsiteBlacklist",
              "/dashboard/WebsiteHistoryReport",
              "/dashboard/DownloadBrowserHistory",
              "/dashboard/addBlacklistedapplication",
              "/dashboard/ViewBlacklistedapplication",
              "/dashboard/managewhitelisted",
              "/dashboard/viewreport",
            ]}
          >
            {/* Application Control */}
            <AccordionItem
              title="Application Control"
              icon={AppWindow}
              isOpen={openAccordions.Application}
              onToggle={() => toggleAccordion("Application")}
              childPaths={[
                "/dashboard/setMode",
                "/dashboard/viewMode",
                "/dashboard/addApplication",
                "/dashboard/viewApplication",
                "/dashboard/manageBlacklisted",
                "/dashboard/preventedApplicationReport",
                "/dashboard/whitelistedApplication",
              ]}
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
                Prevented Report
              </NavLink>
              <NavLink
                to="/dashboard/whitelistedApplication"
                icon={CircleSmall}
              >
                Whitelisted
              </NavLink>
            </AccordionItem>

            {/* USB Protection */}
            <AccordionItem
              title="USB Protection"
              icon={Usb}
              isOpen={openAccordions.usb}
              onToggle={() => toggleAccordion("usb")}
              childPaths={[
                "/dashboard/externalUsb",
                "/dashboard/externalUsbReport",
              ]}
            >
              <NavLink to="/dashboard/externalUsb" icon={CircleSmall}>
                External USB
              </NavLink>
              <NavLink to="/dashboard/externalUsbReport" icon={CircleSmall}>
                USB Report
              </NavLink>
            </AccordionItem>

            {/* Website Protection */}
            <AccordionItem
              title="Website Protection"
              icon={Globe}
              isOpen={openAccordions.website}
              onToggle={() => toggleAccordion("website")}
              childPaths={[
                "/dashboard/CaptureWebsiteHistory",
                "/dashboard/WebsiteBlacklistHistory",
                "/dashboard/WebsiteBlacklist",
                "/dashboard/WebsiteHistoryReport",
                "/dashboard/DownloadBrowserHistory",
              ]}
            >
              <NavLink to="/dashboard/CaptureWebsiteHistory" icon={CircleSmall}>
                Capture History
              </NavLink>
              <NavLink
                to="/dashboard/WebsiteBlacklistHistory"
                icon={CircleSmall}
              >
                Blacklist History
              </NavLink>
              <NavLink to="/dashboard/WebsiteBlacklist" icon={CircleSmall}>
                Website Blacklist
              </NavLink>
              <NavLink to="/dashboard/WebsiteHistoryReport" icon={CircleSmall}>
                History Report
              </NavLink>
              <NavLink
                to="/dashboard/DownloadBrowserHistory"
                icon={CircleSmall}
              >
                Download Browser History
              </NavLink>
            </AccordionItem>

            {/* Application Blacklisting */}
            <AccordionItem
              title="Application Blacklisting"
              icon={Ban}
              isOpen={openAccordions.blacklisting}
              onToggle={() => toggleAccordion("blacklisting")}
              childPaths={[
                "/dashboard/addBlacklistedapplication",
                "/dashboard/ViewBlacklistedapplication",
                "/dashboard/managewhitelisted",
                "/dashboard/viewreport",
              ]}
            >
              <NavLink
                to="/dashboard/addBlacklistedapplication"
                icon={CircleSmall}
              >
                Add Application
              </NavLink>
              <NavLink
                to="/dashboard/ViewBlacklistedapplication"
                icon={CircleSmall}
              >
                View Application
              </NavLink>
              <NavLink to="/dashboard/managewhitelisted" icon={CircleSmall}>
                Manage Whitelisted
              </NavLink>
              <NavLink to="/dashboard/viewreport" icon={CircleSmall}>
                View Report
              </NavLink>
            </AccordionItem>
          </AccordionItem>

          {/* Policy */}
          <AccordionItem
            title="Policy"
            icon={Shield}
            iconSize={25}
            isOpen={openAccordions.policy}
            onToggle={() => toggleParentAccordion("policy")}
            childPaths={["/dashboard/PolicySetupFirewall"]}
          >
            <NavLink to="/dashboard/PolicySetupFirewall" icon={CircleSmall}>
              Latest Policy Integrated
            </NavLink>
          </AccordionItem>

          {/* Group */}
          <AccordionItem
            title="Group"
            icon={Users}
            iconSize={25}
            isOpen={openAccordions.group}
            onToggle={() => toggleParentAccordion("group")}
            childPaths={["/dashboard/CreateGroup", "/dashboard/GroupList"]}
          >
        
            <NavLink to="/dashboard/GroupList" icon={CircleSmall}>
              View Groups
            </NavLink>
          </AccordionItem>
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto border-t border-gray-700 bg-gray-800 p-2 flex flex-col">
          <button
            onClick={() => {
              localStorage.removeItem("isAuthenticated");
              setIsAuthenticated(false);
            }}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 py-1.5 px-2 rounded-md transition-colors duration-200 self-start"
            title="Logout"
          >
            <LogOut size={14} />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>

          {!collapsed && (
            <div className="text-[10px] text-gray-500 mt-2 border-t border-gray-700 pt-1 pl-2">
              © {new Date().getFullYear()}{" "}
              <span className="text-cyan-400 font-semibold">ScanPlus</span>
            </div>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 ">
        <header className="bg-gray-800/95 backdrop-blur-md shadow-lg px-4 py-2 flex items-center justify-between border-b border-gray-700 sticky top-0 z-10">
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
