import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Auth from "./Auth/Auth";
import RegisterEdit from "./Register&Edit/Register&Edit";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" pathname="/" element={<Auth/>}/>
                <Route path="/edit" pathname="/edit" element={<RegisterEdit/>}/>
            </Routes>
        </BrowserRouter>
    );
}
