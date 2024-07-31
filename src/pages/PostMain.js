import Topbar from "../components/common/Topbar";
import SearchTags from '../components/post/SearchTags';
import AddPostButton from '../components/post/AddPostButton';
import AllPosts from '../components/post/AllPosts'
import './page.css';

function PostMain () {
  return (
      <div>
        <Topbar/>
        <div className="container">
          <SearchTags/>
          <AddPostButton/>
          <AllPosts/>
        </div>
      </div>
  );
}

export default PostMain;