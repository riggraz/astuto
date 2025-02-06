interface IPostStatusChangeJSON {
  post_status_id: number;
  user_full_name: string;
  user_email: string;
  user_avatar?: string;
  created_at: string;
}

export default IPostStatusChangeJSON;