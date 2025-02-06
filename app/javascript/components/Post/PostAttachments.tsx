import React from 'react';

interface Props {
  attachmentUrls?: string[];
}

const PostAttachments = ({ attachmentUrls = [] }: Props) => (
  attachmentUrls.length > 0 &&
    <div className="postAttachments">
      {
        attachmentUrls.map((url, index) => (
          <a key={index} href={url} target="_blank">
            <img src={url} className="postAttachment" />
          </a>
        ))
      }
    </div>
);

export default PostAttachments;