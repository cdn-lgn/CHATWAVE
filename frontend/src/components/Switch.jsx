import React,{useContext} from "react";
import { userContext } from '../context/userContext';

const Switch = ({ checked, onChange }) => {
  const {theme} = useContext(userContext)
  return (
    <div className="relative w-11 h-6" onClick={onChange}>
      <div className={`switch ${checked ? "on" : "off"}`} style={{background: checked ?  theme.button : ""}}>
        <div className="slider"></div>
      </div>
    </div>
  );
};

export default Switch;
