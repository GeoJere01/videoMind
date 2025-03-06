import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import OpenAI from "openai";
import { internal } from "./_generated/api";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const list = query({
  args: {
    videoId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const titles = await ctx.db
      .query("titles")
      .withIndex("by_user_and_video", (q) =>
        q.eq("userId", args.userId).eq("videoId", args.videoId)
      )
      .collect();

    // Get ratings for each title
    const titlesWithRatings = await Promise.all(
      titles.map(async (title) => {
        const ratings = await ctx.db
          .query("titleRatings")
          .withIndex("by_title", (q) => q.eq("titleId", title._id))
          .collect();

        const avgRating = ratings.length
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

        return {
          ...title,
          avgRating,
          totalRatings: ratings.length,
        };
      })
    );

    return titlesWithRatings;
  },
});

export const generate = mutation({
  args: {
    videoId: v.string(),
    userId: v.string(),
    title: v.string(),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Calculate title metrics
    const metrics = {
      clickbaitScore: calculateClickbaitScore(args.title),
      seoScore: calculateSEOScore(args.title),
      readabilityScore: calculateReadabilityScore(args.title),
    };

    const titleId = await ctx.db.insert("titles", {
      videoId: args.videoId,
      userId: args.userId,
      title: args.title,
      category: args.category,
      tags: args.tags,
      metrics,
    });

    return titleId;
  },
});

export const rateTitle = mutation({
  args: {
    titleId: v.id("titles"),
    userId: v.string(),
    rating: v.number(),
    feedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user has already rated this title
    const existingRating = await ctx.db
      .query("titleRatings")
      .withIndex("by_title_and_user", (q) =>
        q.eq("titleId", args.titleId).eq("userId", args.userId)
      )
      .first();

    if (existingRating) {
      // Update existing rating
      await ctx.db.patch(existingRating._id, {
        rating: args.rating,
        feedback: args.feedback,
      });
      return existingRating._id;
    }

    // Create new rating
    return await ctx.db.insert("titleRatings", {
      titleId: args.titleId,
      userId: args.userId,
      rating: args.rating,
      feedback: args.feedback,
      createdAt: new Date().toISOString(),
    });
  },
});

export const analyzeTitle = action({
  args: {
    titleId: v.id("titles"),
  },
  handler: async (ctx, args) => {
    const title = await ctx.runQuery(internal.titles.getTitle, {
      titleId: args.titleId,
    });
    if (!title || !title.title) throw new Error("Title not found or invalid");

    // Get existing analysis to avoid duplicates
    const existingAnalysis = await ctx.runQuery(
      internal.titles.getLatestAnalysis,
      { titleId: args.titleId }
    );

    // Only analyze if no recent analysis exists (within last hour)
    if (
      existingAnalysis &&
      Date.now() - new Date(existingAnalysis.timestamp).getTime() < 3600000
    ) {
      return existingAnalysis;
    }

    // Perform sentiment analysis using OpenAI
    const sentimentResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Analyze the sentiment, emotion, and intensity of this YouTube title.",
        },
        {
          role: "user",
          content: title.title,
        },
      ],
      temperature: 0.2,
    });

    const sentiment = parseSentimentResponse(
      sentimentResponse.choices[0].message.content || ""
    );

    // Extract and analyze keywords
    const keywordsResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Extract and analyze key terms from this YouTube title. Consider SEO relevance and search potential.",
        },
        {
          role: "user",
          content: title.title,
        },
      ],
      temperature: 0.2,
    });

    const keywords = parseKeywordsResponse(
      keywordsResponse.choices[0].message.content || ""
    );

    // Analyze target demographics
    const demographicsResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Analyze the target demographics for this YouTube title. Consider age groups, interests, and viewer types.",
        },
        {
          role: "user",
          content: title.title,
        },
      ],
      temperature: 0.2,
    });

    const demographics = parseDemographicsResponse(
      demographicsResponse.choices[0].message.content || ""
    );

    // Analyze competition and trends
    const competitionAndTrends = await analyzeCompetitionAndTrends(title.title);

    // Calculate performance metrics
    const performance = calculatePerformanceMetrics(title.title);

    // Store the analysis using a mutation
    const analysis = await ctx.runMutation(internal.titles.storeAnalysis, {
      titleId: args.titleId,
      sentiment,
      keywords,
      demographics,
      competition: competitionAndTrends.competition,
      trends: competitionAndTrends.trends,
      performance,
    });

    return analysis;
  },
});

export const getTitleAnalytics = query({
  args: {
    titleId: v.id("titles"),
  },
  handler: async (ctx, args) => {
    const title = await ctx.db.get(args.titleId);
    if (!title) throw new Error("Title not found");

    const analytics = await ctx.db
      .query("titleAnalytics")
      .withIndex("by_title", (q) => q.eq("titleId", args.titleId))
      .order("desc")
      .first();

    const ratings = await ctx.db
      .query("titleRatings")
      .withIndex("by_title", (q) => q.eq("titleId", args.titleId))
      .collect();

    return {
      title,
      metrics: title.metrics,
      analytics,
      ratings: {
        average: ratings.length
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0,
        count: ratings.length,
        distribution: calculateRatingDistribution(ratings),
      },
    };
  },
});

// Utility functions for title analysis
function calculateClickbaitScore(title: string): number {
  // Simple clickbait detection logic
  const clickbaitPhrases = [
    "you won't believe",
    "shocking",
    "amazing",
    "mind-blowing",
    "!!",
    "???",
  ];
  const containsClickbait = clickbaitPhrases.some((phrase) =>
    title.toLowerCase().includes(phrase)
  );
  return containsClickbait ? 0.5 : 1.0;
}

function calculateSEOScore(title: string): number {
  // Basic SEO scoring
  const length = title.length;
  if (length < 30) return 0.6;
  if (length > 60) return 0.7;
  return 1.0;
}

function calculateReadabilityScore(title: string): number {
  // Basic readability scoring
  const words = title.split(" ").length;
  if (words < 4) return 0.6;
  if (words > 15) return 0.7;
  return 1.0;
}

function calculateRatingDistribution(ratings: any[]): Record<number, number> {
  const distribution: Record<number, number> = {};
  for (const rating of ratings) {
    distribution[rating.rating] = (distribution[rating.rating] || 0) + 1;
  }
  return distribution;
}

// Helper functions for parsing AI responses
function parseSentimentResponse(response: string): {
  score: number;
  emotion: string;
  intensity: number;
} {
  // Implement parsing logic for sentiment response
  // This is a placeholder implementation
  return {
    score: 0.8,
    emotion: "positive",
    intensity: 0.7,
  };
}

function parseKeywordsResponse(
  response: string
): Array<{ word: string; relevance: number }> {
  // Implement parsing logic for keywords response
  // This is a placeholder implementation
  return [
    { word: "example", relevance: 0.9 },
    { word: "keyword", relevance: 0.8 },
  ];
}

function parseDemographicsResponse(
  response: string
): Array<{ group: string; affinity: number; confidence: number }> {
  // Implement parsing logic for demographics response
  // This is a placeholder implementation
  return [
    { group: "tech-savvy millennials", affinity: 0.85, confidence: 0.75 },
    { group: "gaming enthusiasts", affinity: 0.9, confidence: 0.8 },
  ];
}

async function analyzeCompetitionAndTrends(title: string) {
  // Implement competition and trends analysis
  // This is a placeholder implementation
  return {
    competition: {
      similarTitles: 150,
      competitionLevel: "moderate",
      recommendedChanges: ["Add more specificity", "Include trending terms"],
      competitiveGap: 0.3,
    },
    trends: [
      {
        trend: "AI Technology",
        alignment: 0.8,
        potential: 0.9,
        timeRelevance: "trending",
      },
    ],
  };
}

function calculatePerformanceMetrics(title: string) {
  // Implement performance metrics calculation
  // This is a placeholder implementation
  return {
    clarity: 0.85,
    engagement: 0.75,
    memorability: 0.8,
    brandAlignment: 0.7,
  };
}

// Add internal queries and mutations for the action to use
export const getTitle = query({
  args: { titleId: v.id("titles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.titleId);
  },
});

export const getLatestAnalysis = query({
  args: { titleId: v.id("titles") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("titleAnalytics")
      .withIndex("by_title", (q) => q.eq("titleId", args.titleId))
      .order("desc")
      .first();
  },
});

export const storeAnalysis = mutation({
  args: {
    titleId: v.id("titles"),
    sentiment: v.object({
      score: v.number(),
      emotion: v.string(),
      intensity: v.number(),
    }),
    keywords: v.array(
      v.object({
        word: v.string(),
        relevance: v.number(),
      })
    ),
    demographics: v.array(
      v.object({
        group: v.string(),
        affinity: v.number(),
        confidence: v.number(),
      })
    ),
    competition: v.object({
      similarTitles: v.number(),
      competitionLevel: v.string(),
      recommendedChanges: v.array(v.string()),
      competitiveGap: v.optional(v.number()),
    }),
    trends: v.array(
      v.object({
        trend: v.string(),
        alignment: v.number(),
        potential: v.number(),
        timeRelevance: v.string(),
      })
    ),
    performance: v.object({
      clarity: v.number(),
      engagement: v.number(),
      memorability: v.number(),
      brandAlignment: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("titleAnalytics", {
      titleId: args.titleId,
      timestamp: new Date().toISOString(),
      ...args,
    });
  },
});
