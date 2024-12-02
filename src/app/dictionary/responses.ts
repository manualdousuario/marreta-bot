import { Languages } from "./types";

export const responses = {
  "success.reply": {
    [Languages.PT]: "Aperte aqui para ler a matéria",
    [Languages.EN]: "Click here to read the article",
  },
  "error.notAReply": {
    [Languages.PT]: "Este post não é uma resposta. Responda a um post mencionando o bot para fazer o download.",
    [Languages.EN]: "This post is not a reply. Reply to a post mentioning the bot to download.",
  },
  "error.unknown": {
    [Languages.PT]: "Ocorreu um erro desconhecido",
    [Languages.EN]: "An unknown error occurred",
  },
} as const;
