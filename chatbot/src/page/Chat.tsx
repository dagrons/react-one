// src/components/Chat.tsx
import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {ChatInput} from '../components/ChatInput';
import {BotMessage, UserMessage} from "../components/Message";


export const Chat: React.FC = () => {
    const messages = useSelector((state: RootState) => state.chat.messages);

    return (
        <div style={{margin: "10%", position: "relative"}}>
            <h1>Chat with our Bot</h1>
            <div style={{width: "100%", minHeight: "500px"}}>
                {messages.map((msg, index) => (
                    msg.sender === 'user' ? (
                        <UserMessage key={index} message={msg.text}></UserMessage>
                    ) : (
                        <BotMessage key={index} message={msg.text}></BotMessage>
                    )
                ))}
            </div>
            <div style={{width: "80%", position: "absolute", "bottom": "20px"}}>
                <ChatInput/>
            </div>
        </div>
    );
};



