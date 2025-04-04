export type RootStackParamList = {
    Home: undefined;
    Tutorial: undefined;
    HandGame: undefined;
    BattleScreen: { enemyName: string }; // Aquí especificamos que recibe enemyName
    Cave: undefined;
    Bar: undefined;
    Shop: undefined;
    PawnShop: undefined;
    Prision: undefined;
  };
  export type DefeatEvent = { 
    type: 'dispatch', 
    action: () => any // devuelve una acción redux 
  } | { 
    type: 'function', 
    fn: () => void // función normal 
  };