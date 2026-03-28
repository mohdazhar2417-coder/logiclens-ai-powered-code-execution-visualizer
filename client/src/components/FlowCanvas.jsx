import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import CustomFlowNode from "./CustomFlowNode.jsx";

const nodeTypes = {
  traceNode: CustomFlowNode,
};

function FlowCanvas({ nodes, edges, onNodeClick }) {
  return (
    <div className="panel h-[520px] overflow-hidden p-0">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Interactive execution flow</p>
        <h3 className="mt-1 text-lg font-semibold text-white">React Flow visual storytelling canvas</h3>
      </div>
      <div className="h-[452px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={(_event, node) => onNodeClick?.(node)}
          fitView
          className="bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_28%),linear-gradient(180deg,_rgba(2,6,23,0.98),_rgba(8,15,32,0.98))]"
        >
          <MiniMap pannable zoomable className="!bg-slate-950/80" />
          <Controls className="!border-none !bg-slate-950/80 !text-white" />
          <Background color="rgba(148, 163, 184, 0.18)" gap={24} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default FlowCanvas;
