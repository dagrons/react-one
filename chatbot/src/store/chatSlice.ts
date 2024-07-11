// src/chatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  messages: Message[];
}
interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const initialState: ChatState = {
  messages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
  },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;

