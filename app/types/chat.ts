export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

export interface DogProfile {
  breed: string;
  age: string;
  name?: string;
}

export interface ChatRequest {
  messages: { role: Role; content: string }[];
  dogProfile: DogProfile;
}

export interface ChatResponse {
  reply: string;
  error?: string;
}
