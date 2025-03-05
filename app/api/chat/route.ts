import { NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { openai } from "@ai-sdk/openai";

// import { createAnthropic } from "@ai-sdk/anthropic";
const openAi = createOpenAI({
  compatibility: "strict",
});

const model = openai("gpt-4o");

import { streamText, tool } from "ai";
import { currentUser } from "@clerk/nextjs/server";
import { getVideoDetails } from "@/actions/getVideoDetails";
import fetchTranscript from "@/tools/fetchTranscript";

export async function POST(req: Request) {
  const { messages, videoId } = await req.json();

  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const videoDetails = await getVideoDetails(videoId);

  const systemMessage = `Your name is Mr. Jere. You are an AI Agent ready to accept questions from the user about ONE
     specific video. The video ID in question is ${videoId} but you'll refer to this as ${
    videoDetails?.title || "selected video"
  }. use emojis to make the conversation more engaging.
    If an error occurs, explain it to the user and ask them
     to try again later. If the error suggest the user upgrade,
      explain that they must upgrade to use the feature, tell 
      them to go to 'Manage Plan' in the header and upgrade.
       If any tool is used, analyze the response and if it 
       contains a cache, explain that the transcript is cached
        because they previously transcribed the video saving the 
        user a token - use words like database instead of cache
         to make it more easy to understand. Format for notion`;

  const result = streamText({
    model,
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      ...messages,
    ],
    tools: { fetchTranscript: fetchTranscript },
  });

  return result.toDataStreamResponse();
}
