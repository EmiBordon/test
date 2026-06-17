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
import { CrossIcon, RefreshIcon, HandOneRingIcon } from './SvgExporter';
import { getSpellIcon } from './functions/spellEffects';

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

const PlanillaGrid: React.FC<PlanillaGridProps> = ({ visible, onClose }) => {
  const [path, setPath] = useState<Point[]>([{ row: CENTER, col: CENTER }]);
  const [isDragging, setIsDragging] = useState(false);
  const [fingerPos, setFingerPos] = useState<{ x: number; y: number } | null>(null);
  const [phase, setPhase] = useState<'drawing' | 'reveal'>('drawing');
  const [SpellIcon, setSpellIcon] = useState<React.ComponentType<any> | null>(null);

  const pathRef = useRef<Point[]>([{ row: CENTER, col: CENTER }]);
  const isDraggingRef = useRef(false);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const revealOpacity = useRef(new Animated.Value(0)).current;

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
      contentOpacity.setValue(1);
      revealOpacity.setValue(0);
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
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
            backgroundColor: '#333',
            left: (c1.x + c2.x) / 2 - length / 2,
            top: (c1.y + c2.y) / 2 - font(1.5),
            transform: [{ rotate: `${angle}deg` }],
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
              backgroundColor: '#888',
              left: (c1.x + fingerPos.x) / 2 - length / 2,
              top: (c1.y + fingerPos.y) / 2 - font(1),
              transform: [{ rotate: `${angle}deg` }],
              opacity: 0.5,
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
    contentOpacity.setValue(1);
    revealOpacity.setValue(0);
  };

  const handleReveal = () => {
    const sequence = pathRef.current.map(p => getValue(p.row, p.col));
    const Icon = getSpellIcon(sequence);
    setSpellIcon(() => Icon);

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
        <Animated.View style={[styles.container, { opacity: contentOpacity }]}>
          {phase === 'drawing' && (
            <>
              <TouchableOpacity style={styles.crossButton} onPress={onClose}>
                <CrossIcon width={font(28)} height={font(28)} />
              </TouchableOpacity>

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

                        return (
                          <View
                            key={col}
                            style={[styles.cell, { width: CELL_SIZE, height: CELL_SIZE }]}
                          >
                            <View
                              style={[
                                styles.circle,
                                { width: sz, height: sz, borderRadius: sz / 2 },
                                inPath && !isHead && styles.circleInPath,
                                isHead && styles.circleHead,
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
                    <RefreshIcon width={font(44)} height={font(44)} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={handleReveal}>
                    <HandOneRingIcon width={font(100)} height={font(100)} />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </Animated.View>

        {/* Capa de revelación con fade-in/out */}
        <Animated.View
          style={[StyleSheet.absoluteFillObject, styles.revealLayer, { opacity: revealOpacity }]}
          pointerEvents="none"
        >
          {SpellIcon && <SpellIcon width={font(180)} height={font(180)} />}
        </Animated.View>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffffe1',
  },
  container: {
    width: '95%',
    backgroundColor: '#ffffffe1',
    borderRadius: font(16),
    paddingVertical: font(16),
    paddingHorizontal: CONTAINER_PADDING,
    alignItems: 'center',
    top: font(100),
  },
  crossButton: {
    position: 'absolute',
    top: font(1),
    right: font(12),
    padding: font(1),
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: '#D4D4D4',
  },
  circleInPath: {
    backgroundColor: '#131313',
    borderColor: '#333',
  },
  circleHead: {
    backgroundColor: '#131313',
    borderColor: '#333',
    borderWidth: 2,
  },
  bottomArea: {
    width: '100%',
    alignItems: 'center',
    marginTop: font(12),
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
    justifyContent: 'center',
    gap: font(32),
    marginTop: font(4),
  },
  actionButton: {
    padding: font(8),
  },
  revealLayer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlanillaGrid;
