import { Button } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import '../../styles/login.css'
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import { useStateValue } from '../global-state-provider/StateProvider';
import { getTotalUsersFromDb } from '../backend/get&SetDataToDb'
import { useHistory } from 'react-router'
import { sign } from '../utils/loginUtils'
import gsap from 'gsap'

function Login() {
    const [{ totalUserOnDb }, dispatch] = useStateValue();
    const [userAlreadyHasAcct, setUserAlreadyHasAcct] = useState(false);
    const [phoneInput, setPhoneInput] = useState("");
    const history = useHistory()


    useEffect(() => {
        const bg1Timeline = gsap.timeline({ defaults: { duration: 6, ease: "power1" } })
        const bg2Timeline = gsap.timeline({ defaults: { duration: 6, ease: "power1" } })

        bg1Timeline.to(".auth-bg1", { right: "50px", top: "20%" })
            .to(".auth-bg1", { right: "20px", top: "30%" })
            .to(".auth-bg1", { right: "-10px", top: "20%" })
        bg1Timeline.repeat(-1)

        bg2Timeline.to(".auth-bg2", { left: "40px", bottom: "40px" })
            .to(".auth-bg2", { left: "80px", bottom: "0" })
            .to(".auth-bg2", { left: "40px", bottom: "-40px" })
            .to(".auth-bg2", { left: "0", bottom: "40px" })
        bg2Timeline.repeat(-1)

    }, [])
    useEffect(() => { // Gets the total registertered user on db and reset Path and reset url path
        history.push("/")
        let unsubcribeGetToUserFromDb = getTotalUsersFromDb(dispatch);
        return () => { unsubcribeGetToUserFromDb(); }
    }, [dispatch, history])

    return (
        <div
            className="auth">
            <img className="auth-bg1" src="/img/loginBg.svg" alt="background" />
            <img className="auth-bg2" src="/img/loginBg2.svg" alt="background" />
            {userAlreadyHasAcct ?
                <div className="login">
                    <div className="login__container">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/150px-WhatsApp.svg.png" alt="whatapp-logo" />
                        <div className="login__text">
                            <h1>Sign in to WhatsApp</h1>
                        </div>
                        <Button onClick={() => sign.in(totalUserOnDb, dispatch, history)}>
                            Sign In With Google
                        </Button>
                        <div className="login__signUp">
                            <p >Create an account ?</p>
                            <span onClick={() => setUserAlreadyHasAcct(false)}>Sign Up </span>
                        </div>
                    </div>
                </div>
                :
                < div className="login" >
                    <div
                        className="login__container">
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
                        <Button onClick={() => sign.up(phoneInput, totalUserOnDb, dispatch, history)}>
                            Sign Up With Google
                        </Button>
                        <div className="login__login">
                            <p>Already has an account ?</p>
                            <span onClick={() => setUserAlreadyHasAcct(true)}>Sign In</span>
                        </div>
                    </div>
                </div >
            }
        </div>

    )

}



export default React.memo(Login)
