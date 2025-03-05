"use server";

import { redirect } from "next/navigation";

function getVideoIdFromUrl(url: string): string | null {
  if (!url) return null;

  // Extract video ID from various YouTube URL formats
  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#&?]*)/,
    /youtube\.com\/shorts\/([^#&?]*)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export async function analyseYoutuVideo(formData: FormData) {
  const url = formData.get("url")?.toString();
  if (!url) return;

  const videoId = getVideoIdFromUrl(url);
  console.log("video log is >>> ", videoId);
  if (!videoId) return;

  redirect(`/video/${videoId}/analysis`);
}
