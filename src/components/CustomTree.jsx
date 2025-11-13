import React, { useState, useRef, useEffect } from "react";

const treeData = [
  {
    id: 1,
    label: "Upstream",
    children: [
      {
        id: 2,
        label: "PM_APP1 (EIH - 172.26.3.31)",
        children: [
          {
            id: 3,
            label: "Updates",
            children: [
              { id: 4, label: "All Updates" },
              { id: 5, label: "Critical Updates" },
              { id: 6, label: "Security Updates" },
              { id: 7, label: "Approve Or Decline" },
              { id: 8, label: "View Patch" },
              { id: 9, label: "Missing Patch" },
            ],
          },
          {
            id: 10,
            label: "Computers",
            children: [
              { id: 11, label: "All Computers" },
              { id: 12, label: "Unassigned Computers" },
              { id: 13, label: "Win10" },
              { id: 14, label: "Win8" },
              { id: 15, label: "Test" },
              { id: 16, label: "Win7" },
              { id: 17, label: "Windows 10" },
              { id: 18, label: "omk_test" },
            ],
          },
          { id: 19, label: "Synchronization" },
        ],
      },
    ],
  },
  { id: 20, label: "Downstream",children:
   [
      {
        id: 2,
        label: "PM_APP1 (EIH - 172.26.3.31)",
        children: [
          {
            id: 3,
            label: "Updates",
            children: [
              { id: 4, label: "All Updates" },
              { id: 5, label: "Critical Updates" },
              { id: 6, label: "Security Updates" },
              { id: 7, label: "Approve Or Decline" },
              { id: 8, label: "View Patch" },
              { id: 9, label: "Missing Patch" },
            ],
          },
          {
            id: 10,
            label: "Computers",
            children: [
              { id: 11, label: "All Computers" },
              { id: 12, label: "Unassigned Computers" },
              { id: 13, label: "Win10" },
              { id: 14, label: "Win8" },
              { id: 15, label: "Test" },
              { id: 16, label: "Win7" },
              { id: 17, label: "Windows 10" },
              { id: 18, label: "omk_test" },
            ],
          },
          { id: 19, label: "Synchronization" },
        ],
      },
    ] },
  
];

// Recursive Tree Node with lines and right-click context menu, now supports getNodeOptions for custom options
const TreeNode = ({ node, depth = 0, isLast = false, onNodeRightClick, getNodeOptions }) => {
  const [open, setOpen] = useState(false);

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (onNodeRightClick) {
      onNodeRightClick(e, node);
    }
  };

  return (
    <div className="relative pl-6">
      {/* Vertical line for all except root */}
      {depth > 0 && (
        <div
          className={`absolute left-0 ${isLast ? 'top-0 h-6' : 'top-0 h-full'} w-6 border-l border-gray-600`}
          style={{ zIndex: 0 }}
        ></div>
      )}
      {/* Horizontal connector for all except root */}
      {depth > 0 && (
        <div
          className="absolute left-0 top-3 w-3 h-0.5 bg-gray-600"
          style={{ zIndex: 1 }}
        ></div>
      )}
      <div
        className="flex items-center cursor-pointer hover:bg-gray-700 px-2 py-1 rounded text-gray-200 relative"
        style={{ zIndex: 2 }}
        onClick={() => setOpen(!open)}
        onContextMenu={handleContextMenu}
      >
        {node.children && (
          <span
            className={`mr-2 transform ${open ? "rotate-90" : ""} transition-transform`}
          >
            ▶
          </span>
        )}
        <span>{node.label}</span>
      </div>

      {/* Children */}
      {open &&
        node.children &&
        node.children.map((child, idx) => (
          <TreeNode
            key={child.id}
            node={child}
            depth={depth + 1}
            isLast={idx === node.children.length - 1}
            onNodeRightClick={onNodeRightClick}
            getNodeOptions={getNodeOptions}
          />
        ))}
    </div>
  );
};

export default function CustomTree({ getNodeOptions }) {
  const [search, setSearch] = useState("");
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, node: null });
  const menuRef = useRef(null);

  // Hide context menu on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };
    if (contextMenu.visible) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [contextMenu.visible]);

  const handleNodeRightClick = (e, node) => {
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      node,
    });
  };

  const filterTree = (nodes, query) => {
    return nodes
      .map((node) => {
        if (node.label.toLowerCase().includes(query.toLowerCase())) return node;
        if (node.children) {
          const filteredChildren = filterTree(node.children, query);
          if (filteredChildren.length > 0) return { ...node, children: filteredChildren };
        }
        return null;
      })
      .filter(Boolean);
  };

  const filteredData = search ? filterTree(treeData, search) : treeData;

  // Default getNodeOptions if not provided
  const getOptions = getNodeOptions || ((node) => {
    if (!node.children) {
      return [
        { label: 'Edit', onClick: () => alert('Edit ' + node.label) },
        { label: 'Delete', onClick: () => alert('Delete ' + node.label) },
        { label: 'Special Leaf Action', onClick: () => alert('Special Leaf Action for ' + node.label) },
      ];
    } else {
      return [
        { label: 'Edit', onClick: () => alert('Edit ' + node.label) },
        { label: 'Delete', onClick: () => alert('Delete ' + node.label) },
        { label: 'Add Child', onClick: () => alert('Add Child to ' + node.label) },
      ];
    }
  });

  return (
    <div className="bg-gray-900 p-4 rounded-md max-w-md border border-gray-500 text-gray-200 relative">
      <input
        type="text"
        placeholder="Search"
        className="w-full mb-3 px-3 py-2 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div>
        {filteredData.map((node, idx) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            isLast={idx === filteredData.length - 1}
            onNodeRightClick={handleNodeRightClick}
            getNodeOptions={getOptions}
          />
        ))}
      </div>

      {/* Context Menu Popup */}
      {contextMenu.visible && (
        <div
          ref={menuRef}
          className="absolute bg-white text-gray-900 rounded shadow-lg border border-gray-300 z-50 min-w-[140px]"
          style={{ top: contextMenu.y - 60, left: contextMenu.x - 20 }}
        >
          <div className="px-4 py-2 font-semibold border-b border-gray-200">{contextMenu.node?.label}</div>
          {contextMenu.node && getOptions(contextMenu.node).map((opt, i) => (
            <button
              key={i}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                opt.onClick();
                setContextMenu((prev) => ({ ...prev, visible: false }));
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
