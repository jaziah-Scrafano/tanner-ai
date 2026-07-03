type Message = {
  sender: "user" | "tanner";
  text: string;
};

export default function MessageBubble({
  message,
}: {
  message: Message;
}) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      } animate-[fadeIn_.25s_ease]`}
    >
      <div
        className={`relative max-w-[85%] rounded-3xl border px-6 py-5 backdrop-blur-xl transition-all duration-300

        ${
          isUser
            ? `
              border-green-400/30
              bg-gradient-to-br
              from-green-500/20
              to-cyan-500/10
              shadow-[0_0_30px_rgba(57,255,136,.18)]
            `
            : `
              border-cyan-400/20
              bg-slate-950/80
              shadow-[0_0_30px_rgba(34,211,238,.12)]
            `
        }`}
      >
        {/* Header */}

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-lg

              ${
                isUser
                  ? "bg-green-400/20"
                  : "bg-cyan-400/20"
              }`}
            >
              {isUser ? "👤" : "🧠"}
            </div>

            <div>
              <div
                className={`text-xs font-black uppercase tracking-[0.25em]

                ${
                  isUser
                    ? "text-green-300"
                    : "text-cyan-300"
                }`}
              >
                {isUser ? "You" : "Tanner AI"}
              </div>

              <div className="text-[10px] text-zinc-500">
                {new Date().toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Message */}

        <div
          className="
            whitespace-pre-wrap
            break-words
            text-[15px]
            leading-8
            text-zinc-100
            selection:bg-cyan-500/40
          "
        >
          {message.text}
        </div>

        {/* Bottom Glow */}

        <div
          className={`pointer-events-none absolute bottom-0 left-8 right-8 h-px

          ${
            isUser
              ? "bg-gradient-to-r from-transparent via-green-400/70 to-transparent"
              : "bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
          }`}
        />
      </div>
    </div>
  );
}
