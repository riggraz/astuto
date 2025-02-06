import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import I18n from 'i18n-js';

import IPost, { POST_APPROVAL_STATUS_APPROVED, POST_APPROVAL_STATUS_PENDING, postJSON2JS } from '../../interfaces/IPost';
import IPostStatus from '../../interfaces/IPostStatus';
import IBoard from '../../interfaces/IBoard';
import ITenantSetting from '../../interfaces/ITenantSetting';

import PostUpdateList from './PostUpdateList';
import PostEditForm from './PostEditForm';
import PostAttachments from './PostAttachments';
import PostFooter from './PostFooter';
import LikeList from './LikeList';
import ActionBox from './ActionBox';
import LikeButton from '../../containers/LikeButton';
import PostBoardLabel from '../common/PostBoardLabel';
import PostStatusLabel from '../common/PostStatusLabel';
import Comments from '../../containers/Comments';
import Sidebar from '../common/Sidebar';
import PoweredByLink from '../common/PoweredByLink';

import { LikesState } from '../../reducers/likesReducer';
import { CommentsState } from '../../reducers/commentsReducer';
import { PostStatusChangesState } from '../../reducers/postStatusChangesReducer';
import { PostEditFormState } from '../../reducers/currentPostReducer';

import { fromRailsStringToJavascriptDate } from '../../helpers/datetime';
import HttpStatus from '../../constants/http_status';
import ActionLink from '../common/ActionLink';
import { EditIcon } from '../common/Icons';
import Badge, { BADGE_TYPE_DANGER, BADGE_TYPE_WARNING } from '../common/Badge';
import { likeJSON2JS } from '../../interfaces/ILike';

interface Props {
  postId: number;
  post: IPost;
  editMode: boolean;
  editForm: PostEditFormState;
  likes: LikesState;
  followed: boolean;
  comments: CommentsState;
  postStatusChanges: PostStatusChangesState;
  boards: Array<IBoard>;
  postStatuses: Array<IPostStatus>;
  originPost: any;
  isLoggedIn: boolean;
  isPowerUser: boolean;
  currentUserFullName: string;
  currentUserEmail: string;
  currentUserAvatar?: string;
  tenantSetting: ITenantSetting;
  authenticityToken: string;

  requestPost(postId: number): Promise<any>;
  updatePost(
    postId: number,
    title: string,
    description: string,
    boardId: number,
    postStatusId: number,
    attachmentsToDelete: number[],
    attachments: File[],
    authenticityToken: string,
  ): Promise<any>;

  requestLikes(postId: number): Promise<any>;
  requestFollow(postId: number): void;
  requestPostStatusChanges(postId: number): void;

  toggleEditMode(): void;
  handleChangeEditFormTitle(title: string): void;
  handleChangeEditFormDescription(description: string): void;
  handleChangeEditFormBoard(boardId: number): void;
  handleChangeEditFormPostStatus(postStatusId: number): void;

  deletePost(postId: number, authenticityToken: string): Promise<any>;

  postStatusChangeSubmitted(
    newPostStatusId: number,
    userFullName: string,
    userEmail: string,
  ): void;

  submitFollow(
    postId: number,
    isFollow: boolean,
    authenticityToken: string,
  ): void;
}

interface State {
  postLoaded: boolean;
  likesLoaded: boolean;
}

class PostP extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      postLoaded: false,
      likesLoaded: false,
    }

    this._handleUpdatePost = this._handleUpdatePost.bind(this);
    this._handleDeletePost = this._handleDeletePost.bind(this);
  }

  componentDidMount() {
    const { postId } = this.props;

    this.props.requestPost(postId).then(() => this.setState({ postLoaded: true }));
    this.props.requestLikes(postId).then(() => this.setState({ likesLoaded: true }));
    this.props.requestFollow(postId);
    this.props.requestPostStatusChanges(postId);
  }

  _handleUpdatePost(
    title: string,
    description: string,
    boardId: number,
    postStatusId: number,
    attachmentsToDelete: number[],
    attachments: File[],
  ) {
    const {
      postId,
      post,
      currentUserFullName,
      currentUserEmail,
      authenticityToken,

      updatePost,
      postStatusChangeSubmitted,
    } = this.props;

    const oldPostStatusId = post.postStatusId;
    
    updatePost(
      postId,
      title,
      description,
      boardId,
      postStatusId,
      attachmentsToDelete,
      attachments,
      authenticityToken,
    ).then(res => {
      if (res?.status !== HttpStatus.OK) return;
      if (postStatusId === oldPostStatusId) return;

      postStatusChangeSubmitted(
        postStatusId,
        currentUserFullName,
        currentUserEmail,
      );
    });
  }

  _handleDeletePost() {
    this.props.deletePost(
      this.props.postId,
      this.props.authenticityToken
    ).then(() => {
      const board = this.props.boards.find(board => board.id === this.props.post.boardId);
      window.location.href = `/boards/${board.slug || board.id}`;
    });
  }

  render() {
    const {
      post,
      editMode,
      editForm,
      likes,
      followed,
      comments,
      postStatusChanges,
      boards,
      postStatuses,
      originPost,

      isLoggedIn,
      isPowerUser,
      currentUserEmail,
      currentUserAvatar,
      tenantSetting,
      authenticityToken,

      submitFollow,
      toggleEditMode,
      handleChangeEditFormTitle,
      handleChangeEditFormDescription,
      handleChangeEditFormBoard,
      handleChangeEditFormPostStatus,
    } = this.props;

    const {
      postLoaded,
      likesLoaded,
    } = this.state;

    const postToShow = postLoaded ? post : postJSON2JS(originPost.post);
    const likesToShow = likesLoaded ? likes : { items: originPost.likes.map(l => likeJSON2JS(l)), areLoading: false, error: null };
    
    const postUpdates = [
      ...comments.items.filter(comment => comment.isPostUpdate === true),
      ...postStatusChanges.items,
    ].sort(
      (a, b) =>
      fromRailsStringToJavascriptDate(a.createdAt) < fromRailsStringToJavascriptDate(b.createdAt) ? 1 : -1
    );

    return (
      <div className="postContainer">
        <Sidebar>
          <PostUpdateList
            postUpdates={postUpdates}
            postStatuses={postStatuses}
            areLoading={comments.areLoading}
            error={comments.error}
          />

          {
            isPowerUser &&
              <LikeList
                likes={likesToShow.items}
                areLoading={likesToShow.areLoading}
                error={likesToShow.error}
              />
          }

          <ActionBox
            followed={followed}
            submitFollow={() => submitFollow(postToShow.id, !followed, authenticityToken)}

            isLoggedIn={isLoggedIn}
          />

          { tenantSetting.show_powered_by && <PoweredByLink /> }
        </Sidebar>

        <div className="postAndCommentsContainer">
        {
          editMode ?
            <PostEditForm
              {...editForm}
              attachmentUrls={postToShow.attachmentUrls}

              handleChangeTitle={handleChangeEditFormTitle}
              handleChangeDescription={handleChangeEditFormDescription}
              handleChangeBoard={handleChangeEditFormBoard}
              handleChangePostStatus={handleChangeEditFormPostStatus}

              tenantSetting={tenantSetting}
              isPowerUser={isPowerUser}
              boards={boards}
              postStatuses={postStatuses}

              toggleEditMode={toggleEditMode}
              handleUpdatePost={this._handleUpdatePost}
            />
          :
            <>
              <div className="postHeader">
                <LikeButton
                  postId={postToShow.id}
                  likeCount={likesToShow.items.length}
                  showLikeCount={isPowerUser || tenantSetting.show_vote_count}
                  liked={likesToShow.items.find(like => like.email === currentUserEmail) ? 1 : 0}
                  size="large"
                  isLoggedIn={isLoggedIn}
                  authenticityToken={authenticityToken}
                />

                <h3>{postToShow.title}</h3>
              </div>
                
              <div className="postInfo">
                <PostBoardLabel
                  {...boards.find(board => board.id === postToShow.boardId)}
                />
                <PostStatusLabel
                  {...postStatuses.find(postStatus => postStatus.id === postToShow.postStatusId)}
                />
                { isPowerUser &&
                  <ActionLink onClick={toggleEditMode} icon={<EditIcon />} customClass='editAction'>
                    {I18n.t('common.buttons.edit')}
                  </ActionLink>
                }
              </div>

              {
                (isPowerUser && postToShow.approvalStatus !== POST_APPROVAL_STATUS_APPROVED) &&
                  <div className="postInfo">
                    <Badge type={postToShow.approvalStatus === POST_APPROVAL_STATUS_PENDING ? BADGE_TYPE_WARNING : BADGE_TYPE_DANGER}>
                      { I18n.t(`activerecord.attributes.post.approval_status_${postToShow.approvalStatus.toLowerCase()}`) }
                    </Badge>
                  </div>
              }
                
              <ReactMarkdown
                className="postDescription"
                disallowedTypes={['heading', 'image', 'html']}
                unwrapDisallowed
              >
                {postToShow.description}
              </ReactMarkdown>

              <PostAttachments
                attachmentUrls={postToShow?.attachmentUrls}
              />

              <PostFooter
                createdAt={postToShow.createdAt}
                handleDeletePost={this._handleDeletePost}
                toggleEditMode={toggleEditMode}

                isPowerUser={isPowerUser}
                authorEmail={postToShow.userEmail}
                authorFullName={postToShow.userFullName}
                authorAvatar={originPost.authorAvatar}
                currentUserEmail={currentUserEmail}
              />
            </>
        }
          
          <Comments
            postId={this.props.postId}
            tenantSetting={tenantSetting}
            isLoggedIn={isLoggedIn}
            isPowerUser={isPowerUser}
            userEmail={currentUserEmail}
            userAvatar={currentUserAvatar}
            authenticityToken={authenticityToken}
          />
        </div>
      </div>
    );
  }
}

export default PostP;