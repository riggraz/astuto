import * as React from 'react';
import I18n from 'i18n-js';
import { Tooltip } from 'react-tooltip'

import { BsReply } from 'react-icons/bs';
import { FiEdit, FiDelete, FiSettings } from 'react-icons/fi';
import { ImCancelCircle } from 'react-icons/im';
import { TbLock, TbLockOpen } from 'react-icons/tb';
import { GrTest, GrClearOption, GrOverview } from 'react-icons/gr';
import { BiLike, BiSolidLike } from "react-icons/bi";
import {
  MdContentCopy,
  MdDone,
  MdOutlineArrowBack,
  MdOutlineLibraryBooks,
  MdVerified,
  MdCheck,
  MdClear,
  MdAdd,
  MdAttachFile,
} from 'react-icons/md';
import { FaUserNinja, FaMarkdown, FaRegImage } from "react-icons/fa";
import { FaDroplet } from "react-icons/fa6";

export const EditIcon = () => <FiEdit />;

export const DeleteIcon = () => <FiDelete />;

export const CancelIcon = () => <ImCancelCircle />;

export const BlockIcon = () => <TbLock />;

export const UnblockIcon = () => <TbLockOpen />;

export const CopyIcon = () => <MdContentCopy />;

export const TestIcon = () => <GrTest />;

export const DoneIcon = () => <MdDone />;

export const BackIcon = () => <MdOutlineArrowBack />;

export const ReplyIcon = () => <BsReply />;

export const LearnMoreIcon = () => <MdOutlineLibraryBooks />;

export const StaffIcon = () => (
  <>
  <span data-tooltip-id="staff-tooltip" data-tooltip-content={I18n.t('common.user_staff')} className="staffIcon">
    <MdVerified />
  </span>
  <Tooltip id="staff-tooltip" />
  </>
);

export const ClearIcon = () => <GrClearOption />;

export const LikeIcon = ({size = 32}) => <BiLike size={size} />;

export const SolidLikeIcon = ({size = 32}) => <BiSolidLike size={size} />;

export const SettingsIcon = () => <FiSettings />;

export const AnonymousIcon = ({size = 32}) => (
  <>
  <span data-tooltip-id="anonymous-tooltip" data-tooltip-content={I18n.t('defaults.user_full_name')} className="anonymousIcon">
    <FaUserNinja size={size} />
  </span>
  <Tooltip id="anonymous-tooltip" />
  </>
);

export const ApproveIcon = () => <MdCheck />;

export const RejectIcon = () => <MdClear />;

export const AddIcon = () => <MdAdd />;

export const PreviewIcon = ({size = 24}) => <GrOverview size={size} />;

export const LiquidIcon = ({size = 18}) => (
  <>
  <a href="https://shopify.github.io/liquid/" target="_blank" rel="noreferrer" className="link">
    <span
      data-tooltip-id="liquid-tooltip"
      data-tooltip-content={I18n.t('common.language_supported', { language: 'Liquid' })}
      className="liquidIcon"
    >
      <FaDroplet size={size} />
    </span>
  </a>
  <Tooltip id="liquid-tooltip" />
  </>
);

export const MarkdownIcon = ({size = 24, style = {}}) => (
  <>
  <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noreferrer" className="link">
    <span
      data-tooltip-id="markdown-tooltip"
      data-tooltip-content={I18n.t('common.language_supported', { language: 'Markdown' })}
      style={{...style, ...{opacity: 0.75}}}
      className="markdownIcon"
    >
      <FaMarkdown size={size} />
    </span>
  </a>
  <Tooltip id="markdown-tooltip" />
  </>
);

export const AttachIcon = ({size = 24}) => <MdAttachFile size={size} />;

export const ImageIcon = ({size = 24}) => <FaRegImage size={size} />;