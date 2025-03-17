import React from 'react';
import { Sign2Icon,MaiaHeadIcon, MattHeadIcon, Maia4HeadIcon, DianaHeadIcon, Maia2HeadIcon, Maia3HeadIcon, ShopGirlHeadIcon 
  ,BoxIcon, BarisHeadIcon, GermisHeadIcon, JoxHeadIcon,GorjoxHeadIcon
} from "../SvgExporter";

export interface Conversation {
  dialogos: {
    text: string;
    svg?: (props: any) => JSX.Element;
  }[];
}

export const conversations: {
  homechessclose:Conversation;
  mattconv1: Conversation;
  mattconv2: Conversation;
  mattconv3: Conversation;
  shopgirlconv1: Conversation;
  sign1:Conversation;
  openbox:Conversation;
  barisconv1:Conversation;
  barisconv2:Conversation;
  caveclose1:Conversation;
  caveclose2:Conversation;
  caveclose3:Conversation;
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
  shopgirlconv1: {
    dialogos: [
      { 
        text: "Tengo algunos productos que podrian interesarte.", 
        svg: ShopGirlHeadIcon
      },
      { 
        text: "¿Deseas comprar?", 
        svg: ShopGirlHeadIcon 
      },
    ],
  },
  sign1: {
    dialogos: [
      { 
        text: "PELIGRO!                      ESTA PROHIBIDO EL INGRESO!", 
        svg: Sign2Icon
      },
    ],
  },
  homechessclose: {
    dialogos: [
      { 
        text: "Es el baúl de Papá, Ovy tenia la llave...", 
        svg: MaiaHeadIcon
      },
    ],
  },
  openbox: {
    dialogos: [
      { 
        text: "Deseas romper la caja?", 
        svg: BoxIcon
      },
    ],
  },
  barisconv1: {
    dialogos: [
      { 
        text: "Ohh, pequeña Maia, en que puedo ayudarte?", 
        svg: BarisHeadIcon 
      },
      { 
        text: "Hola señor Baris, seguro esta enterado de lo de mi hermano, verdad?", 
        svg: MaiaHeadIcon
      },
      { 
        text: "Ohh, si por supuesto... realmente es una pena, siempre fue un buen chico.", 
        svg: BarisHeadIcon 
      },
      { 
        text: "Crei que usted lo odiaba... ", 
        svg: MaiaHeadIcon
      },
      { 
        text: "Ohh, para nada, solo era un niño un poco travieso...", 
        svg: BarisHeadIcon 
      },
      { 
        text: "Tus padres no sabian controlarlo, y el tenia una curiosa costumbre de robar en mi Bar...", 
        svg: BarisHeadIcon 
      },
      { 
        text: "Pero se que en el fondo solo fue un niño inconprendido.", 
        svg: BarisHeadIcon 
      },
      { 
        text: "Entiendo...  ", 
        svg: MaiaHeadIcon
      },
      { 
        text: "Señor Baris, yo queria pedirle un favor.", 
        svg: MaiaHeadIcon 
      },
      { 
        text: "Ohh, pequeña Maia, por supuesto, en que puedo ayudarte?", 
        svg: BarisHeadIcon 
      },
      { 
        text: "Yo necesito al menos hablar una ultima vez con Ovy...", 
        svg: MaiaHeadIcon
      },
      { 
        text: "Tengo entendido que usted hace años ayudo a obstuir los pasadizos que llevaban a los calabozos.", 
        svg: MaiaHeadIcon
      },
      { 
        text: "Ohh, pequeña Maia, no me gusta hacia donde va esta conversación.", 
        svg: BarisHeadIcon 
      },
      { 
        text: "Se lo pido por favor, necesito ir a esos pasadizos y entrar al calabozo donde tienen a Ovy.", 
        svg: MaiaHeadIcon
      },
      { 
        text: "Ohh, me va a dar algo...", 
        svg: BarisHeadIcon 
      },
      { 
        text: "...", 
        svg: BarisHeadIcon 
      },
      { 
        text: "De acuerdo...voy a acceder solo porque se que eres una gran guerrera como tus padres..", 
        svg: BarisHeadIcon 
      },
      { 
        text: "Primero deberas ir a la Cueva del pueblo, y deberas acabar con todos los bichos que se encuentran ahi.", 
        svg: BarisHeadIcon 
      },
      { 
        text: "Pero te advierto pequeña Maia, es una tarea muy arriesgada...", 
        svg: BarisHeadIcon 
      },
      { 
        text: "En caso de que aceptes, deberas volver aqui cuando hayas limpiado esa Cueva por completo, luego te dire como acceder a los pasadizos..", 
        svg: BarisHeadIcon 
      },
      { 
        text: "Se lo agradezco señor Baris.", 
        svg: MaiaHeadIcon 
      },
      { 
        text: "Ohh, dios, por favor, ten cuiado...", 
        svg: BarisHeadIcon 
      },
    ],
  },
  barisconv2: {
    dialogos: [
      { 
        text: "Ohh, pequeña Maia, la Cueva es muy peligrosa, tendras que tener mucho cuidado...", 
        svg: BarisHeadIcon
      },
    ],
  },
  caveclose1: {
    dialogos: [
      { 
        text: "No deberia entrar ahi...", 
        svg: MaiaHeadIcon
      },
    ],
  },
  caveclose2: {
    dialogos: [
      { 
        text: "Este Bicho no me deja avanzar...", 
        svg: MaiaHeadIcon
      },
    ],
  },
};
