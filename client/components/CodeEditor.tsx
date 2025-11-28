import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CodeEditor({
  value,
  onChange,
  placeholder,
  className = "",
}: CodeEditorProps) {
  const lines = value.split("\n").length;
  const lineNumbers = Array.from({ length: Math.max(lines, 1) }, (_, i) =>
    i + 1
  );

  return (
    <div className="relative border border-gray-600 rounded-md bg-gray-900/50 overflow-hidden">
      <div className="flex">
        <div className="bg-gray-950 text-gray-500 text-sm font-mono px-3 py-2 text-right border-r border-gray-600 select-none">
          {lineNumbers.map((num) => (
            <div key={num} className="h-6 leading-6">
              {num}
            </div>
          ))}
        </div>
        <div className="flex-1 relative">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`absolute inset-0 resize-none border-0 rounded-none bg-transparent text-white placeholder:text-gray-500 font-mono text-sm p-2 ${className}`}
            style={{
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              lineHeight: "1.5rem",
            }}
          />
          <div
            className="invisible text-white font-mono text-sm p-2 pointer-events-none whitespace-pre-wrap break-words"
            style={{
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              lineHeight: "1.5rem",
            }}
          >
            {value}
            {"\n"}
          </div>
        </div>
      </div>
    </div>
  );
}
