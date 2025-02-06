import * as React from 'react';

import Comment from './Comment';

import IComment from '../../interfaces/IComment';
import { ReplyFormState } from '../../reducers/replyFormReducer';
import ITenantSetting from '../../interfaces/ITenantSetting';

interface Props {
  comments: Array<IComment>;
  replyForms: Array<ReplyFormState>;
  parentId: number;
  level: number;

  toggleCommentReply(commentId: number): void;
  setCommentReplyBody(commentId: number, body: string): void;

  handleSubmitComment(body: string, parentId: number, isPostUpdate: boolean, attachments: File[], onSuccess: Function): void;
  handleUpdateComment(commentId: number, body: string, isPostUpdate: boolean, attachmentsToDelete: number[], attachments: File[], onSuccess: Function): void;
  handleDeleteComment(id: number): void;

  tenantSetting: ITenantSetting;
  isLoggedIn: boolean;
  isPowerUser: boolean;
  userEmail: string;
  userAvatar?: string;
}

const CommentList = ({
  comments,
  replyForms,
  parentId,
  level,

  toggleCommentReply,
  setCommentReplyBody,
  handleSubmitComment,
  handleUpdateComment,
  handleDeleteComment,

  tenantSetting,
  isLoggedIn,
  isPowerUser,
  userEmail,
  userAvatar,
}: Props) => (
  <>
    {comments.map((comment, i) => {
      if (comment.parentId === parentId) {
        return (
          <div className="commentList" key={i}>
            <Comment
              replyForm={replyForms.find(replyForm => replyForm.commentId === comment.id)}
              handleToggleCommentReply={() => toggleCommentReply(comment.id)}
              handleCommentReplyBodyChange={
                (e: React.FormEvent) => (
                  setCommentReplyBody(comment.id, (e.target as HTMLTextAreaElement).value)
                )
              }

              handleSubmitComment={handleSubmitComment}
              handleUpdateComment={handleUpdateComment}
              handleDeleteComment={handleDeleteComment}

              {...comment}

              tenantSetting={tenantSetting}
              isLoggedIn={isLoggedIn}
              isPowerUser={isPowerUser}
              currentUserEmail={userEmail}
              currentUserAvatar={userAvatar}
            />

            <CommentList
              comments={comments}
              replyForms={replyForms}
              parentId={comment.id}
              level={level+1}

              toggleCommentReply={toggleCommentReply}
              setCommentReplyBody={setCommentReplyBody}

              handleSubmitComment={handleSubmitComment}
              handleUpdateComment={handleUpdateComment}
              handleDeleteComment={handleDeleteComment}

              tenantSetting={tenantSetting}
              isLoggedIn={isLoggedIn}
              isPowerUser={isPowerUser}
              userEmail={userEmail}
              userAvatar={userAvatar}
            />
          </div>
        );
      } else return null;
    })}
  </>
);

export default CommentList;