import gsap from "gsap";

export const profile = {
    // Code for the smoothin animation of the user profile sidebar
    open: function (isRoom) {
        if (window.screen.width < 840) return // dont apply animation when user is on a mobile screen
        let userProfile = gsap.timeline({
            defaults: { duration: 1, ease: "power4" },
        });
        userProfile
            .to(isRoom ? ".roomProfile__wr" : ".userProfile__wr", {
                width: "35%",
            })
            .to(
                isRoom ? ".roomProfile__body" : ".userProfile__body",
                { duration: 0.5, stagger: 1, opacity: 1, marginTop: 0 },
                ">-0.7"
            );
    },
    close: function (isRoom) {
        if (window.screen.width < 840) return // dont apply animation when user is on a mobile screen
        gsap.to(isRoom ? ".roomProfile__wr" : ".userProfile__wr", {
            duration: 0.6,
            width: "0%",
        });
        gsap.to(isRoom ? ".roomProfile__body" : ".userProfile__body", {
            opacity: 0,
            marginTop: "-30px",
        });
    },
};
