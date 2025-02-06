import * as React from 'react';
import I18n from 'i18n-js';

import ActionLink from '../common/ActionLink';
import { DeleteIcon } from '../common/Icons';
import buildRequestHeaders from '../../helpers/buildRequestHeaders';
import Spinner from '../common/Spinner';

interface Props {
  deleteAvatarEndpoint: string;
  userProfileUrl: string;
  authenticityToken: string;
}

const DeleteAvatarButton = ({ deleteAvatarEndpoint, userProfileUrl, authenticityToken }: Props) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState('');

  return (
    <>
    <ActionLink
      icon={<DeleteIcon />}
      onClick={async () => {
        setIsDeleting(true);

        try {
          const response = await fetch(deleteAvatarEndpoint, {
            method: 'DELETE',
            headers: buildRequestHeaders(authenticityToken),
          });

          if (response.ok) {
            window.location.href = userProfileUrl;
          } else {
            throw new Error();
          }
        } catch {
          setError(I18n.t('common.errors.unknown'));
        }

        setIsDeleting(false);
        if (error) {
          alert(error);
        }
      }
    }>
      { I18n.t('common.buttons.delete') }
    </ActionLink>

    { isDeleting && <Spinner /> }
    </>
  );
}

export default DeleteAvatarButton;