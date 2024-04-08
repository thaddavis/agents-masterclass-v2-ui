"use client";

import { chatReducer, initialState } from "@/app/agents/completion/ChatReducer";
import { Chat } from "@/components/chat";
import { useReducer } from "react";
import { ChatContext, ChatDispatchContext } from "./ChatContext";

export default function Page() {
  const [chat, dispatch] = useReducer(chatReducer, initialState);

  return (
    <>
      <ChatContext.Provider value={chat}>
        <ChatDispatchContext.Provider value={dispatch}>
          <Chat />
        </ChatDispatchContext.Provider>
      </ChatContext.Provider>
    </>
  );
}
