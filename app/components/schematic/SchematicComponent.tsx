"use client";

import { getTemporaryAccessToken } from "@/actions/getTemporaryAccessToken";
import SchematicEmbed from "./SchematicEmbed";
import { useEffect, useState } from "react";

function SchematicComponent({ componentId }: { componentId: string }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const token = await getTemporaryAccessToken();
        if (!token) {
          setError("No access token received");
          return;
        }
        setAccessToken(token);
      } catch (err) {
        console.error("Failed to get access token:", err);
        setError(
          `Failed to get access token: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      }
    }
    fetchToken();
  }, []);

  if (!componentId) {
    return null;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!accessToken) {
    return <div>Loading...</div>;
  }

  return <SchematicEmbed accessToken={accessToken} componentId={componentId} />;
}

export default SchematicComponent;
