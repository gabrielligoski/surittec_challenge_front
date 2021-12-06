import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Auth from "./Auth/Auth";

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" pathname="/" element={<Auth />} />
        </Routes>
      </BrowserRouter>
  );
}
