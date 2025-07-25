
import React from 'react';
import { ChatMessage } from '../types';

interface MessageBubbleProps {
    message: ChatMessage;
    isOwnMessage: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage }) => {
    const bubbleClasses = isOwnMessage
        ? 'bg-primary text-white self-end'
        : 'bg-slate-700 text-slate-200 self-start';

    return (
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${bubbleClasses}`}>
                <p>{message.text}</p>
            </div>
            <span className="text-xs text-slate-500 mt-1 px-1">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
    );
};

export default MessageBubble;
