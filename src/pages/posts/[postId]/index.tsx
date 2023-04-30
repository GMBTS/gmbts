import { GetStaticPaths, GetStaticProps } from 'next';

type Post = {
  postId: number;
  title: string;
  content1: string;
  image1: string;
  content2: string;
  image2: string;
};

const Posts = ({ post }: { post: Post }) => {
  return (
    <div style={{ height: '' }}>
      <h1>{post.title}</h1>
    </div>
  );
};

export default Posts;

export const getStaticProps: GetStaticProps = async (context) => {
  const postId = context?.params?.postId;

  const post: Post = {
    postId: 1,
    title: 'headerr',
    content1: 'hey',
    image1: 'https://picsum.photos/200/300',
    content2: 'hey2',
    image2: 'https://picsum.photos/200/300',
  };

  return {
    props: {
      post,
    },
  };
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};
