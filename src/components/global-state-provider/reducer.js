
export const initialState = {
  user: localStorage.whatsappCloneUser ? JSON.parse(localStorage.whatsappCloneUser) : null, // state for the current logged in user
  userChats: null, // state for the current logged in user chats 
  currentLoggedInUserChats: null, // state for the current user chats convos
  currentDisplayedRoomMembers: null, // state for the members of the current displayed room
  currentDisplayConvoInfo: null, // state for the current displayed convo either chat or room
  currentDisplayedConvoMessages: null, // state for the current displayed convo messages either chat or room
  isMuteNotifichecked: false, // state if the current displayed convo has been muted
  isCurrentConvoBlocked: false, // state if the current displayed convo has been blocked
  selectedPreviewMember: null, // state of the member whom profile was clicked in RoomProfileMain 
  totalUserOnDb: null, // state for the total registered users on the db
  isUserOnDarkMode: false, // keeps state if user is on dark mode
  darkMode: { bc1: { backgroundColor: "#212121" }, bc2: { backgroundColor: "#3D3D3D" } },
  lightMode: { bc1: { backgroundColor: "white" }, bc2: { backgroundColor: "EDEDED" } }
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.user };
    case "SET_USERCHATS":
      return { ...state, userChats: action.userChats }
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
    case "SET_SELECTEDPREVIEWMEMBER":
      return { ...state, selectedPreviewMember: action.selectedPreviewMember };
    case "SET_TOTALUSERONDB":
      return { ...state, totalUserOnDb: action.totalUserOnDb };
    case "SET_ISUSERONDARKMODE":
      return { ...state, isUserOnDarkMode: action.isUserOnDarkMode }
    case "LOG_OUT":
      return { ...initialState, user: null }
    default:
      return state;
  }
}
export default reducer;
