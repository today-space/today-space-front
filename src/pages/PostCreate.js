import Topbar from "../components/common/Topbar";
import './page.css';
import PostCreateForm from "../components/post/PostCreateForm";

function PostCreate() {
  return (
      <div>
        <Topbar/>
        <div className="post-create-container">
          <PostCreateForm/>
        </div>
      </div>
  );
}

export default PostCreate;