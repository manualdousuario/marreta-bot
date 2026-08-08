import type { AppBskyFeedPost, Un$Typed } from "@atproto/api";
import { createRecord } from "../bot/services/create-record";

type CreatePostData = Partial<Un$Typed<AppBskyFeedPost.Record>> & {
  text: string;
};

export const createPost = (data: CreatePostData) => {
  return createRecord({
    ...data,
    createdAt: new Date().toISOString(),
  });
};
