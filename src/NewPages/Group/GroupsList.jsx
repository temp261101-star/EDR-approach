import axios from "axios";
import {
  Users,
  Plus,
  Edit,
  Trash,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GroupsList() {
  const [treeData, setTreeData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    node: null,
  });
  const [groupDevices, setGroupDevices] = useState([]);
  const menuRef = useRef(null);

  const preventClickOnContextMenu = (e) => {
    if (e.button === 2) {
      // Right click
      e.stopPropagation();
    }
  };

  const navigate = useNavigate();

  const API = "http://192.168.0.196:5000/api/groups";

  // 🔄 Fetch all data and build tree structure
  const loadGroups = async () => {
    try {
      // Get all records including groups and devices
      const res = await axios.get(
        "http://192.168.0.196:5000/api/all-groups-with-devices"
      );
      const allRecords = res.data;

      // Build nested tree structure
      const buildTree = (parentId = null) => {
        return allRecords
          .filter(
            (item) =>
              item.type === "group" &&
              String(item.parentId || null) === String(parentId)
          )
          .map((node) => ({
            ...node,
            children: buildTree(node.id),
            deviceCount: allRecords.filter(
              (item) =>
                item.type === "groupDevice" &&
                String(item.parentId) === String(node.id)
            ).length,
          }));
      };

      const tree = buildTree();
      setTreeData(tree);

      // If a node was selected, reload its devices
      if (selectedNode) {
        loadGroupDevices(selectedNode.id);
      }
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  // Load devices for selected group
  const loadGroupDevices = async (groupId) => {
    try {
      const res = await axios.get(
        `http://192.168.0.196:5000/api/groups/${groupId}/devices`
      );
      setGroupDevices(res.data);
    } catch (err) {
      console.error("Error fetching group devices:", err);
      setGroupDevices([]);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (selectedNode) {
      loadGroupDevices(selectedNode.id);
    }
  }, [selectedNode]);

  // Hide context menu when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setContextMenu({ visible: false });
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Recursive TreeNode Component
  const TreeNode = ({ node, depth = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(depth === 0);
    const isRightClick = useRef(false);

    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      isRightClick.current = true; // Mark as right-click
      setContextMenu({ visible: true, x: e.clientX, y: e.clientY, node });

      // Reset flag after a short delay
      setTimeout(() => {
        isRightClick.current = false;
      }, 100);
    };

    const handleClick = (e) => {
      // Ignore clicks if it was a right-click
      if (isRightClick.current) {
        return;
      }
      e.stopPropagation();
      setSelectedNode(node);
    };

    const handleToggle = (e) => {
      e.stopPropagation();
      setIsExpanded(!isExpanded);
    };

    const hasChildren = node.children && node.children.length > 0;

    return (
      <div className="relative">
        {/* Node - Compact Version */}
        <div
          className={`group flex items-center cursor-pointer py-1.5 px-2 rounded-md transition-all text-sm ${
            selectedNode?.id === node.id
              ? "bg-blue-600/20 border border-blue-600/40"
              : "hover:bg-gray-800/50"
          }`}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          onMouseDown={(e) => {
            // Prevent default behavior for right-click
            if (e.button === 2) {
              e.preventDefault();
            }
          }}
          style={{ marginLeft: `${depth * 16}px` }}
        >
          {/* Expand/Collapse Icon - Smaller */}
          {hasChildren ? (
            <button
              onClick={handleToggle}
              className="mr-1 p-0.5 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
          ) : (
            <div className="w-4 mr-1 flex-shrink-0"></div>
          )}

          {/* Group Icon - Smaller */}
          <Users className="w-3.5 h-3.5 mr-1.5 text-blue-400 flex-shrink-0" />

          {/* Node Content - Compact */}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <span className="font-medium text-gray-100 truncate block leading-tight">
                {node.name}
              </span>
              {node.description && (
                <p className="text-[10px] text-gray-500 truncate leading-tight mt-0.5">
                  {node.description}
                </p>
              )}
            </div>
            {node.deviceCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] bg-gray-700/80 rounded-full text-gray-300 font-medium flex-shrink-0">
                {node.deviceCount}
              </span>
            )}
          </div>
        </div>

        {/* Children - Tighter spacing */}
        {hasChildren && isExpanded && (
          <div className="ml-3 border-l border-gray-700/30 pl-1">
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleAddChildGroup = async (parent) => {
    const name = prompt(`Enter name for child group under "${parent.name}":`);
    if (!name) return;

    const description = prompt("Enter description (optional):", "");

    try {
      // Use the dedicated child group endpoint
      const response = await axios.post(
        `http://192.168.0.196:5000/api/groups/${parent.id}/children`,
        {
          name,
          description: description || "",
        }
      );

      await loadGroups();

      // Show success message
      alert(
        `Child group "${name}" created successfully under "${parent.name}"`
      );
    } catch (err) {
      console.error("Error creating child group:", err);

      // Show specific error message
      if (err.response && err.response.data && err.response.data.error) {
        alert(`Failed to create child group: ${err.response.data.error}`);
      } else {
        alert("Failed to create child group. Please try again.");
      }
    }
  };

  const handleEditGroup = async (node) => {
    const name = prompt("Enter new group name:", node.name);
    if (!name) return;

    const description = prompt(
      "Enter new description:",
      node.description || ""
    );

    try {
      await axios.put(`${API}/${node.id}`, { name, description });
      await loadGroups();
      alert("Group updated successfully");
    } catch (err) {
      console.error("Error updating group:", err);
      alert("Failed to update group");
    }
  };

  const handleDeleteGroup = async (node) => {
    const confirmMessage =
      node.children && node.children.length > 0
        ? `Delete "${node.name}" and all its ${node.children.length} subgroup(s)? This action cannot be undone.`
        : `Delete "${node.name}"? This action cannot be undone.`;

    if (window.confirm(confirmMessage)) {
      try {
        await axios.delete(`${API}/${node.id}`);
        await loadGroups();

        // Clear selection if deleted node was selected
        if (selectedNode?.id === node.id) {
          setSelectedNode(null);
          setGroupDevices([]);
        }

        alert("Group deleted successfully");
      } catch (err) {
        console.error("Error deleting group:", err);
        alert("Failed to delete group");
      }
    }
  };

  const handleAddRootGroup = async () => {
    const name = prompt("Enter name for new root group:");
    if (!name) return;

    const description = prompt("Enter description (optional):", "");

    const rootGroup = {
      id: Date.now(),
      name,
      description: description || "",
      parentId: null,
      createdAt: new Date().toISOString(),
      type: "group",
    };

    try {
      await axios.post(API, [rootGroup]);
      await loadGroups();
      alert(`Root group "${name}" created successfully`);
    } catch (err) {
      console.error("Error creating root group:", err);
      alert("Failed to create root group");
    }
  };

  // Context menu options
  const getContextMenuOptions = (node) => [
    {
      label: "Add Child Group",
      icon: <Plus size={14} />,
      onClick: () => handleAddChildGroup(node),
    },
    {
      label: "Edit Group",
      icon: <Edit size={14} />,
      onClick: () => handleEditGroup(node),
    },
    {
      label: "Delete Group",
      icon: <Trash size={14} />,
      onClick: () => handleDeleteGroup(node),
      destructive: true,
    },
  ];

  return (
    <div className="flex bg-gray-950 text-gray-100 min-h-screen">
      {/* Left - Tree Panel */}
      <div className="w-1/3 border-r border-gray-800 p-3 overflow-y-auto max-h-screen">
        <div className="flex items-center justify-between mb-3 sticky top-0 bg-gray-950 pb-2 border-b border-gray-800/50 z-10">
          <h2 className="text-base font-semibold">Group Hierarchy</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/dashboard/CreateGroup")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-xs font-medium"
            >
              <Plus size={14} />
              Create Group
            </button>
           
          </div>
        </div>

        {treeData.length > 0 ? (
          <div className="space-y-0.5">
            {treeData.map((node) => (
              <TreeNode key={node.id} node={node} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No groups found</p>
            <button
              onClick={handleAddRootGroup}
              className="mt-3 text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Create your first group
            </button>
          </div>
        )}
      </div>

      {/* Right - Details Panel */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedNode ? (
          <div className="max-w-4xl">
            {/* Group Header */}
            <div className="bg-gray-900 rounded-xl p-6 mb-6 border border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {selectedNode.name}
                  </h1>
                  <p className="text-gray-400 mb-4">
                    {selectedNode.description || "No description provided"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm border border-blue-600/30">
                    {selectedNode.type || "group"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                <div>
                  <span className="text-gray-500">Group ID:</span>
                  <p className="text-gray-300 font-mono">{selectedNode.id}</p>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <p className="text-gray-300">
                    {new Date(selectedNode.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Subgroups:</span>
                  <p className="text-gray-300">
                    {selectedNode.children ? selectedNode.children.length : 0}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Devices:</span>
                  <p className="text-gray-300">{groupDevices.length}</p>
                </div>
              </div>
            </div>

            {/* Devices Section */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users size={20} />
                Devices in Group ({groupDevices.length})
              </h2>

              {groupDevices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupDevices.map((device) => (
                    <div
                      key={device.id}
                      className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-white truncate">
                          {device.name}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            device.status === "Online"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : device.status === "Offline"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          }`}
                        >
                          {device.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-400">
                        <p>
                          IP:{" "}
                          <span className="text-gray-300 font-mono">
                            {device.ip}
                          </span>
                        </p>
                        <p>
                          Location:{" "}
                          <span className="text-gray-300">
                            {device.location}
                          </span>
                        </p>
                        <p>
                          OS: <span className="text-gray-300">{device.os}</span>
                        </p>
                        <p>
                          Branch:{" "}
                          <span className="text-gray-300">{device.branch}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No devices in this group</p>
                  <p className="text-sm mt-1">
                    Add devices to this group from the Create Group page
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">No Group Selected</h2>
            <p>Select a group from the tree to view its details and devices</p>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          ref={menuRef}
          className="fixed bg-gray-800 border border-gray-700 text-gray-200 rounded-lg shadow-xl z-50 min-w-[180px] py-1"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div className="px-3 py-2 font-semibold border-b border-gray-700 text-sm">
            {contextMenu.node?.name}
          </div>
          {getContextMenuOptions(contextMenu.node).map((opt, i) => (
            <button
              key={i}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors ${
                opt.destructive ? "text-red-400 hover:bg-red-500/20" : ""
              }`}
              onClick={() => {
                opt.onClick();
                setContextMenu({ visible: false });
              }}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
