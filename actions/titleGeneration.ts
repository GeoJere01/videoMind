"use server";

import { api } from "@/convex/_generated/api";
import { FeatureFlag, featureFlagEvents } from "@/features/flags";
import getConvexClient from "@/lib/convex";
import { client } from "@/lib/schematic";
import { currentUser } from "@clerk/nextjs/server";
import OpenAI from "openai";

const convexClient = getConvexClient();

export async function titleGeneration(
  videoId: string,
  videoSummary: string,
  consideration: string
) {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not found");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    console.log("video summary", videoSummary);
    console.log("Generating title for video for videoId", videoId);
    console.log("Considerations", consideration);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "you are a helpful youtube video creator assistant that creates high quality SEO friendly concise video title",
        },
        {
          role: "user",
          content: `Please provide ONE concise youtube title (and nothing else) for this video. focus on the main points and key takeaways, it should be SEO friendly and 100 characters or less: \n\n${videoSummary} \n\n${consideration}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const title =
      response.choices[0]?.message?.content || "unable to generate title";

    if (!title) {
      return {
        error: "failed to generate title",
      };
    }

    await convexClient.mutation(api.titles.generate, {
      videoId,
      userId: user.id,
      title: title,
    });

    await client.track({
      event: featureFlagEvents[FeatureFlag.TITLE_GENERATIONS].event,
      company: {
        id: user.id,
      },
      user: {
        id: user.id,
      },
    });

    console.log("title generated", title);
  } catch (error) {
    console.log("Error generating title", error);
    throw new Error("Failed to generate title");
  }
}
