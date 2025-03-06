"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  TrendingUp,
  Users,
  Target,
  BarChart,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface AdvancedTitleAnalyticsProps {
  titleId: Id<"titles">;
}

interface Keyword {
  word: string;
  relevance: number;
  searchVolume?: number;
  difficulty?: number;
}

interface Demographic {
  group: string;
  affinity: number;
  confidence: number;
}

interface Trend {
  trend: string;
  alignment: number;
  potential: number;
  timeRelevance: string;
}

interface Performance {
  clarity: number;
  engagement: number;
  memorability: number;
  brandAlignment?: number;
}

export default function AdvancedTitleAnalytics({
  titleId,
}: AdvancedTitleAnalyticsProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const analytics = useQuery(api.titles.getTitleAnalytics, { titleId });
  const analyze = useAction(api.titles.analyzeTitle);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      await analyze({ titleId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!analytics?.analytics) {
    return (
      <div className="text-center py-8">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
        >
          <RefreshCcw
            className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`}
          />
          {isAnalyzing ? "Analyzing..." : "Analyze Title"}
        </button>
      </div>
    );
  }

  const {
    sentiment,
    keywords,
    demographics,
    competition,
    trends,
    performance,
  } = analytics.analytics;

  return (
    <div className="space-y-6">
      {/* Sentiment Analysis */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          Sentiment Analysis
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {(sentiment.score * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-500">Sentiment Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold capitalize text-blue-600">
              {sentiment.emotion}
            </div>
            <div className="text-sm text-gray-500">Emotion</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {(sentiment.intensity * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-500">Intensity</div>
          </div>
        </div>
      </div>

      {/* Keywords */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
          Key Terms
        </h3>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword: Keyword, index: number) => (
            <div
              key={index}
              className="px-3 py-1 bg-purple-50 rounded-full flex items-center gap-2"
            >
              <span className="text-purple-700">{keyword.word}</span>
              <span className="text-sm text-purple-500">
                {(keyword.relevance * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Demographics */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-green-500" />
          Target Audience
        </h3>
        <div className="space-y-3">
          {demographics.map((demo: Demographic, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700">
                  {demo.group}
                </div>
                <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400"
                    style={{ width: `${demo.affinity * 100}%` }}
                  />
                </div>
              </div>
              <div className="ml-4 text-sm text-gray-500">
                {(demo.affinity * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competition & Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart className="w-5 h-5 text-red-500" />
            Competition
          </h3>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500">Similar Titles</div>
              <div className="text-xl font-bold text-gray-700">
                {competition.similarTitles}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Competition Level</div>
              <div className="text-xl font-bold capitalize text-gray-700">
                {competition.competitionLevel}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Recommended Changes</div>
              <ul className="mt-2 space-y-1">
                {competition.recommendedChanges.map(
                  (change: string, index: number) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 flex items-center gap-2"
                    >
                      <span className="w-1 h-1 bg-red-400 rounded-full" />
                      {change}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Trends
          </h3>
          <div className="space-y-4">
            {trends.map((trend: Trend, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700">
                    {trend.trend}
                  </div>
                  <div className="text-sm text-gray-500 capitalize">
                    {trend.timeRelevance}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-400"
                      style={{ width: `${trend.alignment * 100}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {(trend.potential * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(performance as Performance).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {(value * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-500 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="px-4 py-2 text-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <RefreshCcw
            className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`}
          />
          {isAnalyzing ? "Updating Analysis..." : "Update Analysis"}
        </button>
      </div>
    </div>
  );
}
