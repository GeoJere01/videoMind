"use client";

import dynamic from "next/dynamic";

const SchematicEmbedComponent = dynamic(
  () =>
    import("@schematichq/schematic-components").then(
      (mod) => mod.SchematicEmbed
    ),
  { ssr: false }
);

const SchematicEmbed = ({
  accessToken,
  componentId,
}: {
  accessToken: string;
  componentId: string;
}) => {
  return <SchematicEmbedComponent accessToken={accessToken} id={componentId} />;
};

export default SchematicEmbed;
