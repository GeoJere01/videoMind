"use client";

import { useUser } from "@clerk/nextjs";
import Usage from "./Usage";
import { FeatureFlag } from "@/features/flags";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";

function ThumbnailGeneration({ videoId }: { videoId: string }) {
  const { user } = useUser();
  const [imageLoadErrors, setImageLoadErrors] = useState<
    Record<string, boolean>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  const images = useQuery(api.images.getImages, {
    videoId,
    userId: user?.id ?? "",
  });

  // Reset error state when images change
  useEffect(() => {
    if (images) {
      setIsLoading(false);
      setImageLoadErrors({});
    }
  }, [images]);

  const handleImageError = (imageId: string) => {
    setImageLoadErrors((prev) => ({
      ...prev,
      [imageId]: true,
    }));
  };

  return (
    <div className="rounded-xl flex flex-col p-4 border">
      <div className="min-w-52">
        <Usage
          featureFlag={FeatureFlag.IMAGE_GENERATION}
          title="Thumbnail Generation"
        />
      </div>

      <div className={`flex overflow-x-auto gap-4 ${images?.length && "mt-4"}`}>
        {images?.map(
          (image) =>
            image.url &&
            !imageLoadErrors[image._id] && (
              <div
                key={image._id}
                className="flex-none w-[200px] h-[110px] rounded-lg overflow-hidden relative"
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                )}
                <Image
                  src={image.url}
                  alt="generated image"
                  width={200}
                  height={200}
                  className="object-cover"
                  loading="lazy"
                  onError={() => handleImageError(image._id)}
                  sizes="200px"
                  quality={75}
                />
              </div>
            )
        )}
      </div>

      {(!images?.length || (images.length === 0 && !isLoading)) && (
        <div className="text-center py-4 rounded-lg mt-4 border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No thumbnails have been generated yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Generate thumbnails to see them appear here
          </p>
        </div>
      )}
    </div>
  );
}

export default ThumbnailGeneration;
