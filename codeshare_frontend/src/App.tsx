import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DummyPage from "./components/DummyPage";
import TextEditor from "./components/TextEditor";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DummyPage />} />
        <Route path="/room/:roomId" element={<TextEditor />} />
      </Routes>
    </Router>
  );
};

export default App;
