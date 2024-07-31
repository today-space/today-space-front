import Topbar from "../components/common/Topbar";
import SearchTags from '../components/post/SearchTags';
import AddPostButton from '../components/post/AddPostButton';
import PostItem from '../components/post/PostItem';
import CommentSection from '../components/post/CommentSection';
import './page.css';

const Post = () => {
  const posts = [
    {
      profileImage: 'https://via.placeholder.com/36',
      title: '우리집거실',
      postImage: 'https://via.placeholder.com/800x500?text=우리집거실+이미지',
      likeCount: 5,
      nickname: '우리집거실',
      content: '안녕하세요! 오늘은 제가 직접 인테리어를 완성해보았습니다. 3개월 동안 열심히 준비한 공간을 정리하고 이곳을 꾸며보았어요. 소파는 편안함을 위해 부드러운 소재를 선택했고, 조명은 은은한 분위기를 연출하기 위해 간접조명을 활용했어요. 식물들도 곳곳에 배치해 생기를 불어넣었습니다. 여러분의 의견이 궁금해요!',
      date: '2024.07.24',
      tags: ['홈스타일링', '인테리어', '거실꾸미기', '집스타그램', '홈데코'],
      comments: [
        {
          avatar: 'https://via.placeholder.com/36',
          author: '인테리어마니아',
          text: '멋진 인테리어네요! 거실 테이블은 어디서 구입하셨나요?',
          time: '2시간 전'
        }
      ]
    },
    {
      profileImage: 'https://via.placeholder.com/36',
      title: '미니멀라이프',
      postImage: 'https://via.placeholder.com/800x500?text=미니멀+주방+이미지',
      likeCount: 3,
      nickname: '미니멀라이프',
      content: '주방을 미니멀하게 꾸며봤어요. 불필요한 것들은 과감히 정리하고, 꼭 필요한 것들만 남겼습니다. 화이트 톤으로 깔끔하게 정리하니 훨씬 넓어 보이네요. 여러분의 주방은 어떤가요?',
      date: '2024.07.23',
      tags: ['미니멀', '주방인테리어', '화이트인테리어', '심플라이프'],
      comments: []
    }
  ];

  return (
      <div>
        <Topbar/>
        <div className="container">
          <SearchTags/>
          <AddPostButton/>
          {posts.map((post, index) => (
              <div className="content">
              <div className="content-wrapper" key={index}>
                <PostItem
                    profileImage={post.profileImage}
                    title={post.title}
                    postImage={post.postImage}
                    likeCount={post.likeCount}
                    nickname={post.nickname}
                    content={post.content}
                    date={post.date}
                    tags={post.tags}
                />
                <CommentSection comments={post.comments}/>
              </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default Post;