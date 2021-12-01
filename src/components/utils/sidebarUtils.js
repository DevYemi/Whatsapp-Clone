import gsap from "gsap"

export const sidebarProfile = { // handles the smooth animation of displaying and hiding the sidebar div
    show: function () {
        const tl = gsap.timeline({ defaults: { duration: .3, ease: "power2" } })
        tl.to('.sidebarProfile', { right: 0 })
            .to('.sidebarProfile__avatar .MuiAvatar-root', { width: '200px', height: '200px', opacity: 1 }, '-=0.1')
            .to(['.sidebarProfile__sec2_wr', '.sidebarProfile__sec3_wr', '.sidebarProfile__sec4_wr'], { duration: .5, opacity: 1, bottom: 0 })
    },
    hide: function () {
        const tl = gsap.timeline({ defaults: { duration: .2, ease: "power2" } })
        tl.to('.sidebarProfile', { right: '100%' })
            .to('.sidebarProfile__avatar .MuiAvatar-root', { width: '50px', height: '50px' })
            .to(['.sidebarProfile__sec2_wr', '.sidebarProfile__sec3_wr', '.sidebarProfile__sec4_wr'], { opacity: 0, bottom: '15px' })
    }
}



export const sidebarMainHeaderHelp = {
    // handling the opeening and closing of the HelpIcon
    open: function (setIsSidebarHeaderHelpOpened) {
        let sidebarMain__headerHelpDiv = document.querySelector(".sidebarMain__headerHelp");
        sidebarMain__headerHelpDiv.style.display = "flex";
        setIsSidebarHeaderHelpOpened(true);
    },
    close: function (setIsSidebarHeaderHelpOpened) {
        let sidebarMain__headerHelpDiv = document.querySelector(".sidebarMain__headerHelp");
        sidebarMain__headerHelpDiv.style.display = "none";
        setIsSidebarHeaderHelpOpened(false);
    },
    handle: function (e, isConvoSearchBarOpen, isSidebarHeaderHelpOpened, setIsSidebarHeaderHelpOpened) {
        // checks if the sidebarMain__headerHelp Div is open and closes it vice versa
        let sidebarMain__headerHelpDiv = document.querySelector(".sidebarMain__headerHelpWr");
        if (e.target === null || sidebarMain__headerHelpDiv === null || isConvoSearchBarOpen) return;
        let isDecendent = sidebarMain__headerHelpDiv.contains(e.target);
        if (
            e.target.id !== "sidebarMain__headerHelp" &&
            isDecendent === false &&
            isSidebarHeaderHelpOpened === true
        ) {
            sidebarMainHeaderHelp.close(setIsSidebarHeaderHelpOpened);
        }
    },
};