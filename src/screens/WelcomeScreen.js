import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useJourney } from '../context/JourneyContext';
import { colors, typography, spacing, radius, shadows } from '../theme';

const FEATURES = [
  { icon: '📋', text: 'Complete activities and surveys to earn points' },
  { icon: '🔭', text: 'Progress from Explorer toward Contributor' },
  { icon: '✨', text: 'Unlock Contributor at 200 points and beyond' },
];

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { currentPhase } = useJourney();

  // Staggered entrance animations
  const logoAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const featuresAnim = useRef(new Animated.Value(0)).current;
  const ctaAnim = useRef(new Animated.Value(0)).current;

  const logoSlide = useRef(new Animated.Value(20)).current;
  const titleSlide = useRef(new Animated.Value(24)).current;
  const ctaSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const sequence = Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(logoAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(logoSlide, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
      ]),
      Animated.timing(titleAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(titleSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(subtitleAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(featuresAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(ctaAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(ctaSlide, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
      ]),
    ]);
    sequence.start();
  }, []);

  return (
    <LinearGradient
      colors={['#0B1C3D', '#162E5C', '#1E56C8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.4, y: 1 }}
      style={[styles.container, { paddingTop: insets.top + spacing.xxl }]}
    >
      {/* Decorative circles */}
      <View style={styles.circleTopRight} />
      <View style={styles.circleBottomLeft} />

      {/* Logo area */}
      <Animated.View
        style={[
          styles.logoArea,
          { opacity: logoAnim, transform: [{ translateY: logoSlide }] },
        ]}
      >
        <View style={styles.logoIconRing}>
          <Text style={styles.logoIcon}>⭐</Text>
        </View>
        <Text style={styles.brandLabel}>MEMBER'S MARK</Text>
        <Text style={styles.communityLabel}>Community</Text>
      </Animated.View>

      {/* Hero text */}
      <Animated.View
        style={[
          styles.heroArea,
          { opacity: titleAnim, transform: [{ translateY: titleSlide }] },
        ]}
      >
        <Text style={styles.heroTitle}>Your voice shapes{'\n'}what comes next.</Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.Text style={[styles.subtitle, { opacity: subtitleAnim }]}>
        Join thousands of members who earn rewards by sharing their opinions on products that matter.
      </Animated.Text>

      {/* Feature list */}
      <Animated.View style={[styles.features, { opacity: featuresAnim }]}>
        {FEATURES.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={styles.featureIconBox}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
            </View>
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}
      </Animated.View>

      {/* CTA */}
      <Animated.View
        style={[
          styles.ctaArea,
          {
            opacity: ctaAnim,
            transform: [{ translateY: ctaSlide }],
            paddingBottom: insets.bottom + spacing.xl,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.ctaButton, shadows.colored('#1E56C8')]}
          onPress={() => navigation.navigate(currentPhase === 'control' ? 'Survey' : 'MemberCelebration')}
          activeOpacity={0.9}
        >
          <Text style={styles.ctaText}>Get Started</Text>
          <Text style={styles.ctaArrow}> →</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  // Decorative background shapes
  circleTopRight: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  circleBottomLeft: {
    position: 'absolute',
    bottom: 60,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  // Logo
  logoArea: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoIconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(245,166,35,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(245,166,35,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoIcon: {
    fontSize: 32,
  },
  brandLabel: {
    ...typography.label,
    color: colors.gold,
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 4,
  },
  communityLabel: {
    ...typography.h2,
    color: '#FFFFFF',
  },
  // Hero text
  heroArea: {
    marginBottom: spacing.lg,
  },
  heroTitle: {
    ...typography.hero,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 46,
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 26,
  },
  // Features
  features: {
    marginBottom: spacing.xxl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureIconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureText: {
    ...typography.bodyMed,
    color: 'rgba(255,255,255,0.85)',
  },
  // CTA
  ctaArea: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.full,
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.xxl,
    width: '100%',
    marginBottom: spacing.md,
  },
  ctaText: {
    ...typography.h4,
    color: colors.navy,
  },
  ctaArrow: {
    ...typography.h4,
    color: colors.blue,
  },
  signinLink: {
    paddingVertical: spacing.sm,
  },
  signinText: {
    ...typography.small,
    color: 'rgba(255,255,255,0.5)',
    textDecorationLine: 'underline',
  },
});
