import gsap from "gsap";

export const roomProfileSidebar = { // handles the smooth animation of the user profile sidebar
    open: function (isMediaDocsNav) {
        const roomProfileContainerDiv = document.querySelector(".roomProfile__container");
        const roomProfileSideBarDiv = document.querySelector(".roomProfileSidebar__wr");
        const tl = gsap.timeline({
            onComplete: () => { isMediaDocsNav && mediaDocsNav.getWidth(); isMediaDocsNav && mediaDocsNav.slideTo(0) },
            defaults: { duration: .2, ease: "power2" }
        })
        tl.to(roomProfileContainerDiv, { display: "none", width: 0 }, 'in')
            .to(roomProfileSideBarDiv, { display: 'initial', width: '100%' }, 'in')
    },
    close: function () {
        const roomProfileContainerDiv = document.querySelector(".roomProfile__container");
        const roomProfileSideBarDiv = document.querySelector(".roomProfileSidebar__wr");
        const tl = gsap.timeline({ defaults: { duration: .2, ease: "power2" } })
        tl.to(roomProfileSideBarDiv, { display: "none", width: 0 }, 'in')
            .to(roomProfileContainerDiv, { display: 'initial', width: '100%' }, 'in')
    }
}

export const mediaDocsNav = { // handles MediaDocs nav icon slide animation
    getWidth: function () {
        const navWidth = document.querySelector(".RPSB_mediaDocs_headerNav p").offsetWidth
        const slideSpan = document.querySelector('.RPSB_mediaDocs_headerNav >.slide');
        slideSpan.style.width = `${navWidth}px`
    },
    slideTo: function (num) {
        const navWidth = document.querySelector(".RPSB_mediaDocs_headerNav p").offsetWidth
        const slideSpan = document.querySelector('.RPSB_mediaDocs_headerNav >.slide');
        const position = `${(+navWidth * num) + 15}px`
        gsap.to(slideSpan, { duration: .2, left: position })
    }
}

export const rearrangeForAdmin = (members) => {
    let notAdmin = [];
    let admin = [];
    let returnValue = []
    if (members) {
        members.forEach(mem => {
            mem.isAdmin ? admin.push(mem) : notAdmin.push(mem)
        });
        returnValue = [...admin, ...notAdmin]
    }

    return returnValue;
}