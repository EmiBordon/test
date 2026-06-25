export interface ConversationOffChoice {
  dialogos: {
    text: string;
  }[];
  opciones: {
    label: string;
    onSelect: () => void;
  }[];
}

export const godofagonyChoice = (
  onMana: () => void,
  onLife: () => void,
): ConversationOffChoice => ({
  dialogos: [
    { text: "Tu Agonia sera recompensada." },
    { text: "¿Que ritual quieres realizar?" },
  ],
  opciones: [
    { label: "Agonizar por Mana", onSelect: onMana },
    { label: "Agonizar por Vida", onSelect: onLife },
  ],
});
