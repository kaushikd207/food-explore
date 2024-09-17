import React from 'react';
import ReactFlow, { MiniMap, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const Flow = ({ nodes, edges, onNodeClick }) => {
  return (
    <div className="h-screen w-full bg-gray-100">
      <ReactFlow nodes={nodes} edges={edges} onNodeClick={onNodeClick}>
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Flow;
