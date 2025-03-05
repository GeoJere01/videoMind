"use client";
import { SchematicProvider } from "@schematichq/schematic-react";
import SchematicWrapped from "./SchematicWrapped";
import { ConvexClientProvider } from "./ConvexClientProvider";

export default function ClientWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const SchematicPublishableKey =
    process.env.NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error("Missing Publishable Key");
  }
  return (
    <ConvexClientProvider>
      <SchematicProvider publishableKey={`${SchematicPublishableKey}`}>
        <SchematicWrapped>{children}</SchematicWrapped>
      </SchematicProvider>
    </ConvexClientProvider>
  );
}
