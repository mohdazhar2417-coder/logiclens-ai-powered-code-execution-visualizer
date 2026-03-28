import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import CustomFlowNode from "./CustomFlowNode.jsx";

const nodeTypes = {
  traceNode: CustomFlowNode,
};

function FlowCanvas({ nodes, edges, onNodeClick }) {
  return (
    <div className="panel h-[560px] overflow-hidden p-0">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Interactive execution flow</p>
        <h3 className="mt-1 text-lg font-semibold text-white">Execution graph connected to the simulator</h3>
      </div>
      <div className="h-[492px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={(_event, node) => onNodeClick?.(node)}
          fitView
          className="bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(196,181,253,0.22),_transparent_34%),linear-gradient(180deg,_rgba(255,252,246,0.98),_rgba(246,238,224,0.96))]"
        >
          <MiniMap pannable zoomable className="!bg-white/80" />
          <Controls className="!border-none !bg-white/80 !text-slate-700" />
          <Background color="rgba(148, 163, 184, 0.18)" gap={24} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default FlowCanvas;
