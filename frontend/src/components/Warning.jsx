import React, { useContext } from 'react'
import { userContext } from '../context/userContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWarning } from '@fortawesome/free-solid-svg-icons'

const Warning = ({warningTitle,warningMessage,next}) => {
    const {theme,setConfirmation}= useContext(userContext)
    const handleConfirmation=()=>{

        next()
        setConfirmation(false)
    }
  return (
    <div className='fixed !w-screen h-dvh backdrop-blur-sm z-50 transition-all duration-300 flex items-center justify-center' >
        <div className=' rounded-lg border-2 p-4' style={{color:theme.text,background:theme.secondary,borderColor:theme.button}}>
            <div className='text-2xl flex item-center justify-start gap-4'>
                <FontAwesomeIcon icon={faWarning} />
                <p>{warningTitle}</p>
            </div>
            <div>
                <p>{warningMessage}</p>
                <button>Ok</button>
            </div>
        </div>
    </div>
  )
}

export default Warning