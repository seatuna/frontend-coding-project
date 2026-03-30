"use client";

import styles from "./page.module.css";
import UserInput from "./ChatTextarea";
import { useChat } from "./hooks/useChat";
import ChatDisplay from "./ChatDisplay";
import { useEffect, useRef } from "react";

export default function Home() {
  const { messages, isLoading, error, isAborted, sendMessage, stopStream } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView();
    }
  }, [messages]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>To get started, type something</h1>
        </div>
        <ChatDisplay messages={messages} isLoading={isLoading} error={error} isAborted={isAborted} />
        <div ref={bottomRef} />
        <UserInput isLoading={isLoading} onSendMessage={sendMessage} stopStream={stopStream} />
      </main>
    </div>
  );
}
