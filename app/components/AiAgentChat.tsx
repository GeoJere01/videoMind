"use client";

import { Button } from "@/components/ui/button";
import { FeatureFlag } from "@/features/flags";
import { Message, useChat } from "@ai-sdk/react";
import { useSchematicFlag } from "@schematichq/schematic-react";
import { ImageIcon, LetterText, Pencil, PenIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  result?: Record<string, unknown>;
}
interface ToolPart {
  type: "tool-invocation";
  toolInvocation: ToolInvocation;
}
const formartToolInvocation = (part: ToolPart) => {
  if (!part.toolInvocation) return "Uknown Tool";
  return `🔧 Tool used: ${part.toolInvocation.toolName}`;
};

function AiAgentChat({ videoId }: { videoId: string }) {
  const { messages, input, handleInputChange, handleSubmit, append, status } =
    useChat({
      maxSteps: 5,
      body: {
        videoId,
      },
    });

  const isScriptGenerationEnabled = useSchematicFlag(
    FeatureFlag.SCRIPT_GENERATION
  );
  const isImageGenrationEnabled = useSchematicFlag(
    FeatureFlag.IMAGE_GENERATION
  );
  const isTitleGenerationEnabled = useSchematicFlag(
    FeatureFlag.TITLE_GENERATIONS
  );
  const isVideoAnalysisEnabled = useSchematicFlag(FeatureFlag.ANALYZE_VIDEO);

  const generateScript = async () => {
    const randomId = Math.random().toString(36).substring(2, 15);

    const userMessage: Message = {
      id: `generate-script-${randomId}`,
      role: "user",
      content:
        "Generate a step-by-step shooting script for this video that i can use on my own channel to produce a video that is similar to this one, do not do any other steps such as generating an image, just generate the script only!",
    };
    append(userMessage);
  };

  const generateTitle = async () => {
    const randomId = Math.random().toString(36).substring(2, 15);

    const userMessage: Message = {
      id: `generate-title-${randomId}`,
      role: "user",
      content: "Generate a title for this video",
    };
    append(userMessage);
  };

  const generateImage = async () => {
    const randomId = Math.random().toString(36).substring(2, 15);

    const userMessage: Message = {
      id: `generate-image-${randomId}`,
      role: "user",
      content: "Generate a thumbnail for this video",
    };
    append(userMessage);
  };
  return (
    <div className="flex flex-col h-full">
      <div className="hidden lg:block px-4 pb-3 border-b border-gray-100">
        <h2 className="txt-lg font-semibold text-gray-800">AI Agent</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-6">
          {messages.length == 0 && (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-gray-700">
                  Welcome to AI Agent Chat
                </h3>
                <p className="text-sm text-gray-500">
                  Ask any question about your video!
                </p>
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] ${
                  m.role === "user" ? "bg-blue-500" : "bg-gray-100"
                } rounded-2xl px-4 py-3`}
              >
                {m.parts.map((part, i) =>
                  part.type === "text" ? (
                    <div
                      key={i}
                      className={`${
                        m.role === "user" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : part.type === "tool-invocation" ? (
                    <div
                      key={i}
                      className="bg-white/50 rounded-lg p-2 space-y-2 text-gray-800"
                    >
                      <div className="font-medium text-xs">
                        {formartToolInvocation(part as ToolPart)}
                      </div>
                      {(part as ToolPart).toolInvocation.result && (
                        <pre className="text-xs bg-white/75 p-2 rounded overflow-auto max-h-40">
                          {JSON.stringify(
                            (part as ToolPart).toolInvocation.result,
                            null,
                            2
                          )}
                        </pre>
                      )}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 p-4 bg-white">
        <div className="space-y-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={
                !isVideoAnalysisEnabled
                  ? "upgrade to ask anything about your video..."
                  : "Ask anything about your video..."
              }
              type="text"
              value={input}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              disabled={
                status === "streaming" ||
                status === "submitted" ||
                !isVideoAnalysisEnabled
              }
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "streaming"
                ? "AI is replying..."
                : status === "submitted"
                ? "AI is thinking..."
                : "Send"}
            </Button>
          </form>

          <div className="flex gap-2">
            <button
              className="text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={generateScript}
              type="button"
              disabled={!isScriptGenerationEnabled}
            >
              <Pencil className="w-4 h-4" />
              Generate Script
            </button>

            <button
              className="text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={generateTitle}
              type="button"
              disabled={!isScriptGenerationEnabled}
            >
              <PenIcon className="w-4 h-4" />
              Generate Title
            </button>

            <button
              className="text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={generateImage}
              type="button"
              disabled={!isScriptGenerationEnabled}
            >
              <ImageIcon className="w-4 h-4" />
              Generate Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiAgentChat;
