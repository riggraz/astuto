import * as React from 'react';

import NewPost from './NewPost';
import SearchFilter from './SearchFilter';
import PostStatusFilter from './PostStatusFilter';
import PostList from './PostList';
import Sidebar from '../common/Sidebar';
import SortByFilter from './SortByFilter';
import DateFilter from './DateFilter';
import PoweredByLink from '../common/PoweredByLink';

import IBoard from '../../interfaces/IBoard';
import ITenantSetting from '../../interfaces/ITenantSetting';

import { PostsState } from '../../reducers/postsReducer';
import { PostStatusesState } from '../../reducers/postStatusesReducer';
import { SortByFilterValues } from '../../actions/changeFilters';

interface Props {
  board: IBoard;
  isLoggedIn: boolean;
  isPowerUser: boolean;
  currentUserFullName: string;
  tenantSetting: ITenantSetting;
  componentRenderedAt: number;
  postStatusesToShowInFilter: Array<number>;
  authenticityToken: string;
  posts: PostsState;
  postStatuses: PostStatusesState;

  requestPosts(
    boardId: number,
    page?: number,
    searchQuery?: string,
    postStatusIds?: Array<number>,
    sortBy?: SortByFilterValues,
    date?: { startDate: string; endDate: string },
  ): void;
  requestPostStatuses(): void;
  handleSearchFilterChange(searchQuery: string): void;
  handlePostStatusFilterChange(postStatusId: number): void;
  handleSortByFilterChange(sortBy: SortByFilterValues): void;
  handleDateFilterChange(startDate: string, endDate: string): void;
}

class BoardP extends React.Component<Props> {
  searchFilterTimeoutId: ReturnType<typeof setTimeout>;

  componentDidMount() {
    this.props.requestPosts(this.props.board.id, 1, '', null, this.props.posts.filters.sortBy);
    this.props.requestPostStatuses();
  }

  componentDidUpdate(prevProps: Props) {
    const { searchQuery } = this.props.posts.filters;
    const prevSearchQuery = prevProps.posts.filters.searchQuery;

    const { postStatusIds } = this.props.posts.filters;
    const prevPostStatusIds = prevProps.posts.filters.postStatusIds;

    const { sortBy } = this.props.posts.filters;
    const prevSortBy = prevProps.posts.filters.sortBy;

    const { startDate, endDate } = this.props.posts.filters.date;
    const prevStartDate = prevProps.posts.filters.date.startDate;
    const prevEndDate = prevProps.posts.filters.date.endDate;

    const requestPostsWithFilters = () => (
      this.props.requestPosts(this.props.board.id, 1, searchQuery, postStatusIds, sortBy, { startDate, endDate })
    );

    // search filter changed
    if (searchQuery !== prevSearchQuery) {
      if (this.searchFilterTimeoutId) clearInterval(this.searchFilterTimeoutId);

      this.searchFilterTimeoutId = setTimeout(() => (
        requestPostsWithFilters()
      ), 500);
    }

    // poststatus/sortby/date filter changed
    if (
      postStatusIds.length !== prevPostStatusIds.length ||
      sortBy !== prevSortBy ||
      startDate !== prevStartDate ||
      endDate !== prevEndDate
    ) {
      requestPostsWithFilters();
    }
  }

  render() {
    const {
      board,
      isLoggedIn,
      isPowerUser,
      currentUserFullName,
      tenantSetting,
      componentRenderedAt,
      postStatusesToShowInFilter,
      authenticityToken,
      posts,
      postStatuses,

      requestPosts,
      handleSearchFilterChange,
      handlePostStatusFilterChange,
      handleSortByFilterChange,
      handleDateFilterChange,
    } = this.props;
    const { filters } = posts;

    return (
      <div className="boardContainer">
        <Sidebar>
          <NewPost
            board={board}
            tenantSetting={tenantSetting}
            isLoggedIn={isLoggedIn}
            currentUserFullName={currentUserFullName}
            isAnonymousFeedbackAllowed={tenantSetting.allow_anonymous_feedback}
            componentRenderedAt={componentRenderedAt}
            authenticityToken={authenticityToken}
          />

          <div className="sidebarFilters">
            <SearchFilter
              searchQuery={filters.searchQuery}
              handleChange={handleSearchFilterChange}
            />
            {
              isPowerUser &&
              <>
              <SortByFilter
                sortBy={filters.sortBy}
                handleChange={sortBy => handleSortByFilterChange(sortBy)}
              />

              <DateFilter
                startDate={filters.date.startDate}
                endDate={filters.date.endDate}
                handleChange={handleDateFilterChange}
              />
              </>
            }
            {
              postStatusesToShowInFilter.length > 0 &&
                <PostStatusFilter
                  postStatuses={postStatuses.items.filter(postStatus => postStatusesToShowInFilter.includes(postStatus.id))}
                  areLoading={postStatuses.areLoading}
                  error={postStatuses.error}

                  currentFilter={filters.postStatusIds}
                  handleFilterClick={handlePostStatusFilterChange}

                  showNoStatusFilter={postStatusesToShowInFilter.includes(null)}
                />
            }
          </div>

          { tenantSetting.show_powered_by && <PoweredByLink /> }
        </Sidebar>

        <PostList
          posts={posts.items}
          showLikeCount={isPowerUser || tenantSetting.show_vote_count}
          showLikeButtons={tenantSetting.show_vote_button_in_board}
          postStatuses={postStatuses.items}
          areLoading={posts.areLoading}
          error={posts.error}
          
          hasMore={posts.haveMore}
          handleLoadMore={() =>
            posts.areLoading ?
              null
            :
              requestPosts(board.id, posts.page + 1, filters.searchQuery, filters.postStatusIds)
          }

          isLoggedIn={isLoggedIn}
          authenticityToken={authenticityToken}
        />
      </div>
    );
  }
}

export default BoardP;