import React from 'react';
import { MaiaHeadIcon, MattHeadIcon, Maia4HeadIcon, DianaHeadIcon, Maia2HeadIcon, Maia3HeadIcon } from "../SvgExporter";

export interface Conversation {
  dialogos: {
    text: string;
    svg?: (props: any) => JSX.Element;
  }[];
}

export const conversations: {
  mattconv1: Conversation;
  mattconv2: Conversation;
  mattconv3: Conversation;
} = {
  mattconv1: {
    dialogos: [
      { 
        text: "Hola Matt, que has estado haciendo estos ultimos dias? ", 
        svg: MaiaHeadIcon 
      },
      { 
        text: "Pues, no mucho... ", 
        svg: MattHeadIcon
      },
      { 
        text: "Aún no puedo creer que Ovy haya sido capaz de matar al Rey Heat, es decir.. es nuestro hermano!", 
        svg: MaiaHeadIcon 
      },
      { 
        text: "Es adoptado. ", 
        svg: MattHeadIcon
      },
      { 
        text: "...", 
        svg: Maia4HeadIcon 
      },
      { 
        text: "En 2 dias será su ejecución, me gustaria al menos poder hablar una ultima vez con él.. ", 
        svg: MaiaHeadIcon 
      },
      { 
        text: "Que piensas hacer? Sabes que eso es imposible.", 
        svg: MattHeadIcon 
      },
      { 
        text: "Encontrare la forma de entrar a la prisión, quiero al menos que me mire a los ojos y me diga por que hizo lo que hizo. ", 
        svg: MaiaHeadIcon 
      },
      { 
        text: "Genial.. tu tambien tienes ganas de que te ejecuten.", 
        svg: MattHeadIcon 
      },
      { 
        text: "No te preocupes, le pedire ayuda a Joshua, el encontrara la forma de hacerme entrar.", 
        svg: MaiaHeadIcon 
      },
      { 
        text: "No voy a negarte que no tengo mucha fe en ti.. pero si quieres terminar como el estupido de Ovy, alla tú.", 
        svg: MattHeadIcon 
      },
      { 
        text: "Gracias por tu apoyo hermanito..", 
        svg: Maia4HeadIcon 
      },
      { 
        text: "En fin.. al menos quiero asegurarme de que mejoraste tus habilidades de combate, que te parece si practicamos?", 
        svg: MattHeadIcon 
      },
      { 
        text: "Ok, pero si te gano, me diras donde escondiste a Diana", 
        svg: MaiaHeadIcon 
      },
      { 
        text: "Esa estupida rata.. esta bien, lo prometo.", 
        svg: MattHeadIcon 
      },
      { 
        text: "Deseas combatir con Matt?", 
        svg: MattHeadIcon
      },
    ],
  },
  mattconv2: {
    dialogos: [
      { 
        text: "Deseas combatir con Matt?", 
        svg: MattHeadIcon
      },
    ],
  },
  mattconv3: {
    dialogos: [
      { 
        text: "Quizas esta funcionando", 
        svg: MattHeadIcon 
      },
      { 
        text: "...", 
        svg: MaiaHeadIcon
      },
      { 
        text: "Genial", 
        svg: MattHeadIcon 
      }
    ],
  },
};
