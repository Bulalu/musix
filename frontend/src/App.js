import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Proposal from "./pages/Proposal";
import Fetchy from "./pages/FetchData";
import moralisLogo from "./images/Moralis.png";
import myLogo from "./images/me.png";
import { ConnectButton } from "web3uikit";

const App = () => {
  return (
    <>
      <div className="header">
        <img width="100px"  src="https://media.giphy.com/media/MagSgolK3ScWvtHAB4/giphy.gif" alt="Ninja donut gif" /> 
        
        <ConnectButton />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/proposal" element={<Proposal />} />
        <Route path="/fetchy" element={<Fetchy />} />
      </Routes>
    </>
  );
};

export default App;
