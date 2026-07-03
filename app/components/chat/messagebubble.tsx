"use client";

export default function MessageBubble({
  message,
}: {
  message: {
    sender: "user" | "tanner";
    text: string;
  };
}) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-3xl px-5 py-4 whitespace-pre-wrap ${
          isUser
            ? "bg-green-500 text-black font-semibold"
            : "glass text-white"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
