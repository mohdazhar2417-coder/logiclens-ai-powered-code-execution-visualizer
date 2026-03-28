import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import CategorySelector from "../components/CategorySelector.jsx";
import CodeEditor from "../components/CodeEditor.jsx";
import ConfidenceCard from "../components/ConfidenceCard.jsx";
import ControlBar from "../components/ControlBar.jsx";
import DetectionCard from "../components/DetectionCard.jsx";
import ExplanationPanel from "../components/ExplanationPanel.jsx";
import FlowCanvas from "../components/FlowCanvas.jsx";
import InputPanel from "../components/InputPanel.jsx";
import ModeSwitcher from "../components/ModeSwitcher.jsx";
import NodeDetailsDrawer from "../components/NodeDetailsDrawer.jsx";
import OutputPanel from "../components/OutputPanel.jsx";
import PatternPreviewPanel from "../components/PatternPreviewPanel.jsx";
import ProgramSelector from "../components/ProgramSelector.jsx";
import StepTimeline from "../components/StepTimeline.jsx";
import TraceSummaryPanel from "../components/TraceSummaryPanel.jsx";
import VariableHistoryPanel from "../components/VariableHistoryPanel.jsx";
import VariablePanel from "../components/VariablePanel.jsx";
import WhyOutputPanel from "../components/WhyOutputPanel.jsx";
import { useTracePlayback } from "../hooks/useTracePlayback.js";
import { samplePrograms as fallbackPrograms } from "../data/samplePrograms.js";
import { api } from "../services/api.js";

function WorkspacePage() {
  const location = useLocation();
  const [mode, setMode] = useState("learning");
  const [programs, setPrograms] = useState(fallbackPrograms);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [code, setCode] = useState(fallbackPrograms[0]?.code || "");
  const [customInputs, setCustomInputs] = useState(fallbackPrograms[0]?.defaultInputs || {});
  const [detection, setDetection] = useState(null);
  const [traceData, setTraceData] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodeStep, setSelectedNodeStep] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPrograms() {
      try {
        const data = await api.listPrograms();
        setPrograms(data);
      } catch {
        setStatus("Using local sample programs because the library API is unavailable.");
      }
    }

    loadPrograms();
  }, []);

  useEffect(() => {
    const reopened = location.state?.reopenedTrace;
    const programFromFavorite = location.state?.selectedProgram;

    if (programFromFavorite) {
      setSelectedProgram(programFromFavorite);
      setSelectedProgramId(programFromFavorite._id || programFromFavorite.subtype);
      setCode(programFromFavorite.code);
      setCustomInputs(programFromFavorite.defaultInputs || {});
      setStatus(`Loaded ${programFromFavorite.name} from favorites.`);
    }

    if (reopened) {
      setCode(reopened.code);
      setCustomInputs(reopened.customInputs || {});
      setDetection({
        category: reopened.category,
        subtype: reopened.subtype,
        confidence: reopened.traceSummary?.detection?.confidence || 74,
        supportLevel: reopened.traceSummary?.detection?.supportLevel || "supported",
        reasons: reopened.traceSummary?.detection?.reasons || [],
      });
      if (reopened.traceSummary?.steps) {
        setTraceData(reopened.traceSummary);
        setCurrentStepIndex(0);
      }
    }
  }, [location.state]);

  const filteredPrograms = useMemo(
    () => programs.filter((program) => selectedCategory === "All" || program.category === selectedCategory),
    [programs, selectedCategory],
  );

  const steps = traceData?.steps || [];
  const currentStep = steps[currentStepIndex] || null;

  const flowNodes = useMemo(() => {
    return (traceData?.nodes || []).map((node) => ({
      ...node,
      data: {
        ...node.data,
        active: node.id === currentStep?.nodeId,
        visited: (traceData?.simulationState?.visitedNodes || []).includes(node.id),
      },
    }));
  }, [traceData, currentStep]);

  useTracePlayback({
    enabled: isPlaying,
    stepCount: steps.length,
    currentStepIndex,
    onAdvance: () => setCurrentStepIndex((index) => Math.min(index + 1, steps.length - 1)),
  });

  useEffect(() => {
    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [currentStepIndex, steps.length]);

  function handleProgramChange(programId) {
    setSelectedProgramId(programId);
    const program = filteredPrograms.find((item) => (item._id || item.subtype) === programId);
    if (!program) return;
    setSelectedProgram(program);
    setCode(program.code);
    setCustomInputs(program.defaultInputs || {});
    setStatus(`Loaded ${program.name}.`);
  }

  async function handleAnalyze() {
    setLoading(true);
    setStatus("");
    try {
      const [detectionResponse, explainResponse] = await Promise.all([
        api.detect({ code, customInputs }),
        api.explain({ code, customInputs }),
      ]);
      setDetection(detectionResponse.detection);
      setTraceData(explainResponse);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setSelectedNode(null);
      setSelectedNodeStep(null);
      setStatus("Trace generated successfully.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveTrace() {
    if (!traceData) return;
    try {
      await api.createTrace({
        title: detection?.subtype || selectedProgram?.name || "Custom Trace",
        category: detection?.category,
        subtype: detection?.subtype,
        code,
        customInputs,
        traceSummary: traceData,
        finalOutput: traceData.finalOutput,
      });
      setStatus("Trace saved to your history.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleFavorite() {
    if (!selectedProgram?._id) {
      setStatus("Choose a library program before adding it to favorites.");
      return;
    }
    try {
      await api.addFavorite(selectedProgram._id);
      setStatus("Program added to favorites.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  function handleNodeClick(node) {
    setSelectedNode(node);
    const step = steps.find((item) => item.nodeId === node.id);
    setSelectedNodeStep(step || null);
  }

  return (
    <main className="mx-auto max-w-[1560px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="panel flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Trace workspace</p>
            <h1 className="text-3xl font-semibold text-white">Visualize how your beginner Java program executes internally</h1>
            <p className="max-w-3xl text-slate-300">
              Switch between learning and demo mode, load a sample, tweak custom inputs, and trace the program one educational
              step at a time.
            </p>
          </div>
          <ModeSwitcher value={mode} onChange={setMode} />
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <CategorySelector value={selectedCategory} onChange={setSelectedCategory} />
          <ProgramSelector programs={filteredPrograms} value={selectedProgramId} onChange={handleProgramChange} />
          <div className="panel flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Trace status</p>
              <p className="mt-1 text-sm text-slate-300">{loading ? "Analyzing code..." : status || "Ready for analysis."}</p>
            </div>
          </div>
        </div>

        <ControlBar
          canPlay={steps.length > 0}
          isPlaying={isPlaying}
          onAnalyze={handleAnalyze}
          onPrev={() => setCurrentStepIndex((index) => Math.max(index - 1, 0))}
          onNext={() => setCurrentStepIndex((index) => Math.min(index + 1, steps.length - 1))}
          onReset={() => {
            setCurrentStepIndex(0);
            setIsPlaying(false);
          }}
          onTogglePlay={() => setIsPlaying((value) => !value)}
          onSave={handleSaveTrace}
          onFavorite={handleFavorite}
          saveDisabled={!traceData}
          favoriteDisabled={!selectedProgram}
        />

        <div className="grid gap-6 2xl:grid-cols-[1.15fr_1.3fr_0.85fr]">
          <div className="space-y-6">
            <CodeEditor code={code} onChange={setCode} activeLine={currentStep?.lineNumber} />
            <InputPanel
              inputs={customInputs}
              onChange={(key, value) => setCustomInputs((current) => ({ ...current, [key]: value }))}
            />
            <DetectionCard detection={detection} />
            <ConfidenceCard detection={detection} />
          </div>

          <div className="space-y-6">
            <FlowCanvas nodes={flowNodes} edges={traceData?.edges || []} onNodeClick={handleNodeClick} />
            <StepTimeline steps={steps} currentStepIndex={currentStepIndex} onSelect={setCurrentStepIndex} />
            <ExplanationPanel step={currentStep} />
            <WhyOutputPanel summary={traceData?.finalExplanation} />
          </div>

          <div className="space-y-6">
            <VariablePanel currentStep={currentStep} simulationState={traceData?.simulationState} />
            <VariableHistoryPanel history={traceData?.variableHistory} />
            <OutputPanel output={currentStep?.outputSnapshot || traceData?.finalOutput} />
            <PatternPreviewPanel output={currentStep?.outputSnapshot || traceData?.finalOutput} />
            <TraceSummaryPanel
              detection={detection}
              branchDecisions={traceData?.branchDecisions}
              loopIterationCounts={traceData?.loopIterationCounts}
            />
            <NodeDetailsDrawer node={selectedNode} step={selectedNodeStep || currentStep} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default WorkspacePage;
