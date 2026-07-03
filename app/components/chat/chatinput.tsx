"use client";

type Props = {
  value: string;
  thinking: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
};

export default function ChatInput({
  value,
  thinking,
  onChange,
  onSend,
}: Props) {
  return (
    <div className="border-t border-white/10 p-5">
      <div className="flex gap-4">
        <input
          className="glass flex-1 rounded-2xl px-5 py-4 outline-none"
          placeholder="Ask Tanner anything..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
        />

        <button
          onClick={onSend}
          disabled={thinking}
          className="button-primary"
        >
          Send
        </button>
      </div>
    </div>
  );
}
