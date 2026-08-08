import type { AppBskyFeedPost, Un$Typed } from "@atproto/api";
import { getAgent } from "../agent";

export const createRecord = async (
  record: Un$Typed<AppBskyFeedPost.Record>
) => {
  const agent = await getAgent();

  const response = await agent.app.bsky.feed.post.create(
    {
      repo: agent.assertDid,
    },
    record
  );

  return response.uri;
};
