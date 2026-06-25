export interface ConversationOff {
  dialogos: {
    text: string;
  }[];
}

export const conversationsoff: {
  agonydeclinemana: ConversationOff;
  agonydeclinemana2: ConversationOff;
  agonydeclinelife: ConversationOff;
} = {
  agonydeclinemana: {
    dialogos: [
      { text: "No puedes realizar este ritual, ya estas agonizando..." },
    ],
  },
   agonydeclinemana2: {
    dialogos: [
      { text: "No puedes realizar este ritual, tienes la Mana al máximo..." },
    ],
  },
  agonydeclinelife: {
    dialogos: [
      { text: "No puedes realizar este ritual, debes estar agonizando..." },
    ],
  },
};
