import React, { useContext } from 'react'
import { userContext } from '../context/userContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWarning, faClose } from '@fortawesome/free-solid-svg-icons'

const Warning = ({ warningTitle, warningMessage, next, setConfirmation }) => {
  const { theme } = useContext(userContext);

  const handleConfirmation = () => {
    try {
      next(); // Execute the next action (like enabling TFA or closing the popup)
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmation(false); // Close the confirmation modal
    }
  }

  return (
    <div className='fixed h-dvh backdrop-blur-sm z-50 transition-all duration-300 flex items-center justify-center p-8'>
      <div className='relative rounded-lg border-2 p-4' style={{ color: theme.text, background: theme.secondary, borderColor: theme.button }}>
        <div className='relative text-2xl flex items-center justify-start gap-4 border-b-2 pb-2'>
          <FontAwesomeIcon icon={faWarning} className="text-yellow-500" />
          <p>{warningTitle}</p>
          <FontAwesomeIcon 
            className="absolute right-2 text-red-500 cursor-pointer" 
            icon={faClose} 
            onClick={() => setConfirmation(false)} 
          />
        </div>
        <div className="relative pt-2 min-h-32">
          <p>{warningMessage}</p>
          <button 
            className="absolute right-2 bottom-0 rounded-sm px-4 hover:opacity-75" 
            style={{ background: theme.button }} 
            onClick={handleConfirmation}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  )
}

export default Warning;
