import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Auth from "./pages/Auth";
import Oauth from "./pages/Oauth";
import "./App.css";
import ProductPostPage from "./pages/ProductPostPage";
import ProductMainPage from "./pages/ProductMainPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/auth/:id" element={<Auth />} />
      <Route path="/oauth/:id" element={<Oauth />} />
      <Route path="/productpost" element={<ProductPostPage />} />
      <Route path="/product" element={<ProductMainPage />} />
    </Routes>
  );
}

export default App;
