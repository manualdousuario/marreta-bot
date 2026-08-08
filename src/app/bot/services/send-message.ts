import { getAgent } from "../agent";

export const sendMessage = async (targetDid: string, text: string) => {
  const agent = (await getAgent()).withProxy(
    "bsky_chat",
    "did:web:api.bsky.chat"
  );

  const {
    data: { convo },
  } = await agent.chat.bsky.convo.getConvoForMembers({
    members: [agent.assertDid, targetDid],
  });

  const response = await agent.chat.bsky.convo.sendMessage({
    convoId: convo.id,
    message: {
      text,
    },
  });

  return response.data;
};
