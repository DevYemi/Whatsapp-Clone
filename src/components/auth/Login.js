import { Button } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { auth, provider } from '../backend/firebase'
import '../../styles/login.css'
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import { useStateValue } from '../global-state-provider/StateProvider';
import { getTotalUsersFromDb, registerNewUserInDb, resetIsUserOnlineOnDb } from '../backend/get&SetDataToDb'
import { useHistory } from 'react-router'

function Login() {
    const [{ totalUserOnDb }, dispatch] = useStateValue();
    const [userAlreadyHasAcct, setUserAlreadyHasAcct] = useState(false);
    const [phoneInput, setPhoneInput] = useState("");
    const history = useHistory()

    const sign = {
        in: function () { // Sign in the user 
            auth.signInWithPopup(provider)
                .then(res => {
                    let check = sign.hasEmailBeenUsedBefore(res?.user?.email);
                    if (check.res) {
                        let info = res.user
                        localStorage.setItem("whatsappCloneUser", JSON.stringify({ info, phoneNumber: check.matchedPhoneNumber }))
                        dispatch({
                            type: "SET_USER",
                            user: { info, phoneNumber: check.matchedPhoneNumber },
                        })
                        resetIsUserOnlineOnDb(info.uid, true);
                    } else {
                        alert(`User not found, please sign up`);
                    }
                }).catch(e => alert(e.message))


        },
        up: function () { // Sign up a new user 
            console.log()
            if (phoneInput === "") return
            let checkNum = sign.hasPhoneNumBeenUsedBefore();
            if (checkNum) return
            if (isValidPhoneNumber(phoneInput)) {
                auth.signInWithPopup(provider)
                    .then(res => {
                        let checkEmail = sign.hasEmailBeenUsedBefore(res?.user?.email)
                        if (!checkEmail.res) {
                            registerNewUserInDb(res?.user?.email, phoneInput, res?.user?.uid, res?.user?.displayName, res?.user?.photoURL)
                            let info = res.user
                            localStorage.setItem("whatsappCloneUser", JSON.stringify({ info, phoneNumber: phoneInput }))
                            dispatch({
                                type: "SET_USER",
                                user: { info, phoneNumber: phoneInput },
                            })
                            resetIsUserOnlineOnDb(info.uid, true)
                        } else {
                            alert(`The email address "${res?.user?.email}" has already been used by another user to register a number`);
                        }
                    })
                    .catch(e => alert(e.message))
            }
        },
        hasPhoneNumBeenUsedBefore: function () { // checks if the new user number input has been used before
            let res;
            for (let i = 0; i < totalUserOnDb.length; i++) {
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
        hasEmailBeenUsedBefore: function (email) { // checks if the new user email from google has been used before
            let res;
            let matchedPhoneNumber
            for (let i = 0; i < totalUserOnDb.length; i++) {
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


    useEffect(() => { // Gets the total registertered user on db and reset Path and reset url path
        history.push("/")
        let unsubcribeGetToUserFromDb = getTotalUsersFromDb(dispatch);
        return () => { unsubcribeGetToUserFromDb(); }
    }, [dispatch, history])
    if (userAlreadyHasAcct) {
        return (
            <div className="login">
                <div className="login__container">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/150px-WhatsApp.svg.png" alt="whatapp-logo" />
                    <div className="login__text">
                        <h1>Sign in to WhatsApp</h1>
                    </div>
                    <Button onClick={sign.in}>
                        Sign In With Google
                    </Button>
                    <div className="login__signUp">
                        <p >Create an account ?</p>
                        <span onClick={() => setUserAlreadyHasAcct(false)}>Sign Up </span>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="login">
                <div className="login__container">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/150px-WhatsApp.svg.png" alt="whatapp-logo" />
                    <div className="login__text">
                        <h1>Sign Up to WhatsApp</h1>
                    </div>
                    <PhoneInput
                        placeholder="Enter phone number"
                        international
                        countryCallingCodeEditable={false}
                        value={phoneInput}
                        defaultCountry="NG"
                        error={phoneInput ? (isValidPhoneNumber(phoneInput) ? undefined : 'Invalid phone number') : 'Phone number required'}
                        onChange={setPhoneInput} />
                    <p className="login__eg">e.g +234 8141 99 ****</p>
                    <Button onClick={sign.up}>
                        Sign Up With Google
                    </Button>
                    <div className="login__login">
                        <p>Already has an account ?</p>
                        <span onClick={() => setUserAlreadyHasAcct(true)}>Sign In</span>
                    </div>
                </div>
            </div>
        )
    }
}



export default React.memo(Login)
