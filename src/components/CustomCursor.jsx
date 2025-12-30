import React, { useState, useEffect } from 'react';
import { useCursor } from '../context/CursorContext';
import { PawnIcon, KnightCursorIcon, QueenIcon } from './CursorIcons';

const CustomCursor = () => {
    const { cursorType } = useCursor();
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            
            // Check if the target or its parent is an interactive element
            const target = e.target.closest('a, button, input, textarea, select');
            setIsPointer(!!target);
        };

        window.addEventListener('mousemove', updateMousePosition);

        // Hide the default cursor
        document.body.style.cursor = 'none';

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            // Restore default cursor on cleanup
            document.body.style.cursor = 'auto';
        };
    }, []);

    const cursorStyle = {
        position: 'fixed',
        top: position.y,
        left: position.x,
        zIndex: 9999,
        pointerEvents: 'none',
        transform: `translate(-20px, -20px) scale(${isPointer ? 1.2 : 1})`,
        transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
        willChange: 'transform'
    };

    const renderCursor = () => {
        switch (cursorType) {
            case 'knight':
                return <KnightCursorIcon />;
            case 'queen':
                return <QueenIcon />;
            default:
                return <PawnIcon />;
        }
    };

    return <div style={cursorStyle}>{renderCursor()}</div>;
};

export default CustomCursor;