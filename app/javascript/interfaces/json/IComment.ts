interface ICommentJSON {
  id: number;
  body: string;
  parent_id: number;
  is_post_update: boolean;
  attachment_urls?: string[];
  user_full_name: string;
  user_email: string;
  user_avatar?: string;
  user_role: number;
  created_at: string;
  updated_at: string;
}

export default ICommentJSON;