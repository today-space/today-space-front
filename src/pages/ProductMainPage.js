import Topbar from "../components/common/Topbar";
import './page.css'
import ProductMain from "../components/product/ProductMain";

function ProductMainPage() {

  return (
      <div>
        <div>
          <Topbar />
        </div>
        <div>
          <ProductMain />
        </div>
      </div>
)
  ;
}

export default ProductMainPage;