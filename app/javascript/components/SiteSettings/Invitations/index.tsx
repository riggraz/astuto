import * as React from 'react';
import { useForm } from 'react-hook-form';
import I18n from 'i18n-js';

import Box from '../../common/Box';
import Button from '../../common/Button';
import { DangerText, SmallMutedText, SuccessText } from '../../common/CustomTexts';
import buildRequestHeaders from '../../../helpers/buildRequestHeaders';
import HttpStatus from '../../../constants/http_status';
import { isValidEmail } from '../../../helpers/regex';
import IInvitation from '../../../interfaces/IInvitation';
import friendlyDate, { fromRailsStringToJavascriptDate, nMonthsAgo } from '../../../helpers/datetime';
import ActionLink from '../../common/ActionLink';
import { TestIcon } from '../../common/Icons';
import Avatar from '../../common/Avatar';

interface Props {
  siteName: string;
  invitations: Array<IInvitation>;
  currentUserEmail: string;
  authenticityToken: string;
}

interface IFormData {
  to: string;
  subject: string;
  body: string;
}

const MAX_INVITATIONS = 20;
const LINK_PLACEHOLDER = '%link%';

const Invitations = ({ siteName, invitations, currentUserEmail, authenticityToken }: Props) => {
  const {
    register,
    handleSubmit,
    formState: {},
    watch,
  } = useForm<IFormData>({
    defaultValues: {
      to: '',
      subject: I18n.t('site_settings.invitations.subject_default', { name: siteName }),
      body: I18n.t('site_settings.invitations.body_default', { name: siteName }),
    },
  });

  const to = watch('to');
  const emailList = to.split(',');

  const subject = watch('subject')
  const body = watch('body')

  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'pending' | 'accepted'>('pending');

  const pendingInvitations = invitations.filter((invitation) => !invitation.accepted_at);
  const acceptedInvitations = invitations.filter((invitation) => invitation.accepted_at);

  let invitationsToDisplay = invitations;
  if (filter === 'pending') invitationsToDisplay = pendingInvitations;
  if (filter === 'accepted') invitationsToDisplay = acceptedInvitations;

  return (
    <>
    <Box customClass="newInvitationsBox">
      <h2>{ I18n.t('site_settings.invitations.new_invitations_title') }</h2>

      <form
        onSubmit={handleSubmit(async (formData) => {
          const emailToList = formData.to.split(',').map((email) => email.trim());
          const invalidEmails = emailToList.filter((email) => !isValidEmail(email));

          if (emailList.length > MAX_INVITATIONS) {
            alert(I18n.t('site_settings.invitations.too_many_emails', { count: MAX_INVITATIONS }));
            return;
          }

          if (invalidEmails.length > 0) {
            alert(I18n.t('site_settings.invitations.invalid_emails', { emails: invalidEmails.join(', ').replace(/, $/, '') }));
            return;
          }

          if (!formData.body.includes(LINK_PLACEHOLDER)) {
            alert(I18n.t('site_settings.invitations.invitation_link_not_found'));
            return;
          }

          const res = await fetch(`/invitations`, {
            method: 'POST',
            headers: buildRequestHeaders(authenticityToken),
            body: JSON.stringify({
              invitations: {
                to: formData.to,
                subject: formData.subject,
                body: formData.body,
              }
            }),
          });

          if (res.status === HttpStatus.OK) {
            setSuccessMessage(I18n.t('site_settings.invitations.submit_success'));
            setErrorMessage(null);
            setTimeout(() => window.location.reload(), 2000);
          } else {
            setErrorMessage(I18n.t('site_settings.invitations.submit_failure'));
          }
        }
      )}>
        <div className="formGroup">
          <label htmlFor="to">{ I18n.t('site_settings.invitations.to') }</label>
          <input
            {...register('to', { required: true })}
            placeholder="alice@example.com,bob@test.org"
            type="text"
            className="formControl"
            id="to"
          />
          <SmallMutedText>
            { I18n.t('site_settings.invitations.to_help') }
          </SmallMutedText>
        </div>

        <div className="formGroup">
          <label htmlFor="subject">{ I18n.t('site_settings.invitations.subject') }</label>
          <input
            {...register('subject', { required: true })}
            type="text"
            className="formControl"
            id="subject"
          />
        </div>

        <div className="formGroup">
          <label htmlFor="body">{ I18n.t('site_settings.invitations.body') }</label>
          <textarea
            {...register('body', { required: true })}
            className="formControl"
            id="body"
          />
        </div>

        <div className="submitFormDiv">
          <Button onClick={() => {}} disabled={to === ''}>
            { I18n.t('site_settings.invitations.send', { count: emailList.length }) }
          </Button>
          
          <div className="testInvitation">
            <ActionLink
              icon={<TestIcon />}
              onClick={async () => {
                if (!body.includes(LINK_PLACEHOLDER)) {
                  alert(I18n.t('site_settings.invitations.invitation_link_not_found'));
                  return;
                }

                const res = await fetch(`/invitations/test`, {
                  method: 'POST',
                  headers: buildRequestHeaders(authenticityToken),
                  body: JSON.stringify({
                    invitations: {
                      to: currentUserEmail,
                      subject: subject,
                      body: body,
                    }
                  }),
                });

                if (res.status === HttpStatus.OK) {
                  alert(I18n.t('site_settings.invitations.test_invitation_success', { email: currentUserEmail }));
                } else {
                  alert(I18n.t('site_settings.invitations.submit_failure'));
                }
              }}
            >
              { I18n.t('site_settings.invitations.test_invitation_button') }
            </ActionLink>

            <SmallMutedText>{ I18n.t('site_settings.invitations.test_invitation_help', { email: currentUserEmail }) }</SmallMutedText>
          </div>
        </div>
      </form>
      <br />
      { successMessage ? <SuccessText>{ successMessage }</SuccessText> : null }
      { errorMessage ? <DangerText>{ errorMessage }</DangerText> : null }
    </Box>


    <Box customClass="pastInvitationsBox">
      <h2>{ I18n.t('site_settings.invitations.past_invitations_title') }</h2>

      <ul className="filterInvitationsNav">
        <li className="nav-item">
          <a onClick={() => setFilter('all')} className={`nav-link${filter === 'all' ? ' active' : ''}`}>
            {I18n.t('site_settings.invitations.all')}
            &nbsp;
            ({invitations && invitations.length})
          </a>
        </li>
        <li className="nav-item">
          <a onClick={() => setFilter('pending')} className={`nav-link${filter === 'pending' ? ' active' : ''}`}>
            {I18n.t('site_settings.invitations.pending')}
            &nbsp;
            ({pendingInvitations && pendingInvitations.length})
          </a>
        </li>
        <li className="nav-item">
          <a onClick={() => setFilter('accepted')} className={`nav-link${filter === 'accepted' ? ' active' : ''}`}>
            {I18n.t('site_settings.invitations.accepted')}
            &nbsp;
            ({acceptedInvitations && acceptedInvitations.length})
          </a>
        </li>
      </ul>

      <ul className="invitationsList">
        {
          invitationsToDisplay.map((invitation, i) => (
            <li key={i} className="invitationListItem">
              <div className="invitationUserInfo">
                <Avatar email={invitation.email} size={42} customClass="userAvatar" />

                <span className="invitationEmail">{ invitation.email }</span>
              </div>

              <div className="invitationInfo">
                {
                  invitation.accepted_at ?
                    <span className="invitationAcceptedAt" title={invitation.accepted_at}>
                      { I18n.t('site_settings.invitations.accepted_at', { when: friendlyDate(invitation.accepted_at) }) }
                    </span>
                  :
                    fromRailsStringToJavascriptDate(invitation.updated_at) > nMonthsAgo(3) ?
                      <span className="invitationSentAt" title={invitation.updated_at}>
                        { I18n.t('site_settings.invitations.sent_at', { when: friendlyDate(invitation.updated_at) }) }
                      </span>
                    :
                      <span className="invitationExpired">
                        { I18n.t('site_settings.invitations.expired') }
                      </span>
                }
              </div>
            </li>
          ))
        }
      </ul>
    </Box>
    </>
  );
};

export default Invitations;
