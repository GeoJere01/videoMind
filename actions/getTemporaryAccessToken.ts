"use server";

import { currentUser } from "@clerk/nextjs/server";
import { SchematicClient } from "@schematichq/schematic-typescript-node";

export async function getTemporaryAccessToken() {
  const user = await currentUser();
  if (!user) return null;

  const client = new SchematicClient({
    apiKey: process.env.SCHEMATIC_API_KEY!,
  });

  try {
    const response = await client.accesstokens.issueTemporaryAccessToken({
      resourceType: "company",
      lookup: {
        id: user.id,
      },
    });
    return response.data.token;
  } catch (error) {
    console.error("Failed to get Schematic access token:", error);
    return null;
  }
}
