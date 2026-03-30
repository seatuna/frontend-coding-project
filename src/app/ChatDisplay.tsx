import { Message } from "./types";
import styles from "./ChatDisplay.module.css";

type ChatDisplayProps = {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isAborted: boolean;
};

export default function ChatDisplay({ messages, isLoading, error }: ChatDisplayProps) {
  return (
    <div className={styles.chatContainer}>
      {messages.map((message) => (
        <div key={message.id} className={message.role === "user" ? styles.userMessage : styles.assistantMessage}>
          <p className={styles.messageContent}>{message.content}</p>
        </div>
      ))}
      {isLoading && <div className={styles.loading}>🧠 Thinking...</div>}
      {error && <div className={styles.error}>❌ {error}</div>}
    </div>
  );
}