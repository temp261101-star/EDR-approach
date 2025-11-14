import axios from "axios";
import {
  Users,
  Plus,
  Edit,
  Trash,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table";
export default function GroupsList() {

  const [deleteModal, setDeleteModal] = useState({ show: false, node: null });
const [editModal, setEditModal] = useState({ show: false, node: null, name: '', description: '' });
const [addChildModal, setAddChildModal] = useState({ show: false, parent: null, name: '' });
const [successModal, setSuccessModal] = useState({ show: false, message: '' });
const [errorModal, setErrorModal] = useState({ show: false, message: '' });

  const [treeData, setTreeData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    node: null,
  });
  const [groupDevices, setGroupDevices] = useState([]);
  const [showCreateParentModal, setShowCreateParentModal] = useState(false);
  const [newParentGroup, setNewParentGroup] = useState({
    name: "",
    description: "",
  });
  const menuRef = useRef(null);

  const navigate = useNavigate();
  const API = "http://192.168.0.196:5000/api/groups";

  // Fetch all data and build tree structure
  const loadGroups = async () => {
    try {
      const res = await axios.get(
        "http://192.168.0.196:5000/api/all-groups-with-devices"
      );
      const allRecords = res.data;

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

  // === NEW: Create Parent Group Function ===
  const handleCreateParentGroup = async () => {
    if (!newParentGroup.name.trim()) {
      alert("Please provide a group name");
      return;
    }

    const parentGroup = {
      id: Date.now(),
      name: newParentGroup.name.trim(),
      description: newParentGroup.description.trim() || "",
      parentId: null, // This makes it a parent/root group
      createdAt: new Date().toISOString(),
      type: "group",
    };

    try {
      await axios.post(API, [parentGroup]);
      await loadGroups();

      // Reset form and close modal
      setNewParentGroup({ name: "", description: "" });
      setShowCreateParentModal(false);

      alert(`Parent group "${parentGroup.name}" created successfully`);
    } catch (err) {
      console.error("Error creating parent group:", err);
      alert("Failed to create parent group");
    }
  };

  // TreeNode Component (keep your existing one)
  const TreeNode = ({ node, depth = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(depth === 0);
    const isRightClick = useRef(false);

    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      isRightClick.current = true;
      setContextMenu({ visible: true, x: e.clientX, y: e.clientY, node });

      setTimeout(() => {
        isRightClick.current = false;
      }, 100);
    };

    const handleClick = (e) => {
      if (isRightClick.current) return;
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
        <div
          className={`group flex items-center cursor-pointer py-1.5 px-2 rounded-md transition-all text-sm ${
            selectedNode?.id === node.id
              ? "bg-blue-600/20 border border-blue-600/40"
              : "hover:bg-gray-800/50"
          }`}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          onMouseDown={(e) => {
            if (e.button === 2) e.preventDefault();
          }}
          style={{ marginLeft: `${depth * 16}px` }}
        >
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

          <Users className="w-3.5 h-3.5 mr-1.5 text-blue-400 flex-shrink-0" />

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

  // Keep your existing functions (handleAddChildGroup, handleEditGroup, handleDeleteGroup, etc.)
  const handleAddChildGroup = async (parent) => {
    const name = prompt(`Enter name for child group under "${parent.name}":`);
    if (!name) return;

    const description = prompt("Enter description (optional):", "");

    try {
      await axios.post(
        `http://192.168.0.196:5000/api/groups/${parent.id}/children`,
        { name, description: description || "" }
      );
      await loadGroups();
      alert(
        `Child group "${name}" created successfully under "${parent.name}"`
      );
    } catch (err) {
      console.error("Error creating child group:", err);
      if (err.response?.data?.error) {
        alert(`Failed to create child group: ${err.response.data.error}`);
      } else {
        alert("Failed to create child group. Please try again.");
      }
    }
  };

  const handleManageGroup = (node) => {
    navigate("/dashboard/CreateGroup", {
      state: {
        isManageMode: true,
        groupId: node.id,
        groupName: node.name,
        groupDescription: node.description || "",
      },
    });
  };

  const handleAddPolicyToGroup = (node) => {
    navigate(`/dashboard/group-policy/${node.id}`, {
      state: {
        groupName: node.name,
        groupId: node.id,
      },
    });
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

  const getContextMenuOptions = (node) => {
    const isParentGroup = node.parentId === null; // Parent groups have null parentId
    const isChildGroup = node.parentId !== null; // Child groups have a parentId

    const options = [
      // Only show "Manage Group" for child groups
      ...(isParentGroup
        ? []
        : [
            {
              label: "Manage Group",
              icon: <Edit size={14} />,
              onClick: () => handleManageGroup(node),
            },
          ]),
      {
        label: "Add Policy to Group",
        icon: <Plus size={14} />,
        onClick: () => handleAddPolicyToGroup(node),
      },
      // Only show "Add Child Group" for parent groups
      ...(isChildGroup
        ? []
        : [
            {
              label: "Add Child Group",
              icon: <Plus size={14} />,
              onClick: () => handleAddChildGroup(node),
            },
          ]),
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

    return options;
  };
  return (
    <div className="flex bg-gray-950 text-gray-100 min-h-screen">
      {/* Left - Tree Panel */}
      <div className="w-1/3 border-r border-gray-800 p-3 overflow-y-auto max-h-screen">
        <div className="flex items-center justify-between mb-3 sticky top-0 bg-gray-950 pb-2 border-b border-gray-800/50 z-10">
          <h2 className="text-base font-semibold">Group Hierarchy</h2>
          <div className="flex items-center gap-2">
            {/* Updated: Open modal instead of navigating */}
            <button
              onClick={() => setShowCreateParentModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-xs font-medium"
            >
              <Plus size={14} />
              Create Parent Group
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
              onClick={() => setShowCreateParentModal(true)}
              className="mt-5 text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Create your first parent group
            </button>
          </div>
        )}
      </div>

      {/* Right - Details Panel (keep your existing details panel) */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedNode ? (
          <div className="max-w-4xl">
            <div className="bg-gray-900 rounded-xl p-6 mb-5 border border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {selectedNode.name}
                  </h1>
                  <p className="text-gray-400 mb-1">
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

                {selectedNode.parentId ? (
                  <div>
                    <span className="text-gray-500">Devices:</span>
                    <p className="text-gray-300">{groupDevices.length}</p>
                  </div>
                ) : (
                  <div>
                    <span className="text-gray-500">Subgroups:</span>
                    <p className="text-gray-300">
                      {selectedNode.children ? selectedNode.children.length : 0}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {selectedNode.parentId && (
              <div className="bg-gray-900 rounded-xl p-2 border border-gray-800">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Users size={20} />
                  Devices in Group ({groupDevices.length})
                </h2>

                {groupDevices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                    <Table showCheckboxes={false} data={groupDevices} />
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
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">No Group Selected</h2>
            <p>Select a group from the tree to view its details and devices</p>
          </div>
        )}
      </div>

      {/* === NEW: Create Parent Group Modal === */}
      {showCreateParentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create Parent Group</h3>
              <button
                onClick={() => setShowCreateParentModal(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={newParentGroup.name}
                  onChange={(e) =>
                    setNewParentGroup({
                      ...newParentGroup,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter group name"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  Description
                </label>
                <textarea
                  value={newParentGroup.description}
                  onChange={(e) =>
                    setNewParentGroup({
                      ...newParentGroup,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter group description (optional)"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent h-20 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateParentModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateParentGroup}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                Create Parent Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu (keep your existing context menu) */}
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
