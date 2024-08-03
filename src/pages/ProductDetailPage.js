import ProductDetail from "../components/product/ProductDetail";
import './page.css'
import Topbar from "../components/common/Topbar";

function ProductDetailPage(){
  return(
      <div>
        <Topbar />
        <ProductDetail />
      </div>
  );
}
export default ProductDetailPage;