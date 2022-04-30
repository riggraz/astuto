import { connect } from "react-redux";
import { deletePostStatus } from "../actions/deletePostStatus";

import { requestPostStatuses } from "../actions/requestPostStatuses";
import { submitPostStatus } from "../actions/submitPostStatus";
import { updatePostStatus } from "../actions/updatePostStatus";
import { updatePostStatusOrder } from "../actions/updatePostStatusOrder";
import PostStatusesSiteSettingsP from "../components/SiteSettings/PostStatuses/PostStatusesSiteSettingsP";
import IPostStatus from "../interfaces/IPostStatus";
import { State } from "../reducers/rootReducer";

const mapStateToProps = (state: State) => ({
  postStatuses: state.postStatuses,
  settingsAreUpdating: state.siteSettings.postStatuses.areUpdating,
  settingsError: state.siteSettings.postStatuses.error,
});

const mapDispatchToProps = (dispatch: any) => ({
  requestPostStatuses() {
    dispatch(requestPostStatuses());
  },

  submitPostStatus(
    name: string,
    color: string,
    onSuccess: Function,
    authenticityToken: string
  ) {
    dispatch(submitPostStatus(name, color, authenticityToken)).then(res => {
      if (res && res.status === 201) onSuccess();
    });
  },

  updatePostStatus(
    id: number,
    name: string,
    color: string,
    onSuccess: Function,
    authenticityToken: string,
  ) {
    dispatch(updatePostStatus(id, name, color, authenticityToken)).then(res => {
      if (res && res.status === 200) onSuccess();
    });
  },

  updatePostStatusOrder(
    id: number,
    postStatuses: Array<IPostStatus>,
    sourceIndex: number,
    destinationIndex: number,
    authenticityToken: string) {
      dispatch(updatePostStatusOrder(id, postStatuses, sourceIndex, destinationIndex, authenticityToken));
  },

  deletePostStatus(id: number, authenticityToken: string) {
    dispatch(deletePostStatus(id, authenticityToken));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostStatusesSiteSettingsP);