import * as React from 'react';
import I18n from 'i18n-js';
import InfiniteScroll from 'react-infinite-scroller';

import PostListItem from './PostListItem';
import Spinner from '../common/Spinner';
import {
  DangerText,
  CenteredMutedText,
} from '../common/CustomTexts';

import IPost from '../../interfaces/IPost';
import IPostStatus from '../../interfaces/IPostStatus';

interface Props {
  posts: Array<IPost>;
  showLikeCount: boolean;
  showLikeButtons: boolean;
  postStatuses: Array<IPostStatus>;
  areLoading: boolean;
  error: string;

  hasMore: boolean;
  handleLoadMore(): void;

  isLoggedIn: boolean;
  authenticityToken: string;
}

const PostList = ({
  posts,
  showLikeCount,
  showLikeButtons,
  postStatuses,
  areLoading,
  error,
  hasMore,
  handleLoadMore,
  isLoggedIn,
  authenticityToken,
}: Props) => (
  <div className="postList">
    { error ? <DangerText>{error}</DangerText> : null }
    <InfiniteScroll
      initialLoad={false}
      loadMore={handleLoadMore}
      threshold={50}
      hasMore={hasMore}
      loader={<Spinner key={0} />}
      useWindow={true}
    >
      {
        posts.length > 0 ?
          posts.map((post, i) => (
            <PostListItem
              id={post.id}
              title={post.title}
              slug={post.slug}
              description={post.description}
              postStatus={postStatuses.find(postStatus => postStatus.id === post.postStatusId)}
              likeCount={post.likeCount}
              showLikeCount={showLikeCount}
              showLikeButtons={showLikeButtons}
              liked={post.liked}
              commentsCount={post.commentsCount}
              hasAttachments={post.hasAttachments}

              isLoggedIn={isLoggedIn}
              authenticityToken={authenticityToken}

              key={i}
            />
          ))
        :
          areLoading ? <p></p> : <CenteredMutedText>{I18n.t('board.posts_list.empty')}</CenteredMutedText>
      }
    </InfiniteScroll>
  </div>
);

export default PostList;