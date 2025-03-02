import React from 'react';
import { MaiaHeadIcon, MattHeadIcon, Maia4HeadIcon, DianaHeadIcon, Maia2HeadIcon, Maia3HeadIcon } from "../SvgExporter";

export interface Conversation {
  dialogos: {
    text: string;
    svg: (props: any) => JSX.Element;
  }[];
}

export const conversations: {
  mattconv1: Conversation;
  mattconv2: Conversation;
} = {
  mattconv1: {
    dialogos: [
      { 
        text: "Hola, ¿cómo estás?", 
        svg: MaiaHeadIcon 
      },
      { 
        text: "...", 
        svg: MattHeadIcon
      },
      { 
        text: "Muy bien, gracias por preguntar.", 
        svg: MaiaHeadIcon 
      }
    ],
  },
  mattconv2: {
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
