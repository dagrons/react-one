import React from 'react';
import ReactMarkdown from 'react-markdown';
import {Persona, PersonaSize} from "@fluentui/react";

interface MessageProps {
    message: string;
}

export const UserMessage: React.FC<MessageProps> = ({ message }) => {
    return (
        <div className="user-message" style={{"display": "flex", "alignItems": "center"}}>
            <Persona imageUrl={"sada"} size={PersonaSize.size40} style={{"alignItems": "start"}}/>
            <ReactMarkdown>{message}</ReactMarkdown>
        </div>
    );
};

export const BotMessage: React.FC<MessageProps> = ({ message }) => {
    return (
        <div className="bot-message" style={{"display": "flex", "alignItems": "center"}}>
            <Persona imageUrl={"sada"} size={PersonaSize.size40} style={{"alignItems": "start"}}/>
            <ReactMarkdown>{message}</ReactMarkdown>
        </div>
    );
};
