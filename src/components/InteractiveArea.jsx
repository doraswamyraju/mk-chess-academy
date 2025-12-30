import React from 'react';
import { useCursor } from '../context/CursorContext';

const InteractiveArea = ({ children, onHoverType = 'knight', className = '' }) => {
    const { setCursorType } = useCursor();

    const handleMouseEnter = () => setCursorType(onHoverType);
    const handleMouseLeave = () => setCursorType('pawn');

    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={className}>
            {children}
        </div>
    );
};

export default InteractiveArea;