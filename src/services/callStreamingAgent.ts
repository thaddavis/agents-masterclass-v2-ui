import { Action } from "@/app/agents/streaming/ChatReducer";
import React from "react";

export async function callStreamingAgent(
  prompt: string,
  dispatch: React.Dispatch<Action>
) {
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_AGENT_API_URL}/streaming-agent/completion`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: prompt,
      }),
    }
  );

  const reader = resp?.body?.getReader();

  const decoder = new TextDecoder();

  while (true) {
    // @ts-ignore
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    const chunk = decoder.decode(value);
    try {
      // Adjusting for SSE format by stripping 'data: ' prefix and trimming any remaining whitespace
      console.log("chunk", chunk);

      // ******** LEFT OFF HERE ********
      // setMessages((prevMessages) => [...prevMessages, newMessage.message]);
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  }

  console.log("DONE");
}

function readChunks(reader: ReadableStreamDefaultReader<Uint8Array>) {
  return {
    async *[Symbol.asyncIterator]() {
      let readResult = await reader.read();
      while (!readResult.done) {
        yield readResult.value;
        readResult = await reader.read();
      }
    },
  };
}
