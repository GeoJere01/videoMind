"use client";

import { useUser } from "@clerk/nextjs";
import Usage from "./Usage";
import { FeatureFlag } from "@/features/flags";
import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Copy, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import TitleAnalytics from "./TitleAnalytics";

interface Title {
  _id: Id<"titles">;
  _creationTime: number;
  videoId: string;
  userId: string;
  title: string;
  avgRating: number;
  totalRatings: number;
  metrics?: {
    clickbaitScore: number;
    seoScore: number;
    readabilityScore: number;
  };
}

function TitleGeneration({ videoId }: { videoId: string }) {
  const { user } = useUser();
  const [selectedTitleId, setSelectedTitleId] = useState<Id<"titles"> | null>(
    null
  );
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});

  const titles = useQuery(api.titles.list, {
    videoId,
    userId: user?.id ?? "",
  }) as Title[] | undefined;

  const rateTitle = useMutation(api.titles.rateTitle);

  const { value: isTitleGenerationEnabled } = useSchematicEntitlement(
    FeatureFlag.TITLE_GENERATIONS
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // toast.success("Copied to clipboard");
  };

  const handleRating = async (titleId: Id<"titles">, rating: number) => {
    if (!user) return;

    await rateTitle({
      titleId,
      userId: user.id,
      rating,
    });

    setUserRatings((prev) => ({
      ...prev,
      [titleId]: rating,
    }));
  };

  return (
    <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
      <div className="min-w-52">
        <Usage featureFlag={FeatureFlag.TITLE_GENERATIONS} title="Titles" />
      </div>

      <div className="space-y-3 mt-4">
        {titles?.map((title: Title) => (
          <div key={title._id}>
            <div className="group relative p-4 rounded-lg border border-gray-100 bg-gray-50 hover:border-blue-100 hover:bg-blue-50 transition-all duration-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {title.title}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">
                        {title.avgRating.toFixed(1)} ({title.totalRatings})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleRating(title._id, rating)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                            userRatings[title._id] === rating
                              ? "bg-yellow-400 text-white"
                              : "bg-gray-200 hover:bg-yellow-200"
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(title.title)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 hover:bg-blue-100 rounded-md"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedTitleId(
                        selectedTitleId === title._id ? null : title._id
                      )
                    }
                    className="p-1.5 hover:bg-blue-100 rounded-md"
                    title="Show analytics"
                  >
                    {selectedTitleId === title._id ? (
                      <ChevronUp className="w-4 h-4 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {selectedTitleId === title._id && (
              <div className="mt-4 pl-4">
                <TitleAnalytics titleId={title._id} />
              </div>
            )}
          </div>
        ))}
      </div>

      {(!titles || titles.length === 0) && !!isTitleGenerationEnabled && (
        <div className="text-center py-8 px-4 rounded-lg mt-4 border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No titles have been generated yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Generate titles to see them appear here
          </p>
        </div>
      )}
    </div>
  );
}

export default TitleGeneration;
