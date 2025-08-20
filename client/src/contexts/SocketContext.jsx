import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useRef,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [typingUsers, setTypingUsers] = useState({});
    const { user, token } = useAuth();
    const socketRef = useRef(null);

    useEffect(() => {
        if (user && token) {
            // Initialize socket connection
            const newSocket = io("http://localhost:5000", {
                auth: {
                    token,
                },
            });

            newSocket.on("connect", () => {
                console.log("Connected to server");
            });

            newSocket.on("disconnect", () => {
                console.log("Disconnected from server");
            });

            // Listen for online users
            newSocket.on("users:online", (users) => {
                setOnlineUsers(users);
            });

            // Listen for new messages
            newSocket.on("message:new", (message) => {
                setMessages((prev) => [...prev, message]);
            });

            // Listen for typing events
            newSocket.on("typing:start", ({ userId, username }) => {
                setTypingUsers((prev) => ({
                    ...prev,
                    [userId]: username,
                }));
            });

            newSocket.on("typing:stop", ({ userId }) => {
                setTypingUsers((prev) => {
                    const newTyping = { ...prev };
                    delete newTyping[userId];
                    return newTyping;
                });
            });

            // Listen for message status updates
            newSocket.on("message:status", ({ messageId, status }) => {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg._id === messageId ? { ...msg, status } : msg
                    )
                );
            });

            socketRef.current = newSocket;
            setSocket(newSocket);

            return () => {
                newSocket.close();
                setSocket(null);
                socketRef.current = null;
            };
        }
    }, [user, token]);

    const sendMessage = (receiverId, text) => {
        if (socket && text.trim()) {
            const messageData = {
                receiverId,
                text: text.trim(),
                timestamp: new Date().toISOString(),
            };

            socket.emit("message:send", messageData);

            // Optimistically add message to local state
            const optimisticMessage = {
                _id: Date.now().toString(), // Temporary ID
                senderId: user._id,
                receiverId,
                text: text.trim(),
                status: "sending",
                createdAt: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, optimisticMessage]);
        }
    };

    const startTyping = (receiverId) => {
        if (socket) {
            socket.emit("typing:start", { receiverId });
        }
    };

    const stopTyping = (receiverId) => {
        if (socket) {
            socket.emit("typing:stop", { receiverId });
        }
    };

    const markMessageAsRead = (messageId) => {
        if (socket) {
            socket.emit("message:read", { messageId });
        }
    };

    const getMessagesForUser = (userId) => {
        return messages
            .filter(
                (msg) =>
                    (msg.senderId === user._id && msg.receiverId === userId) ||
                    (msg.senderId === userId && msg.receiverId === user._id)
            )
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    };

    const isUserOnline = (userId) => {
        return onlineUsers.some((onlineUser) => onlineUser._id === userId);
    };

    const value = {
        socket,
        onlineUsers,
        messages,
        typingUsers,
        sendMessage,
        startTyping,
        stopTyping,
        markMessageAsRead,
        getMessagesForUser,
        isUserOnline,
        setMessages,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
