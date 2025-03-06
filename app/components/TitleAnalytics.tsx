"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Star, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import AdvancedTitleAnalytics from "./AdvancedTitleAnalytics";

interface TitleAnalyticsProps {
  titleId: Id<"titles">;
}

interface TitleAnalytics {
  title: {
    _id: Id<"titles">;
    title: string;
    metrics?: {
      clickbaitScore: number;
      seoScore: number;
      readabilityScore: number;
    };
  };
  metrics?: {
    clickbaitScore: number;
    seoScore: number;
    readabilityScore: number;
  };
  ratings: {
    average: number;
    count: number;
    distribution: Record<number, number>;
  };
}

export default function TitleAnalytics({ titleId }: TitleAnalyticsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const analytics = useQuery(api.titles.getTitleAnalytics, {
    titleId,
  }) as TitleAnalytics | undefined;

  if (!analytics) return null;

  const {
    metrics = { seoScore: 0, clickbaitScore: 0, readabilityScore: 0 },
    ratings,
  } = analytics;

  return (
    <div className="space-y-6">
      {/* Basic Metrics */}
      <div className="space-y-6">
        {/* Title Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="SEO Score"
            value={metrics.seoScore}
            icon={<TrendingUp className="w-5 h-5" />}
            description="How well your title is optimized for search"
          />
          <MetricCard
            title="Clickbait Score"
            value={metrics.clickbaitScore}
            icon={<AlertCircle className="w-5 h-5" />}
            description="Balance between engagement and authenticity"
          />
          <MetricCard
            title="Readability"
            value={metrics.readabilityScore}
            icon={<CheckCircle className="w-5 h-5" />}
            description="How easy your title is to read and understand"
          />
        </div>

        {/* Ratings Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Community Ratings</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <span className="text-2xl font-bold">
                {ratings.average.toFixed(1)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Based on {ratings.count} ratings
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="mt-4 space-y-2">
            {Object.entries(ratings.distribution)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([rating, count]) => (
                <div key={rating} className="flex items-center gap-2">
                  <div className="w-12 text-sm text-gray-600">{rating} ★</div>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${(count / ratings.count) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="w-12 text-sm text-gray-600 text-right">
                    {count}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Advanced Analytics Toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 py-2 text-blue-500 hover:text-blue-600 flex items-center gap-2"
        >
          {showAdvanced ? "Hide Advanced Analytics" : "Show Advanced Analytics"}
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
            AI-Powered
          </span>
        </button>
      </div>

      {/* Advanced Analytics */}
      {showAdvanced && (
        <div className="mt-8">
          <AdvancedTitleAnalytics titleId={titleId} />
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}

function MetricCard({ title, value, icon, description }: MetricCardProps) {
  const percentage = Math.round(value * 100);
  const getColorClass = (value: number) => {
    if (value >= 0.8) return "text-green-600";
    if (value >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className={getColorClass(value)}>{icon}</span>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className={`text-2xl font-bold ${getColorClass(value)}`}>
        {percentage}%
      </div>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
}
