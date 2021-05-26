export const initialState = {
  user: null,
  currentDisplayConvoInfo: null,
  isMuteNotifichecked: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.user };
    case "SET_CURRENTDISPLAYCONVOINFO":
      return { ...state, currentDisplayConvoInfo: action.currentDisplayConvoInfo };
      case "SET_ISMUTENOTIFICHECKED":
      return { ...state, isMuteNotifichecked: action.isMuteNotifichecked };
    default:
      return state;
  }
}
export default reducer;
