"use server";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { FeatureFlag, featureFlagEvents } from "@/features/flags";
import checkFeatureUsageLimit from "@/lib/checkFeatureUsageLimit";
import getConvexClient from "@/lib/convex";
import { client } from "@/lib/schematic";
import { currentUser } from "@clerk/nextjs/server";

export interface VideoResponse {
  success: boolean;
  data?: Doc<"videos">;
  error?: string;
}

export const createOrGetVideo = async (
  videoId: string,
  userId: string
): Promise<VideoResponse> => {
  const convex = getConvexClient();
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      error: "user not found",
    };
  }

  const featureCheck = await checkFeatureUsageLimit(
    user.id,
    featureFlagEvents[FeatureFlag.ANALYZE_VIDEO].event
  );

  if (!featureCheck.success) {
    return {
      success: false,
      error: featureCheck.error,
    };
  }

  try {
    const video = await convex.query(api.videos.getVideoById, {
      videoId,
      userId,
    });

    if (!video) {
      console.log(
        `analyse event for the video ${videoId} - token will be spent`
      );

      const newVideo = await convex.query(api.videos.getVideoById, {
        videoId,
        userId,
      });

      console.log("Tracking analyze video content");
      await client.track({
        event: featureFlagEvents[FeatureFlag.ANALYZE_VIDEO].event,
        company: {
          id: userId,
        },
        user: {
          id: userId,
        },
      });

      return {
        success: true,
        data: newVideo!,
      };
    } else {
      console.log("video exists - no token needs to be spent");
      return {
        success: true,
        data: video,
      };
    }
  } catch (error) {
    console.error("Error fetching or getting videos", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
};
