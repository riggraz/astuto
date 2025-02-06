import * as React from 'react';
import I18n from 'i18n-js';

import Button from '../../common/Button';
import IUser, { UserRoles, USER_ROLE_ADMIN, USER_ROLE_MODERATOR, USER_ROLE_USER } from '../../../interfaces/IUser';
import { getLabel } from '../../../helpers/formUtils';
import Avatar from '../../common/Avatar';

interface Props {
  user: IUser;
  updateUserRole(newRole: UserRoles): void;
}

interface State {
  role: UserRoles;
}

class UserForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { role: this.props.user.role };

    this._handleUpdateUserRole = this._handleUpdateUserRole.bind(this);
  }

  _handleUpdateUserRole(selectedRole: UserRoles, currentRole: UserRoles) {
    const { user, updateUserRole } = this.props;
    let confirmation = true;

    if (selectedRole !== currentRole) {
      if (selectedRole === 'moderator')
        confirmation = confirm(I18n.t('moderation.users.role_to_moderator_confirmation', { name: user.fullName }));
      else if (selectedRole === 'admin')
        confirmation = confirm(I18n.t('moderation.users.role_to_admin_confirmation', { name: user.fullName }));
    }

    if (confirmation) updateUserRole(selectedRole);
  }

  render() {
    const { user } = this.props;
    const selectedRole = this.state.role;

    return (
      <div className="userForm">
        <Avatar avatarUrl={user.avatarUrl} email={user.email} size={42} customClass="userAvatar" />

        <div className="userFullNameRoleForm">
          <span className="userFullName">{ user.fullName }</span>

          <select
            value={selectedRole || 'Loading...'}
            onChange={
              (e: React.FormEvent) => {
                this.setState({role: (e.target as HTMLSelectElement).value as UserRoles});
            }}
            id="selectPickerUserRole"
            className="selectPicker"
          >
            <optgroup label={getLabel('user', 'role')}>
              <option value={USER_ROLE_USER}>
                { I18n.t(`moderation.users.role_${USER_ROLE_USER}`) }
              </option>
              <option value={USER_ROLE_MODERATOR}>
                { I18n.t(`moderation.users.role_${USER_ROLE_MODERATOR}`) }
              </option>
              <option value={USER_ROLE_ADMIN}>
                { I18n.t(`moderation.users.role_${USER_ROLE_ADMIN}`) }
              </option>
            </optgroup>
          </select>
        </div>

        <Button onClick={() => this._handleUpdateUserRole(selectedRole, user.role)} className="updateUserButton">
          { I18n.t('common.buttons.update') }
        </Button>
      </div>
    );
  }
}

export default UserForm;