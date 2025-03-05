"use client";

import { createOrGetVideo } from "@/actions/createOrGetVideo";
import AiAgentChat from "@/app/components/AiAgentChat";
import ThumbnailGeneration from "@/app/components/ThumbnailGeneration";
import TitleGeneration from "@/app/components/TitleGeneration";
import Transcription from "@/app/components/Transcription";
import Usage from "@/app/components/Usage";
import YoutubeVideoDetails from "@/app/components/YoutubeVideoDetails";
import { Doc } from "@/convex/_generated/dataModel";
import { FeatureFlag } from "@/features/flags";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function Analysispage() {
  const params = useParams<{ videoId: string }>();
  const { videoId } = params;
  const { user } = useUser();
  const [video, setVideo] = useState<Doc<"videos"> | null | undefined>(
    undefined
  );

  useEffect(() => {
    if (!user?.id) return;

    const fetchVideo = async () => {
      const response = await createOrGetVideo(videoId as string, user.id);
      if (!response.success) {
        // toast.error("Error creating or getting video", {
        //   description: response.error,
        //   duration: 10000,
        // });
      } else {
        setVideo(response.data!);
      }
    };

    fetchVideo();
  }, [videoId, user]);

  return (
    <div className="xl:container mx-auto px-4 md:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left side */}
        <div className="order-2 lg:order-1 flex flex-col gap-4 bg-white lg:border-r border-gray-200 p-6">
          <div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-xl">
            <Usage
              featureFlag={FeatureFlag.ANALYZE_VIDEO}
              title="Analyze video"
            />
          </div>

          <YoutubeVideoDetails videoId={videoId} />
          <ThumbnailGeneration videoId={videoId} />
          <TitleGeneration videoId={videoId} />
          <Transcription videoId={videoId} />
        </div>
        {/* Right side */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-20 h-[500px] md:h-[calc(100vh-6rem)]">
          <AiAgentChat videoId={videoId} />
        </div>
      </div>
    </div>
  );
}

export default Analysispage;
