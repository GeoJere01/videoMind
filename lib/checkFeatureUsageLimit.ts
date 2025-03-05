import { featureFlagEvents } from "@/features/flags";
import { client } from "./schematic";

const checkFeatureUsageLimit = async (
  userId: string,
  eventSubtype: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const entitlements = await client.entitlements.getFeatureUsageByCompany({
      keys: {
        id: userId,
      },
    });

    const feature = entitlements.data.features.find(
      (entitlement) => entitlement.feature?.eventSubtype === eventSubtype
    );

    if (!feature) {
      return {
        success: false,
        error:
          "This feature is not available on your current plan, please upgrade to continue",
      };
    }

    const { usage, allocation } = feature;

    if (usage === undefined || allocation === undefined) {
      return {
        success: false,
        error: "system error - Contact support (georgejere60@gmail.com)",
      };
    }

    const hasExceededUsageLimit = usage >= allocation;

    if (hasExceededUsageLimit) {
      const featureName =
        Object.entries(featureFlagEvents).find(
          ([, value]) => value.event === eventSubtype
        )?.[0] || eventSubtype;

      return {
        success: false,
        error: `You have reached your ${featureName} limit. Please upgrade your plan to continue using this feature.`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error checking feature usage limits", error);
    return {
      success: false,
      error: "Error checking feature usage limit",
    };
  }
};

export default checkFeatureUsageLimit;
