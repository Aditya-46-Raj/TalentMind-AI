import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "@/features/auth/store/authStore";
import { 
    LayoutDashboard, Briefcase, MessageSquare, User, 
    LogOut, Mic, Settings, Menu, X, ExternalLink, Mail, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

function MainLayout({ children }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Job Match", path: "/job/analyze", icon: Briefcase },
    { name: "Mock Interview", path: "/interview/setup", icon: Mic },
    { name: "AI Mentor", path: "/chat", icon: MessageSquare },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  // Old header nav items (without settings, just as they were)
  const headerNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Job Match", path: "/job/analyze", icon: Briefcase },
    { name: "Mock Interview", path: "/interview/setup", icon: Mic },
    { name: "AI Mentor", path: "/chat", icon: MessageSquare },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const initials = user?.name 
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) 
    : "TM";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 md:p-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
            TM
          </div>
          <span className="font-bold text-xl truncate">TalentMind AI</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-5 h-5" />
        </Button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <Link 
            to="/profile" 
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors mb-3"
        >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border shrink-0">
                {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="font-semibold text-primary text-sm">{initials}</span>
                )}
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate">{user?.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
            </div>
        </Link>
        <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      
      {/* Restored Old Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="w-6 h-6" />
            </Button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                TM
              </div>
              <span className="font-bold text-xl hidden sm:inline-block">TalentMind AI</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 md:gap-4 flex-1 justify-center">
            {headerNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline-block">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/profile" className="hidden md:flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
                    {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="font-semibold text-primary text-xs">{initials}</span>
                    )}
                </div>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout} className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hidden sm:flex">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline-block">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Toggleable Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
              onClick={() => setSidebarOpen(false)} 
            />
            <aside className="relative w-72 max-w-[80%] bg-card h-full border-r shadow-2xl animate-in slide-in-from-left duration-300 z-50">
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-muted/10 flex flex-col h-full">
          <div className="flex-1">
            {children}
          </div>

          {/* Preserved Footer */}
          <footer className="border-t bg-card mt-auto shrink-0">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-[10px]">
                    TM
                  </div>
                  <span className="font-semibold">TalentMind AI</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a href="mailto:contact@talentmind.ai" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
                
                <p className="text-xs text-muted-foreground text-center md:text-right">
                  © {new Date().getFullYear()} TalentMind AI.<br/>Built by Aditya Raj
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>

    </div>
  );
}

export default MainLayout;
