import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { font } from './functions/fontsize';
import objectivesList from './functions/objectives';
import { ObjetivesIcon } from './SvgExporter'; // Ajusta la ruta según tu proyecto
import { markObjectiveAsSeen } from '../redux/objectivesSlice'; // Ajusta esta ruta

const Objectives = () => {
  const dispatch = useDispatch();

  const currentObjective = useSelector((state: any) => state.objectives.currentObjective);
  const lastSeenObjective = useSelector((state: any) => state.objectives.lastSeenObjective);
  const objectiveDescription = objectivesList[currentObjective] || '¡Misión completada!';

  const [showObjective, setShowObjective] = useState(false);
  const isNewObjective = currentObjective !== lastSeenObjective;

  const handlePress = () => {
    if (isNewObjective) {
      dispatch(markObjectiveAsSeen());
    }
    setShowObjective((prev) => !prev);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showObjective) {
      timeout = setTimeout(() => {
        setShowObjective(false);
      }, 10000);
    }
    return () => clearTimeout(timeout);
  }, [showObjective]);

  useEffect(() => {
    // Al actualizar el objetivo, por las dudas ocultamos el cartel
    setShowObjective(false);
  }, [currentObjective]);

  return (
    <View style={styles.container}>
      {/* Objetivo a la izquierda */}
      {showObjective && (
        <View style={styles.textContainer}>
          <Text style={styles.objectiveText}>Objetivo: {objectiveDescription}</Text>
        </View>
      )}
         {isNewObjective && (
          <View style={styles.newObjectiveBadge}>
            <Text style={styles.newObjectiveText}>NUEVO OBJETIVO!</Text>
          </View>
        )}
      {/* Ícono con mensaje debajo */}
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handlePress} style={styles.button}>
          <ObjetivesIcon width={font(36)} height={font(36)} />
        </TouchableOpacity>
       
      </View>
    </View>
  );
};

export default Objectives;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    //alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    
  },
  button: {
    left: '15%',
    backgroundColor:"white",
    borderRadius: font(1000),
  },
  newObjectiveBadge: {
    position: 'absolute',
    top: font(42), // Debajo del ícono
    backgroundColor: 'black',
    borderRadius: font(5),
    height: font(25),
    width: font(140),
    paddingHorizontal: font(10),
    paddingVertical: font(3),
    right: font(1),
  },
  newObjectiveText: {
    color: 'white',
    fontSize: font(14),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textContainer: {
    marginRight: font(10),
    paddingHorizontal: font(15),
    paddingVertical: font(8),
    backgroundColor: 'black',
    borderRadius: font(8),
    maxWidth: font(200),
  },
  objectiveText: {
    fontSize: font(15),
    color: 'white',
    fontWeight: 'bold',
  },
});
