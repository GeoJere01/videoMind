"use server";

import { google } from "googleapis";
import { VideoDetails } from "@/types/types";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

export async function getVideoDetails(videoId: string) {
  console.log("Fetching video details for:", videoId);

  try {
    const videoResponse = await youtube.videos.list({
      part: ["statistics", "snippet"],
      id: [videoId],
    });

    const videoDetails = videoResponse.data.items?.[0];

    if (!videoDetails) throw new Error("video not found");

    const channelResponse = await youtube.channels.list({
      part: ["statistics", "snippet"],
      id: [videoDetails.snippet?.channelId || ""],
      key: process.env.YOUTUBE_API_KEY,
    });

    const channelDetails = channelResponse.data.items?.[0];

    console.log("video details fetched successfully");

    const video: VideoDetails = {
      title: videoDetails.snippet?.title || "Unknown title",
      thumbnail:
        videoDetails.snippet?.thumbnails?.maxres?.url ||
        videoDetails.snippet?.thumbnails?.high?.url ||
        videoDetails.snippet?.thumbnails?.default?.url ||
        "",
      publishedAt:
        videoDetails.snippet?.publishedAt || new Date().toISOString(),

      views: videoDetails.statistics?.viewCount || "0",
      likes: videoDetails.statistics?.likeCount || "Not avilable",
      comments: videoDetails.statistics?.commentCount || "Not available",

      channel: {
        title: videoDetails.snippet?.channelTitle || "Unkown channel",
        thumbnail: channelDetails?.snippet?.thumbnails?.default?.url || "",
        subscribers: channelDetails?.statistics?.subscriberCount || "0",
      },
    };

    return video;
  } catch (error) {
    console.error("Error fetching video details", error);
    return null;
  }
}
