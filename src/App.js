import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Auth from "./pages/Auth";
import Oauth from "./pages/Oauth";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/auth/:id" element={<Auth />} />
      <Route path="/oauth/:id" element={<Oauth />} />
    </Routes>
  );
}

export default App;
