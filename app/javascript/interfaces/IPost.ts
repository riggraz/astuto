import IPostJSON from "./json/IPost";

// Approval status
export const POST_APPROVAL_STATUS_APPROVED = 'approved';
export const POST_APPROVAL_STATUS_PENDING = 'pending';
export const POST_APPROVAL_STATUS_REJECTED = 'rejected';

export type PostApprovalStatus =
  typeof POST_APPROVAL_STATUS_APPROVED |
  typeof POST_APPROVAL_STATUS_PENDING |
  typeof POST_APPROVAL_STATUS_REJECTED;

interface IPost {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  attachmentUrls?: string[];
  hasAttachments?: boolean;
  approvalStatus: PostApprovalStatus;
  boardId: number;
  postStatusId?: number;
  likeCount: number;
  liked: number;
  commentsCount: number;
  hotness: number;
  userId: number;
  userEmail: string;
  userFullName: string;
  userAvatar?: string;
  createdAt: string;
}

export default IPost;

export const postJSON2JS = (postJSON: IPostJSON): IPost => ({
  id: postJSON.id,
  title: postJSON.title,
  slug: postJSON.slug,
  description: postJSON.description,
  attachmentUrls: postJSON.attachment_urls,
  hasAttachments: postJSON.has_attachments,
  approvalStatus: postJSON.approval_status,
  boardId: postJSON.board_id,
  postStatusId: postJSON.post_status_id,
  likeCount: postJSON.likes_count,
  liked: postJSON.liked,
  commentsCount: postJSON.comments_count,
  hotness: postJSON.hotness,
  userId: postJSON.user_id,
  userEmail: postJSON.user_email,
  userFullName: postJSON.user_full_name,
  userAvatar: postJSON.user_avatar,
  createdAt: postJSON.created_at,
});