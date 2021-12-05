
export const openImageFullScreen = (setImageFullScreen, url, message) => {
    // Open image on full screen when a user clicks on a message
    setImageFullScreen({
        isFullScreen: true,
        url: url,
        caption: message ? message : "",
    });
};

export const closeImageOnFullScreen = (setImageFullScreen) => { // close image on full when a user clicks the cancel icon
    setImageFullScreen({ isFullScreen: false });
}