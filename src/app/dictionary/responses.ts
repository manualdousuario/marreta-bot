import { Languages } from "./types";

export const responses = {
  "success.reply": {
    [Languages.PT]: "Aperte aqui para ler a matéria",
  },
  "error.notAReply": {
    [Languages.PT]:
      "Este post não é uma resposta. Responda a um post mencionando o bot para fazer o download.",
  },
  "error.unknown": {
    [Languages.PT]: "Ocorreu um erro desconhecido",
  },
} as const;
