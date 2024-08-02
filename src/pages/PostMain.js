import Topbar from "../components/common/Topbar";
import SearchTags from '../components/post/SearchTags';
import AddPostButton from '../components/post/AddPostButton';
import AllPosts from '../components/post/AllPosts'
import './page.css';

function PostMain () {
  return (
      <div>
        <Topbar/>
        <div className="search-tags-wrapper">
          <SearchTags/>
        </div>
        <div className="add-post-button-wrapper">
          <AddPostButton/>
        </div>
        <AllPosts/>
      </div>
  );
}

export default PostMain;
