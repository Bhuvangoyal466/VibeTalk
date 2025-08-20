import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import UserList from "../components/UserList";
import ChatScreen from "../components/ChatScreen";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { LogOut, Sun, Moon, MessageCircle } from "lucide-react";

const Home = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [showUserList, setShowUserList] = useState(true);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile && selectedUser) {
                setShowUserList(false);
            } else if (!mobile) {
                setShowUserList(true);
            }
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, [selectedUser]);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        if (isMobile) {
            setShowUserList(false);
        }
    };

    const handleBackToUsers = () => {
        if (isMobile) {
            setShowUserList(true);
            setSelectedUser(null);
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary rounded-lg">
                        <MessageCircle className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">VibeTalk</h1>
                        <p className="text-xs text-muted-foreground">
                            Welcome, {user?.username}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Theme Toggle */}
                    <div className="flex items-center space-x-2">
                        <Sun className="h-4 w-4" />
                        <Switch
                            checked={theme === "dark"}
                            onCheckedChange={toggleTheme}
                        />
                        <Moon className="h-4 w-4" />
                    </div>

                    {/* Logout Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* User List Sidebar */}
                <div
                    className={`${
                        isMobile ? (showUserList ? "w-full" : "w-0") : "w-80"
                    } transition-all duration-300 border-r border-border bg-card overflow-hidden`}
                >
                    {(showUserList || !isMobile) && (
                        <UserList
                            onUserSelect={handleUserSelect}
                            selectedUser={selectedUser}
                            className="h-full"
                        />
                    )}
                </div>

                {/* Chat Area */}
                <div
                    className={`${
                        isMobile ? (showUserList ? "w-0" : "w-full") : "flex-1"
                    } transition-all duration-300 overflow-hidden`}
                >
                    {selectedUser ? (
                        <ChatScreen
                            user={selectedUser}
                            onBack={handleBackToUsers}
                            showBackButton={isMobile}
                        />
                    ) : (
                        !isMobile && (
                            <div className="h-full flex items-center justify-center bg-muted/10">
                                <div className="text-center space-y-4">
                                    <div className="p-6 bg-primary/10 rounded-full mx-auto w-fit">
                                        <MessageCircle className="h-12 w-12 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            Select a conversation
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Choose a user from the sidebar to
                                            start chatting
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
