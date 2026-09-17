import { Hexagon, LogOut, MessageSquare, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../axiosSetup/API";
import GoogleLoginModal from "./GoogleLoginModal";

interface User {
  id: string;
  name: string;
  email: string;
}

function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

useEffect(() => {
  const storedUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  setUser(storedUser);
}, []);

const handleLogout = async () => {
    try {
        await API.post("/auth/logout");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    } catch (error) {
        console.error("Logout error:", error);
        // Even if the API call fails, clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    }
};

const handleLogin = () => {
    setIsLoginModalOpen(true);
};

const handleGoToChatbox = async () => {
    try {
        // Try to get user's repos
        const reposRes = await API.get("/user/repos");
        
        if (reposRes.data?.count > 0) {
            // User has repos, navigate to the first one
            const firstRepo = reposRes.data.repos[0];
            navigate(`/chatbox/${firstRepo.jobId}`);
        } else {
            // No repos, navigate to link drop
            navigate("/pastelink");
        }
    } catch (error) {
        console.error("Error fetching repos:", error);
        // Fallback to link drop
        navigate("/pastelink");
    }
};

    return (
        <div className="bg-[#0d0f14] border-b-2 border-[#1e2530] flex items-center py-4 px-4 md:px-11 justify-between">
            {/* left part */}
            <div className="left flex justify-between space-x-2 items-center">
                {/* icon */}
                <div className="icon flex justify-center items-center h-8 w-8 rounded-tl-[25%] rounded-tr-[25%] rounded-br-[25%] rounded-bl-[25%] bg-[#a8ff3e]">
                    <Hexagon className="w-[50%] h-[50%] text-black" />
                </div>
                {/* company name */}
                <div className="text-white flex items-center">
                    <h1 className="text-lg md:text-xl">contrib</h1>
                    <h1 className="text-[#a8ff3e] text-lg md:text-xl">.ai</h1>
                </div>
            </div>
            
            {/* Desktop middle part */}
            <div className="hidden md:flex space-x-7">
                {location.pathname === '/' ? (
                    <>
                        <a href="#features" className="text-[#7a8299] hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="text-[#7a8299] hover:text-white transition-colors">How it works</a>
                    </>
                ) : (
                    <>
                        <a href="/#features" className="text-[#7a8299] hover:text-white transition-colors">Features</a>
                        <a href="/#how-it-works" className="text-[#7a8299] hover:text-white transition-colors">How it works</a>
                    </>
                )}
                <a href="/docs" className="text-[#7a8299] hover:text-white transition-colors">Docs</a>
            </div>
            
            {/* Desktop button */}
            <div className="hidden md:flex space-x-1">
                {
                    user ? (
                        <div className="flex items-center space-x-3">
                            {/* Go to Chatbox button for logged-in users */}
                            <button
                                onClick={handleGoToChatbox}
                                className="flex items-center space-x-1 text-[#a8ff3e] hover:text-[#bfff6e] border border-[#1e2530] rounded-[5px] p-2 transition-all duration-300 hover:border-[#a8ff3e] hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] hover:scale-105"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span>Chat</span>
                            </button>
                            
                            <div className="text-white border border-[#1e2530] rounded-[5px] p-2 text-sm">
                                {user.name}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-1 text-[#7a8299] hover:text-white border border-[#1e2530] rounded-[5px] p-2 transition-all duration-300 hover:border-[#a8ff3e] hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] hover:scale-105"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={handleLogin}
                            className="bg-[#a8ff3e] text-black rounded-[5px] px-6 py-2 hover:bg-[#bfff6e] transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] hover:scale-105 font-medium"
                        >
                            Sign In
                        </button>
                    )
                }
            </div>
            
            {/* Mobile menu button */}
            <button 
                className="md:hidden text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-16 left-0 right-0 bg-[#0d0f14] border-b-2 border-[#1e2530] p-4 md:hidden flex flex-col space-y-4">
                    {location.pathname === '/' ? (
                        <>
                            <a href="#features" className="text-[#7a8299] hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
                            <a href="#how-it-works" className="text-[#7a8299] hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>How it works</a>
                        </>
                    ) : (
                        <>
                            <a href="/#features" className="text-[#7a8299] hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
                            <a href="/#how-it-works" className="text-[#7a8299] hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>How it works</a>
                        </>
                    )}
                    <a href="/docs" className="text-[#7a8299] hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Docs</a>
                    
                    <div className="border-t border-[#1e2530] pt-4">
                        {
                            user ? (
                                <div className="flex flex-col space-y-3">
                                    <button
                                        onClick={() => {
                                            handleGoToChatbox();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center justify-center space-x-1 text-[#a8ff3e] hover:text-[#bfff6e] border border-[#1e2530] rounded-[5px] p-2 transition-all duration-300 hover:border-[#a8ff3e] hover:shadow-[0_0_15px_rgba(168,255,62,0.3)]"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        <span>Chat</span>
                                    </button>
                                    
                                    <div className="text-white border border-[#1e2530] rounded-[5px] p-2 text-center">
                                        {user.name}
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center justify-center space-x-1 text-[#7a8299] hover:text-white border border-[#1e2530] rounded-[5px] p-2 transition-all duration-300 hover:border-[#a8ff3e] hover:shadow-[0_0_15px_rgba(168,255,62,0.3)]"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => {
                                        handleLogin();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="bg-[#a8ff3e] text-black rounded-[5px] px-6 py-2 hover:bg-[#bfff6e] transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,255,62,0.3)] font-medium w-full"
                                >
                                    Sign In
                                </button>
                            )
                        }
                    </div>
                </div>
            )}
            
          {/* Google Login Modal */}
        <GoogleLoginModal 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)} 
        />
        </div>
        
        
    )
}

export default Navbar