"use server";

import { api } from "@/convex/_generated/api";
import { FeatureFlag, featureFlagEvents } from "@/features/flags";
import getConvexClient from "@/lib/convex";
import { client } from "@/lib/schematic";
import { currentUser } from "@clerk/nextjs/server";
import OpenAI from "openai";

// Enhanced timeout and retry configuration
const IMAGE_SIZE = "1792x1024" as const;
const FETCH_TIMEOUT = 45000; // 45 seconds
const DALLE_TIMEOUT = 60000; // 60 seconds for DALL-E generation
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 8000;
const convexClient = getConvexClient();

// Cache successful operations
const operationCache = new Map<string, { result: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = FETCH_TIMEOUT
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function retryOperation<T>(
  operation: () => Promise<T>,
  operationKey?: string,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> {
  // Check cache if key provided
  if (operationKey) {
    const cached = operationCache.get(operationKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`Using cached result for ${operationKey}`);
      return cached.result;
    }
  }

  try {
    const result = await operation();
    // Cache successful result if key provided
    if (operationKey) {
      operationCache.set(operationKey, { result, timestamp: Date.now() });
    }
    return result;
  } catch (error) {
    if (retries > 0) {
      console.log(
        `Retrying operation, ${retries} attempts remaining. Delay: ${delay}ms`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      // Exponential backoff with max delay
      const nextDelay = Math.min(delay * 2, MAX_RETRY_DELAY);
      return retryOperation(operation, operationKey, retries - 1, nextDelay);
    }
    throw error;
  }
}

export const dalleImageGeneration = async (prompt: string, videoId: string) => {
  try {
    const user = await currentUser();

    if (!user?.id) {
      throw new Error("User not found!");
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: DALLE_TIMEOUT,
    });

    if (!prompt) {
      throw new Error("Failed to generate image prompt");
    }

    console.log("Generating image with prompt", prompt);

    // Cache key for this specific image generation
    const cacheKey = `dalle-${videoId}-${prompt}`;

    const imageResponse = await retryOperation(async () => {
      return await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: IMAGE_SIZE,
        quality: "hd",
        style: "natural",
      });
    }, cacheKey);

    const imageUrl = imageResponse.data[0]?.url;

    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }

    console.log("getting upload URL...");
    const postUrl = await retryOperation(
      () => convexClient.mutation(api.images.generateUploadUrl),
      `upload-url-${videoId}`
    );

    console.log("downloading image from DALL-E");
    const image: Blob = await retryOperation(async () => {
      const response = await fetchWithTimeout(imageUrl);
      return response.blob();
    }, `download-${videoId}-${imageUrl}`);
    console.log("image downloaded successfully!");

    console.log("uploading image to storage");
    const result = await retryOperation(async () => {
      const response = await fetchWithTimeout(postUrl, {
        method: "POST",
        headers: {
          "Content-Type": image.type,
        },
        body: image,
      });
      return response;
    }, `upload-${videoId}-${postUrl}`);

    const { storageId } = await result.json();
    console.log("storage id", storageId);

    console.log("saving image reference to the database");
    await retryOperation(
      () =>
        convexClient.mutation(api.images.storeImage, {
          storageId: storageId,
          videoId,
          userId: user.id,
        }),
      `store-${videoId}-${storageId}`
    );
    console.log("saved reference image to database");

    const dbImageUrl = await retryOperation(
      () =>
        convexClient.query(api.images.getImages, {
          videoId,
          userId: user.id,
        }),
      `get-images-${videoId}`
    );

    await client.track({
      event: featureFlagEvents[FeatureFlag.IMAGE_GENERATION].event,
      company: {
        id: user.id,
      },
      user: {
        id: user.id,
      },
    });

    return {
      imageUrl: dbImageUrl,
      success: true,
    };
  } catch (error) {
    console.error("Error in dalleImageGeneration:", error);
    return {
      imageUrl: null,
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
