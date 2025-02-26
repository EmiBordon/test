import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { 
  PaperHandIcon, RockHandIcon, ScissorsHandIcon, MaiaIcon, MattIcon, Maia2HeadIcon,
  Maia4HeadIcon, MattHeadIcon, 
} from "../SvgExporter"; // Importa los íconos

// Opciones del juego
const OPTIONS = {
  rock: "RockHandIcon",
  paper: "PaperHandIcon",
  scissors: "ScissorsHandIcon",
};

// Función para determinar el ganador de cada ronda
const determineWinner = (playerChoice: string, computerChoice: string): string => {
  if (playerChoice === computerChoice) return "Empate";
  
  switch (playerChoice) {
    case "rock":
      return computerChoice === "scissors" ? "Ganaste" : "Perdiste";
    case "paper":
      return computerChoice === "rock" ? "Ganaste" : "Perdiste";
    case "scissors":
      return computerChoice === "paper" ? "Ganaste" : "Perdiste";
    default:
      return "Opción inválida";
  }
};

// Función para generar la elección aleatoria de la computadora
const getRandomChoice = (): string => {
  const choices = Object.keys(OPTIONS); // ["rock", "paper", "scissors"]
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
};

const HandGame = () => {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [computerScore, setComputerScore] = useState<number>(0);
  // Estados para el game over
  const [gameOver, setGameOver] = useState(false);
  // Se usa para determinar si se ganó o perdió. Se establece al finalizar el juego.
  const [finalWinner, setFinalWinner] = useState("");
  // Estado para la fase del game over (1 o 2)
  const [gameOverPhase, setGameOverPhase] = useState(1);
  // Estado para controlar si la ronda está en progreso y ocultar las opciones
  const [roundInProgress, setRoundInProgress] = useState(false);

  // Renderiza dos círculos (bolitas) según el puntaje (1° y 2° ronda)
  const renderScore = (score: number) => (
    <View style={styles.scoreIndicatorContainer}>
      <View style={[styles.scoreCircle, { backgroundColor: score >= 1 ? "black" : "white" }]} />
      <View style={[styles.scoreCircle, { backgroundColor: score >= 2 ? "black" : "white" }]} />
    </View>
  );

  // Función para reiniciar el juego y volver a la fase inicial de game over
  const handleReset = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setPlayerChoice(null);
    setComputerChoice(null);
    setGameOver(false);
    setFinalWinner("");
    setGameOverPhase(1);
  };

  // Función que se ejecuta al presionar una opción
  const handleChoice = (choice: string) => {
    if (roundInProgress) return;
    setRoundInProgress(true);

    const computerSelection = getRandomChoice();
    setPlayerChoice(choice);
    setComputerChoice(computerSelection);

    setTimeout(() => {
      const result = determineWinner(choice, computerSelection);
      let newPlayerScore = playerScore;
      let newComputerScore = computerScore;
      
      if (result === "Ganaste") {
        newPlayerScore += 1;
      } else if (result === "Perdiste") {
        newComputerScore += 1;
      }
      
      setPlayerScore(newPlayerScore);
      setComputerScore(newComputerScore);
      
      // Al llegar a 2 victorias se determina el ganador final y se activa el game over
      if (newPlayerScore === 2 || newComputerScore === 2) {
        const finalResult = newPlayerScore === 2 ? "¡Ganaste el juego!" : "La computadora ganó el juego!";
        setFinalWinner(finalResult);
        setGameOver(true);
      }
      
      setPlayerChoice(null);
      setComputerChoice(null);
      setRoundInProgress(false);
    }, 1500);
  };

  // Si el juego terminó, se renderiza la pantalla de game over en dos fases
  if (gameOver) {
    // Se determina si el jugador ganó
    const isWinner = finalWinner === "¡Ganaste el juego!";
    return (
      <View style={styles.gameOverScreen}>
        <View style={styles.gameOverContainer}>
          {isWinner ? (
            gameOverPhase === 1 ? (
              <>
                <Maia2HeadIcon width={80} height={80} />
                <Text style={styles.gameOverText}>Bueno... al parecer yo gane hermanito.</Text>
              </>
            ) : (
              <>
                <MattHeadIcon width={80} height={80} />
                <Text style={styles.gameOverText}>Si si, lo que digas... aqui tienes tu llave.</Text>
              </>
            )
          ) : (
            gameOverPhase === 1 ? (
              <>
                <MattHeadIcon width={80} height={80} />
                <Text style={styles.gameOverText}>Como siempre, yo gane...igual te doy la llave por que me das lastima.</Text>
              </>
            ) : (
              <>
                <Maia4HeadIcon width={80} height={80} />
                <Text style={styles.gameOverText}>Que sorpresa... solo querias alimentar tu estupido ego.</Text>
              </>
            )
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            if (gameOverPhase === 1) {
              setGameOverPhase(2);
            } else {
              handleReset();
            }
          }}
          style={styles.resetButton}
        >
          <Text style={styles.resetButtonText}>
            {gameOverPhase === 1 ? ">>" : "Reiniciar"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Pantalla principal del juego
  return (
    <View style={styles.container}>
      {/* Icono Matt en la parte superior */}
      <View style={styles.mattContainer}>
        <MattIcon width={120} height={120} />
      </View>

      {/* Puntaje de la computadora en la parte superior */}
      <View style={styles.computerScoreContainer}>
        {renderScore(computerScore)}
      </View>

      {/* Muestra las elecciones en el centro, enfrentadas */}
      {playerChoice && computerChoice && (
        <View style={styles.centerContainer}>
          {/* Elección del jugador (abajo) */}
          <View style={styles.choiceContainer}>
            {playerChoice === "rock" && <RockHandIcon width={150} height={150} fill="black" />}
            {playerChoice === "paper" && <PaperHandIcon width={150} height={150} fill="black" />}
            {playerChoice === "scissors" && <ScissorsHandIcon width={150} height={150} fill="black" />}
          </View>
          {/* Espacio entre las manos */}
          <View style={styles.vsContainer} />
          {/* Elección de la computadora (arriba) */}
          <View style={styles.choiceContainer}>
            {computerChoice === "rock" && (
              <RockHandIcon width={150} height={150} fill="black" style={styles.flippedIcon} />
            )}
            {computerChoice === "paper" && (
              <PaperHandIcon width={150} height={150} fill="black" style={styles.flippedIcon} />
            )}
            {computerChoice === "scissors" && (
              <ScissorsHandIcon width={150} height={150} fill="black" style={styles.flippedIcon} />
            )}
          </View>
        </View>
      )}

      {/* Puntaje del jugador en la parte inferior */}
      <View style={styles.playerScoreContainer}>
        {renderScore(playerScore)}
      </View>

      {/* Opciones en la parte inferior (se muestran solo si no hay ronda en progreso) */}
      {!roundInProgress && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={() => handleChoice("rock")}>
            <RockHandIcon width={100} height={100} fill="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleChoice("paper")}>
            <PaperHandIcon width={100} height={100} fill="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleChoice("scissors")}>
            <ScissorsHandIcon width={100} height={100} fill="black" />
          </TouchableOpacity>
        </View>
      )}

      {/* Icono Maia debajo de las opciones */}
      <View style={styles.maiaContainer}>
        <MaiaIcon width={120} height={120} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "white",
  },
  mattContainer: {
    position: "absolute",
    top: "2%",
    alignSelf: "center",
  },
  computerScoreContainer: {
    position: "absolute",
    top: "20%",
    alignSelf: "center",
  },
  playerScoreContainer: {
    position: "absolute",
    bottom: "30%",
    alignSelf: "center",
  },
  scoreIndicatorContainer: {
    flexDirection: "row",
  },
  scoreCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    marginHorizontal: 5,
  },
  centerContainer: {
    position: "absolute",
    top: "25%",
    flexDirection: "column-reverse", // Íconos enfrentados
    alignItems: "center",
    justifyContent: "space-between",
    height: "40%",
  },
  choiceContainer: {
    alignItems: "center",
  },
  flippedIcon: {
    transform: [{ rotate: "180deg" }], // Gira los íconos de la computadora 180 grados
  },
  vsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingBottom: "10%",
    backgroundColor: "white",
    bottom: "12%",
  },
  maiaContainer: {
    position: "absolute",
    bottom: "2%",
    alignSelf: "center",
  },
  gameOverScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  gameOverContainer: {
    alignItems: "center",
    padding: 20,
    borderWidth: 4,
    borderColor: "black",
    borderRadius: 10,
  },
  gameOverText: {
    fontSize: 24,
    marginVertical: 20,
    color: "black",
    textAlign: "center",
  },
  resetButton: {
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  resetButtonText: {
    color: "white",
    fontSize: 18,
  },
});

export default HandGame;
