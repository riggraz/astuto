import * as React from 'react';
import Gravatar from 'react-gravatar';

interface Props {
  avatarUrl?: string;
  email: string;
  customClass?: string;
  size?: number;
}

const Avatar = ({avatarUrl, email, customClass, size = 28}: Props) => {
  const customClassName = `avatar${customClass ? ' '+customClass : ''}`;

  if (avatarUrl) {
    return <img src={avatarUrl} alt={`${email} avatar`} width={size} height={size} className={customClassName} />;
  } else {
    return <Gravatar email={email} size={size} className={customClassName} />;
  }
}

export default Avatar;