import { Languages } from "./types";

export const responses = {
  "success.reply": {
    [Languages.EN]: "Click here to read the article",
    [Languages.PT]: "Aperte aqui para ler a matéria"
  },
  "error.notAReply": {
    [Languages.EN]:
      "This post is not a reply. Please reply to a post and tag me to get the download link.",
    [Languages.PT]:
      "Este post não é uma resposta. Responda a um post mencionando o bot para fazer o download."
  },
  "error.unknown": {
    [Languages.EN]:
      "An unknown error occurred",
    [Languages.PT]:
      "Ocorreu um erro desconhecido"
  },
} as const;
