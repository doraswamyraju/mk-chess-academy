import React from 'react';

export const PawnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 45 45">
      <defs>
        <radialGradient id="pawnGradient" cx="50%" cy="50%" r="50%" fx="25%" fy="25%"><stop offset="0%" style={{stopColor: '#E6D4B8', stopOpacity: 1}} /><stop offset="100%" style={{stopColor: '#C4A484', stopOpacity: 1}} /></radialGradient>
        <filter id="pawnShadow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceAlpha" stdDeviation="1"/><feOffset dx="1" dy="1" result="offsetblur"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <g style={{filter: 'url(#pawnShadow)'}}><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38-1.99 1.03-3.28 3.12-3.28 5.62 0 3.04 2.08 5.54 4.9 6.32-1.25.97-2.9 2.16-2.9 4.68V36h9v-4c0-2.52-1.65-3.71-2.9-4.68 2.82-.78 4.9-3.28 4.9-6.32 0-2.5-1.29-4.59-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="url(#pawnGradient)" stroke="#5C3D2E" strokeWidth="1.5"/></g>
    </svg>
);

export const KnightCursorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 45 45">
        <defs>
            <linearGradient id="knightGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{stopColor: '#FF4E50'}} /><stop offset="100%" style={{stopColor: '#F9D423'}} /></linearGradient>
            <filter id="knightShadow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/><feOffset dx="1.5" dy="1.5" result="offsetblur"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <g style={{filter: 'url(#knightShadow)'}}><path d="M22 10c10.5 1 16.5 8 16 29H15c-2.5-4-4-10-3-14 2-3 5-3 6-5 1-2-1-5-1-7 0-4 3-6 6-7zm-1 9c0 3-2 5-2 5s-2-2-2-5 2-5 2-5 2 2 2 5z" fill="url(#knightGradient)" stroke="#ffffff" strokeWidth="1"/></g>
    </svg>
);

export const QueenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 45 45">
        <defs>
            <radialGradient id="queenGradient" cx="50%" cy="50%" r="50%" fx="25%" fy="25%"><stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 1}} /><stop offset="100%" style={{stopColor: '#42A5F5', stopOpacity: 1}} /></radialGradient>
            <filter id="queenShadow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceAlpha" stdDeviation="2"/><feOffset dx="1" dy="1" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="0.5"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <g style={{filter: 'url(#queenShadow)'}}><path d="M8 12a1 1 0 011-1h27a1 1 0 011 1v2a1 1 0 01-1 1h-2.133l-2.4 11.2a1 1 0 01-.974.8H11.507a1 1 0 01-.974-.8L8.133 15H6a1 1 0 01-1-1v-2zM22.5 7a2.5 2.5 0 110-5 2.5 2.5 0 010 5zM12 7a2.5 2.5 0 110-5 2.5 2.5 0 010 5zM33 7a2.5 2.5 0 110-5 2.5 2.5 0 010 5zM12 36h21v-4H12v4z" fill="url(#queenGradient)" stroke="#1E88E5" strokeWidth="1.2"/></g>
    </svg>
);