import { Action } from "@/app/agents/streaming/ChatReducer";
import { nanoid } from "@/lib/utils";
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

  const aiMessageId = nanoid();
  let accMessage = "";

  while (true) {
    // @ts-ignore
    const { done, value } = await reader.read();
    if (done) break;
    let chunk = decoder.decode(value);

    try {
      const parsedChunk = JSON.parse(chunk);
      if (parsedChunk["event"] === "on_chat_model_start") {
        dispatch({
          type: "ADD_MESSAGE",
          payload: {
            id: aiMessageId,
            content: "",
            role: "ai",
            error: null,
          },
        });
      } else if (parsedChunk["event"] === "on_chat_model_stream") {
        accMessage += parsedChunk["data"];
        dispatch({
          type: "EDIT_MESSAGE",
          payload: {
            id: aiMessageId,
            content: accMessage,
          },
        });
      } else if (parsedChunk["event"] === "on_chat_model_end") {
      } else {
        console.error("Unknown event:", parsedChunk["event"]);
      }
    } catch (e) {
      let multiChunkAcc = "";

      let idx = 0;
      while (0 < chunk.length) {
        if (chunk[idx] === "}") {
          try {
            multiChunkAcc += chunk[idx];
            const parsedChunk = JSON.parse(multiChunkAcc);
            if (parsedChunk["event"] === "on_chat_model_start") {
              dispatch({
                type: "ADD_MESSAGE",
                payload: {
                  id: aiMessageId,
                  content: "",
                  role: "ai",
                  error: null,
                },
              });
            } else if (parsedChunk["event"] === "on_chat_model_stream") {
              accMessage += parsedChunk["data"];
              dispatch({
                type: "EDIT_MESSAGE",
                payload: {
                  id: aiMessageId,
                  content: accMessage,
                },
              });
            } else if (parsedChunk["event"] === "on_chat_model_end") {
            } else {
              console.error("Unknown event:", parsedChunk["event"]);
            }

            chunk = chunk.substring(idx + 1);
            idx = 0;
            multiChunkAcc = "";
          } catch (e) {
            multiChunkAcc += chunk.substring(0, idx);
          }
        } else {
          multiChunkAcc += chunk[idx];
          idx++;
        }
      }
    }
  }
}
