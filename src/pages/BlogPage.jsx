import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import Section from '../components/Section';
import InteractivePuzzleDisplay from '../components/InteractivePuzzleDisplay';
import InteractiveArea from '../components/InteractiveArea';

// --- PAGE-SPECIFIC ICONS ---
const DownloadCloudIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8 17l4 4 4-4"/><path d="M12 12v9"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>);
const PlayCircleIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>);


// --- PAGE-SPECIFIC DATA ---
// Dynamic blogs and puzzles will be fetched from api_public.php
const resources = [
    { title: "Beginner's Checklist", type: "PDF" },
    { title: "Intermediate Syllabus", type: "PDF" },
    { title: "Endgame Puzzles", type: "PDF" },
];
const videos = [
    { title: "King's Gambit Accepted: Main Line", thumbnail: "https://placehold.co/800x450/1A237E/FFFFFF?text=Opening+Tutorial" },
    { title: "Coach Mouli Analyzes a Grandmaster Game", thumbnail: "https://placehold.co/800x450/2962FF/FFFFFF?text=Game+Analysis" },
];




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


const FeaturedArticles = ({ posts }) => {
    const navigate = useNavigate();
    return (
        <Section divider="slant" dividerColor="var(--light-bg)">
            <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Featured Articles & News</h2>
            <div className="grid lg:grid-cols-3 gap-8">
                {posts.length === 0 ? (
                    <div className="col-span-3 text-center text-gray-500 py-8">No articles published yet. Check back soon!</div>
                ) : (
                    posts.map((post) => (
                        <InteractiveArea key={post.id} className="w-full">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
                                {post.image_url ? (
                                    <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover bg-gray-200" />
                                ) : (
                                    <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-b">
                                        <span className="text-gray-400 font-medium tracking-widest uppercase">No Image</span>
                                    </div>
                                )}
                                <div className="p-6 flex flex-col flex-grow">
                                    <p className="text-sm font-semibold text-[var(--accent-red)] mb-2">{post.category}</p>
                                    <h3 className="text-xl font-bold text-[var(--dark-blue)] mb-3 flex-grow">{post.title}</h3>
                                    <p className="text-[var(--text-light)] mb-4">{post.excerpt}</p>
                                    <button onClick={() => {
                                        const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                        navigate(`/blog/${post.id}-${slug}`);
                                    }} className="text-left font-bold text-[var(--primary-blue)] hover:underline mt-auto">Read More &rarr;</button>
                                </div>
                            </div>
                        </InteractiveArea>
                    ))
                )}
            </div>
        </Section>
    );
};

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


const PuzzleArchive = ({ puzzles, onSelectPuzzle }) => {
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
    }, [difficulty, theme, searchTerm, puzzles]);

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

const PuzzleSection = ({ puzzles }) => {
    const [puzzleOfTheWeek, setPuzzleOfTheWeek] = useState(null);
    const [activePuzzle, setActivePuzzle] = useState(null);
    const puzzleRef = useRef(null);

    useEffect(() => {
        if (!puzzles || puzzles.length === 0) return;
        
        // Find puzzle marked as weekly, or fallback to the first one
        const weeklyPuzzle = puzzles.find(p => p.is_weekly === 1) || puzzles[0];
        setPuzzleOfTheWeek(weeklyPuzzle);
        setActivePuzzle(weeklyPuzzle);
    }, [puzzles]);

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
                <PuzzleArchive puzzles={puzzles} onSelectPuzzle={handleSelectPuzzle} />
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
    const [blogs, setBlogs] = useState([]);
    const [puzzles, setPuzzles] = useState([]);

    useEffect(() => {
        const fetchPublicContent = async () => {
            try {
                const { postToApi } = await import('../utils/api.js');
                const data = await postToApi('api_public.php', { action: 'get_public_content' });
                if (data.status === 'success') {
                    setBlogs(data.blogs || []);
                    setPuzzles(data.puzzles || []);
                }
            } catch (err) {
                console.error("Failed to fetch public content", err);
            }
        };
        fetchPublicContent();
    }, []);

    return (
        <main>
            <BlogHero />
            <FeaturedArticles posts={blogs} />
            <LearningResources resources={resources} />
            <VideoLibrary videos={videos} />
            <PuzzleSection puzzles={puzzles} />
            <CommunityContributions />
            <FinalCTA />
        </main>
    );
};

export default BlogPage;
