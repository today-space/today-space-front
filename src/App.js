import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Auth from "./pages/Auth";
import Oauth from "./pages/Oauth";
import "./App.css";
import PostCreate from "./pages/PostCreate";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/auth/:id" element={<Auth />} />
      <Route path="/oauth/:id" element={<Oauth />} />
      <Route path="/post/create" element={<PostCreate />} />
    </Routes>
  );
}

export default App;
