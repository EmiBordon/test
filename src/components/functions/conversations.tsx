import React from 'react';
import { Sign2Icon,MaiaHeadIcon, MattHeadIcon, Maia4HeadIcon, DianaHeadIcon, Maia2HeadIcon, Maia3HeadIcon, ShopGirlHeadIcon 
  ,BoxIcon, BarisHeadIcon, GermisHeadIcon, JoxHeadIcon,GorjoxHeadIcon, PawnShopBoyHeadIcon
} from "../SvgExporter";

export interface Conversation {
  dialogos: {
    text: string;
    svg?: (props: any) => JSX.Element;
  }[];
}

export const conversations: {
  homechestclose:Conversation;
  mattconv1: Conversation;
  mattconv2: Conversation;
  mattconv3: Conversation;
  mattconv4: Conversation;
  mattconv5: Conversation;
  shopgirlconv1: Conversation;
  pawnshopboyconv1:Conversation;
  sign1:Conversation;
  openbox:Conversation;
  barisconv1:Conversation;
  barisconv2:Conversation;
  barisconv3:Conversation;
  caveclose1:Conversation;
  caveclose2:Conversation;
  caveclose3:Conversation;
  germisconv1:Conversation;
  germisconv2:Conversation;
  joxconv1:Conversation;
  joxconv2:Conversation;
  gorjoxconv0:Conversation;
  gorjoxconv1:Conversation;
  gorjoxconv2:Conversation;
  gorjoxconv3:Conversation;
  gorjoxconv4:Conversation;

} = {
  mattconv1: {
    dialogos: [
      { 
        text: "Oye hermana, el señor Baris necesita tu ayuda.. ", 
        svg: MattHeadIcon
      },
      { 
        text: "Tu eres la mejor guerrera del pueblo actualmente, es importante tu ayuda.", 
        svg: MattHeadIcon
      },
      { 
        text: "Lo se, hace ya 6 meses comenzo la catastrofe.. los Bichos ya deben haber llegado al pueblo..", 
        svg: MaiaHeadIcon 
      },
      
      { 
        text: "Aun no puedo creer que nuestro hermano haya sido el causante de todo esto.", 
        svg: MaiaHeadIcon 
      },
      { 
        text: "Es adoptado. ", 
        svg: MattHeadIcon 
      },
      { 
        text: "Que piensas hacer? Iras con el señor Baris?", 
        svg: MattHeadIcon 
      },
      { 
        text: "Si, por supuesto... ", 
        svg: MaiaHeadIcon 
      },
      { 
        text: "Esta bien, deberas estar bien equipada y preparada.", 
        svg: MattHeadIcon 
      },
      { 
        text: "Haremos un combate de entrenamiento, para que recuerdes como luchar.", 
        svg: MattHeadIcon 
      },
      { 
        text: "Aunque te recuerdo, la batalla se basa en 2 turnos, uno para atacar y otro para defender...", 
        svg: MattHeadIcon 
      },
      { 
        text: "En tu turno para ataque puedes atacar a tu oponente o usar algun objeto para aumentar tu salud..", 
        svg: MattHeadIcon 
      },
      { 
        text: "Cualquiera de las 2 acciones te haran perder el turno.", 
        svg: MattHeadIcon 
      },
      { 
        text: "Luego en tu turno de Defensa deberas elegir entre defenderte del ataque enemigo o usar el arco..", 
        svg: MattHeadIcon 
      },
      { 
        text: "Si atinas con el arco haras perder el turno al enemigo, aunque perderas flechas.. ", 
        svg: MattHeadIcon 
      },
      { 
        text: "Espero todo haya quedado claro hermanita, ahora luchemos!", 
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
        text: "Bien hecho hermana, aunque creo que te excediste..", 
        svg: MattHeadIcon 
      },
      { 
        text: "No seas marica.", 
        svg: MaiaHeadIcon
      },
      { 
        text: "En fin.. toma, deberias usar el mapa del pueblo para viajar. ", 
        svg: MattHeadIcon 
      },
      { 
        text: "Gracias hermano, volvere pronto, cuidate.", 
        svg: MaiaHeadIcon 
      },
    ],
  },
  mattconv4: {
    dialogos: [
      { 
        text: "Ten mucho cuidado hermana...", 
        svg: MattHeadIcon 
      },
    ],
  },
  mattconv5: {
    dialogos: [
      { 
        text: "Espero hayas disfrutado la demo hermana.", 
        svg: MattHeadIcon 
      },
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
        text: "PELIGRO!!!", 
        svg: Sign2Icon
      },
    ],
  },
  homechestclose: {
    dialogos: [
      { 
        text: "El viejo baúl de Papá.. Ovy escondio la llave hace mas de un año.", 
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
        text: "Ohh, pequeña Maia, que bueno que viniste.", 
        svg: BarisHeadIcon 
      },
      { 
        text: "Hola señor Baris, vine tan rapido como pude, que sucede?", 
        svg: MaiaHeadIcon
      },
      { 
        text: "Ohh, pequeña Maia, los Bichos comenzaron la invasion, recibimos noticias muy terribles...", 
        svg: BarisHeadIcon 
      },
      { 
        text: "Al parecer estan arrasando con toda la prision..", 
        svg: BarisHeadIcon 
      },
      { 
        text: "No es posible, ahi se encuentra Ovy.", 
        svg: MaiaHeadIcon
      },
      
      { 
        text: "Ohh, es una verdadera tragedia pequeña Maia, por eso necesitamos de tu ayuda.", 
        svg: BarisHeadIcon 
      },
      { 
        text: "Entiendo.. ire a la prision a combatir con los Bichos. ", 
        svg: MaiaHeadIcon
      },
      { 
        text: "Ohh no, pequeña Maia, no es lo mas prudente, hay que actuar con inteligencia.", 
        svg: BarisHeadIcon 
      },
      { 
        text: "Necesito que recojas algo muy importante que hay en la Cueva del pueblo.", 
        svg: BarisHeadIcon
      },
      { 
        text: "Es fundamental para volver a crear el sello magico contra los Bichos.", 
        svg: BarisHeadIcon
      },
      { 
        text: "De acuerdo, ire a la cueva, que debo buscar.", 
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
        text: "En la Cueva hay 2 Bichos pequeña Maia.. necesitamos su sangre..", 
        svg: BarisHeadIcon 
      },
      { 
        text: "Tendras que combatir con ellos y traer una muestra de su sangre.", 
        svg: BarisHeadIcon 
      },
      { 
        text: "Cuente conmigo señor Baris.", 
        svg: MaiaHeadIcon 
      },
      { 
        text: "Ohh, dios, por favor, ten cuidado...", 
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
  barisconv3: {
    dialogos: [
      { 
        text: "Ohh, pequeña Maia, ya no hay mas nada que hacer aqui, esto solo es una Demo.", 
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
        text: "Debo acabar con este Bicho antes de continuar...", 
        svg: MaiaHeadIcon
      },
    ],
  },
  caveclose3: {
    dialogos: [
      { 
        text: "Debo acabar con este Bicho antes de continuar...", 
        svg: MaiaHeadIcon
      },
    ],
  },
  pawnshopboyconv1: {
    dialogos: [
      { 
        text: "Bienvenida, estoy dispuesto a comprarte cualquier tesoro que tengas.", 
        svg: PawnShopBoyHeadIcon
      },
      { 
        text: "¿Deseas vender?", 
        svg: PawnShopBoyHeadIcon
      },
    ],
  },
  germisconv1: {
    dialogos: [
      { 
        text: "ASafsagaags ... oye tu..", 
        svg: GermisHeadIcon 
      },
      { 
        text: "Acaso no leiste el cartel...", 
        svg: GermisHeadIcon
      },
      { 
        text: "...", 
        svg: MaiaHeadIcon 
      },
      { 
        text: "aasdasgdhg... voy a tener que matarte..", 
        svg: GermisHeadIcon 
      },
      { 
        text: "Deseas combatir con Germis ?", 
        svg: GermisHeadIcon 
      },
    ],
  },
  germisconv2: {
    dialogos: [
      { 
        text: "Deseas combatir con Germis ?", 
        svg: GermisHeadIcon 
      },
    ],
  },
  joxconv1: {
    dialogos: [
      { 
        text: "Asi que casi matas a mi hermano.. interesante.", 
        svg: JoxHeadIcon 
      },
      { 
        text: "Los humanos son asquerosos. ", 
        svg: JoxHeadIcon 
      },
      { 
        text: "Aunque alguna vez yo tambien fui humano... ya ni lo recuerdo. ", 
        svg: JoxHeadIcon 
      },
      { 
        text: "Que? Que quieres decir con eso ?", 
        svg: MaiaHeadIcon 
      },
      { 
        text: "No voy a seguir hablando con un asqueroso humano...", 
        svg: JoxHeadIcon 
      },
      { 
        text: "Deseas combatir con Jox ?", 
        svg: JoxHeadIcon 
      },
    ],
  },
  joxconv2: {
    dialogos: [
      { 
        text: "Deseas combatir con Jox ?", 
        svg: JoxHeadIcon 
      },
    ],
  },
  gorjoxconv0: {
    dialogos: [
      { 
        text: "asfdgasg... estupido humano...", 
        svg: GermisHeadIcon 
      },
      { 
        text: "Seras testigo de nuestro verdadero poder...", 
        svg: GermisHeadIcon 
      },
      { 
        text: "Sera mejor que te prepares.. ", 
        svg: JoxHeadIcon 
      },
      { 
        text: "Los hermanos te invitan a contemplar su forma definitiva..", 
        svg: GermisHeadIcon 
      },
    ],
  },
  gorjoxconv1: {
    dialogos: [
      { 
        text: "No creia que un humano tan insignificante como tu..", 
        svg: JoxHeadIcon 
      },
      { 
        text: "Nos daria problemas...", 
        svg: JoxHeadIcon 
      },
      { 
        text: "Mostremosle de que estamos hechos hermanito.", 
        svg: GermisHeadIcon 
      },
      { 
        text: "Si.. ", 
        svg: JoxHeadIcon 
      },
      { 
        text: "Los hermanos te invitan a contemplar su forma definitiva..", 
        svg: JoxHeadIcon  
      },
    ],
  },
  gorjoxconv2: {
    dialogos: [
      { 
        text: "Los hermanos te invitan a contemplar su forma definitiva..", 
        svg: GermisHeadIcon 
      },
    ],
  },
  gorjoxconv3: {
    dialogos: [
      { 
        text: "*gruñidos ...", 
        svg: GorjoxHeadIcon 
      },
      { 
        text: "Genial...", 
        svg: MaiaHeadIcon 
      },
      { 
        text: "Deseas combatir con Gorjox ?", 
        svg: GorjoxHeadIcon 
      },
    ],
  },
  gorjoxconv4: {
    dialogos: [
      { 
        text: "Deseas combatir con Gorjox ?", 
        svg: GorjoxHeadIcon 
      },
    ],
  },
};
