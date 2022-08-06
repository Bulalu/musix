import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Proposal from "./pages/Proposal";
import Fetchy from "./pages/FetchData";
import Testu from "./pages/Testu";


import { ConnectButton } from "web3uikit";

const App = () => {
  return (
    <>
      <div className="header">
        {/* <img width="200px"  src="https://media.giphy.com/media/blSTtZehjAZ8I/giphy."  />  */}
        <h1>Musix</h1>
        
        <ConnectButton />
      </div>
      <Routes>
      
        <Route path="/" element={<Home />} />
        <Route path="/proposal" element={<Proposal />} />
        <Route path="/fetchy" element={<Fetchy />} />
        <Route path="/testu" element={<Testu />} />
      </Routes>
    </>
  );
};

export default App;
