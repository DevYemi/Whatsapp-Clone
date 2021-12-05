import { Mic, SendRounded } from '@material-ui/icons';
import React from 'react'
import gsap from 'gsap';
import '../../styles/voiceNoteRecoder.css'
import { setVoiceNoteToDb } from '../backend/get&SetDataToDb';
import { useStateValue } from '../global-state-provider/StateProvider';

// NOTE: THIS VARIABLES AIN'T INSIDE THE VOICE-NOTE-RECODER COMPONENT BECAUSE I NOTICED
//1.) REACT USE-STATE HOOKS DOESN'T HANDLE SET-INTERVAL CALLBACK FUNCTION PROPERLY
//2.) I DON'T REALLY UNDERSTAND CONTEXT-SCOPE AND SO I'M STILL LEARNING AS VALUE AIN'T CHANGING LIKE THEY SHOULD WHEN I TRIED USING USE-STATE HOOK

// PS: IF YOU HAVE A BETTER WAY OF DOING THIS PLEASE LET ME KNOW

var onRecordState; // takes in a object from the "new MediaRecorder" 
var micBlinking; //  holds the micBlinking timeInterval variable
var isRecordingStopByCancel; // holds true or false if voice recording was ended by the user pressing cancel  
var countDown; //  holds the countDown timeInterval variable
function VoiceNoteRecoder({ setVnIsRecoding, vnIsRecoding, convoId, scrollConvoBody }) {
    const [{ user, currentDisplayConvoInfo, isUserOnDarkMode }] = useStateValue();
    const recordAudio = { // handles the recording of the audio
        setup: function () { // sets the Media API and gets permission for microphone usage from user device
            var audioChunks = [];
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => { recordAudio.handleStream(stream, audioChunks); }) // call handleStream permission has been granted
                .catch(e => alert(`${e} Please enable Microphone to be able to send voice note`)) // alert error if any
        },
        start: function (e) { // starts recording user VOICE NOTE
            setVnIsRecoding(true);
            let redRecodingMic = document.querySelector(".voiceNoteRecoder__recoding > div > .MuiSvgIcon-root");
            micBlinking = setInterval(() => { redRecodingMic.classList.toggle("blink"); }, 500);
            countDown = setInterval(() => { this.timerCount.count(); }, 1000);
            onRecordState.start();
        },
        stop: function (e, type) { // stop recording user VOICE NOTE
            let currentMin = document.querySelector(".voiceNoteRecoder__min");
            let currentSec = document.querySelector(".voiceNoteRecoder__sec");
            currentMin.innerText = "00"
            currentSec.innerText = "00"
            setVnIsRecoding(false);
            clearInterval(countDown);
            clearInterval(countDown);
            clearInterval(micBlinking);
            isRecordingStopByCancel = false;
            this.stopAnimation.reset();

        },
        timerCount: { // set min and sec of the VOICE NOTE
            count: function () { // counts the min & sec of the VOICE NOTE
                let currentMin = document.querySelector(".voiceNoteRecoder__min");
                let currentSec = document.querySelector(".voiceNoteRecoder__sec");
                let currentMinDigit = this.convertStringToDigit(currentMin.innerHTML);
                let currentSecDigit = this.convertStringToDigit(currentSec.innerHTML);
                let updatedSec = currentSecDigit + 1
                let updatedMin;
                if (updatedSec >= 60) { // then 1 mintues has passed and restart sec from 0
                    updatedMin = currentMinDigit + 1
                    updatedSec = 0
                } else { // min stays the same
                    updatedMin = currentMinDigit
                }
                if (updatedMin >= 60) { // then voice note is up to 1 hour, end voice note
                    onRecordState.stop();
                    clearInterval(countDown);
                } else { // set updated min & sec to dom
                    currentMin.innerText = this.convertDigitToString(updatedMin)
                    currentSec.innerText = this.convertDigitToString(updatedSec)
                }
            },

            convertStringToDigit: function (string) { // convert a string to a number
                return parseFloat(string)
            },
            convertDigitToString: function (digit) { // convert a number to a string
                let result;
                if (digit <= 9) {
                    result = `0${digit.toString()}`
                } else {
                    result = digit.toString()
                }
                return result;
            }

        },
        handleStream: function (stream, audioChunks) { // handles the stream of the audio
            onRecordState = new MediaRecorder(stream);
            onRecordState.ondataavailable = e => { // a callback function that is called when ever onRecordState starts or stop
                audioChunks.push(e.data);
                if (onRecordState.state === "inactive") { // if user stop recording  create audio format
                    let blob = new Blob(audioChunks, { type: 'audio/mp3' });
                    if (isRecordingStopByCancel) { // delete the message and don't send to db
                        recordAudio.stopAnimation.animate();
                    } else { // send audio to db and stop recording
                        let min = document.querySelector(".voiceNoteRecoder__min").innerText
                        let sec = document.querySelector(".voiceNoteRecoder__sec").innerText
                        setVoiceNoteToDb(blob, convoId, user, scrollConvoBody, currentDisplayConvoInfo, min, sec);
                        recordAudio.stop()
                    }

                }
            }
            recordAudio.start();
        },
        stopAnimation: { // a smooth mic and dust bin animation when a recorded voice note is deleted
            animate: function (eventType) { // animate icons when message a deleted
                let mic = ".voiceNoteRecoder__recoding > div > .MuiSvgIcon-root";
                let bin = ".voiceNoteRecoder__recoding > div > img";
                let tl = gsap.timeline({ onComplete: () => recordAudio.stop(), defaults: { duration: 1, ease: "power2" } })
                tl.to(mic, { y: "-60px" })
                    .to(mic, { rotation: "-180deg" }, "label")
                    .to(bin, { y: 0 }, "label")
                    .to(mic, { y: 0 })
                    .to(mic, { display: "none" }, ">-.7")
                    .to(bin, { y: "50px" })
            },
            reset: function () { // set icons to thier original position after animation has ended
                let mic = document.querySelector(".voiceNoteRecoder__recoding > div > .MuiSvgIcon-root");
                let bin = document.querySelector(".voiceNoteRecoder__recoding > div > img")
                mic.style.transform = "translateY(0px) rotate(0deg)"
                mic.style.display = "inline-block"
                bin.style.transform = "translateY(50px)"
            }
        }

    }

    return (
        <div className={`voiceNoteRecoder ${vnIsRecoding ? "show" : ""}`}>
            <div className={`voiceNoteRecoder__recoding ${vnIsRecoding ? "show" : ""}`} >
                <div>
                    <img src="/img/bin.png" alt="bin" />
                    <Mic />
                </div>
                <p className="voiceNoteRecoder__timer"><span className="voiceNoteRecoder__min">00</span>:<span className="voiceNoteRecoder__sec">00</span></p>
            </div>
            <p onClick={(e) => { isRecordingStopByCancel = true; onRecordState.stop(); }} className={vnIsRecoding ? "show" : ""}>Cancel</p>
            <div className="voiceNoteRecoder__mic" onClick={() => vnIsRecoding ? onRecordState.stop() : recordAudio.setup()}>

                {vnIsRecoding ? <SendRounded className={`${isUserOnDarkMode && "dark-mode-color3"}`} /> : <Mic className={`micIcon ${isUserOnDarkMode && "dark-mode-color3"}`} />}

            </div>
        </div>
    )
}

export default React.memo(VoiceNoteRecoder)
