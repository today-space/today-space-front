import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Auth from "./pages/Auth";
import Oauth from "./pages/Oauth";
import "./App.css";
import ProductMain from "./pages/ProductMain";
import PostEdit from "./pages/PostEdit";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/auth/:id" element={<Auth />} />
      <Route path="/oauth/:id" element={<Oauth />} />
      <Route path="/products" element={<ProductMain />} />
      <Route path="/post/edit/:id" element={<PostEdit />} />
    </Routes>
  );
}

export default App;
