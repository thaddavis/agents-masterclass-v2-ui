import assert from "assert";

export async function callCompletionAgent(prompt: string) {
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_AGENT_API_URL}/completion-agent/completion`,
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

  assert(resp.ok, "Network response was not OK");

  return resp;
}
