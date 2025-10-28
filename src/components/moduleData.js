// moduleData.js
export const moduleData = {
  favorite: {
    name: "Manage Scope",
    sections: [
      {
        id: "dashboard",
        title: "Dashboard",
        items: [
          { id: "policymgmt", label: "Policy Management" },
          { id: "zonedash", label: "Zone Dashboard" },
        ],
      },
      {
        id: "os_hardening",
        title: "OS Hardening",
        items: [
          {
            id: "full_hard_drive_encryption",
            label: "Full Hard Drive Encryption",
            isTitle: true,
            nested: [
              { id: "hdd_drive_encrypt", label: "Hard Drive Encryption" },
              { id: "add_drive", label: "Add Drive" },
            ],
          },
          {
            id: "service_rights_assignment",
            label: "Service and Rights Assignment",
            isTitle: true,
            nested: [
              { id: "createOSpolicy", label: "Create OS Policy" },
              { id: "windowspolicy", label: "Windows Policy" },
            ],
          },
        ],
      },
    ],
  },
  reports: {
    name: "Manage Reports",
    sections: [
      {
        id: "system_reports",
        title: "System Reports",
        items: [
          { id: "cpureport", label: "CPU Report" },
          { id: "ramreport", label: "RAM Report" },
        ],
      },
    ],
  },
};
