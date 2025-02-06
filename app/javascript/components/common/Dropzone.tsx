import React, {useEffect} from 'react';
import {useDropzone} from 'react-dropzone';
import I18n from 'i18n-js';
import { SmallMutedText } from './CustomTexts';
import ActionLink from './ActionLink';
import { DeleteIcon } from './Icons';

interface Props {
  files: any[];
  setFiles: React.Dispatch<React.SetStateAction<any[]>>;
  maxSizeKB?: number;
  maxFiles?: number;
  accept?: string[];
  customStyle?: { [key: string]: string };
}

const Dropzone = ({
  files,
  setFiles,
  maxSizeKB = 256,
  maxFiles = 1,
  accept = ['image/png', 'image/jpeg', 'image/jpg', 'image/x-icon', 'image/icon', 'image/svg+xml', 'image/svg', 'image/webp'],
  customStyle = {}
}: Props) => {
  const acceptDict = accept.reduce((acc, type) => {
    acc[type] = [];
    return acc;
  }, {});

  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: acceptDict,
    maxSize: maxSizeKB * 1024,
    maxFiles: maxFiles,
    disabled: files.length >= maxFiles,
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        alert(I18n.t('common.errors.invalid_file', { errors: fileRejections.map(rejection => rejection.errors[0].message).join(', ') }));
      }

      // If number of files already uploaded is lower than maxFiles, add the new files
      const filesAfterDrop = (files.length + acceptedFiles.length <= maxFiles) ? files.concat(acceptedFiles) : acceptedFiles;


      setFiles(filesAfterDrop.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    },
  });
  
  const thumbnails = files.map(file => (
    <div className="thumbnailContainer" key={file.name}>
      <div className="thumbnail">
        <div className="thumbnailInner">
          <img
            src={file.preview}
            className="thumbnailImage"
            // Revoke data uri after image is loaded
            onLoad={() => { URL.revokeObjectURL(file.preview) }}
          />
        </div>
      </div>
      
      <ActionLink
        onClick={() => setFiles(files.filter(f => f !== file))}
        icon={<DeleteIcon />}
        customClass="removeThumbnail"
      >
        {I18n.t('common.buttons.delete')}
      </ActionLink>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section>
      <div {...getRootProps({className: 'dropzone' + (isDragAccept ? ' dropzone-accept' : isDragReject ? ' dropzone-reject' : '') + (files.length >= maxFiles ? ' dropzone-disabled' : '')})} style={customStyle}>
        <input {...getInputProps()} />
        <SmallMutedText>{I18n.t('common.drag_and_drop', { maxCount: maxFiles, maxSize: maxSizeKB })}</SmallMutedText>
      </div>
      <aside className="thumbnailsContainer">
        {thumbnails}
      </aside>
    </section>
  );
}

export default Dropzone;