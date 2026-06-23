import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import { font } from './functions/fontsize';
import { CrossIcon, RefreshIcon, HandIcon, HandOneRingIcon, HandTwoRingsIcon, HandThreeRingsIcon } from './SvgExporter';
import IconButton from './functions/iconbutton';
import { useSelector, useDispatch } from 'react-redux';
import ManaBar from './manabar';
import { resolveSpell } from './functions/spellEffects';

const GRID_SIZE = 9;
const CENTER = Math.floor(GRID_SIZE / 2);

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_PADDING = font(10);
const CELL_SIZE = Math.floor((SCREEN_WIDTH * 0.95 - CONTAINER_PADDING * 2) / GRID_SIZE);
const CIRCLE_SIZE = Math.floor(CELL_SIZE * 0.55);
const CENTER_CIRCLE_SIZE = Math.floor(CELL_SIZE * 0.75);

interface Point {
  row: number;
  col: number;
}

interface PlanillaGridProps {
  visible: boolean;
  onClose: () => void;
}

const HAND_ICONS = [HandIcon, HandOneRingIcon, HandTwoRingsIcon, HandThreeRingsIcon];

const BLOCKED_SETS: Record<number, Set<number>> = {
  0: new Set(Array.from({ length: 81 }, (_, i) => i)),
  1: new Set([
    0,1,2,3,4,5,6,7,8,9,
    10,11,12,13,14,15,16,17,18,19,
    25,26,27,28,
    34,35,36,37,
    43,44,45,46,
    52,53,54,55,
    61,62,63,64,
    65,66,67,68,69,70,
    71,72,73,74,75,76,77,78,79,80,
  ]),
  2: new Set([
    0,1,2,3,4,5,6,7,8,9,
    17,18,26,27,35,36,44,45,53,54,62,63,
    71,72,73,74,75,76,77,78,79,80,
  ]),
  3: new Set<number>(),
};

const PlanillaGrid: React.FC<PlanillaGridProps> = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const maiaManaLevel = useSelector((state: any) => state.maia.maiaManaLevel);
  const maiaMana = useSelector((state: any) => state.maia.maiaMana);
  const [path, setPath] = useState<Point[]>([{ row: CENTER, col: CENTER }]);
  const [isDragging, setIsDragging] = useState(false);
  const [fingerPos, setFingerPos] = useState<{ x: number; y: number } | null>(null);
  const [phase, setPhase] = useState<'drawing' | 'reveal'>('drawing');
  const [SpellIcon, setSpellIcon] = useState<React.ComponentType<any> | null>(null);
  const [revealMessage, setRevealMessage] = useState<string | null>(null);

  const pathRef = useRef<Point[]>([{ row: CENTER, col: CENTER }]);
  const isDraggingRef = useRef(false);
  const maiaManaLevelRef = useRef(maiaManaLevel);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const revealOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => { maiaManaLevelRef.current = maiaManaLevel; }, [maiaManaLevel]);

  useEffect(() => {
    if (visible) {
      const newPath = [{ row: CENTER, col: CENTER }];
      pathRef.current = newPath;
      setPath(newPath);
      isDraggingRef.current = false;
      setIsDragging(false);
      setFingerPos(null);
      setPhase('drawing');
      setSpellIcon(null);
      setRevealMessage(null);
      contentOpacity.setValue(1);
      revealOpacity.setValue(0);
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        const level = Math.min(maiaManaLevelRef.current, 3);
        const centerValue = CENTER * GRID_SIZE + CENTER;
        if (BLOCKED_SETS[level].has(centerValue)) {
          isDraggingRef.current = false;
          return;
        }

        const { locationX, locationY } = evt.nativeEvent;
        const col = Math.floor(locationX / CELL_SIZE);
        const row = Math.floor(locationY / CELL_SIZE);

        if (row === CENTER && col === CENTER) {
          const newPath = [{ row: CENTER, col: CENTER }];
          pathRef.current = newPath;
          setPath(newPath);
          isDraggingRef.current = true;
          setIsDragging(true);
          setFingerPos({ x: locationX, y: locationY });
        } else {
          isDraggingRef.current = false;
        }
      },

      onPanResponderMove: (evt) => {
        if (!isDraggingRef.current) return;

        const { locationX, locationY } = evt.nativeEvent;
        setFingerPos({ x: locationX, y: locationY });

        const col = Math.floor(locationX / CELL_SIZE);
        const row = Math.floor(locationY / CELL_SIZE);
        if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return;

        const level = Math.min(maiaManaLevelRef.current, 3);
        if (BLOCKED_SETS[level].has(row * GRID_SIZE + col)) return;

        const current = pathRef.current;
        if (current.some(p => p.row === row && p.col === col)) return;

        const last = current[current.length - 1];
        if (Math.abs(row - last.row) <= 1 && Math.abs(col - last.col) <= 1) {
          const newPath = [...current, { row, col }];
          pathRef.current = newPath;
          setPath(newPath);
        }
      },

      onPanResponderRelease: () => {
        isDraggingRef.current = false;
        setIsDragging(false);
        setFingerPos(null);
      },

      onPanResponderTerminate: () => {
        isDraggingRef.current = false;
        setIsDragging(false);
        setFingerPos(null);
      },
    })
  ).current;

  const getValue = (row: number, col: number) => row * GRID_SIZE + col;

  const getCellCenter = (row: number, col: number) => ({
    x: col * CELL_SIZE + CELL_SIZE / 2,
    y: row * CELL_SIZE + CELL_SIZE / 2,
  });

  const renderLines = () => {
    const elements: React.ReactNode[] = [];

    for (let i = 0; i < path.length - 1; i++) {
      const c1 = getCellCenter(path[i].row, path[i].col);
      const c2 = getCellCenter(path[i + 1].row, path[i + 1].col);
      const dx = c2.x - c1.x;
      const dy = c2.y - c1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      elements.push(
        <View
          key={`line-${i}`}
          style={{
            position: 'absolute',
            width: length,
            height: font(3),
            backgroundColor: '#851de6',
            left: (c1.x + c2.x) / 2 - length / 2,
            top: (c1.y + c2.y) / 2 - font(1.5),
            transform: [{ rotate: `${angle}deg` }],
            shadowColor: '#c084fc',
            shadowOpacity: 0.9,
            shadowRadius: 6,
          }}
        />
      );
    }

    if (isDragging && fingerPos && path.length > 0) {
      const c1 = getCellCenter(path[path.length - 1].row, path[path.length - 1].col);
      const dx = fingerPos.x - c1.x;
      const dy = fingerPos.y - c1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      if (length > CELL_SIZE / 4) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        elements.push(
          <View
            key="ghost-line"
            style={{
              position: 'absolute',
              width: length,
              height: font(2),
              backgroundColor: '#c084fc',
              left: (c1.x + fingerPos.x) / 2 - length / 2,
              top: (c1.y + fingerPos.y) / 2 - font(1),
              transform: [{ rotate: `${angle}deg` }],
              opacity: 0.55,
            }}
          />
        );
      }
    }

    return elements;
  };

  const resetPath = () => {
    const newPath = [{ row: CENTER, col: CENTER }];
    pathRef.current = newPath;
    setPath(newPath);
    isDraggingRef.current = false;
    setIsDragging(false);
    setFingerPos(null);
    setPhase('drawing');
    setSpellIcon(null);
    setRevealMessage(null);
    contentOpacity.setValue(1);
    revealOpacity.setValue(0);
  };

  const handleReveal = () => {
    const sequence = pathRef.current.map(p => getValue(p.row, p.col));
    const { Icon, effect, noMana } = resolveSpell(sequence, maiaMana);
    setSpellIcon(() => Icon);
    setRevealMessage(noMana ? 'No tienes suficiente Maná' : null);
    if (!noMana && effect) effect(dispatch);

    // 1. Fade out el contenido
    Animated.timing(contentOpacity, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      setPhase('reveal');

      // 2. Fade in la secuencia
      Animated.timing(revealOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {

        // 3. Pausa y fade out
        setTimeout(() => {
          Animated.timing(revealOpacity, {
            toValue: 0,
            duration: 450,
            useNativeDriver: true,
          }).start(() => {
            onClose();
          });
        }, 550);

      });
    });
  };

  const GRID_PX = CELL_SIZE * GRID_SIZE;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>

        {/* Contenido principal con fade-out */}
        <Animated.View style={{ opacity: contentOpacity, alignItems: 'center', width: '95%' }}>
          {phase === 'drawing' && (
            <>
              <View style={styles.container}>
                <IconButton
                  Icon={CrossIcon}
                  width={font(28)}
                  height={font(28)}
                  style={{ top: font(1), right: font(12), zIndex: 10 }}
                  onPress={onClose}
                />

                <View style={{ width: GRID_PX, height: GRID_PX, marginTop: font(28) }}>
                  <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                    {renderLines()}
                    {Array.from({ length: GRID_SIZE }, (_, row) => (
                      <View key={row} style={styles.row}>
                        {Array.from({ length: GRID_SIZE }, (_, col) => {
                          const isCenter = row === CENTER && col === CENTER;
                          const inPath = path.some(p => p.row === row && p.col === col);
                          const isHead =
                            path.length > 0 &&
                            path[path.length - 1].row === row &&
                            path[path.length - 1].col === col;
                          const sz = isCenter ? CENTER_CIRCLE_SIZE : CIRCLE_SIZE;
                          const level = Math.min(maiaManaLevel, 3);
                          const isBlocked = BLOCKED_SETS[level].has(row * GRID_SIZE + col);

                          return (
                            <View
                              key={col}
                              style={[styles.cell, { width: CELL_SIZE, height: CELL_SIZE }]}
                            >
                              <View
                                style={[
                                  styles.circle,
                                  { width: sz, height: sz, borderRadius: sz / 2 },
                                  isBlocked && styles.circleBlocked,
                                  !isBlocked && inPath && !isHead && styles.circleInPath,
                                  !isBlocked && isHead && styles.circleHead,
                                ]}
                              />
                            </View>
                          );
                        })}
                      </View>
                    ))}
                  </View>

                  <View
                    style={StyleSheet.absoluteFillObject}
                    {...panResponder.panHandlers}
                  />
                </View>

                <View style={styles.bottomArea}>
                  <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.actionButton} onPress={resetPath}>
                      <RefreshIcon width={font(44)} height={font(44)} overflow='hidden' />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.manaBarContainer}>
                    <ManaBar />
                  </View>
                </View>
              </View>

              {/* Hand icon fuera del recuadro, centrado debajo */}
              <TouchableOpacity style={styles.handButton} onPress={handleReveal}>
                {React.createElement(HAND_ICONS[Math.min(maiaManaLevel, 3)], { width: font(120), height: font(120), overflow: 'hidden' })}
              </TouchableOpacity>
            </>
          )}
        </Animated.View>

        {/* Capa de revelación con fade-in/out */}
        <Animated.View
          style={[StyleSheet.absoluteFillObject, styles.revealLayer, { opacity: revealOpacity }]}
          pointerEvents="none"
        >
          {SpellIcon && <SpellIcon width={font(180)} height={font(180)} />}
          {revealMessage && (
            <Text style={styles.revealMessage}>{revealMessage}</Text>
          )}
        </Animated.View>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 3, 1, 0.88)',
    paddingBottom: font(0),
  },
  container: {
    width: '100%',
    backgroundColor: 'rgba(192, 119, 84, 0.97)',
    borderRadius: font(10),
    paddingVertical: font(18),
    paddingHorizontal: CONTAINER_PADDING,
    alignItems: 'center',
    borderWidth: font(10),
    borderColor: '#C8A84B',
    shadowColor: '#D4AF37',
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 10,
    
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: '#2a1208',
    shadowColor: '#C8A84B',
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  circleBlocked: {
    backgroundColor: 'rgba(20, 8, 2, 0.4)',
  },
  circleInPath: {
    backgroundColor: '#5d00ff',
    borderColor: '#a855f7',
    shadowColor: '#c084fc',
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  circleHead: {
    backgroundColor: '#5d00ff',
    borderColor: '#a855f7',
    borderWidth: 2,
    shadowColor: '#f0abfc',
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  bottomArea: {
    width: '100%',
    alignItems: 'center',
    marginTop: font(12),
  },
  manaBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: font(8),
  },
  hintText: {
    fontSize: font(13),
    color: '#888',
    textAlign: 'center',
    marginBottom: font(8),
    height: font(18),
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingRight: font(8),
    marginTop: font(4),
  },
  actionButton: {
    padding: font(8),
  },
  handButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: font(8),
    padding: font(4),
  },
  revealLayer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  revealMessage: {
    marginTop: font(16),
    fontSize: font(18),
    fontWeight: 'bold',
    color: '#C8A84B',
    textAlign: 'center',
    textShadowColor: '#D4AF37',
    textShadowRadius: 8,
  },
});

export default PlanillaGrid;
