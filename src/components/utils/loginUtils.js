import { auth, provider } from '../backend/firebase'
import { registerNewUserInDb, resetIsUserOnlineOnDb } from '../backend/get&SetDataToDb';
import { isValidPhoneNumber } from 'react-phone-number-input'

export const sign = {
    in: function (totalUserOnDb, dispatch, history) { // Sign in the user 
        auth.signInWithPopup(provider)
            .then(res => {
                let check = sign.hasEmailBeenUsedBefore(res?.user?.email, totalUserOnDb);
                if (check.res) {
                    let info = res.user
                    localStorage.setItem("whatsappCloneUser", JSON.stringify({ info, phoneNumber: check.matchedPhoneNumber }))
                    dispatch({
                        type: "SET_USER",
                        user: { info, phoneNumber: check.matchedPhoneNumber },
                    })
                    resetIsUserOnlineOnDb(info.uid, true);
                    history.push("/home")
                } else {
                    alert(`User not found, please sign up`);
                }
            }).catch(e => alert(e.message))


    },
    up: function (phoneInput, totalUserOnDb, dispatch, history) { // Sign up a new user 
        console.log()
        if (phoneInput === "") return
        let checkNum = sign.hasPhoneNumBeenUsedBefore(phoneInput, totalUserOnDb);
        if (checkNum) return
        if (isValidPhoneNumber(phoneInput)) {
            auth.signInWithPopup(provider)
                .then(res => {
                    let checkEmail = sign.hasEmailBeenUsedBefore(res?.user?.email, totalUserOnDb)
                    if (!checkEmail.res) {
                        registerNewUserInDb(res?.user?.email, phoneInput, res?.user?.uid, res?.user?.displayName, res?.user?.photoURL)
                        let info = res.user
                        localStorage.setItem("whatsappCloneUser", JSON.stringify({ info, phoneNumber: phoneInput }))
                        dispatch({
                            type: "SET_USER",
                            user: { info, phoneNumber: phoneInput },
                        })
                        resetIsUserOnlineOnDb(info.uid, true)
                        history.push("/home")
                    } else {
                        alert(`The email address "${res?.user?.email}" has already been used by another user to register a number`);
                    }
                })
                .catch(e => alert(e.message))
        }
    },
    hasPhoneNumBeenUsedBefore: function (phoneInput, totalUserOnDb) { // checks if the new user number input has been used before
        let res;
        for (let i = 0; i < totalUserOnDb?.length; i++) {
            const user = totalUserOnDb[i];
            if (user.phoneNumber === phoneInput) {
                alert(`The number ${phoneInput} has already been used by another user`);
                i = totalUserOnDb + 1
                res = true
            } else {
                res = false
            }
        }
        return res
    },
    hasEmailBeenUsedBefore: function (email, totalUserOnDb) { // checks if the new user email from google has been used before
        let res;
        let matchedPhoneNumber
        for (let i = 0; i < totalUserOnDb?.length; i++) {
            const user = totalUserOnDb[i];
            if (user.email === email) {
                i = totalUserOnDb + 1
                matchedPhoneNumber = user.phoneNumber
                res = true
            } else {
                res = false
            }

        }
        return { res, matchedPhoneNumber }

    }

}
