import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import InteractiveArea from './InteractiveArea';

const InteractivePuzzleDisplay = ({ puzzle, isWeekly, onReset, puzzleRef }) => {
    const [game, setGame] = useState(new Chess());
    const [currentMove, setCurrentMove] = useState(0);
    const [isSolved, setIsSolved] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (puzzle) {
            try {
                setGame(new Chess(puzzle.fen));
            } catch (e) {
                console.error("Invalid FEN", puzzle.fen);
                setGame(new Chess());
            }
            setCurrentMove(0);
            setIsSolved(false);
            setShowHint(false);
            setShowSolution(false);
            setStatus(isWeekly ? 'White to move.' : 'Solve the puzzle.');
        }
    }, [puzzle, isWeekly]);

    const onDrop = (sourceSquare, targetSquare) => {
        if (isSolved || showSolution) return false;
        
        try {
            const gameCopy = new Chess(game.fen());
            const move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
            if (move === null) return false;

            const expectedMove = puzzle.solution[currentMove];
            
            if (move.san === expectedMove || move.lan === expectedMove) {
                setGame(gameCopy);
                setCurrentMove(currentMove + 1);
                setStatus('Correct!');
                setTimeout(() => setStatus(''), 1500);
                if (currentMove + 1 === puzzle.solution.length) {
                    setIsSolved(true);
                    setStatus('Puzzle Solved!');
                }
                return true;
            } else {
                setStatus('Incorrect move. Try again.');
                setTimeout(() => setStatus(''), 1500);
                return false;
            }
        } catch (e) {
            return false;
        }
    };
    
    const handleDownload = () => {
        const pgn = `[FEN "${puzzle.fen}"]\n\n${puzzle.solution.map((move, i) => `${i + 1}. ${move}`).join(' ')}`;
        const element = document.createElement("a");
        const file = new Blob([pgn], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `puzzle_${puzzle.id}.pgn`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const revealSolution = () => {
        try {
            const tempGame = new Chess(puzzle.fen);
            puzzle.solution.forEach(move => tempGame.move(move));
            setGame(tempGame);
            setShowSolution(true);
            setIsSolved(true);
            setStatus('Solution Revealed.');
        } catch (e) {
            console.error("Error revealing solution", e);
        }
    };

    if (!puzzle) return (
        <div className="bg-gray-100 p-12 rounded-lg text-center text-gray-500">
            No puzzle data available.
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl" ref={puzzleRef}>
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-2xl font-bold text-[var(--dark-blue)]">
                    {isWeekly ? 'Puzzle of the Week' : 'Archive Puzzle'}: {puzzle.title}
                </h3>
                {onReset && !isWeekly && (
                    <InteractiveArea>
                        <button onClick={onReset} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            &larr; Back to Weekly Puzzle
                        </button>
                    </InteractiveArea>
                )}
            </div>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                    <InteractiveArea onHoverType="queen"><Chessboard position={game.fen()} onPieceDrop={onDrop} /></InteractiveArea>
                </div>
                <div className="w-full md:w-1/2 text-[var(--text-dark)]">
                    <div className="bg-gray-100 p-4 rounded-lg h-16 mb-4 flex items-center justify-center">
                         <p className={`font-bold text-xl ${isSolved ? 'text-[var(--success-green)]' : 'text-[var(--text-light)]'}`}>
                            {status}
                        </p>
                    </div>
                    {showSolution && <p className="font-bold text-lg mb-4" style={{color: 'var(--primary-blue)'}}>Solution: {puzzle.solution.join(', ')}</p>}
                    <div className="space-y-4">
                        <InteractiveArea>
                            <button onClick={() => setShowHint(!showHint)} className="w-full text-white font-bold py-2 px-4 rounded-lg transition-colors" style={{backgroundColor: 'var(--primary-blue)'}}>
                                {showHint ? 'Hide Hint' : 'Show Hint'}
                            </button>
                        </InteractiveArea>
                        {showHint && <p className="bg-gray-100 p-3 rounded-lg text-sm">{puzzle.hint}</p>}
                        <InteractiveArea>
                            <button onClick={revealSolution} disabled={isSolved} className="w-full text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400" style={{backgroundColor: 'var(--success-green)'}}>
                                Reveal Solution
                            </button>
                        </InteractiveArea>
                         <InteractiveArea>
                            <button onClick={handleDownload} className="w-full text-white font-bold py-2 px-4 rounded-lg transition-colors" style={{backgroundColor: 'var(--accent-red)'}}>
                                Download Puzzle (PGN)
                            </button>
                        </InteractiveArea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InteractivePuzzleDisplay;
