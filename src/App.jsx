import { useState } from "react";

function App() {
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState([]);

  const analyzeCode = () => {
    const steps = [];

    if (code.includes("for")) {
      steps.push("Loop detected");
    }
    if (code.includes("while")) {
      steps.push("While loop detected");
    }
    if (code.includes("if")) {
      steps.push("Conditional detected");
    }
    if (code.includes("System.out.print")) {
      steps.push("Output statement detected");
    }

    if (steps.length === 0) {
      steps.push("Basic analysis ready");
    }

    setAnalysis(steps);
  };

  return (
    <div style={{ padding: "24px", fontFamily: "Arial" }}>
      <h1>LogicLens AI</h1>
      <p>AI Powered Code Execution Visualizer</p>

      <textarea
        rows="14"
        cols="70"
        placeholder="Paste your Java code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <br /><br />

      <button onClick={analyzeCode}>Analyze Code</button>

      <h3>Analysis Output</h3>
      <ul>
        {analysis.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;