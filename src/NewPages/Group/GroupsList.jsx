// import axios from "axios";
// import {
//   Users,
//   Plus,
//   Edit,
//   Trash,
//   ChevronRight,
//   ChevronDown,
//   X,
//   UserCog,
// } from "lucide-react";
// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Table from "../../components/Table";


// const Modal = ({ isOpen, onClose, title, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold">{title}</h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-200 transition-colors"
//           >
//             <X size={20} />
//           </button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// };

// export default function GroupsList() {
//   const [deleteModal, setDeleteModal] = useState({ show: false, node: null });
//   const [editModal, setEditModal] = useState({ 
//     show: false, 
//     node: null, 
//     name: '', 
//     description: '' 
//   });
//   const [addChildModal, setAddChildModal] = useState({ 
//     show: false, 
//     parent: null, 
//     name: '',
//     description: '' 
//   });
//   const [successModal, setSuccessModal] = useState({ show: false, message: '' });
//   const [errorModal, setErrorModal] = useState({ show: false, message: '' });
//   const [treeData, setTreeData] = useState([]);
//   const [selectedNode, setSelectedNode] = useState(null);
//   const [contextMenu, setContextMenu] = useState({
//     visible: false,
//     x: 0,
//     y: 0,
//     node: null,
//   });
//   const [groupDevices, setGroupDevices] = useState([]);
//   const [showCreateParentModal, setShowCreateParentModal] = useState(false);
//   const [newParentGroup, setNewParentGroup] = useState({
//     name: "",
//     description: "",
//   });

//   const menuRef = useRef(null);
//   const navigate = useNavigate();
//   const API = "http://192.168.0.196:5000/api/groups";

//   // Fetch all data and build tree structure
//   const loadGroups = async () => {
//     try {
//       const res = await axios.get(
//         "http://192.168.0.196:5000/api/all-groups-with-devices"
//       );
//       const allRecords = res.data;

//       const buildTree = (parentId = null) => {
//         return allRecords
//           .filter(
//             (item) =>
//               item.type === "group" &&
//               String(item.parentId || null) === String(parentId)
//           )
//           .map((node) => ({
//             ...node,
//             children: buildTree(node.id),
//             deviceCount: allRecords.filter(
//               (item) =>
//                 item.type === "groupDevice" &&
//                 String(item.parentId) === String(node.id)
//             ).length,
//           }));
//       };

//       const tree = buildTree();
//       setTreeData(tree);

//       if (selectedNode) {
//         loadGroupDevices(selectedNode.id);
//       }
//     } catch (err) {
//       console.error("Error fetching groups:", err);
//       showError("Failed to load groups");
//     }
//   };

//   // Load devices for selected group
//   const loadGroupDevices = async (groupId) => {
//     try {
//       const res = await axios.get(
//         `http://192.168.0.196:5000/api/groups/${groupId}/devices`
//       );
//       setGroupDevices(res.data);
//     } catch (err) {
//       console.error("Error fetching group devices:", err);
//       setGroupDevices([]);
//     }
//   };

//   useEffect(() => {
//     loadGroups();
//   }, []);

//   useEffect(() => {
//     if (selectedNode) {
//       loadGroupDevices(selectedNode.id);
//     }
//   }, [selectedNode]);

//   // Hide context menu when clicking outside
//   useEffect(() => {
//     const handleClick = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setContextMenu({ visible: false });
//       }
//     };
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   // Success and Error modal helpers
//   const showSuccess = (message) => {
//     setSuccessModal({ show: true, message });
//   };

//   const showError = (message) => {
//     setErrorModal({ show: true, message });
//   };

//   // === Create Parent Group Function ===
//   const handleCreateParentGroup = async () => {
//     if (!newParentGroup.name.trim()) {
//       showError("Please provide a group name");
//       return;
//     }

//     const parentGroup = {
//       id: Date.now(),
//       name: newParentGroup.name.trim(),
//       description: newParentGroup.description.trim() || "",
//       parentId: null,
//       createdAt: new Date().toISOString(),
//       type: "group",
//     };

//     try {
//       await axios.post(API, [parentGroup]);
//       await loadGroups();

//       // Reset form and close modal
//       setNewParentGroup({ name: "", description: "" });
//       setShowCreateParentModal(false);
//       showSuccess(`Parent group "${parentGroup.name}" created successfully`);
//     } catch (err) {
//       console.error("Error creating parent group:", err);
//       showError("Failed to create parent group");
//     }
//   };

//   // === Edit Group Function ===
//   const handleEditGroup = (node) => {
//     setEditModal({
//       show: true,
//       node: node,
//       name: node.name,
//       description: node.description || ''
//     });
//   };

//   const handleEditSubmit = async () => {
//     if (!editModal.name.trim()) {
//       showError("Please provide a group name");
//       return;
//     }

//     try {
//       await axios.put(`${API}/${editModal.node.id}`, {
//         name: editModal.name.trim(),
//         description: editModal.description.trim()
//       });
//       await loadGroups();
//       setEditModal({ show: false, node: null, name: '', description: '' });
//       showSuccess("Group Details updated successfully");
//     } catch (err) {
//       console.error("Error updating group:", err);
//       showError("Failed to update group");
//     }
//   };

//   // === Add Child Group Function ===
//   const handleAddChildGroup = (parent) => {
//     setAddChildModal({
//       show: true,
//       parent: parent,
//       name: '',
//       description: ''
//     });
//   };

//   const handleAddChildSubmit = async () => {
//     if (!addChildModal.name.trim()) {
//       showError("Please provide a group name");
//       return;
//     }

//     try {
//       await axios.post(
//         `http://192.168.0.196:5000/api/groups/${addChildModal.parent.id}/children`,
//         { 
//           name: addChildModal.name.trim(), 
//           description: addChildModal.description.trim() || "" 
//         }
//       );
//       await loadGroups();
//       setAddChildModal({ show: false, parent: null, name: '', description: '' });
//       showSuccess(`Child group "${addChildModal.name}" created successfully under "${addChildModal.parent.name}"`);
//     } catch (err) {
//       console.error("Error creating child group:", err);
//       if (err.response?.data?.error) {
//         showError(`Failed to create child group: ${err.response.data.error}`);
//       } else {
//         showError("Failed to create child group. Please try again.");
//       }
//     }
//   };

//   // === Delete Group Function ===
//   const handleDeleteGroup = async (node) => {
//     setDeleteModal({ show: true, node: node });
//   };

//   const handleDeleteConfirm = async () => {
//     const node = deleteModal.node;
//     try {
//       await axios.delete(`${API}/${node.id}`);
//       await loadGroups();

//       if (selectedNode?.id === node.id) {
//         setSelectedNode(null);
//         setGroupDevices([]);
//       }

//       setDeleteModal({ show: false, node: null });
//       showSuccess("Group deleted successfully");
//     } catch (err) {
//       console.error("Error deleting group:", err);
//       showError("Failed to delete group");
//     }
//   };

//   // TreeNode Component
//   const TreeNode = ({ node, depth = 0 }) => {
//     const [isExpanded, setIsExpanded] = useState(depth === 0);
//     const isRightClick = useRef(false);

//     const handleContextMenu = (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       isRightClick.current = true;
//       setContextMenu({ visible: true, x: e.clientX, y: e.clientY, node });

//       setTimeout(() => {
//         isRightClick.current = false;
//       }, 100);
//     };

//     const handleClick = (e) => {
//       if (isRightClick.current) return;
//       e.stopPropagation();
//       setSelectedNode(node);
//     };

//     const handleToggle = (e) => {
//       e.stopPropagation();
//       setIsExpanded(!isExpanded);
//     };

//     const hasChildren = node.children && node.children.length > 0;

//     return (
//       <div className="relative">
//         <div
//           className={`group flex items-center cursor-pointer py-1.5 px-2 rounded-md transition-all text-sm ${
//             selectedNode?.id === node.id
//               ? "bg-blue-600/20 border border-blue-600/40"
//               : "hover:bg-gray-800/50"
//           }`}
//           onClick={handleClick}
//           onContextMenu={handleContextMenu}
//           onMouseDown={(e) => {
//             if (e.button === 2) e.preventDefault();
//           }}
//           style={{ marginLeft: `${depth * 16}px` }}
//         >
//           {hasChildren ? (
//             <button
//               onClick={handleToggle}
//               className="mr-1 p-0.5 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
//             >
//               {isExpanded ? (
//                 <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
//               ) : (
//                 <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
//               )}
//             </button>
//           ) : (
//             <div className="w-4 mr-1 flex-shrink-0"></div>
//           )}

//           <Users className="w-3.5 h-3.5 mr-1.5 text-blue-400 flex-shrink-0" />

//           <div className="flex-1 min-w-0 flex items-center gap-2">
//             <div className="flex-1 min-w-0">
//               <span className="font-medium text-gray-100 truncate block leading-tight">
//                 {node.name}
//               </span>
//               {node.description && (
//                 <p className="text-[10px] text-gray-500 truncate leading-tight mt-0.5">
//                   {node.description}
//                 </p>
//               )}
//             </div>
//             {node.deviceCount > 0 && (
//               <span className="px-1.5 py-0.5 text-[10px] bg-gray-700/80 rounded-full text-gray-300 font-medium flex-shrink-0">
//                 {node.deviceCount}
//               </span>
//             )}
//           </div>
//         </div>

//         {hasChildren && isExpanded && (
//           <div className="ml-3 border-l border-gray-700/30 pl-1">
//             {node.children.map((child) => (
//               <TreeNode key={child.id} node={child} depth={depth + 1} />
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const handleManageGroup = (node) => {
//     navigate("/dashboard/CreateGroup", {
//       state: {
//         isManageMode: true,
//         groupId: node.id,
//         groupName: node.name,
//         groupDescription: node.description || "",
//       },
//     });
//   };

//   const handleAddPolicyToGroup = (node) => {
//     navigate(`/dashboard/group-policy/${node.id}`, {
//       state: {
//         groupName: node.name,
//         groupId: node.id,
//       },
//     });
//   };

//   const getContextMenuOptions = (node) => {
//     const isParentGroup = node.parentId === null;
//     const isChildGroup = node.parentId !== null;

//     const options = [
//       ...(isParentGroup
//         ? []
//         : [
//             {
//               label: "Manage Group",
//               icon: <UserCog size={14} />,
//               onClick: () => handleManageGroup(node),
//             },
//             {
//               label: "Add Policy to Group",
//               icon: <Plus size={14} />,
//               onClick: () => handleAddPolicyToGroup(node),
//             },
//           ]),

//       ...(isChildGroup
//         ? []
//         : [
//             {
//               label: "Add Child Group",
//               icon: <Plus size={14} />,
//               onClick: () => handleAddChildGroup(node),
//             },
//           ]),
//       {
//         label: "Edit Group Details",
//         icon: <Edit size={14} />,
//         onClick: () => handleEditGroup(node),
//       },
//       {
//         label: "Delete Group",
//         icon: <Trash size={14} />,
//         onClick: () => handleDeleteGroup(node),
//         destructive: true,
//       },
//     ];

//     return options;
//   };

//   return (
//     <div className="flex bg-gray-950 text-gray-100 min-h-screen">
//       {/* Left - Tree Panel */}
//       <div className="w-1/3 border-r border-gray-800 p-3 overflow-y-auto max-h-screen">
//         <div className="flex items-center justify-between mb-3 sticky top-0 bg-gray-950 pb-2 border-b border-gray-800/50 z-10">
//           <h2 className="text-base font-semibold">Group Hierarchy</h2>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setShowCreateParentModal(true)}
//               className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-xs font-medium"
//             >
//               <Plus size={14} />
//               Create Parent Group
//             </button>
//           </div>
//         </div>

//         {treeData.length > 0 ? (
//           <div className="space-y-0.5">
//             {treeData.map((node) => (
//               <TreeNode key={node.id} node={node} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-8 text-gray-500">
//             <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
//             <p>No groups found</p>
//             <button
//               onClick={() => setShowCreateParentModal(true)}
//               className="mt-5 text-blue-400 hover:text-blue-300 text-sm underline"
//             >
//               Create your first parent group
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Right - Details Panel */}
//       <div className="flex-1 p-6 overflow-y-auto">
//         {selectedNode ? (
//           <div className="max-w-4xl">
//             <div className="bg-gray-900 rounded-xl p-6 mb-5 border border-gray-800">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h1 className="text-2xl font-bold text-white">
//                     {selectedNode.name}
//                   </h1>
//                   <p className="text-gray-400 mb-1">
//                     {selectedNode.description || "No description provided"}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm border border-blue-600/30">
//                     {selectedNode.type || "group"}
//                   </span>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
//                 <div>
//                   <span className="text-gray-500">Group ID:</span>
//                   <p className="text-gray-300 font-mono">{selectedNode.id}</p>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Created:</span>
//                   <p className="text-gray-300">
//                     {new Date(selectedNode.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>

//                 {selectedNode.parentId ? (
//                   <div>
//                     <span className="text-gray-500">Devices:</span>
//                     <p className="text-gray-300">{groupDevices.length}</p>
//                   </div>
//                 ) : (
//                   <div>
//                     <span className="text-gray-500">Subgroups:</span>
//                     <p className="text-gray-300">
//                       {selectedNode.children ? selectedNode.children.length : 0}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {selectedNode.parentId && (
//               <div className="bg-gray-900 rounded-xl p-2 border border-gray-800">
//                 <h2 className="text-xl font-semibold flex items-center gap-2">
//                   <Users size={20} />
//                   Devices in Group ({groupDevices.length})
//                 </h2>

//                 {groupDevices.length > 0 ? (
//                   <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
//                     <Table showCheckboxes={false} data={groupDevices} />
//                   </div>
//                 ) : (
//                   <div className="text-center py-8 text-gray-500">
//                     <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
//                     <p>No devices in this group</p>
//                     <p className="text-sm mt-1">
//                       Add devices to this group from the Create Group page
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="text-center py-16 text-gray-500">
//             <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
//             <h2 className="text-xl font-semibold mb-2">No Group Selected</h2>
//             <p>Select a group from the tree to view its details and devices</p>
//           </div>
//         )}
//       </div>

//       {/* Create Parent Group Modal */}
//       <Modal
//         isOpen={showCreateParentModal}
//         onClose={() => setShowCreateParentModal(false)}
//         title="Create Parent Group"
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm mb-1 text-gray-300">
//               Group Name *
//             </label>
//             <input
//               type="text"
//               value={newParentGroup.name}
//               onChange={(e) =>
//                 setNewParentGroup({
//                   ...newParentGroup,
//                   name: e.target.value,
//                 })
//               }
//               placeholder="Enter group name"
//               className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//             />
//           </div>

//           <div>
//             <label className="block text-sm mb-1 text-gray-300">
//               Description
//             </label>
//             <textarea
//               value={newParentGroup.description}
//               onChange={(e) =>
//                 setNewParentGroup({
//                   ...newParentGroup,
//                   description: e.target.value,
//                 })
//               }
//               placeholder="Enter group description (optional)"
//               className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent h-20 resize-none"
//             />
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             onClick={() => setShowCreateParentModal(false)}
//             className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleCreateParentGroup}
//             className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
//           >
//             Create Parent Group
//           </button>
//         </div>
//       </Modal>

//       {/* Edit Group Modal */}
//       <Modal
//         isOpen={editModal.show}
//         onClose={() => setEditModal({ show: false, node: null, name: '', description: '' })}
//         title="Edit Group"
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm mb-1 text-gray-300">
//               Group Name *
//             </label>
//             <input
//               type="text"
//               value={editModal.name}
//               onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
//               placeholder="Enter group name"
//               className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//             />
//           </div>

//           <div>
//             <label className="block text-sm mb-1 text-gray-300">
//               Description
//             </label>
//             <textarea
//               value={editModal.description}
//               onChange={(e) => setEditModal({ ...editModal, description: e.target.value })}
//               placeholder="Enter group description (optional)"
//               className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent h-20 resize-none"
//             />
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             onClick={() => setEditModal({ show: false, node: null, name: '', description: '' })}
//             className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleEditSubmit}
//             className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
//           >
//             Update Group
//           </button>
//         </div>
//       </Modal>

//       {/* Add Child Group Modal */}
//       <Modal
//         isOpen={addChildModal.show}
//         onClose={() => setAddChildModal({ show: false, parent: null, name: '', description: '' })}
//         title={`Add Child Group to "${addChildModal.parent?.name}"`}
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm mb-1 text-gray-300">
//               Group Name *
//             </label>
//             <input
//               type="text"
//               value={addChildModal.name}
//               onChange={(e) => setAddChildModal({ ...addChildModal, name: e.target.value })}
//               placeholder="Enter child group name"
//               className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//             />
//           </div>

//           <div>
//             <label className="block text-sm mb-1 text-gray-300">
//               Description
//             </label>
//             <textarea
//               value={addChildModal.description}
//               onChange={(e) => setAddChildModal({ ...addChildModal, description: e.target.value })}
//               placeholder="Enter group description (optional)"
//               className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent h-20 resize-none"
//             />
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             onClick={() => setAddChildModal({ show: false, parent: null, name: '', description: '' })}
//             className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleAddChildSubmit}
//             className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
//           >
//             Create Child Group
//           </button>
//         </div>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         isOpen={deleteModal.show}
//         onClose={() => setDeleteModal({ show: false, node: null })}
//         title="Confirm Delete"
//       >
//         <div className="space-y-4">
//           <p className="text-gray-300">
//             {deleteModal.node?.children && deleteModal.node.children.length > 0
//               ? `Delete "${deleteModal.node?.name}" and all its ${deleteModal.node.children.length} subgroup(s)? This action cannot be undone.`
//               : `Delete "${deleteModal.node?.name}"? This action cannot be undone.`}
//           </p>
//         </div>

//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             onClick={() => setDeleteModal({ show: false, node: null })}
//             className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleDeleteConfirm}
//             className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all"
//           >
//             Delete Group
//           </button>
//         </div>
//       </Modal>

//       {/* Success Modal */}
//       <Modal
//         isOpen={successModal.show}
//         onClose={() => setSuccessModal({ show: false, message: '' })}
//         title="Success"
//       >
//         <div className="space-y-4">
//           <p className="text-green-400">{successModal.message}</p>
//         </div>
//         <div className="flex justify-end mt-6">
//           <button
//             onClick={() => setSuccessModal({ show: false, message: '' })}
//             className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
//           >
//             OK
//           </button>
//         </div>
//       </Modal>

//       {/* Error Modal */}
//       <Modal
//         isOpen={errorModal.show}
//         onClose={() => setErrorModal({ show: false, message: '' })}
//         title="Error"
//       >
//         <div className="space-y-4">
//           <p className="text-red-400">{errorModal.message}</p>
//         </div>
//         <div className="flex justify-end mt-6">
//           <button
//             onClick={() => setErrorModal({ show: false, message: '' })}
//             className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
//           >
//             OK
//           </button>
//         </div>
//       </Modal>

//       {/* Context Menu */}
//       {contextMenu.visible && (
//         <div
//           ref={menuRef}
//           className="fixed bg-gray-800 border border-gray-700 text-gray-200 rounded-lg shadow-xl z-50 min-w-[180px] py-1"
//           style={{ top: contextMenu.y, left: contextMenu.x }}
//         >
//           <div className="px-3 py-2 font-semibold border-b border-gray-700 text-sm">
//             {contextMenu.node?.name}
//           </div>
//           {getContextMenuOptions(contextMenu.node).map((opt, i) => (
//             <button
//               key={i}
//               className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors ${
//                 opt.destructive ? "text-red-400 hover:bg-red-500/20" : ""
//               }`}
//               onClick={() => {
//                 opt.onClick();
//                 setContextMenu({ visible: false });
//               }}
//             >
//               {opt.icon}
//               <span>{opt.label}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }





















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



const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default function GroupsList() {
  const [deleteModal, setDeleteModal] = useState({ show: false, node: null });
  const [editModal, setEditModal] = useState({ 
    show: false, 
    node: null, 
    name: '', 
    description: '' 
  });
  const [addChildModal, setAddChildModal] = useState({ 
    show: false, 
    parent: null, 
    name: '',
    description: '' 
  });
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
      showError("Failed to load groups");
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

  // Success and Error modal helpers
  const showSuccess = (message) => {
    setSuccessModal({ show: true, message });
  };

  const showError = (message) => {
    setErrorModal({ show: true, message });
  };

  // === Create Parent Group Function ===
  const handleCreateParentGroup = async () => {
    if (!newParentGroup.name.trim()) {
      showError("Please provide a group name");
      return;
    }

    const parentGroup = {
      id: Date.now(),
      name: newParentGroup.name.trim(),
      description: newParentGroup.description.trim() || "",
      parentId: null,
      createdAt: new Date().toISOString(),
      type: "group",
    };

    try {
      await axios.post(API, [parentGroup]);
      await loadGroups();

      // Reset form and close modal
      setNewParentGroup({ name: "", description: "" });
      setShowCreateParentModal(false);
      showSuccess(`Parent group "${parentGroup.name}" created successfully`);
    } catch (err) {
      console.error("Error creating parent group:", err);
      showError("Failed to create parent group");
    }
  };

  // === Edit Group Function ===
  const handleEditGroup = (node) => {
    setEditModal({
      show: true,
      node: node,
      name: node.name,
      description: node.description || ''
    });
  };

  const handleEditSubmit = async () => {
    if (!editModal.name.trim()) {
      showError("Please provide a group name");
      return;
    }

    try {
      await axios.put(`${API}/${editModal.node.id}`, {
        name: editModal.name.trim(),
        description: editModal.description.trim()
      });
      await loadGroups();
      setEditModal({ show: false, node: null, name: '', description: '' });
      showSuccess("Group updated successfully");
    } catch (err) {
      console.error("Error updating group:", err);
      showError("Failed to update group");
    }
  };

  // === Add Child Group Function ===
  const handleAddChildGroup = (parent) => {
    setAddChildModal({
      show: true,
      parent: parent,
      name: '',
      description: ''
    });
  };

  const handleAddChildSubmit = async () => {
    if (!addChildModal.name.trim()) {
      showError("Please provide a group name");
      return;
    }

    try {
      await axios.post(
        `http://192.168.0.196:5000/api/groups/${addChildModal.parent.id}/children`,
        { 
          name: addChildModal.name.trim(), 
          description: addChildModal.description.trim() || "" 
        }
      );
      await loadGroups();
      setAddChildModal({ show: false, parent: null, name: '', description: '' });
      showSuccess(`Child group "${addChildModal.name}" created successfully under "${addChildModal.parent.name}"`);
    } catch (err) {
      console.error("Error creating child group:", err);
      if (err.response?.data?.error) {
        showError(`Failed to create child group: ${err.response.data.error}`);
      } else {
        showError("Failed to create child group. Please try again.");
      }
    }
  };

  // === Delete Group Function ===
  const handleDeleteGroup = async (node) => {
    setDeleteModal({ show: true, node: node });
  };

  const handleDeleteConfirm = async () => {
    const node = deleteModal.node;
    try {
      await axios.delete(`${API}/${node.id}`);
      await loadGroups();

      if (selectedNode?.id === node.id) {
        setSelectedNode(null);
        setGroupDevices([]);
      }

      setDeleteModal({ show: false, node: null });
      showSuccess("Group deleted successfully");
    } catch (err) {
      console.error("Error deleting group:", err);
      showError("Failed to delete group");
    }
  };

  // TreeNode Component
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

  const getContextMenuOptions = (node) => {
    const isParentGroup = node.parentId === null;
    const isChildGroup = node.parentId !== null;

    const options = [
      ...(isParentGroup
        ? []
        : [
            {
              label: "Manage Group",
              icon: <Edit size={14} />,
              onClick: () => handleManageGroup(node),
            },
            {
              label: "Add Policy to Group",
              icon: <Plus size={14} />,
              onClick: () => handleAddPolicyToGroup(node),
            },
          ]),

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
<div className="flex flex-col lg:flex-row bg-gray-950 text-gray-100 h-[85vh] overflow-hidden">
      {/* Left - Tree Panel */}
      <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-800 p-4 lg:p-6 overflow-y-auto max-h-[35vh] lg:max-h-screen">
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-gray-950 pb-3 border-b border-gray-800/50 z-10">
          <h2 className="text-lg lg:text-xl font-semibold">Group Hierarchy</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateParentModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-sm font-medium"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Create Parent Group</span>
              <span className="sm:hidden">Create Group</span>
            </button>
          </div>
        </div>

        {treeData.length > 0 ? (
          <div className="space-y-1">
            {treeData.map((node) => (
              <TreeNode key={node.id} node={node} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-base">No groups found</p>
            <button
              onClick={() => setShowCreateParentModal(true)}
              className="mt-4 text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Create your first parent group
            </button>
          </div>
        )}
      </div>

      {/* Right - Details Panel */}
     <div className="flex-1 p-4 lg:p-6 overflow-y-auto h-screen">
        {selectedNode ? (
          <div className="max-w-6xl mx-auto ">
            <div className="bg-gray-900 rounded-xl p-4 lg:p-6 mb-6 border border-gray-800">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-0">
                <div className="flex-1">
                  <h1 className="text-xl lg:text-2xl font-bold text-white break-words">
                    {selectedNode.name}
                  </h1>
                  <p className="text-gray-400 mt-1 text-sm lg:text-base break-words">
                    {selectedNode.description || "No description provided"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm border border-blue-600/30">
                    {selectedNode.type || "group"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 text-sm">
                <div>
                  <span className="text-gray-500 block mb-1">Group ID:</span>
                  <p className="text-gray-300 font-mono text-sm">{selectedNode.id}</p>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Created:</span>
                  <p className="text-gray-300 text-sm">
                    {new Date(selectedNode.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">
                    {selectedNode.parentId ? "Devices:" : "Subgroups:"}
                  </span>
                  <p className="text-gray-300 text-sm">
                    {selectedNode.parentId 
                      ? groupDevices.length 
                      : (selectedNode.children ? selectedNode.children.length : 0)
                    }
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Type:</span>
                  <p className="text-gray-300 text-sm capitalize">
                    {selectedNode.parentId ? "Child Group" : "Parent Group"}
                  </p>
                </div>
              </div>
            </div>

            {selectedNode.parentId && (
              <div className="bg-gray-900 rounded-xl p-1 lg:p-6 border border-gray-800 mb-32 ">
                <h2 className="text-lg lg:text-xl font-semibold flex items-center gap-2 mb-2">
                  <Users size={20} />
                  Devices in Group ({groupDevices.length})
                </h2>

                {groupDevices.length > 0 ? (
                  <div className="overflow-x-auto -mx-4 lg:mx-0">
                    <div className="min-w-full ">
                      <Table showCheckboxes={false} data={groupDevices} />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-base">No devices in this group</p>
                    <p className="text-sm mt-1">
                      Add devices to this group from the Create Group page
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 lg:py-16 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">No Group Selected</h2>
            <p className="text-base">Select a group from the tree to view its details and devices</p>
          </div>
        )}
      </div>

      {/* All Modals - They are already responsive */}
      <Modal
        isOpen={showCreateParentModal}
        onClose={() => setShowCreateParentModal(false)}
        title="Create Parent Group"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-gray-300">
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
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">
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

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={() => setShowCreateParentModal(false)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateParentGroup}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all order-1 sm:order-2"
          >
            Create Parent Group
          </button>
        </div>
      </Modal>

      {/* Edit Group Modal */}
      <Modal
        isOpen={editModal.show}
        onClose={() => setEditModal({ show: false, node: null, name: '', description: '' })}
        title="Edit Group"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-gray-300">
              Group Name *
            </label>
            <input
              type="text"
              value={editModal.name}
              onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
              placeholder="Enter group name"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">
              Description
            </label>
            <textarea
              value={editModal.description}
              onChange={(e) => setEditModal({ ...editModal, description: e.target.value })}
              placeholder="Enter group description (optional)"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent h-20 resize-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={() => setEditModal({ show: false, node: null, name: '', description: '' })}
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleEditSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all order-1 sm:order-2"
          >
            Update Group
          </button>
        </div>
      </Modal>

      {/* Add Child Group Modal */}
      <Modal
        isOpen={addChildModal.show}
        onClose={() => setAddChildModal({ show: false, parent: null, name: '', description: '' })}
        title={`Add Child Group to "${addChildModal.parent?.name}"`}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-gray-300">
              Group Name *
            </label>
            <input
              type="text"
              value={addChildModal.name}
              onChange={(e) => setAddChildModal({ ...addChildModal, name: e.target.value })}
              placeholder="Enter child group name"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">
              Description
            </label>
            <textarea
              value={addChildModal.description}
              onChange={(e) => setAddChildModal({ ...addChildModal, description: e.target.value })}
              placeholder="Enter group description (optional)"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent h-20 resize-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={() => setAddChildModal({ show: false, parent: null, name: '', description: '' })}
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleAddChildSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all order-1 sm:order-2"
          >
            Create Child Group
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, node: null })}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300 text-sm lg:text-base">
            {deleteModal.node?.children && deleteModal.node.children.length > 0
              ? `Delete "${deleteModal.node?.name}" and all its ${deleteModal.node.children.length} subgroup(s)? This action cannot be undone.`
              : `Delete "${deleteModal.node?.name}"? This action cannot be undone.`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={() => setDeleteModal({ show: false, node: null })}
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all order-1 sm:order-2"
          >
            Delete Group
          </button>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={successModal.show}
        onClose={() => setSuccessModal({ show: false, message: '' })}
        title="Success"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-green-400 text-sm lg:text-base">{successModal.message}</p>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={() => setSuccessModal({ show: false, message: '' })}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
          >
            OK
          </button>
        </div>
      </Modal>

      {/* Error Modal */}
      <Modal
        isOpen={errorModal.show}
        onClose={() => setErrorModal({ show: false, message: '' })}
        title="Error"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-red-400 text-sm lg:text-base">{errorModal.message}</p>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={() => setErrorModal({ show: false, message: '' })}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
          >
            OK
          </button>
        </div>
      </Modal>

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