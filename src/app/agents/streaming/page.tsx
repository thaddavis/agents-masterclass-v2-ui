import { chatReducer, initialState } from "@/app/agents/streaming/ChatReducer";
import { useReducer } from "react";

export default function Page() {
  const [chat, dispatch] = useReducer(chatReducer, initialState);

  return <div>Streaming</div>;
}
