import gsap from "gsap";

export const displayConvoForMobile = (event, history) => {
    // displays chat message on a mobile screen when the user clicks on the sideBarConvo component 
    let convoDiv = document.querySelector(".convo");
    if (window.screen.width > 840) return // return if user is on a bigger screen
    if (!convoDiv) return
    if (event === "show") {
        gsap.to(convoDiv, {
            duration: .5,
            ease: "power2",
            left: 0
        })
    } else {
        // if history is false it means close convo but don't redirect to home page, so chat or room will open
        gsap.to(convoDiv, {
            duration: .5,
            onComplete: () => history && history(),
            ease: "power2",
            left: "110%"
        })
    }
}
export function mobileDisplayConvoProfile(event, isRoom) {
    if (window.screen.width > 840) return // return if user is on a very bigger screen
    let convoDiv = document.querySelector(isRoom ? ".roomProfile__wr " : ".userProfile__wr");
    let convoDivBody = document.querySelector(isRoom ? ".roomProfile__body " : ".userProfile__body");
    if (!convoDiv && !convoDivBody) return
    if (event === "show") {
        let convoTimeline = gsap.timeline({ defaults: { duration: 1, ease: "power4" }, })
        convoTimeline.to(convoDiv, { width: "100%", left: 0, })
            .to(convoDivBody, {
                duration: 0.5,
                stagger: 1,
                opacity: 1,
                marginTop: 0
            }, ">-0.7")
    } else {
        let convoTimeline = gsap.timeline({ defaults: { duration: 1, ease: "power4" }, })
        convoTimeline.to(convoDiv, { left: "110%" })
            .to(convoDivBody, {
                duration: 0.6,
                stagger: 1,
                marginTop: "-30px"
            })
    }
}