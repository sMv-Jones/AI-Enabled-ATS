import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, ChevronLeft } from 'lucide-react';

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const linkStyle = (path) =>
        `text-sm font-medium transition-colors hover:text-white ${location.pathname === path ? 'text-blue-400 font-semibold' : 'text-slate-400'
        }`;

    return (
        <header className="border-b border-white/10 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">

                {/* Logo Section */}
                <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                    <Zap className="h-8 w-8 text-blue-400 mr-2 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                    <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        TalentGPT
                    </span>
                </div>

                {/* Central Navbar Links */}
                <nav className="flex items-center gap-8 bg-white/5 px-6 py-2 rounded-full border border-white/5 backdrop-blur-sm">
                    <Link to="/" className={linkStyle('/')}>Home</Link>
                    <Link to="/about" className={linkStyle('/about')}>About</Link>
                    <Link to="/contact" className={linkStyle('/contact')}>Contact</Link>
                </nav>

                {/* Dynamic Context Action button */}
                <div className="min-w-[100px] flex justify-end">
                    {location.pathname !== '/' && (
                        <Link to="/" className="text-slate-400 hover:text-white flex items-center transition-colors text-sm font-medium gap-1 group">
                            <ChevronLeft className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" />
                            Back to Home
                        </Link>
                    )}
                </div>

            </div>
        </header>
    );
}