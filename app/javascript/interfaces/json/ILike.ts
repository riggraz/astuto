interface ILikeJSON {
  id: number;
  user_id: number;
  post_id: number;
  full_name: string;
  email: string;
  user_avatar?: string;
}

export default ILikeJSON;