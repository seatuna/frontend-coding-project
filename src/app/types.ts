export type StreamEvent =
  | { type: "status"; message: string }
  | { type: "text"; content: string }
  | { type: "tool_start"; tool: string }
  | { type: "tool_result"; tool: string; result: string }
  | { type: "citation"; title: string; url: string }
  | { type: "done" }
  | { type: "error"; message: string };

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
}
