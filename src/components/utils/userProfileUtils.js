import gsap from "gsap";

export const userprofileSidebar = { // handles the smooth animation of the user profile sidebar
    open: function (isMediaDocsNav) {
        const userProfileContainerDiv = document.querySelector(".userProfile__container");
        const userProfileSideBarDiv = document.querySelector(".userProfileSidebar__wr");
        const tl = gsap.timeline({
            onComplete: () => { isMediaDocsNav && mediaDocsNav.getWidth(); isMediaDocsNav && mediaDocsNav.slideTo(0) },
            defaults: { duration: .2, ease: "power2" }
        })
        tl.to(userProfileContainerDiv, { display: "none", width: 0 }, 'in')
            .to(userProfileSideBarDiv, { display: 'initial', width: '100%' }, 'in')
    },
    close: function (isRoom) {
        const userProfileContainerDiv = document.querySelector(".userProfile__container");
        const userProfileSideBarDiv = document.querySelector(".userProfileSidebar__wr");
        const tl = gsap.timeline({ defaults: { duration: .2, ease: "power2" } })
        tl.to(userProfileSideBarDiv, { display: "none", width: 0 }, 'in')
            .to(userProfileContainerDiv, { display: 'initial', width: '100%' }, 'in')
    }
}

export const mediaDocsNav = { // handles MediaDocs nav icon slide animation
    getWidth: function () {
        const navWidth = document.querySelector(".UPSB_mediaDocs_headerNav p").offsetWidth
        const slideSpan = document.querySelector('.UPSB_mediaDocs_headerNav >.slide');
        slideSpan.style.width = `${navWidth}px`
    },
    slideTo: function (num) {
        const navWidth = document.querySelector(".UPSB_mediaDocs_headerNav p").offsetWidth
        const slideSpan = document.querySelector('.UPSB_mediaDocs_headerNav >.slide');
        const position = `${(+navWidth * num) + 15}px`
        gsap.to(slideSpan, { duration: .2, left: position })
    }
}