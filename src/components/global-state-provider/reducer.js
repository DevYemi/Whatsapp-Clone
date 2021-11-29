export const initialState = {
  user: null, // state for the current logged in user
  currentLoggedInUserChats: null, // state for the current user chats convos
  currentDisplayedRoomMembers: null, // state for the members of the current displayed room
  currentDisplayConvoInfo: null, // state for the current displayed convo either chat or room
  currentDisplayedConvoMessages: null, // state for the current displayed convo messages either chat or room
  isMuteNotifichecked: false, // state if the current displayed convo has been muted
  isCurrentConvoBlocked: false, // state if the current displayed convo has been blocked
  totalUserOnDb: null, // state for the total registered users on the db
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.user };
    case "SET_CURRENTLOGGEDINUSERCHATS":
      return { ...state, currentLoggedInUserChats: action.currentLoggedInUserChats }
    case "SET_CURRENTDISPLAYEDROOMMEMBERS":
      return { ...state, currentDisplayedRoomMembers: action.currentDisplayedRoomMembers }
    case "SET_CURRENTDISPLAYCONVOINFO":
      return { ...state, currentDisplayConvoInfo: action.currentDisplayConvoInfo };
    case "SET_ISMUTENOTIFICHECKED":
      return { ...state, isMuteNotifichecked: action.isMuteNotifichecked };
    case "SET_ISCURRENTCONVOBLOCKED":
      return { ...state, isCurrentConvoBlocked: action.isCurrentConvoBlocked };
    case "SET_CURRENTDISPLAYEDCONVOMESSAGES":
      return { ...state, currentDisplayedConvoMessages: action.currentDisplayedConvoMessages };
    case "SET_TOTALUSERONDB":
      return { ...state, totalUserOnDb: action.totalUserOnDb };
    default:
      return state;
  }
}
export default reducer;
