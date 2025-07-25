

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ChatConversation } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { fetchMessagesForConversation, sendMessage } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import MessageBubble from './MessageBubble';
import { Send } from './Icons';

interface ChatBoxProps {
    conversation: ChatConversation;
}

const ChatBox: React.FC<ChatBoxProps> = ({ conversation }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const otherParty = user?.id === conversation.buyer_id ? conversation.seller_name : conversation.buyer_name;

    const isParticipant = user?.id === conversation.buyer_id || user?.id === conversation.seller_id;
    const isAdmin = user?.roles.includes('admin') || false;
    const canChat = isParticipant || isAdmin;

    useEffect(() => {
        // Function to fetch messages without setting loading state
        const getMessages = async () => {
            try {
                const data = await fetchMessagesForConversation(conversation.id);
                setMessages(data);
            } catch (error) {
                console.error("Polling for messages failed", error);
            }
        };
        
        // Initial fetch for the new conversation
        setLoading(true);
        getMessages().finally(() => setLoading(false));

        // Set up polling
        const intervalId = setInterval(getMessages, 3000); // Poll every 3 seconds

        // Clean up when conversation.id changes or component unmounts
        return () => clearInterval(intervalId);

    }, [conversation.id]);

    useEffect(() => {
        // Scroll to bottom whenever messages update
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !canChat) return;

        const textToSend = newMessage;
        setNewMessage('');
        
        try {
            // Optimistically update the UI
            const tempId = String(Date.now());
            const optimisticMessage: ChatMessage = {
                id: tempId,
                conversation_id: conversation.id,
                sender_id: user.id,
                text: textToSend,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, optimisticMessage]);

            const sentMessage = await sendMessage(conversation.id, textToSend, user);

            // Replace optimistic message with the real one from the server
            setMessages(prev => prev.map(msg => msg.id === tempId ? sentMessage : msg));

        } catch(error) {
            console.error("Failed to send message", error);
            // Revert optimistic update on failure
             setMessages(prev => prev.filter(msg => msg.id !== String(Date.now())));
        }
    };

    return (
        <div className="flex flex-col h-full bg-dark/50 backdrop-blur-sm rounded-xl ring-1 ring-white/10">
            <header className="p-4 border-b border-slate-800">
                <h3 className="font-bold text-white">Chat with {otherParty}</h3>
                <p className="text-sm text-slate-400 truncate">Regarding: {conversation.product_name}</p>
                 {isAdmin && !isParticipant && <p className="text-xs text-yellow-400 font-semibold mt-1">You are monitoring this chat as an Admin.</p>}
            </header>
            <main className="flex-1 p-4 overflow-y-auto space-y-4">
                {loading ? <LoadingSpinner /> : (
                    messages.map(msg => (
                        <MessageBubble key={msg.id} message={msg} isOwnMessage={msg.sender_id === user?.id} />
                    ))
                )}
                <div ref={messagesEndRef} />
            </main>
            <footer className="p-4 border-t border-slate-800">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder={canChat ? "Type a message..." : "You cannot participate in this chat."}
                        className="w-full p-2 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700 disabled:cursor-not-allowed"
                        disabled={!canChat}
                    />
                    <button type="submit" className="bg-primary text-white p-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed" disabled={!canChat || !newMessage.trim()}>
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatBox;
