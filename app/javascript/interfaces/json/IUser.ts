interface IUserJSON {
  id: number;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  status: string;
}

export default IUserJSON;