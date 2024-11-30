import { Post } from "../types";
import { getReplyData } from "../utils/get-reply-data";
import { createPost } from "./create-post";

export const handleRequest = async (parent: Post, post: Post) => {
  const urlParts = parent.uri.split("/");
  const parentThread = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=at://${urlParts[2]}/app.bsky.feed.post/${urlParts[4]}&depth=10`
  );

  const postData = await parentThread.json();

  let recordURI = null;

  if (postData.thread.post.embed["$type"] === "app.bsky.embed.external#view") {
    const { url, status, error } = await fetchEndpoint(
      postData.thread.post.embed.external.uri
    );

    if (url && status === 200) {
      recordURI = await createPost({
        text: `${url} ${randomEmoji("success")}`,
        reply: getReplyData(post),
        facets: [
          {
            index: {
              byteStart: 0,
              byteEnd: url.length,
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
    } else if (!url && status === 400 && error.code === "BLOCKED_DOMAIN") {
      recordURI = await createPost({
        text: `Este site é à prova de marretadas ${randomEmoji("blocked")}`,
        reply: getReplyData(post),
      });
    } else {
      recordURI = await createPost({
        text: `Não é você, sou eu. Algo deu errado… ${randomEmoji("error")}`,
        reply: getReplyData(post),
      });
    }
  } else {
    recordURI = await createPost({
      text: `Não é você, sou eu. Algo deu errado… ${randomEmoji("error")}`,
      reply: getReplyData(post),
    });
  }

  return recordURI;
};

const randomEmoji = (type: string) => {
  let emojis = [];

  if (type === "success") {
    emojis = ["🪓", "🧨", "🛡️", "💣", "🧱", "🔨", "⚒️", "🛠️"];
  } else if (type === "blocked") {
    emojis = ["😭", "😤", "😡", "🤬"];
  } else if (type === "error") {
    emojis = ["😧", "😮", "😲", "😯", "🙄", "😬", "😥", "😓", "🥵"];
  }

  return emojis[Math.floor(Math.random() * emojis.length)];
};

const fetchEndpoint = async (url: string) => {
  const endpoint = `https://marreta.pcdomanual.com/api/${url}`;

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
      return { url: data.url, status: 200, error: null };
    } else if (data.status === 400) {
      return { url: null, status: 400, error: data.error };
    } else {
      return { url: null, status: -1, error: null };
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return { url: null, status: -1, error: null };
  }
};
