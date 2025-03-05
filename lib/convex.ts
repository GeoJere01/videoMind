import { ConvexHttpClient } from "convex/browser";

const getConvexClient = () => {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error("Next public convex url is not set");
  }
  return new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
};

export default getConvexClient;
