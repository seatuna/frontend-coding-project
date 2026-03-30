"use client";

import { useState, useRef, useEffect } from "react";
import { Message, StreamEvent } from "../types";

type StreamState = {
  isLoading: boolean;
  error: string | null;
  isAborted: boolean;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamState, setStreamState] = useState<StreamState>({ isLoading: false, error: null, isAborted: false });
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup function to abort the stream if the component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const parseStream = async (
    response: Response,
    onEvent: (event: StreamEvent) => void
  ) => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No response body");
    }

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const jsonStr = line.slice(6);
            const event = JSON.parse(jsonStr) as StreamEvent;
            onEvent(event);
          } catch (e) {
            console.error("Failed to parse SSE event:", e);
          }
        }
      }
    }
  };

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt.trim(),
    };

    // Adds the user's prompt to the messages array
    setMessages((prev) => [...prev, userMessage]);
    setStreamState((prev) => ({ ...prev, isLoading: true, error: null, isAborted: false }));

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("https://api.example.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
      };

      await parseStream(response, (event) => {
        switch (event.type) {
          case "text":
            assistantMessage.content += event.content;
            setMessages((prev) => {
              // replace the last assistant message with the updated stream response
              const lastMsg = prev[prev.length - 1];
              if (lastMsg && lastMsg.role === "assistant" && lastMsg.id === assistantMessage.id) {
                return [...prev.slice(0, -1), { ...assistantMessage }];
              } else {
                return [...prev, { ...assistantMessage }];
              }
            });
            break;
          case "done":
            setStreamState((prev) => ({ ...prev, isLoading: false }));
            break;
          case "error":
            setStreamState((prev) => ({ ...prev, isLoading: false, error: event.message }));
            break;
        }
      });

      setStreamState((prev) => ({ ...prev, isLoading: false }));
    } catch (err: any) {
      setStreamState((prev) => ({ ...prev, isLoading: false, error: err.message || "An error occurred, please try again." }));
    } finally {
      abortControllerRef.current = null;
    }
  };

  const stopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setStreamState((prev) => ({ ...prev, isLoading: false, isAborted: true }));
    }
  };

  return {
    messages,
    isLoading: streamState.isLoading,
    error: streamState.error,
    isAborted: streamState.isAborted,
    sendMessage,
    stopStream,
  };
}
