import React from 'react'
import { Knob } from 'rc-knob'
import "rc-knob/lib/index.js" 


const KnobControl = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col items-center">
      <Knob
        size={50}
        angleOffset={220}
        angleRange={280}
        min={0}
        max={100}
        value={value}
        onChange={onChange}
        className="mb-2"
      />
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default KnobControl;
