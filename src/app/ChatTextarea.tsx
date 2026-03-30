"use client";

import { useRef, useState } from "react";
import styles from "./ChatTextarea.module.css";

type ChatTextareaProps = {
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  stopStream: () => void;
};

export default function ChatTextarea({ isLoading, onSendMessage, stopStream }: ChatTextareaProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = "inherit";
      const scrollHeight = inputRef.current.scrollHeight;
      inputRef.current.style.height = scrollHeight + "px";
    }
  };

  const handleSendMessage = () => {
    onSendMessage(inputValue);
    setInputValue("");
  };

  return (
    <>
      <div className={styles.chat}>
        <textarea placeholder="Start typing..." ref={inputRef} value={inputValue} onChange={handleChange} rows={1} />
      </div>
      <div className={styles.buttonContainer}>
        {isLoading && <button className={styles.button} onClick={stopStream}>Stop</button>}
        <button className={styles.button} onClick={handleSendMessage}>Send</button>
      </div>
    </>
  );
}