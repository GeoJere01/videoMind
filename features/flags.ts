export enum FeatureFlag {
  TRANSCRIPTION = "transcriptions",
  IMAGE_GENERATION = "image-generation",
  ANALYZE_VIDEO = "analyze-video",
  TITLE_GENERATIONS = "title-generations",
  SCRIPT_GENERATION = "script-generation",
}

export const featureFlagEvents: Record<FeatureFlag, { event: string }> = {
  [FeatureFlag.TRANSCRIPTION]: {
    event: "transcribe",
  },
  [FeatureFlag.IMAGE_GENERATION]: {
    event: "generate-image",
  },
  [FeatureFlag.ANALYZE_VIDEO]: {
    event: "analyze-video",
  },
  [FeatureFlag.TITLE_GENERATIONS]: {
    event: "generate-title",
  },
  [FeatureFlag.SCRIPT_GENERATION]: {
    event: "",
  },
};
