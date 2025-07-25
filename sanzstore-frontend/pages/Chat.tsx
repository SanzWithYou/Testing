
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChatConversation } from '../types';
import { fetchUserConversations } from '../services/api';
import ChatSidebar from '../components/ChatSidebar';
import ChatBox from '../components/ChatBox';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const Chat: React.FC = () => {
    const { conversationId } = useParams<{ conversationId?: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setError("You must be logged in to view chats.");
            setLoading(false);
            return;
        }

        const getConversations = async () => {
            try {
                const data = await fetchUserConversations(user.id);
                setConversations(data);
            } catch (err) {
                console.error("Polling for conversations failed:", err);
            }
        };
        
        // Initial fetch with loading state
        setLoading(true);
        fetchUserConversations(user.id)
            .then(data => {
                setConversations(data);
            })
            .catch(err => {
                setError("Failed to fetch conversations.");
            })
            .finally(() => {
                setLoading(false);
            });
        
        // Set up polling
        const intervalId = setInterval(getConversations, 5000); // Poll every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [user]);

    useEffect(() => {
        document.title = 'My Chats – Sanz Store';
        // This effect handles setting the active conversation
        if (conversations.length > 0) {
            const idToSelect = conversationId || conversations[0].id;
            const selectedConvo = conversations.find(c => c.id === idToSelect);
            setActiveConversation(selectedConvo || conversations[0]);
             if (!conversationId && conversations[0]?.id) {
                navigate(`/chat/${conversations[0].id}`, { replace: true });
            }
        }
    }, [user, conversationId, conversations, navigate]);

    const handleSelectConversation = (id: string) => {
        const selected = conversations.find(c => c.id === id);
        if (selected) {
            setActiveConversation(selected);
            navigate(`/chat/${id}`);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error} />;

    return (
        <div className="h-[75vh] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
            <div className="md:col-span-1 lg:col-span-1 h-full">
                <ChatSidebar
                    conversations={conversations}
                    activeConversationId={activeConversation?.id || null}
                    onSelectConversation={handleSelectConversation}
                />
            </div>
            <div className="md:col-span-2 lg:col-span-3 h-full">
                {activeConversation ? (
                    <ChatBox conversation={activeConversation} />
                ) : (
                    <div className="flex items-center justify-center h-full bg-dark/50 backdrop-blur-sm rounded-xl ring-1 ring-white/10">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white">Select a Conversation</h2>
                            <p className="text-slate-400">Choose a chat from the sidebar to start messaging.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
