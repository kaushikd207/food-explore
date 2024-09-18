import React from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

const Flow = ({ nodes, edges, onNodeClick }) => {
  return (
    <div className="w-[100%] h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        fitView
        style={{ background: "#f5f5f5" }}
      >
        <Controls />
        <Background gap={20} size={1} color="#ccc" />
      </ReactFlow>
    </div>
  );
};

export default Flow;
