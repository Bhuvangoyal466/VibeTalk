import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useAuth } from "../contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import {
    ArrowLeft,
    Send,
    Smile,
    Paperclip,
    MoreVertical,
    Phone,
    Video,
} from "lucide-react";
import { cn } from "../lib/utils";

const ChatScreen = ({ user, onBack, showBackButton }) => {
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const { user: currentUser } = useAuth();
    const {
        sendMessage,
        getMessagesForUser,
        startTyping,
        stopTyping,
        markMessageAsRead,
        typingUsers,
        isUserOnline,
    } = useSocket();

    const messages = getMessagesForUser(user._id);
    const isUserTyping = typingUsers[user._id];

    useEffect(() => {
        scrollToBottom();
    }, [messages, isUserTyping]);

    useEffect(() => {
        // Mark messages as read when chat is opened
        messages.forEach((msg) => {
            if (msg.senderId === user._id && msg.status !== "read") {
                markMessageAsRead(msg._id);
            }
        });
    }, [messages, user._id, markMessageAsRead]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = () => {
        if (message.trim()) {
            sendMessage(user._id, message.trim());
            setMessage("");
            setIsTyping(false);
            stopTyping(user._id);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleTyping = (e) => {
        setMessage(e.target.value);

        if (!isTyping) {
            setIsTyping(true);
            startTyping(user._id);
        }

        // Clear existing timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Set new timeout
        const newTimeout = setTimeout(() => {
            setIsTyping(false);
            stopTyping(user._id);
        }, 1000);

        setTypingTimeout(newTimeout);
    };

    const formatMessageTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const formatMessageDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return "Today";
        if (diffInDays === 1) return "Yesterday";
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year:
                date.getFullYear() !== now.getFullYear()
                    ? "numeric"
                    : undefined,
        });
    };

    const shouldShowDateSeparator = (currentMsg, previousMsg) => {
        if (!previousMsg) return true;

        const currentDate = new Date(currentMsg.createdAt).toDateString();
        const previousDate = new Date(previousMsg.createdAt).toDateString();

        return currentDate !== previousDate;
    };

    const getMessageStatus = (msg) => {
        if (msg.senderId !== currentUser._id) return null;

        switch (msg.status) {
            case "sending":
                return "⏳";
            case "sent":
                return "✓";
            case "delivered":
                return "✓✓";
            case "read":
                return <span className="text-primary">✓✓</span>;
            default:
                return "✓";
        }
    };

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Chat Header */}
            <div className="bg-card border-b border-border px-4 py-3">
                <div className="flex items-center space-x-3">
                    {showBackButton && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="p-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}

                    <div className="relative">
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={user.avatar}
                                alt={user.username}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {isUserOnline(user._id) && (
                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                        )}
                    </div>

                    <div className="flex-1">
                        <h3 className="font-semibold">{user.username}</h3>
                        <p className="text-xs text-muted-foreground">
                            {isUserTyping ? (
                                <span className="text-primary">typing...</span>
                            ) : isUserOnline(user._id) ? (
                                "Online"
                            ) : (
                                "Last seen recently"
                            )}
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="p-2">
                            <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-2">
                            <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-2">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="p-4 bg-muted/20 rounded-full w-fit mx-auto mb-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage
                                        src={user.avatar}
                                        alt={user.username}
                                    />
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                                        {user.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">
                                {user.username}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Start a conversation with {user.username}
                            </p>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isOwn = msg.senderId === currentUser._id;
                            const previousMsg = messages[index - 1];
                            const showDate = shouldShowDateSeparator(
                                msg,
                                previousMsg
                            );

                            return (
                                <div key={msg._id}>
                                    {/* Date Separator */}
                                    {showDate && (
                                        <div className="flex justify-center my-4">
                                            <span className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                                                {formatMessageDate(
                                                    msg.createdAt
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {/* Message */}
                                    <div
                                        className={cn(
                                            "flex",
                                            isOwn
                                                ? "justify-end"
                                                : "justify-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "message-bubble max-w-xs lg:max-w-md",
                                                isOwn
                                                    ? "message-bubble sent"
                                                    : "message-bubble received"
                                            )}
                                        >
                                            <p className="text-sm break-words">
                                                {msg.text}
                                            </p>
                                            <div
                                                className={cn(
                                                    "flex items-center space-x-1 mt-1",
                                                    isOwn
                                                        ? "justify-end"
                                                        : "justify-start"
                                                )}
                                            >
                                                <span className="text-xs opacity-70">
                                                    {formatMessageTime(
                                                        msg.createdAt
                                                    )}
                                                </span>
                                                {isOwn && (
                                                    <span className="text-xs">
                                                        {getMessageStatus(msg)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {/* Typing Indicator */}
                    {isUserTyping && (
                        <div className="flex justify-start">
                            <div className="message-bubble received">
                                <div className="typing-indicator">
                                    <div
                                        className="typing-dot"
                                        style={{ "--delay": "0ms" }}
                                    ></div>
                                    <div
                                        className="typing-dot"
                                        style={{ "--delay": "150ms" }}
                                    ></div>
                                    <div
                                        className="typing-dot"
                                        style={{ "--delay": "300ms" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="bg-card border-t border-border p-4">
                <div className="flex items-end space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 self-end mb-1"
                    >
                        <Paperclip className="h-4 w-4" />
                    </Button>

                    <div className="flex-1 relative">
                        <Input
                            ref={inputRef}
                            placeholder="Type a message..."
                            value={message}
                            onChange={handleTyping}
                            onKeyPress={handleKeyPress}
                            className="pr-10 resize-none"
                            rows={1}
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                        >
                            <Smile className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        size="sm"
                        className="p-2 self-end mb-1"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatScreen;
