import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Auth from "./pages/Auth";
import Oauth from "./pages/Oauth";
import PostMain from "./pages/PostMain";
import "./App.css";
import PostCreate from "./pages/PostCreate";
import MyPage from "./pages/MyPage";
import NotFound from "./components/common/NotFound";
import ProductPostPage from "./pages/ProductPostPage";
import ProductMainPage from "./pages/ProductMainPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import Review from "./pages/Review";
import PostDetailPage from "./pages/PostDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/auth/:id" element={<Auth />} />
      <Route path="/oauth/:id" element={<Oauth />} />
      <Route path="/post/create" element={<PostCreate />} />
      <Route path="/post" element={<PostMain />} />
      <Route path="/post/:id" element={<PostDetailPage />} />
      <Route path="/productpost" element={<ProductPostPage />} />
      <Route path="/productpost/:id" element={<ProductPostPage />} />
      <Route path="/product" element={<ProductMainPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/mypage/:id" element={<MyPage />} />
      <Route path="/review/:id" element={<Review />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
