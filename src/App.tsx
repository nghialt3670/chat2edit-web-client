import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import AppBar from "./components/AppBar";
import { useState } from "react";
import Message from "./models/Message";
import { ContextProvider } from "./contexts";
import Edit from "./pages/Edit";
import { IconButton } from "@mui/material";
import { RiSidebarFoldFill, RiSidebarUnfoldFill } from "react-icons/ri";
import { TfiAlignJustify } from "react-icons/tfi";
import Sidebar from "./components/Sidebar";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <ContextProvider messages={messages} setMessages={setMessages}>
      <div className="main">
        <AppBar />
        <div className="body">
          <Sidebar />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/edit" element={<Edit />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </ContextProvider>
  );
}

export default App;
