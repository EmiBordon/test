import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { font } from './fontsize';

const DURATION = 1000;

const DamageOverlay = () => {
  const maiaCurrentHealth = useSelector((state: any) => state.maia.maiacurrenthealth);
  const prevHealthRef = useRef<number>(maiaCurrentHealth);

  const overlayOpacity  = useRef(new Animated.Value(0)).current;
  const textOpacity     = useRef(new Animated.Value(0)).current;
  const textTranslateY  = useRef(new Animated.Value(0)).current;
  const shakeX          = useRef(new Animated.Value(0)).current;
  const isAnimating     = useRef(false);

  const [blocking, setBlocking] = useState(false);
  const [damageAmount, setDamageAmount] = useState(0);

  useEffect(() => {
    const prev = prevHealthRef.current;
    const delta = prev - maiaCurrentHealth;
    prevHealthRef.current = maiaCurrentHealth;

    if (delta <= 0 || isAnimating.current) return;

    isAnimating.current = true;
    setBlocking(true);
    setDamageAmount(delta);

    textTranslateY.setValue(0);
    overlayOpacity.setValue(0);
    textOpacity.setValue(0);
    shakeX.setValue(0);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(overlayOpacity, { toValue: 0.45, duration: 80, useNativeDriver: true }),
        Animated.timing(overlayOpacity, { toValue: 0, duration: DURATION - 80, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(textOpacity, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(textOpacity,    { toValue: 0,   duration: DURATION - 80, useNativeDriver: true }),
          Animated.timing(textTranslateY, { toValue: -60, duration: DURATION - 80, useNativeDriver: true }),
        ]),
      ]),
      Animated.sequence([
        Animated.timing(shakeX, { toValue: -12, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue:  12, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue:  10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue:  -6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue:   6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue:   0, duration: 60, useNativeDriver: true }),
      ]),
    ]).start(() => {
      isAnimating.current = false;
      setBlocking(false);
    });
  }, [maiaCurrentHealth]);

  return (
    <View
      style={styles.screenWrapper}
      pointerEvents={blocking ? 'box-only' : 'none'}
    >
      <Animated.View style={[styles.redOverlay, { opacity: overlayOpacity }]} />

      <Animated.View style={[styles.shakeWrapper, { transform: [{ translateX: shakeX }] }]}>
        <Animated.View
          style={[
            styles.damageTextWrapper,
            { opacity: textOpacity, transform: [{ translateY: textTranslateY }] },
          ]}
        >
          <Text style={styles.damageText}>-{damageAmount}</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9000,
  },
  redOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#7e1e1e',
  },
  shakeWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  damageTextWrapper: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
  },
  damageText: {
    color: '#FF3030',
    fontSize: font(52),
    fontFamily: 'MedievalSharp',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});

export default DamageOverlay;
