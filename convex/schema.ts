import { timeStamp } from "console";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  videos: defineTable({
    videoId: v.string(),
    userId: v.string(),
    viewCount: v.optional(v.number()),
    lastAnalyzed: v.optional(v.string()),
    analyticsData: v.optional(
      v.object({
        engagement: v.number(),
        viewTrend: v.number(),
        performance: v.number(),
      })
    ),
  })
    .index("by_user_id", ["userId"])
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"]),

  titleAnalytics: defineTable({
    titleId: v.id("titles"),
    timestamp: v.string(),
    sentiment: v.object({
      score: v.number(),
      emotion: v.string(),
      intensity: v.number(),
    }),
    keywords: v.array(
      v.object({
        word: v.string(),
        relevance: v.number(),
        searchVolume: v.optional(v.number()),
        difficulty: v.optional(v.number()),
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
  })
    .index("by_title", ["titleId"])
    .index("by_title_and_time", ["titleId", "timestamp"]),

  transcript: defineTable({
    videoId: v.string(),
    userId: v.string(),
    transcript: v.array(
      v.object({
        text: v.string(),
        timestamp: v.string(),
      })
    ),
  })
    .index("by_user_id", ["userId"])
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"]),

  images: defineTable({
    storageId: v.id("_storage"),
    videoId: v.string(),
    userId: v.string(),
  })
    .index("by_user_id", ["userId"])
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"]),

  titles: defineTable({
    videoId: v.string(),
    userId: v.string(),
    title: v.string(),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    metrics: v.optional(
      v.object({
        clickbaitScore: v.number(),
        seoScore: v.number(),
        readabilityScore: v.number(),
      })
    ),
  })
    .index("by_user_id", ["userId"])
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"])
    .index("by_category", ["category"]),

  titleRatings: defineTable({
    titleId: v.id("titles"),
    userId: v.string(),
    rating: v.number(),
    feedback: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_title", ["titleId"])
    .index("by_user", ["userId"])
    .index("by_title_and_user", ["titleId", "userId"]),

  analytics: defineTable({
    videoId: v.string(),
    userId: v.string(),
    timestamp: v.string(),
    metrics: v.object({
      views: v.number(),
      likes: v.number(),
      comments: v.number(),
      retention: v.optional(v.number()),
      engagement: v.optional(v.number()),
    }),
    trends: v.optional(
      v.array(
        v.object({
          date: v.string(),
          views: v.number(),
        })
      )
    ),
  })
    .index("by_video", ["videoId"])
    .index("by_user", ["userId"])
    .index("by_video_and_date", ["videoId", "timestamp"]),
});
