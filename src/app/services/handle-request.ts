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
    const externalUrl = postData.thread.post.embed.external.uri;
    console.log("Processing external URL:", externalUrl);

    try {
      // Basic URL validation
      new URL(externalUrl);

      const { url, status } = await fetchEndpoint(externalUrl);

      if (url && status === 200) {
        recordURI = await createPost({
          text: `🔗 Chapeu de paywall é Marreta! ${randomEmoji("success")}`,
          reply: getReplyData(post),
          facets: [
            {
              index: {
                byteStart: 5,
                byteEnd: 34,
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
      } else {
        recordURI = await createPost({
          text: `Não é você, sou eu. Algo deu errado… ${randomEmoji("error")}`,
          reply: getReplyData(post),
        });
      }
    } catch (error: any) {
      if (error?.code === "BLOCKED_DOMAIN") {
        console.error("Blocked domain:", externalUrl, error);
        recordURI = await createPost({
          text: `Este site é à prova de marretadas ${randomEmoji("blocked")}`,
          reply: getReplyData(post),
        });
      } else if (error?.code === "INVALID_URL") {
        console.error("Invalid URL format:", externalUrl, error);
        recordURI = await createPost({
          text: `URL inválida ${randomEmoji("error")}`,
          reply: getReplyData(post),
        });
      } else {
        recordURI = await createPost({
          text: `Não é você, sou eu. Algo deu errado… ${randomEmoji("error")}`,
          reply: getReplyData(post),
        });
      }
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
  let emojis: string[] = [];

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
  try {
    // Encode the URL properly
    const encodedUrl = encodeURIComponent(url);
    const endpoint = `https://marreta.link/api/${encodedUrl}`;

    console.log("Making request to endpoint:", endpoint);

    // Perform the fetch request
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    // Log response status and headers for debugging
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers));

    // Check if the response is ok
    if (!response.ok) {
      console.error("Response not OK:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Error response body:", errorText);
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
      console.error("Unexpected response status:", data.status);
      return { url: null, status: -1, error: null };
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return { url: null, status: -1, error: null };
  }
};
