import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Auth from "./Auth/Auth";
import Register from "./Register/Register";
import Dashboard from "./Dashboard/Dashboard";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" pathname="/" element={<Auth/>}/>
                <Route path="/register" pathname="/register" element={<Register/>}/>
                <Route path="/dashboard" pathname="/dashboard" element={<Dashboard/>}/>
            </Routes>
        </BrowserRouter>
    );
}
