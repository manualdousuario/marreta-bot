import { t } from "../dictionary/translate";
import { Post } from "../types";
import { getReplyData } from "../utils/get-reply-data";
import { createPost } from "./create-post";
import { NotAReplyError } from "../errors";

export const handleRequest = async (parent: Post, post: Post) => {
  if (typeof post.record.reply === "undefined") {
    throw new NotAReplyError(post);
  }

  const string = `${t("success.reply", post.record.langs)}`;

  const urlParts = parent.uri.split("/");
  const threadReq = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=at://${urlParts[2]}/app.bsky.feed.post/${urlParts[4]}&depth=10`
  );

  const data = await threadReq.json();

  let url = "";
  let recordURI = null;

  if (data.thread.post.embed["$type"] === "app.bsky.embed.external#view") {
    url = await fetchEndpoint(data.thread.post.embed.external.uri);

    console.log(url);

    if (!!url) {
      recordURI = await createPost({
        text: string,
        reply: getReplyData(post),
        facets: [
          {
            index: {
              byteStart: 0,
              byteEnd: string.length - 1,
            },
            features: [
              {
                $type: "app.bsky.richtext.facet#link",
                uri: `${url}`,
              },
            ],
          },
        ],
      });
    }
  }

  return recordURI;
};

const fetchEndpoint = async (url: string) => {
  const endpoint = `https://marreta.pcdomanual.com/api/${url}`;

  console.log(endpoint);

  try {
    // Perform the fetch request
    const response = await fetch(endpoint, { method: "GET" });

    // Check if the response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response as JSON
    const data = await response.json();

    console.log("API Response:", data);

    // Process the response
    if (data.status === 200) {
      return data.url;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};
