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
  const [teacherTab, setTeacherTab] = useState("teacher");
  const [utilityTab, setUtilityTab] = useState("history");
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
  const liveOutput = currentStep ? currentStep.outputSnapshot : "";
  const isPatternProgram = detection?.category === "Pattern Programs";
  const progressPercent = steps.length ? Math.round(((currentStepIndex + 1) / steps.length) * 100) : 0;

  const visitedNodeIds = useMemo(() => {
    return new Set(steps.slice(0, currentStepIndex + 1).map((step) => step.nodeId).filter(Boolean));
  }, [steps, currentStepIndex]);

  const flowNodes = useMemo(() => {
    return (traceData?.nodes || []).map((node) => ({
      ...node,
      data: {
        ...node.data,
        active: node.id === currentStep?.nodeId,
        visited: visitedNodeIds.has(node.id),
      },
    }));
  }, [traceData, currentStep, visitedNodeIds]);

  const flowEdges = useMemo(() => {
    return (traceData?.edges || []).map((edge) => {
      const isActive = edge.source === currentStep?.nodeId || edge.target === currentStep?.nodeId;
      const isVisited = visitedNodeIds.has(edge.source) && visitedNodeIds.has(edge.target);
      const baseStyle = edge.style || {};

      return {
        ...edge,
        animated: isActive || edge.animated,
        style: {
          ...baseStyle,
          stroke: isActive ? "#f97316" : isVisited ? "#8b5cf6" : (baseStyle.stroke || "rgba(120, 113, 108, 0.48)"),
          strokeWidth: isActive ? 4 : isVisited ? 3 : 2.2,
          filter: isActive ? "drop-shadow(0 0 10px rgba(249, 115, 22, 0.45))" : baseStyle.filter,
        },
        labelStyle: {
          fill: isActive ? "#9a3412" : isVisited ? "#6d28d9" : "#6b7280",
          fontWeight: isActive ? 700 : 600,
        },
        labelBgStyle: {
          fill: isActive ? "rgba(255, 237, 213, 0.98)" : "rgba(255, 255, 255, 0.92)",
          fillOpacity: 1,
        },
      };
    });
  }, [traceData, currentStep, visitedNodeIds]);

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
      setTeacherTab("teacher");
      setUtilityTab("history");
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
        supportLevel: detection?.supportLevel,
        confidence: detection?.confidence,
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
    if (step) {
      setCurrentStepIndex(step.stepIndex);
    }
    setTeacherTab("node");
  }

  const teacherTabs = [
    { key: "teacher", label: "Teacher mode" },
    { key: "node", label: "Node details" },
    { key: "why", label: "Why output" },
  ];

  const utilityTabs = [
    { key: "history", label: "Variable history" },
    { key: "output", label: "Live output" },
    { key: "summary", label: "Trace summary" },
  ];

  return (
    <main className="mx-auto max-w-[1720px] px-4 py-5 sm:px-6 lg:px-8">
      <div className="space-y-5">
        <section className="panel overflow-hidden">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Trace workspace</p>
              <div className="space-y-2">
                <h1 className="max-w-4xl text-3xl font-semibold text-white">
                  See how beginner Java code moves from parsing to simulation to visual flow.
                </h1>
                <p className="max-w-3xl text-slate-300">
                  This layout is optimized around the real interaction loop: change code, press next, watch the graph react,
                  and read the explanation without jumping around the page.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 xl:items-end">
              <ModeSwitcher value={mode} onChange={setMode} />
              <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(251,191,36,0.1),rgba(196,181,253,0.18))] px-4 py-3 text-sm text-slate-300">
                {loading ? "Analyzing code..." : status || "Ready for analysis."}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr_0.8fr]">
          <CategorySelector value={selectedCategory} onChange={setSelectedCategory} />
          <ProgramSelector programs={filteredPrograms} value={selectedProgramId} onChange={handleProgramChange} />
          <div className="panel flex flex-col justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Parser to flow link</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Connected end to end</h3>
            </div>
            <p className="text-sm text-slate-300">
              Parsed statements feed the simulation engine, and the resulting execution steps drive the React Flow graph,
              active node state, visited node history, and line highlighting.
            </p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
          <div className="space-y-4">
            <CodeEditor code={code} onChange={setCode} activeLine={currentStep?.lineNumber} />
            <div className="grid gap-4 md:grid-cols-2">
              <DetectionCard detection={detection} />
              <ConfidenceCard detection={detection} />
            </div>
          </div>

          <div className="panel space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Execution studio</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Controls, timeline, graph, and teaching in one zone</h3>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/55 px-4 py-3 text-sm text-slate-300">
                <p className="font-medium text-white">{currentStep?.title || "No step selected yet"}</p>
                <p className="mt-1">Line {currentStep?.lineNumber || "-"} - {progressPercent}% through the trace</p>
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

            <StepTimeline steps={steps} currentStepIndex={currentStepIndex} onSelect={setCurrentStepIndex} />

            <div className="grid gap-4 2xl:grid-cols-[1.24fr_0.82fr]">
              <FlowCanvas nodes={flowNodes} edges={flowEdges} onNodeClick={handleNodeClick} />

              <div className="space-y-4">
                <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(244,234,255,0.5))] p-4 shadow-[0_14px_36px_rgba(143,105,65,0.08)]">
                  <div className="flex flex-wrap gap-2">
                    {teacherTabs.map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setTeacherTab(tab.key)}
                        className={`rounded-full px-4 py-2 text-sm transition ${
                          teacherTab === tab.key
                            ? "bg-gradient-to-r from-amber-300 via-orange-300 to-violet-300 text-slate-950"
                            : "bg-white/55 text-slate-300 hover:bg-white/85"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-white/55 p-4 text-sm text-slate-300">
                    {teacherTab === "teacher" && (
                      <p>Teacher mode sits right beside the graph now, so the explanation updates where the learner is already looking.</p>
                    )}
                    {teacherTab === "node" && (
                      <p>Click any graph node to inspect its code line, variable changes, and the reason for the next transition.</p>
                    )}
                    {teacherTab === "why" && <p>Use the final explanation to connect the whole trace to the output the learner sees.</p>}
                  </div>
                </div>

                {teacherTab === "teacher" && <ExplanationPanel step={currentStep} />}
                {teacherTab === "node" && <NodeDetailsDrawer node={selectedNode} step={selectedNodeStep || currentStep} />}
                {teacherTab === "why" && <WhyOutputPanel summary={traceData?.finalExplanation} />}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_0.92fr_1.16fr]">
          <InputPanel
            inputs={customInputs}
            onChange={(key, value) => setCustomInputs((current) => ({ ...current, [key]: value }))}
          />

          <VariablePanel currentStep={currentStep} simulationState={traceData?.simulationState} />

          <div className="space-y-4">
            <div className="panel">
              <div className="flex flex-wrap gap-2">
                {utilityTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setUtilityTab(tab.key)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      utilityTab === tab.key
                        ? "bg-gradient-to-r from-violet-300 via-fuchsia-200 to-amber-300 text-slate-950"
                        : "bg-white/55 text-slate-300 hover:bg-white/85"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {utilityTab === "history" && <VariableHistoryPanel history={traceData?.variableHistory} />}
            {utilityTab === "output" && (
              <div className="space-y-4">
                <OutputPanel output={liveOutput} />
                {isPatternProgram && <PatternPreviewPanel output={liveOutput} />}
              </div>
            )}
            {utilityTab === "summary" && (
              <TraceSummaryPanel
                detection={detection}
                branchDecisions={traceData?.branchDecisions}
                loopIterationCounts={traceData?.loopIterationCounts}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default WorkspacePage;
