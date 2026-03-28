import { ArrowRight, BrainCircuit, ChartNoAxesCombined, GitBranchPlus, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Trace how Java thinks",
    body: "See every branch, loop iteration, variable update, and printed output unfold step by step.",
    icon: BrainCircuit,
  },
  {
    title: "Interactive execution flow",
    body: "React Flow turns beginner programs into a visual story instead of a static textbook diagram.",
    icon: GitBranchPlus,
  },
  {
    title: "Learning analytics",
    body: "Confidence, support level, and teacher-mode explanations help students understand why an output happened.",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Real full-stack platform",
    body: "Authentication, saved traces, favorites, admin content management, and cloud deployment readiness are built in.",
    icon: ShieldCheck,
  },
];

function LandingPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex rounded-full border border-amber-300/20 bg-amber-400/10 px-4 py-2 text-sm text-amber-100">
            See how beginner Java programs actually think.
          </div>
          <div className="space-y-4">
            <h1 className="max-w-4xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-7xl">
              LogicLens turns confusing Java execution into a guided visual lesson.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              Beginner programmers often memorize syntax without understanding control flow, variable updates, or why the final
              output appears. LogicLens solves that gap with tracing, explanation, flow visualization, output simulation, and
              saved learning history.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              Launch workspace
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 font-semibold text-slate-100 transition hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { value: "10+", label: "deeply supported demo traces" },
              { value: "5", label: "learning categories" },
              { value: "3", label: "responsive workspace layouts" },
            ].map((item) => (
              <div key={item.label} className="panel">
                <p className="text-3xl font-semibold text-white">{item.value}</p>
                <p className="mt-2 text-sm text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="panel overflow-hidden p-0">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">TraceWise AI cockpit</p>
          </div>
          <div className="grid gap-4 p-6">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <feature.icon className="mb-4 size-6 text-amber-300" />
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
