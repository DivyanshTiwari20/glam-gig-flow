import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, X, Sparkles, User, Settings, LogOut, UserCircle, ExternalLink, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { NotificationBell } from "@/components/notifications/NotificationBell";

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setFullName] = useState("Beauty Artist");
  const [email, setEmail] = useState("artist@glamflow.com");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setEmail(user.email || "No email");
        
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single();
        
        if (!error && data) {
          setFullName(data.full_name || "User");
          setAvatarUrl(data.avatar_url || null);
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileAction = async (action) => {
    setShowProfileMenu(false);

    switch (action) {
      case "profile":
        navigate("/profile");
        break;
      case "edit-profile":
        navigate("/profile-editor");
        break;
      case "public-profile":
        if (userId) {
          window.open(`/public-profile/${userId}`, '_blank');
        }
        break;
      case "settings":
        navigate("/settings");
        break;
      case "logout":
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Logout error:", error.message);
        } else {
          navigate("/");
        }
        break;
      default:
        break;
    }
  };

  const navItems = [
    { label: "Home", path: "/app" },
    { label: "Tasks", path: "/tasks" },
    { label: "Calendar", path: "/calendar" },
    { label: "Bookings", path: "/bookings" },
    { label: "Invoice", path: "/invoice" },
  ];

  return (
    <div>
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50 ">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo-1.png" alt="GlamFlow Logo" className="h-24 w-24 object-contain" />
            {/* <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              GlamFlow
            </span> */}
          </div>

          {/* Right Side Items */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-1 bg-muted p-1 rounded-md">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    className="rounded-md h-auto px-4 py-1 text-sm transition-colors duration-300 hover:bg-pink-400 hover:text-primary-foreground"
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            {/* <ThemeToggle /> */}
            
            {/* Notification Bell */}
            <NotificationBell />
            
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-9 w-9 p-0"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-9 w-9 rounded-full p-0 hover:bg-primary/10"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
              </Button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-card border rounded-md shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
                  <div className="p-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="h-10 w-10 object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{fullName}</p>
                        <p className="text-xs text-muted-foreground">{email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => handleProfileAction("edit-profile")}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Public Profile
                    </button>
                    <button
                      onClick={() => handleProfileAction("public-profile")}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Public Profile
                    </button>
                    <button
                      onClick={() => handleProfileAction("settings")}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                  </div>

                  <div className="border-t py-2">
                    <button
                      onClick={() => handleProfileAction("logout")}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t bg-card/95 backdrop-blur">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={`w-full justify-start transition-colors duration-300 ${
                      isActive 
                        ? 'bg-primary/10 text-primary hover:bg-pink-400 hover:text-primary-foreground' 
                        : 'hover:bg-pink-400 hover:text-primary-foreground'
                    }`}
                    onClick={() => {
                      navigate(item.path);
                      setShowMobileMenu(false);
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;
