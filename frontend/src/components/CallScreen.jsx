import React,{useContext} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt, faPhoneSlash, faVolumeUp, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { SocketContext } from '../context/socketContext';

const CallScreen = () => {
  const { callStatus } = useContext(SocketContext);
  // Sample data for users
  const caller = { name: "John Doe", photo: "https://via.placeholder.com/100" };
  const receiver = { name: "Jane Smith", photo: "https://via.placeholder.com/100" };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      {/* Call Screen Container */}
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
        {/* Incoming / Outgoing / Connected Call */}
        {callStatus === "receiving" && (
          <div className="text-center p-6">
            <img className="w-24 h-24 rounded-full mx-auto mb-4" src={caller.photo} alt="Caller" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">{caller.name}</h2>
            <div className="flex justify-around text-3xl text-gray-600">
              <button className="text-green-600">
                <FontAwesomeIcon icon={faPhoneAlt} />
              </button>
              <button className="text-red-600">
                <FontAwesomeIcon icon={faPhoneSlash} />
              </button>
            </div>
          </div>
        )}

        {callStatus === "sending" && (
          <div className="text-center p-6">
            <img className="w-24 h-24 rounded-full mx-auto mb-4" src={receiver.photo} alt="Receiver" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">{receiver.name}</h2>
            <div className="flex justify-around text-3xl text-gray-600">
              <button className="text-red-600">
                <FontAwesomeIcon icon={faPhoneSlash} />
              </button>
              <button className="text-blue-600">
                <FontAwesomeIcon icon={faVolumeUp} />
              </button>
            </div>
          </div>
        )}

        {callStatus === "connected" && (
          <div className="relative">
            {/* Fullscreen view */}
            <div className="w-full h-96 bg-gray-500 flex justify-center items-center text-white text-2xl">
              <p>Full Screen View (2nd User)</p>
            </div>
            {/* Small self view */}
            <div className="absolute bottom-16 left-4 w-24 h-24 rounded-full overflow-hidden border-4 border-white">
              <img className="w-full h-full object-cover" src="https://via.placeholder.com/100" alt="Self View" />
            </div>
            {/* Control Buttons */}
            <div className="flex justify-around items-center py-4 text-3xl text-gray-600">
              <button className="text-red-600">
                <FontAwesomeIcon icon={faPhoneSlash} />
              </button>
              <button className="text-gray-600">
                <FontAwesomeIcon icon={faMicrophone} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallScreen;