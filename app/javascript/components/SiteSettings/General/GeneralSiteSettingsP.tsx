import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import I18n from 'i18n-js';

import Box from '../../common/Box';
import SiteSettingsInfoBox from '../../common/SiteSettingsInfoBox';
import Button from '../../common/Button';
import HttpStatus from '../../../constants/http_status';
import {
  TENANT_SETTING_BRAND_DISPLAY_NAME_AND_LOGO,
  TENANT_SETTING_BRAND_DISPLAY_NAME_ONLY,
  TENANT_SETTING_BRAND_DISPLAY_LOGO_ONLY,
  TENANT_SETTING_BRAND_DISPLAY_NONE,
  TENANT_SETTING_COLLAPSE_BOARDS_IN_HEADER_NO_COLLAPSE,
  TENANT_SETTING_COLLAPSE_BOARDS_IN_HEADER_ALWAYS_COLLAPSE,
  TENANT_SETTING_LOGO_LINKS_TO_ROOT_PAGE,
  TENANT_SETTING_LOGO_LINKS_TO_CUSTOM_URL,
  TENANT_SETTING_LOGO_LINKS_TO_NOTHING,
} from '../../../interfaces/ITenantSetting';
import { DangerText, SmallMutedText } from '../../common/CustomTexts';
import { getLabel, getValidationMessage } from '../../../helpers/formUtils';
import IBoardJSON from '../../../interfaces/json/IBoard';
import ActionLink from '../../common/ActionLink';
import { CancelIcon, DeleteIcon, EditIcon, LearnMoreIcon } from '../../common/Icons';
import Dropzone from '../../common/Dropzone';

export interface ISiteSettingsGeneralForm {
  siteName: string;
  siteLogo?: File;
  shouldDeleteSiteLogo: boolean;
  oldSiteLogo: string;
  siteFavicon?: File;
  shouldDeleteSiteFavicon: boolean;
  brandDisplaySetting: string;
  locale: string;
  useBrowserLocale: boolean;
  rootBoardId?: string;
  customDomain?: string;
  isPrivate: boolean;
  allowAnonymousFeedback: boolean;
  feedbackApprovalPolicy: string;
  allowAttachmentUpload: boolean;
  logoLinksTo: string;
  logoCustomUrl?: string;
  showRoadmapInHeader: boolean;
  collapseBoardsInHeader: string;
  showVoteCount: boolean;
  showVoteButtonInBoard: boolean;
  hideUnusedStatusesInFilterByStatus: boolean;
  showPoweredBy: boolean;
}

interface Props {
  originForm: ISiteSettingsGeneralForm;
  siteLogoUrl?: string;
  siteFaviconUrl?: string;
  boards: IBoardJSON[];
  isMultiTenant: boolean;
  authenticityToken: string;

  areUpdating: boolean;
  error: string;

  updateTenant(
    siteName: string,
    siteLogo: File,
    shouldDeleteSiteLogo: boolean,
    oldSiteLogo: string,
    siteFavicon: File,
    shouldDeleteSiteFavicon: boolean,
    brandDisplaySetting: string,
    locale: string,
    useBrowserLocale: boolean,
    rootBoardId: number,
    customDomain: string,
    isPrivate: boolean,
    allowAnonymousFeedback: boolean,
    feedbackApprovalPolicy: string,
    allowAttachmentUpload: boolean,
    logoLinksTo: string,
    logoCustomUrl: string,
    showRoadmapInHeader: boolean,
    collapseBoardsInHeader: string,
    showVoteCount: boolean,
    showVoteButtonInBoard: boolean,
    hideUnusedStatusesInFilterByStatus: boolean,
    showPoweredBy: boolean,
    authenticityToken: string
  ): Promise<any>;
}

const GeneralSiteSettingsP = ({
  originForm,
  siteLogoUrl,
  siteFaviconUrl,
  boards,
  isMultiTenant,
  authenticityToken,

  areUpdating,
  error,
  updateTenant,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { isDirty, isSubmitSuccessful, errors },
    watch,
    control,
  } = useForm<ISiteSettingsGeneralForm>({
    defaultValues: {
      siteName: originForm.siteName,
      siteLogo: null,
      shouldDeleteSiteLogo: false,
      oldSiteLogo: originForm.oldSiteLogo,
      siteFavicon: null,
      shouldDeleteSiteFavicon: false,
      brandDisplaySetting: originForm.brandDisplaySetting,
      locale: originForm.locale,
      useBrowserLocale: originForm.useBrowserLocale,
      rootBoardId: originForm.rootBoardId,
      customDomain: originForm.customDomain,
      isPrivate: originForm.isPrivate,
      allowAnonymousFeedback: originForm.allowAnonymousFeedback,
      feedbackApprovalPolicy: originForm.feedbackApprovalPolicy,
      allowAttachmentUpload: originForm.allowAttachmentUpload,
      logoLinksTo: originForm.logoLinksTo,
      logoCustomUrl: originForm.logoCustomUrl,
      showRoadmapInHeader: originForm.showRoadmapInHeader,
      collapseBoardsInHeader: originForm.collapseBoardsInHeader,
      showVoteCount: originForm.showVoteCount,
      showVoteButtonInBoard: originForm.showVoteButtonInBoard,
      hideUnusedStatusesInFilterByStatus: originForm.hideUnusedStatusesInFilterByStatus,
      showPoweredBy: originForm.showPoweredBy,
    },
  });
  
  const onSubmit: SubmitHandler<ISiteSettingsGeneralForm> = data => {
    updateTenant(
      data.siteName,
      data.siteLogo ? data.siteLogo : null,
      data.shouldDeleteSiteLogo,
      data.oldSiteLogo,
      data.siteFavicon ? data.siteFavicon : null,
      data.shouldDeleteSiteFavicon,
      data.brandDisplaySetting,
      data.locale,
      data.useBrowserLocale,
      Number(data.rootBoardId),
      data.customDomain,
      data.isPrivate,
      data.allowAnonymousFeedback,
      data.feedbackApprovalPolicy,
      data.allowAttachmentUpload,
      data.logoLinksTo,
      data.logoCustomUrl,
      data.showRoadmapInHeader,
      data.collapseBoardsInHeader,
      data.showVoteCount,
      data.showVoteButtonInBoard,
      data.hideUnusedStatusesInFilterByStatus,
      data.showPoweredBy,
      authenticityToken
    ).then(res => {
      if (res?.status !== HttpStatus.OK) return;

      const urlWithoutHash = window.location.href.split('#')[0];
      window.history.pushState({}, document.title, urlWithoutHash);
      window.location.reload();
    });
  };

  React.useEffect(() => {
    if (window.location.hash) {
      const anchor = window.location.hash.substring(1);
      const anchorElement = document.getElementById(anchor);

      if (anchorElement) {
        anchorElement.classList.add('highlighted');

        setTimeout( () => {
          anchorElement.scrollIntoView({
            behavior: 'smooth'
          })
        }, 50);
      }
    }
  }, []);

  const customDomain = watch('customDomain');
  const shouldDeleteSiteLogo = watch('shouldDeleteSiteLogo');
  const shouldDeleteSiteFavicon = watch('shouldDeleteSiteFavicon');

  const [showSiteLogoDropzone, setShowSiteLogoDropzone] = React.useState([null, undefined, ''].includes(siteLogoUrl));
  const [showSiteFaviconDropzone, setShowSiteFaviconDropzone] = React.useState([null, undefined, ''].includes(siteFaviconUrl));

  return (
    <>
      <Box customClass="generalSiteSettingsContainer">
        <h2>{ I18n.t('site_settings.general.title') }</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="formRow">
            <div className="formGroup col-6">
              <label htmlFor="siteName">{ getLabel('tenant', 'site_name') }</label>
              <input
                {...register('siteName', { required: true })}
                id="siteName"
                className="formControl"
              />
              <DangerText>{errors.siteName && getValidationMessage(errors.siteName.type, 'tenant', 'site_name')}</DangerText>
            </div>

            <div className="formGroup col-6">
              <label htmlFor="brandSetting">{ getLabel('tenant_setting', 'brand_display') }</label>
              <select
                {...register('brandDisplaySetting')}
                id="brandSetting"
                className="selectPicker"
              >
                <option value={TENANT_SETTING_BRAND_DISPLAY_NAME_AND_LOGO}>
                  { I18n.t('site_settings.general.brand_setting_both') }
                </option>
                <option value={TENANT_SETTING_BRAND_DISPLAY_NAME_ONLY}>
                  { I18n.t('site_settings.general.brand_setting_name') }
                </option>
                <option value={TENANT_SETTING_BRAND_DISPLAY_LOGO_ONLY}>
                  { I18n.t('site_settings.general.brand_setting_logo') }
                </option>
                <option value={TENANT_SETTING_BRAND_DISPLAY_NONE}>
                  { I18n.t('site_settings.general.brand_setting_none') }
                </option>
              </select>
            </div>

            {/* Hidden oldSiteLogo field for backwards compatibility */}
            <div className="formGroup d-none">
              <label htmlFor="oldSiteLogo">{ getLabel('tenant', 'site_logo') }</label>
              <input
                {...register('oldSiteLogo')}
                placeholder='https://example.com/logo.png'
                id="oldSiteLogo"
                className="formControl"
              />
            </div>
          </div>

          <div className="formRow">
            <div className="formGroup col-6">
              <label htmlFor="siteLogo">{ getLabel('tenant', 'site_logo') }</label>

              {
                siteLogoUrl &&
                  <div className={`siteLogoPreview${shouldDeleteSiteLogo ? ' siteLogoPreviewShouldDelete' : ''}`}>
                    <img src={siteLogoUrl} alt={`${originForm.siteName} logo`} className="siteLogoPreviewImg" />
                  </div>
              }

              <div className="siteLogoActions">
              {
                (siteLogoUrl && !shouldDeleteSiteLogo) &&
                  (showSiteLogoDropzone ?
                    <ActionLink
                      onClick={() => setShowSiteLogoDropzone(false)}
                      icon={<CancelIcon />}
                    >
                      {I18n.t('common.buttons.cancel')}
                    </ActionLink>
                  :
                    <ActionLink
                      onClick={() => setShowSiteLogoDropzone(true)}
                      icon={<EditIcon />}
                    >
                      {I18n.t('common.buttons.edit')}
                    </ActionLink>)
              }

              {
                (siteLogoUrl && !showSiteLogoDropzone) &&
                  (shouldDeleteSiteLogo ?
                    <Controller
                      name="shouldDeleteSiteLogo"
                      control={control}
                      render={({ field }) => (
                        <ActionLink
                          onClick={() => field.onChange(false)}
                          icon={<CancelIcon />}
                        >
                          {I18n.t('common.buttons.cancel')}
                        </ActionLink>
                      )}
                    />
                  :
                    <Controller
                      name="shouldDeleteSiteLogo"
                      control={control}
                      render={({ field }) => (
                        <ActionLink
                          onClick={() => field.onChange(true)}
                          icon={<DeleteIcon />}
                        >
                          {I18n.t('common.buttons.delete')}
                        </ActionLink>
                      )}
                    />
                  )
              }
              </div>
              
              {
                showSiteLogoDropzone &&
                  <Controller
                    name="siteLogo"
                    control={control}
                    render={({ field }) => (
                      <Dropzone
                        files={field.value ? [field.value] : []}
                        setFiles={files => files.length > 0 ? field.onChange(files[0]) : field.onChange(null)}
                        maxSizeKB={256}
                        maxFiles={1}
                      />
                    )}
                  />
              }
            </div>

            <div className="formGroup col-6">
              <label htmlFor="siteFavicon">{ getLabel('tenant', 'site_favicon') }</label>
              
              {
                siteFaviconUrl &&
                  <div className={`siteFaviconPreview${shouldDeleteSiteFavicon ? ' siteFaviconPreviewShouldDelete' : ''}`}>
                    <img src={siteFaviconUrl} alt={`${originForm.siteName} favicon`} className="siteFaviconPreviewImg" />
                  </div>
              }

              <div className="siteFaviconActions">
              {
                (siteFaviconUrl && !shouldDeleteSiteFavicon) &&
                  (showSiteFaviconDropzone ?
                    <ActionLink
                      onClick={() => setShowSiteFaviconDropzone(false)}
                      icon={<CancelIcon />}
                    >
                      {I18n.t('common.buttons.cancel')}
                    </ActionLink>
                  :
                    <ActionLink
                      onClick={() => setShowSiteFaviconDropzone(true)}
                      icon={<EditIcon />}
                    >
                      {I18n.t('common.buttons.edit')}
                    </ActionLink>)
              }

              {
                (siteFaviconUrl && !showSiteFaviconDropzone) &&
                  (shouldDeleteSiteFavicon ?
                    <Controller
                      name="shouldDeleteSiteFavicon"
                      control={control}
                      render={({ field }) => (
                        <ActionLink
                          onClick={() => field.onChange(false)}
                          icon={<CancelIcon />}
                        >
                          {I18n.t('common.buttons.cancel')}
                        </ActionLink>
                      )}
                    />
                  :
                    <Controller
                      name="shouldDeleteSiteFavicon"
                      control={control}
                      render={({ field }) => (
                        <ActionLink
                          onClick={() => field.onChange(true)}
                          icon={<DeleteIcon />}
                        >
                          {I18n.t('common.buttons.delete')}
                        </ActionLink>
                      )}
                    />
                  )
              }

              </div>

              {
                showSiteFaviconDropzone &&
                  <Controller
                    name="siteFavicon"
                    control={control}
                    render={({ field }) => (
                      <Dropzone
                        files={field.value ? [field.value] : []}
                        setFiles={files => files.length > 0 ? field.onChange(files[0]) : field.onChange(null)}
                        maxSizeKB={64}
                        maxFiles={1}
                        accept={['image/x-icon', 'image/icon', 'image/png', 'image/jpeg', 'image/jpg']}
                      />
                    )}
                  />
              }
            </div>
          </div>

          <div className="formGroup">
            <label htmlFor="locale">{ getLabel('tenant', 'locale') }</label>
            <select
              {...register('locale')}
              id="locale"
              className="selectPicker"
            >
              <option value="en">🇬🇧 English</option>
              <option value="it">🇮🇹 Italiano</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="es">🇪🇸 Español</option>
              <option value="pt">🇵🇹 Português</option>
              <option value="zh-CN">🇨🇳 中文</option>
              <option value="ru">🇷🇺 Русский</option>
              <option value="vi">🇻🇳 Tiếng Việt</option>
            </select>
          </div>

          <div className="formGroup">
            <div className="checkboxSwitch">
              <input {...register('useBrowserLocale')} type="checkbox" id="use_browser_locale_checkbox" />
              <label htmlFor="use_browser_locale_checkbox">{ getLabel('tenant_setting', 'use_browser_locale') }</label>
              <SmallMutedText>
                { I18n.t('site_settings.general.use_browser_locale_help') }
              </SmallMutedText>
            </div>
          </div>

          <div className="formGroup">
            <label htmlFor="rootBoardId">{ getLabel('tenant_setting', 'root_board_id') }</label>
            <select
              {...register('rootBoardId')}
              id="rootBoardId"
              className="selectPicker"
            >
              <option value="0">
                {I18n.t('roadmap.title')}
              </option>
              <optgroup label={getLabel('board')}>
                {boards.map((board, i) => (
                  <option value={board.id} key={i}>{board.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          { isMultiTenant &&
            <div className="formGroup">
              <label htmlFor="customDomain">{ getLabel('tenant', 'custom_domain') }</label>
              <input
                {...register('customDomain')}
                id="customDomain"
                className="formControl"
              />
              {
                originForm.customDomain !== customDomain && customDomain !== '' &&
                <div style={{marginTop: 16}}>
                  <SmallMutedText>
                    { I18n.t('site_settings.general.custom_domain_help', { domain: customDomain }) }
                  </SmallMutedText>
                </div>
              }
              <div style={{marginTop: 8}}>
                <ActionLink
                  onClick={() => window.open('https://docs.astuto.io/custom-domain', '_blank')}
                  icon={<LearnMoreIcon />}
                >
                  {I18n.t('site_settings.general.custom_domain_learn_more')}
                </ActionLink>
              </div>
            </div>
          }

          <div id="privacy" className="settingsGroup">
            <h4>{ I18n.t('site_settings.general.subtitle_privacy') }</h4>

            <div className="formGroup">
              <div className="checkboxSwitch">
                <input {...register('isPrivate')} type="checkbox" id="is_private_checkbox" />
                <label htmlFor="is_private_checkbox">{ getLabel('tenant_setting', 'is_private') }</label>
                <SmallMutedText>
                  { I18n.t('site_settings.general.is_private_help') }
                </SmallMutedText>
              </div>
            </div>
          </div>

          <div id="moderation" className="settingsGroup">
            <h4>{ I18n.t('site_settings.general.subtitle_moderation') }</h4>

            <div className="formGroup">
              <div className="checkboxSwitch">
                <input {...register('allowAnonymousFeedback')} type="checkbox" id="allow_anonymous_feedback" />
                <label htmlFor="allow_anonymous_feedback">{ getLabel('tenant_setting', 'allow_anonymous_feedback') }</label>
                <SmallMutedText>
                  { I18n.t('site_settings.general.allow_anonymous_feedback_help') }
                </SmallMutedText>
              </div>
            </div>

            <div className="formGroup">
              <label htmlFor="feedbackApprovalPolicy">{ getLabel('tenant_setting', 'feedback_approval_policy') }</label>
              <select
                {...register('feedbackApprovalPolicy')}
                id="feedbackApprovalPolicy"
                className="selectPicker"
              >
                <option value="anonymous_require_approval">
                  { I18n.t('site_settings.general.feedback_approval_policy_anonymous_require_approval') }
                </option>
                <option value="never_require_approval">
                  { I18n.t('site_settings.general.feedback_approval_policy_never_require_approval') }
                </option>
                <option value="always_require_approval">
                  { I18n.t('site_settings.general.feedback_approval_policy_always_require_approval') }
                </option>
              </select>
              <SmallMutedText>
                { I18n.t('site_settings.general.feedback_approval_policy_help') }
              </SmallMutedText>
            </div>

            <div className="formGroup">
              <div className="checkboxSwitch">
                <input {...register('allowAttachmentUpload')} type="checkbox" id="allow_attachment_upload" />
                <label htmlFor="allow_attachment_upload">{ getLabel('tenant_setting', 'allow_attachment_upload') }</label>
                <SmallMutedText>
                  { I18n.t('site_settings.general.allow_attachment_upload_help') }
                </SmallMutedText>
              </div>
            </div>
          </div>

          <div id="header" className="settingsGroup">
            <h4>{ I18n.t('site_settings.general.subtitle_header') }</h4>

            <div className="formGroup">
              <label htmlFor="logoLinksTo">{ getLabel('tenant_setting', 'logo_links_to') }</label>
              <select
                {...register('logoLinksTo')}
                id="logoLinksTo"
                className="selectPicker"
              >
                <option value={TENANT_SETTING_LOGO_LINKS_TO_ROOT_PAGE}>
                  { I18n.t('site_settings.general.logo_links_to_root_page') } ({watch('rootBoardId') === '0' ? I18n.t('roadmap.title') : boards.find(board => board.id === Number(watch('rootBoardId')))?.name})
                </option>
                <option value={TENANT_SETTING_LOGO_LINKS_TO_CUSTOM_URL}>
                  { I18n.t('site_settings.general.logo_links_to_custom_url') }
                </option>
                <option value={TENANT_SETTING_LOGO_LINKS_TO_NOTHING}>
                  { I18n.t('site_settings.general.logo_links_to_nothing') }
                </option>
              </select>
            </div>

            { watch('logoLinksTo') === TENANT_SETTING_LOGO_LINKS_TO_CUSTOM_URL &&
              <div className="formGroup">
                <label htmlFor="logoCustomUrl">{ getLabel('tenant_setting', 'logo_custom_url') }</label>
                <input
                  {...register('logoCustomUrl')}
                  id="logoCustomUrl"
                  className="formControl"
                />
              </div>
            }
            
            <div className="formGroup">
              <div className="checkboxSwitch">
                <input {...register('showRoadmapInHeader')} type="checkbox" id="show_roadmap_in_header" />
                <label htmlFor="show_roadmap_in_header">{ getLabel('tenant_setting', 'show_roadmap_in_header') }</label>
              </div>
            </div>
            
            <div className="formGroup">
              <label htmlFor="collapseBoardsInHeader">{ getLabel('tenant_setting', 'collapse_boards_in_header') }</label>
              <select
                {...register('collapseBoardsInHeader')}
                id="collapseBoardsInHeader"
                className="selectPicker"
              >
                <option value={TENANT_SETTING_COLLAPSE_BOARDS_IN_HEADER_NO_COLLAPSE}>
                  { I18n.t('site_settings.general.collapse_boards_in_header_no_collapse') }
                </option>
                <option value={TENANT_SETTING_COLLAPSE_BOARDS_IN_HEADER_ALWAYS_COLLAPSE}>
                  { I18n.t('site_settings.general.collapse_boards_in_header_always_collapse') }
                </option>
              </select>
            </div>
          </div>

          <div id="visibility" className="settingsGroup">
            <br />
            <h4>{ I18n.t('site_settings.general.subtitle_visibility') }</h4>

            <div className="formGroup">
              <div className="checkboxSwitch">
                <input {...register('showVoteCount')} type="checkbox" id="show_vote_count_checkbox" />
                <label htmlFor="show_vote_count_checkbox">{ getLabel('tenant_setting', 'show_vote_count') }</label>
                <SmallMutedText>
                  { I18n.t('site_settings.general.show_vote_count_help') }
                </SmallMutedText>
              </div>
            </div>

            <div className="formGroup">
              <div className="checkboxSwitch">
                <input {...register('showVoteButtonInBoard')} type="checkbox" id="show_vote_button_in_board_checkbox" />
                <label htmlFor="show_vote_button_in_board_checkbox">{ getLabel('tenant_setting', 'show_vote_button_in_board') }</label>
                <SmallMutedText>
                  { I18n.t('site_settings.general.show_vote_button_in_board_help') }
                </SmallMutedText>
              </div>
            </div>

            <div className="formGroup">
              <div className="checkboxSwitch">
                <input {...register('hideUnusedStatusesInFilterByStatus')} type="checkbox" id="hide_unused_statuses_in_filter_by_status_checkbox" />
                <label htmlFor="hide_unused_statuses_in_filter_by_status_checkbox">{ getLabel('tenant_setting', 'hide_unused_statuses_in_filter_by_status') }</label>
                <SmallMutedText>
                  { I18n.t('site_settings.general.hide_unused_statuses_in_filter_by_status_help') }
                </SmallMutedText>
              </div>
            </div>

            <div className="formGroup">
              <div className="checkboxSwitch">
                <input {...register('showPoweredBy')} type="checkbox" id="show_powered_by_checkbox" />
                <label htmlFor="show_powered_by_checkbox">{ getLabel('tenant_setting', 'show_powered_by') }</label>
              </div>
            </div>
          </div>

          <br />

          <Button onClick={() => null} disabled={!isDirty} className="generalSiteSettingsSubmit">
            {I18n.t('common.buttons.update')}
          </Button>
        </form>
      </Box>

      <SiteSettingsInfoBox
        areUpdating={areUpdating}
        error={error}
        areDirty={isDirty && !isSubmitSuccessful}
        isSticky={isDirty && !isSubmitSuccessful}
        saveButton={
          <Button onClick={handleSubmit(onSubmit)} disabled={!isDirty}>
            {I18n.t('common.buttons.update')}
          </Button>
        }
      />
    </>
  );
}

export default GeneralSiteSettingsP;