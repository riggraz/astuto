import React from 'react';

interface Props {
  attachmentUrls?: string[];
}

const CommentAttachments = ({ attachmentUrls = [] }: Props) => (
  attachmentUrls.length > 0 &&
    <div className="commentAttachments">
      {
        attachmentUrls.map((url, index) => (
          <a key={index} href={url} target="_blank">
            <img src={url} className="commentAttachment" />
          </a>
        ))
      }
    </div>
);

export default CommentAttachments;