import { ArrowBack } from '@material-ui/icons'
import React, { useEffect, useState } from 'react';
import { userprofileSidebar as animate } from "../../utils/userProfileUtils";
import { mediaDocsNav } from './../../utils/userProfileUtils'

function UpsbMediaDocs({ imgMssgAll }) {
    const [mediaDocsNavType, setMediaDocsNavType] = useState('MEDIA');
    useEffect(() => {
        const resizeListener = () => {
            const navWidth = document.querySelector(".UPSB_mediaDocs_headerNav p").offsetWidth
            const slideSpan = document.querySelector('.UPSB_mediaDocs_headerNav >.slide');
            slideSpan.style.width = `${navWidth}px`
        }
        window.addEventListener('resize', resizeListener)
        return () => {
            window.removeEventListener('resize', resizeListener)
        }
    }, [])
    return (
        <div className='UPSB_mediaDocs'>
            <div className="UPSB_mediaDocs_header">
                <ArrowBack onClick={animate.close} />
                <div className="UPSB_mediaDocs_headerNav">
                    <p onClick={() => { mediaDocsNav.slideTo(0); setMediaDocsNavType('MEDIA') }}>Media</p>
                    <p onClick={() => { mediaDocsNav.slideTo(1); setMediaDocsNavType('DOCS') }}>Docs</p>
                    <p onClick={() => { mediaDocsNav.slideTo(2); setMediaDocsNavType('LINKS') }}>Links</p>
                    <span className='slide'></span>
                </div>
            </div>
            <div className="UPSB_mediaDocs_body">
                {mediaDocsNavType === 'MEDIA' ?
                    <div className={`media ${imgMssgAll.length > 0 ? 'filled' : 'empty'}`}>
                        {imgMssgAll.length > 0 ?
                            (
                                imgMssgAll.map((img, index) => (
                                    <div className='imgDiv' key={index}>
                                        <img src={img?.url} alt="docImage" />
                                    </div>
                                ))
                            ) :
                            (
                                <p>No Media</p>
                            )

                        }
                    </div>
                    : mediaDocsNavType === 'DOCS' ?
                        <div className="docs">
                            <p>Doc File Type Isn't Supported</p>
                        </div>
                        : <div className="links">Link File Type Isn't supported</div>
                }

            </div>
        </div>
    )
}

export default UpsbMediaDocs