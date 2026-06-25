export interface ConversationOff {
  dialogos: {
    text: string;
  }[];
}

export const conversationsoff: {
  agonydeclinemana: ConversationOff;
} = {
  agonydeclinemana: {
    dialogos: [
      { text: "No puedes realizar este ritual, ya estas agonizando..." },
    ],
  },
};
