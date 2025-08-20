import React, { useState, useEffect } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useAuth } from "../contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Search, Users } from "lucide-react";
import { cn } from "../lib/utils";

const UserList = ({ onUserSelect, selectedUser, className }) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();
    const { isUserOnline, getMessagesForUser } = useSocket();

    // Mock users data - replace with actual API call
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Simulate API call
                const mockUsers = [
                    {
                        _id: "1",
                        username: "John Doe",
                        email: "john@example.com",
                        avatar: "",
                        lastSeen: new Date().toISOString(),
                    },
                    {
                        _id: "2",
                        username: "Jane Smith",
                        email: "jane@example.com",
                        avatar: "",
                        lastSeen: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
                    },
                    {
                        _id: "3",
                        username: "Alice Johnson",
                        email: "alice@example.com",
                        avatar: "",
                        lastSeen: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                    },
                    {
                        _id: "4",
                        username: "Bob Wilson",
                        email: "bob@example.com",
                        avatar: "",
                        lastSeen: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                    },
                ];

                // Filter out current user
                const filteredUsers = mockUsers.filter(
                    (user) => user._id !== currentUser?._id
                );
                setUsers(filteredUsers);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch users:", error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentUser]);

    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getLastMessage = (userId) => {
        const messages = getMessagesForUser(userId);
        return messages[messages.length - 1];
    };

    const getUnreadCount = (userId) => {
        const messages = getMessagesForUser(userId);
        return messages.filter(
            (msg) => msg.senderId === userId && msg.status !== "read"
        ).length;
    };

    const formatLastSeen = (lastSeen) => {
        const now = new Date();
        const lastSeenDate = new Date(lastSeen);
        const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440)
            return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    const formatMessageTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            });
        } else if (diffInDays === 1) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
        }
    };

    if (loading) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center h-full",
                    className
                )}
            >
                <div className="text-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground">
                        Loading users...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Header */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-2 mb-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <h2 className="font-semibold text-lg">Chats</h2>
                    <Badge variant="secondary" className="ml-auto">
                        {filteredUsers.length}
                    </Badge>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* User List */}
            <ScrollArea className="flex-1">
                <div className="p-2">
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                                {searchTerm
                                    ? "No users found"
                                    : "No users available"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredUsers.map((user) => {
                                const isOnline = isUserOnline(user._id);
                                const lastMessage = getLastMessage(user._id);
                                const unreadCount = getUnreadCount(user._id);
                                const isSelected =
                                    selectedUser?._id === user._id;

                                return (
                                    <div
                                        key={user._id}
                                        onClick={() => onUserSelect(user)}
                                        className={cn(
                                            "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent",
                                            isSelected &&
                                                "bg-accent border border-primary/20"
                                        )}
                                    >
                                        {/* Avatar */}
                                        <div className="relative">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage
                                                    src={user.avatar}
                                                    alt={user.username}
                                                />
                                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                    {user.username
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            {/* Online Indicator */}
                                            <div
                                                className={cn(
                                                    "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-background",
                                                    isOnline
                                                        ? "bg-green-500"
                                                        : "bg-gray-400"
                                                )}
                                            />
                                        </div>

                                        {/* User Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-medium truncate">
                                                    {user.username}
                                                </h3>
                                                {lastMessage && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatMessageTime(
                                                            lastMessage.createdAt
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {lastMessage ? (
                                                        <span className="flex items-center">
                                                            {lastMessage.senderId ===
                                                                currentUser._id && (
                                                                <span className="mr-1">
                                                                    {lastMessage.status ===
                                                                    "read"
                                                                        ? "✓✓"
                                                                        : "✓"}
                                                                </span>
                                                            )}
                                                            {lastMessage.text}
                                                        </span>
                                                    ) : isOnline ? (
                                                        "Online"
                                                    ) : (
                                                        `Last seen ${formatLastSeen(
                                                            user.lastSeen
                                                        )}`
                                                    )}
                                                </p>

                                                {unreadCount > 0 && (
                                                    <Badge
                                                        variant="default"
                                                        className="h-5 w-5 p-0 text-xs flex items-center justify-center bg-primary"
                                                    >
                                                        {unreadCount > 99
                                                            ? "99+"
                                                            : unreadCount}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

export default UserList;
