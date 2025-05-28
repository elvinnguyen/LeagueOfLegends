import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChampionList from "./components/ChampionList";
import ChampionInfo from "./components/ChampionInfo.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChampionList />} />
        <Route path="/champion/:id" element={<ChampionInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
