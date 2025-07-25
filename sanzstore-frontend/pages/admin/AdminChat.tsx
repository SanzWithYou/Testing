
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatConversation } from '../../types';
import { fetchAllConversations } from '../../services/api';
import ChatSidebar from '../../components/ChatSidebar';
import ChatBox from '../../components/ChatBox';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';

const AdminChat: React.FC = () => {
    const { conversationId } = useParams<{ conversationId?: string }>();
    const navigate = useNavigate();

    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Function to fetch conversations without setting loading state
        const getConversations = async () => {
            try {
                const data = await fetchAllConversations();
                setConversations(data);
            } catch (err) {
                console.error("Polling for conversations failed:", err);
            }
        };

        // Initial fetch with loading state
        setLoading(true);
        fetchAllConversations()
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

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []); 

    useEffect(() => {
        // This effect handles setting the active conversation when URL or data changes
        if (conversations.length > 0) {
            const idToSelect = conversationId || conversations[0].id;
            const selectedConvo = conversations.find(c => c.id === idToSelect);
            setActiveConversation(selectedConvo || conversations[0]);
            // If no conversation ID in URL, navigate to the first one
            if (!conversationId && conversations[0]?.id) {
                navigate(`/admin/chat/${conversations[0].id}`, { replace: true });
            }
        }
    }, [conversationId, conversations, navigate]);

    const handleSelectConversation = (id: string) => {
        const selected = conversations.find(c => c.id === id);
        if (selected) {
            setActiveConversation(selected);
            navigate(`/admin/chat/${id}`); 
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error} />;

    return (
         <div className="h-[calc(100vh-10rem)] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
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
                            <p className="text-slate-400">Choose a chat from the sidebar to monitor.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChat;
