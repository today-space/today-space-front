import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Auth from "./pages/Auth";
import Oauth from "./pages/Oauth";
import "./App.css";
import MyPage from "./pages/MyPage";
import NotFound from "./components/common/NotFound";
import ProductPostPage from "./pages/ProductPostPage";
import ProductMainPage from "./pages/ProductMainPage";
import ProductDetailPage from "./pages/ProductDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/auth/:id" element={<Auth />} />
      <Route path="/oauth/:id" element={<Oauth />} />
      <Route path="/productpost" element={<ProductPostPage />} />
      <Route path="/product" element={<ProductMainPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/mypage/:id" element={<MyPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
