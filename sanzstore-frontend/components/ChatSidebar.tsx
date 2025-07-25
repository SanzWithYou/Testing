
import React from 'react';
import { ChatConversation } from '../types';

interface ChatSidebarProps {
    conversations: ChatConversation[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ conversations, activeConversationId, onSelectConversation }) => {
    return (
        <div className="bg-dark/50 backdrop-blur-sm rounded-xl ring-1 ring-white/10 h-full flex flex-col">
            <header className="p-4 border-b border-slate-800">
                <h2 className="font-bold text-xl text-white">Conversations</h2>
            </header>
            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <p className="text-slate-400 text-center p-4">No conversations yet.</p>
                ) : (
                    <ul>
                        {conversations.map(convo => {
                            const isActive = convo.id === activeConversationId;
                            return (
                                <li key={convo.id}>
                                    <button
                                        onClick={() => onSelectConversation(convo.id)}
                                        className={`w-full text-left p-4 border-b border-slate-800 hover:bg-slate-700/50 transition-colors ${isActive ? 'bg-primary/20' : ''}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-white">{convo.product_name}</h4>
                                            <span className="text-xs text-slate-500">{new Date(convo.last_message_timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        <p className="text-sm text-slate-400 truncate">{convo.last_message}</p>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;
