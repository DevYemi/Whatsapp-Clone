export const initialState = {
  user: null, // state for the current logged in user
  currentLoggedInUserChats: null, // state for the current user chats convos
  currentDisplayConvoInfo: null, // state for the current displayed convo either chat or room
  currentDisplayedConvoMessages: null, // state for the current displayed convo messages either chat or room
  isMuteNotifichecked: false, // state if the current displayed convo has been muted
  isCurrentConvoBlocked: false, // state if the current displayed convo has been blocked
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.user };
    case "SET_CURRENTLOGGEDINUSERCHATS":
      return { ...state, currentLoggedInUserChats: action.currentLoggedInUserChats }
    case "SET_CURRENTDISPLAYCONVOINFO":
      return { ...state, currentDisplayConvoInfo: action.currentDisplayConvoInfo };
    case "SET_ISMUTENOTIFICHECKED":
      return { ...state, isMuteNotifichecked: action.isMuteNotifichecked };
    case "SET_ISCURRENTCONVOBLOCKED":
      return { ...state, isCurrentConvoBlocked: action.isCurrentConvoBlocked };
    case "SET_CURRENTDISPLAYEDCONVOMESSAGES":
      return { ...state, currentDisplayedConvoMessages: action.currentDisplayedConvoMessages };
    default:
      return state;
  }
}
export default reducer;
