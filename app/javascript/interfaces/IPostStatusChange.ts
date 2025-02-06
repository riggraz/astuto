interface IPostStatusChange {
  postStatusId: number;
  userFullName: string;
  userEmail: string;
  userAvatar?: string;
  createdAt: string;
}

export default IPostStatusChange;