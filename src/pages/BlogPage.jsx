import React, { useState, useEffect, useCallback, useRef } from 'react';
import InteractiveArea from '../components/InteractiveArea'; // Assuming this is in src/components

// Note: You need to install chess.js and react-chessboard for the puzzle to work
// npm install chess.js react-chessboard
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

// --- PAGE-SPECIFIC ICONS ---
const DownloadCloudIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8 17l4 4 4-4"/><path d="M12 12v9"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>);
const PlayCircleIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>);


// --- PAGE-SPECIFIC DATA ---
const blogPosts = [
    { image: 'https://placehold.co/600x400/FF3D00/FFFFFF?text=Strategy', category: 'Strategy', title: 'The Power of the Pawn', excerpt: 'Discover why the humble pawn is one of the most powerful pieces on the board and how to leverage its strength.' },
    { image: 'https://placehold.co/600x400/2962FF/FFFFFF?text=History', category: 'History', title: 'The Immortal Game: A Look Back', excerpt: 'Revisit one of the most famous chess games ever played, a masterpiece of romantic-era attacking chess.' },
    { image: 'https://placehold.co/600x400/1A237E/FFFFFF?text=News', category: 'Academy News', title: 'Our Student Wins State U-12 Title!', excerpt: 'We are proud to announce that our student has secured the first place in the recent state-level championship.' },
];
const resources = [
    { title: "Beginner's Checklist", type: "PDF" },
    { title: "Intermediate Syllabus", type: "PDF" },
    { title: "Endgame Puzzles", type: "PDF" },
];
const videos = [
    { title: "King's Gambit Accepted: Main Line", thumbnail: "https://placehold.co/800x450/1A237E/FFFFFF?text=Opening+Tutorial" },
    { title: "Coach Mouli Analyzes a Grandmaster Game", thumbnail: "https://placehold.co/800x450/2962FF/FFFFFF?text=Game+Analysis" },
];
const puzzles = [
    // Easy
    { id: 1, fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', solution: ['Nxe5'], difficulty: 'Easy', theme: 'Tactics', title: 'Knight Fork', hint: 'The knight can attack two pieces at once.' },
    { id: 2, fen: 'rnbqkbnr/ppp2ppp/8/3pp3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3', solution: ['exd5', 'Qxd5'], difficulty: 'Easy', theme: 'Opening', title: 'Center Control', hint: 'Control the center of the board.' },
    { id: 3, fen: '4k3/8/8/8/8/8/4P3/4K3 w - - 0 1', solution: ['e4'], difficulty: 'Easy', theme: 'Endgame', title: 'Pawn Promotion Basics', hint: 'Advance your pawn to the end of the board.' },
    { id: 4, fen: 'r1b1k2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 5', solution: ['Bg5'], difficulty: 'Intermediate', theme: 'Tactics', title: 'Pinning the Knight', hint: 'A pin restricts the movement of an opponent\'s piece.' },
    { id: 5, fen: 'rnb1kbnr/pppp1ppp/8/4p3/4P2q/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', solution: ['Qe2'], difficulty: 'Intermediate', theme: 'Defense', title: 'Scholar\'s Mate Defense', hint: 'Protect the f2 pawn.' },
    { id: 6, fen: 'r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', solution: ['d4'], difficulty: 'Easy', theme: 'Opening', title: 'Sicilian Defense', hint: 'Challenge white\'s control of the center.' },
    { id: 7, fen: 'r4rk1/pp1b1ppp/1q2p3/2bpP3/3n1P2/2N1B3/PP2B1PP/R2Q1RK1 w - - 0 15', solution: ['Nxd4'], difficulty: 'Advanced', theme: 'Tactics', title: 'Removing the Defender', hint: 'Capture the piece that is defending another piece.' },
    { id: 8, fen: '5rk1/p1p2ppp/2p5/3p4/3P4/2P2P1P/P1P2P2/4R1K1 w - - 0 20', solution: ['Re7'], difficulty: 'Intermediate', theme: 'Endgame', title: 'Rook on the 7th Rank', hint: 'A rook on the 7th rank is a powerful attacking piece.' },
    { id: 9, fen: 'rnbq1rk1/ppp1bppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQ - 4 6', solution: ['Bg5'], difficulty: 'Intermediate', theme: 'Opening', title: 'Queen\'s Gambit Declined', hint: 'Develop your pieces and control the center.' },
    { id: 10, fen: '2r3k1/5p1p/p2p2p1/1p1P4/3b4/1P1B4/P4PPP/4R1K1 w - - 0 26', solution: ['Re4'], difficulty: 'Advanced', theme: 'Endgame', title: 'Bishop vs Rook', hint: 'Use your rook to create threats.' },
    { id: 11, fen: 'r1bqr1k1/pp1nbppp/2p2n2/3p2B1/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 2 10', solution: ['Bxf6'], difficulty: 'Intermediate', theme: 'Tactics', title: 'Exchanging Pieces', hint: 'Exchange your less active piece for a more active one.' },
    { id: 12, fen: '3r1rk1/pp3ppp/1q6/2b5/3n4/1P3B2/P4PPP/R1BQR1K1 w - - 0 17', solution: ['Nxd4'], difficulty: 'Advanced', theme: 'Tactics', title: 'Discovery Attack', hint: 'Move a piece to reveal an attack from another piece behind it.' },
    { id: 13, fen: '8/6pk/8/8/8/8/5PPP/6K1 w - - 0 40', solution: ['f4'], difficulty: 'Easy', theme: 'Endgame', title: 'Creating a Passed Pawn', hint: 'Use your pawn majority to create a passed pawn.' },
    { id: 14, fen: '2k5/8/8/p1p5/P1P5/8/8/2K5 w - - 0 1', solution: ['Kb2'], difficulty: 'Advanced', theme: 'Endgame', title: 'Opposition', hint: 'Use your king to control key squares and restrict the opponent\'s king.' },
    { id: 15, fen: 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1', solution: ['Nxg6'], difficulty: 'Advanced', theme: 'Tactics', title: 'Mate in 3', hint: 'Look for a sequence of moves that leads to checkmate.'},
];

// --- REUSABLE HELPER COMPONENTS ---
const Section = ({ children, bgColor = 'var(--white)', divider = null, dividerColor = 'var(--light-bg)' }) => (
    <section className="relative py-20" style={{ backgroundColor: bgColor }}>
        <div className="container mx-auto px-6 z-10 relative">{children}</div>
        {divider && <ShapeDivider type={divider} fillColor={dividerColor} />}
    </section>
);

const ShapeDivider = ({ type, fillColor }) => (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none" style={{ transform: type === 'waves' ? '' : 'rotate(180deg)' }}>
        {type === 'waves' ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[100px]">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" style={{ fill: fillColor }}></path>
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[80px]">
                <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" style={{ fill: fillColor }}></path>
            </svg>
        )}
    </div>
);


// --- BLOG PAGE SECTION COMPONENTS ---
const BlogHero = () => (
    <section className="relative text-white flex items-center justify-center text-center overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center hero-parallax" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=2073&auto=format&fit=crop')` }} />
        <div className="absolute inset-0 bg-[var(--dark-blue)] bg-opacity-70"></div>
        <div className="relative z-10 p-6 container mx-auto">
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">Chess Insights Hub</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">Your source for expert chess knowledge, academy news, and community resources.</p>
        </div>
    </section>
);

const FeaturedArticles = ({ posts }) => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Featured Articles & News</h2>
        <div className="grid lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
                <InteractiveArea key={index} className="w-full">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
                        <img src={post.image} alt={post.title} className="w-full h-48 object-cover"/>
                        <div className="p-6 flex flex-col flex-grow">
                            <p className="text-sm font-semibold text-[var(--accent-red)] mb-2">{post.category}</p>
                            <h3 className="text-xl font-bold text-[var(--dark-blue)] mb-3 flex-grow">{post.title}</h3>
                            <p className="text-[var(--text-light)] mb-4">{post.excerpt}</p>
                            <a href="#" className="font-bold text-[var(--primary-blue)] hover:underline mt-auto">Read More &rarr;</a>
                        </div>
                    </div>
                </InteractiveArea>
            ))}
        </div>
    </Section>
);

const LearningResources = ({ resources }) => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Learning Resources</h2>
        <div className="grid md:grid-cols-3 gap-8">
            {resources.map((res, index) => (
                <InteractiveArea key={index} className="w-full">
                    <a href="#" className="bg-white p-6 rounded-lg shadow-md h-full flex items-center justify-between transform hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <span className="font-semibold text-lg text-[var(--dark-blue)]">{res.title}</span>
                        <DownloadCloudIcon className="w-8 h-8 text-[var(--accent-red)]"/>
                    </a>
                </InteractiveArea>
            ))}
        </div>
    </Section>
);

const VideoLibrary = ({ videos }) => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Video Library</h2>
        <div className="grid md:grid-cols-2 gap-8">
            {videos.map((video, index) => (
                <InteractiveArea key={index} onHoverType="queen" className="w-full">
                    <div className="relative rounded-lg shadow-lg overflow-hidden group">
                        <img src={video.thumbnail} alt={video.title} className="w-full"/>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <PlayCircleIcon className="w-20 h-20 text-white"/>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-center mt-4 text-[var(--dark-blue)]">{video.title}</h3>
                </InteractiveArea>
            ))}
        </div>
    </Section>
);

const InteractivePuzzleDisplay = ({ puzzle, isWeekly, onReset, puzzleRef }) => {
    const [game, setGame] = useState(new Chess());
    const [currentMove, setCurrentMove] = useState(0);
    const [isSolved, setIsSolved] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (puzzle) {
            setGame(new Chess(puzzle.fen));
            setCurrentMove(0);
            setIsSolved(false);
            setShowHint(false);
            setShowSolution(false);
            setStatus(isWeekly ? 'White to move.' : 'Solve the puzzle.');
        }
    }, [puzzle, isWeekly]);

    const onDrop = (sourceSquare, targetSquare) => {
        if (isSolved || showSolution) return false;
        const gameCopy = new Chess(game.fen());
        const move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
        if (move === null) return false;

        if (move.san === puzzle.solution[currentMove]) {
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
        const tempGame = new Chess(puzzle.fen);
        puzzle.solution.forEach(move => tempGame.move(move));
        setGame(tempGame);
        setShowSolution(true);
        setIsSolved(true);
        setStatus('Solution Revealed.');
    };

    if (!puzzle) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl" ref={puzzleRef}>
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-2xl font-bold text-[var(--dark-blue)]">
                    {isWeekly ? 'Puzzle of the Week' : 'Archive Puzzle'}: {puzzle.title}
                </h3>
                {!isWeekly && (
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
                        {showHint && <p className="bg-gray-100 p-3 rounded-lg">{puzzle.hint}</p>}
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

const PuzzleArchive = ({ onSelectPuzzle }) => {
    const [filteredPuzzles, setFilteredPuzzles] = useState(puzzles);
    const [difficulty, setDifficulty] = useState('all');
    const [theme, setTheme] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filterPuzzles = useCallback(() => {
        let tempPuzzles = puzzles;
        if (difficulty !== 'all') tempPuzzles = tempPuzzles.filter(p => p.difficulty === difficulty);
        if (theme !== 'all') tempPuzzles = tempPuzzles.filter(p => p.theme === theme);
        if (searchTerm) tempPuzzles = tempPuzzles.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredPuzzles(tempPuzzles);
    }, [difficulty, theme, searchTerm]);

    useEffect(() => { filterPuzzles(); }, [filterPuzzles]);

    return (
        <div className="mt-12">
            <h3 className="text-3xl font-bold text-center text-[var(--dark-blue)] mb-8">Puzzle Archive</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-lg shadow-lg">
                <InteractiveArea className="w-full"><input type="text" placeholder="Search by title..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none" /></InteractiveArea>
                <InteractiveArea className="w-full"><select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none"><option value="all">All Difficulties</option><option value="Easy">Easy</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option></select></InteractiveArea>
                <InteractiveArea className="w-full"><select value={theme} onChange={e => setTheme(e.target.value)} className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none"><option value="all">All Themes</option><option value="Tactics">Tactics</option><option value="Opening">Opening</option><option value="Endgame">Endgame</option><option value="Defense">Defense</option></select></InteractiveArea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPuzzles.map(puzzle => (
                    <InteractiveArea key={puzzle.id} className="w-full">
                        <div className="bg-white p-4 rounded-lg shadow-md text-[var(--text-dark)] flex flex-col justify-between h-full transform hover:shadow-xl hover:scale-105 transition-all duration-300">
                            <div>
                                <h4 className="text-xl font-bold mb-2 text-[var(--dark-blue)]">{puzzle.title}</h4>
                                <p><strong>Difficulty:</strong> {puzzle.difficulty}</p>
                                <p><strong>Theme:</strong> {puzzle.theme}</p>
                            </div>
                            <button onClick={() => onSelectPuzzle(puzzle)} className="mt-4 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full" style={{backgroundColor: 'var(--primary-blue)'}}>
                                Solve this Puzzle
                            </button>
                        </div>
                    </InteractiveArea>
                ))}
            </div>
        </div>
    );
};

const PuzzleSection = () => {
    const [puzzleOfTheWeek, setPuzzleOfTheWeek] = useState(null);
    const [activePuzzle, setActivePuzzle] = useState(null);
    const puzzleRef = useRef(null);

    useEffect(() => {
        const getDayOfYear = date => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const dayOfYear = getDayOfYear(new Date());
        const weekNumber = Math.floor(dayOfYear / 7);
        const weeklyPuzzle = puzzles[weekNumber % puzzles.length];
        setPuzzleOfTheWeek(weeklyPuzzle);
        setActivePuzzle(weeklyPuzzle);
    }, []);

    const handleSelectPuzzle = (puzzle) => {
        setActivePuzzle(puzzle);
        puzzleRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleResetToWeekly = () => {
        setActivePuzzle(puzzleOfTheWeek);
        puzzleRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
            <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Interactive Puzzles</h2>
            <div className="max-w-4xl mx-auto">
                <InteractivePuzzleDisplay 
                    puzzle={activePuzzle} 
                    isWeekly={activePuzzle?.id === puzzleOfTheWeek?.id}
                    onReset={handleResetToWeekly}
                    puzzleRef={puzzleRef}
                />
                <PuzzleArchive onSelectPuzzle={handleSelectPuzzle} />
            </div>
        </Section>
    );
}

const CommunityContributions = () => (
    <Section>
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Community Contributions</h2>
        <div className="grid md:grid-cols-2 gap-12">
            <div>
                <h3 className="text-2xl font-bold text-center text-[var(--dark-blue)] mb-6">Ask the Coaches</h3>
                <form className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                    <InteractiveArea className="w-full"><input type="email" placeholder="Your Email" className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none" /></InteractiveArea>
                    <InteractiveArea className="w-full"><textarea placeholder="Your question or blog topic suggestion..." rows="4" className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none"></textarea></InteractiveArea>
                    <InteractiveArea><button type="submit" className="w-full bg-[var(--accent-red)] text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90">Submit</button></InteractiveArea>
                </form>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-center text-[var(--dark-blue)] mb-6">Student Blog Corner</h3>
                <div className="bg-white p-6 rounded-lg shadow-lg text-center h-full flex flex-col justify-center items-center">
                    <p className="text-[var(--text-light)] mb-4">Have an interesting game or a chess story to share? We feature the best submissions from our students right here!</p>
                    <InteractiveArea><button className="bg-[var(--primary-blue)] text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90">Submit Your Story</button></InteractiveArea>
                </div>
            </div>
        </div>
    </Section>
);

const FinalCTA = () => (
    <Section bgColor="var(--dark-blue)">
        <div className="text-center text-white max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold">Stay Ahead of the Game</h2>
            <p className="mt-4 text-lg text-gray-300">Subscribe to our newsletter for the latest articles, resources, and academy updates delivered straight to your inbox.</p>
            <form className="mt-8 flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <InteractiveArea className="w-full"><input type="email" placeholder="Enter your email" className="w-full p-4 rounded-md border-0 text-gray-800" /></InteractiveArea>
                <InteractiveArea><button type="submit" className="bg-[var(--accent-red)] text-white font-bold py-4 px-8 rounded-md hover:bg-opacity-90 transition-transform hover:scale-105">Subscribe</button></InteractiveArea>
            </form>
        </div>
    </Section>
);

// --- MAIN BLOG PAGE COMPONENT ---
const BlogPage = () => {
    return (
        <main>
            <BlogHero />
            <FeaturedArticles posts={blogPosts} />
            <LearningResources resources={resources} />
            <VideoLibrary videos={videos} />
            <PuzzleSection />
            <CommunityContributions />
            <FinalCTA />
        </main>
    );
};

export default BlogPage;
