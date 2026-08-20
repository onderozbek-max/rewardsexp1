import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadows } from '../theme';
import { ONBOARDING_SLIDES } from '../data/journey';

// On web the viewport is the desktop browser; constrain to phone frame dimensions.
const { width } = Platform.OS === 'web'
  ? { width: 393 }
  : Dimensions.get('window');

// Simple two-stage progression visual: Member (unlocked) → Explorer (coming soon)
function TwoStageFlow() {
  return (
    <View style={twoStageStyles.container}>
      {/* Member */}
      <View style={twoStageStyles.stageBox}>
        <View style={[twoStageStyles.dot, twoStageStyles.dotUnlocked]}>
          <Text style={twoStageStyles.dotEmoji}>🌟</Text>
        </View>
        <Text style={twoStageStyles.stageName}>Member</Text>
        <View style={twoStageStyles.unlockedTag}>
          <Text style={twoStageStyles.unlockedTagText}>Unlocks today</Text>
        </View>
      </View>

      {/* Connector */}
      <View style={twoStageStyles.connector}>
        <View style={twoStageStyles.connectorLine} />
        <Text style={twoStageStyles.connectorArrow}>→</Text>
        <View style={twoStageStyles.connectorLine} />
      </View>

      {/* Explorer */}
      <View style={twoStageStyles.stageBox}>
        <View style={[twoStageStyles.dot, twoStageStyles.dotLocked]}>
          <Text style={twoStageStyles.dotEmoji}>🔭</Text>
        </View>
        <Text style={[twoStageStyles.stageName, twoStageStyles.stageNameMuted]}>Explorer</Text>
        <View style={twoStageStyles.lockedTag}>
          <Text style={twoStageStyles.lockedTagText}>Coming soon</Text>
        </View>
      </View>
    </View>
  );
}

const twoStageStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  stageBox: {
    alignItems: 'center',
    width: 100,
  },
  dot: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  dotUnlocked: {
    backgroundColor: colors.bluePale,
    borderWidth: 2,
    borderColor: colors.blue,
  },
  dotLocked: {
    backgroundColor: colors.borderLight,
    borderWidth: 2,
    borderColor: colors.border,
  },
  dotEmoji: {
    fontSize: 26,
  },
  stageName: {
    ...typography.smallMed,
    color: colors.text,
    marginBottom: 4,
  },
  stageNameMuted: {
    color: colors.textMuted,
  },
  unlockedTag: {
    backgroundColor: colors.bluePale,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  unlockedTagText: {
    ...typography.micro,
    color: colors.blue,
    fontSize: 9,
  },
  lockedTag: {
    backgroundColor: colors.borderLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  lockedTagText: {
    ...typography.micro,
    color: colors.textMuted,
    fontSize: 9,
  },
  connector: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.xl,
  },
  connectorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  connectorArrow: {
    ...typography.body,
    color: colors.textMuted,
    marginHorizontal: 4,
  },
});

function Slide({ slide, isActive }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(16)).current;

  React.useEffect(() => {
    if (isActive) {
      fadeAnim.setValue(0);
      slideUpAnim.setValue(16);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideUpAnim, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }),
      ]).start();
    }
  }, [isActive]);

  return (
    <View style={slideStyles.slide}>
      {/* Illustration area */}
      <View style={slideStyles.illustrationArea}>
        <View style={slideStyles.illustrationCircle}>
          <Text style={slideStyles.emoji}>{slide.emoji}</Text>
        </View>
      </View>

      {/* Text content */}
      <Animated.View
        style={[
          slideStyles.textArea,
          { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] },
        ]}
      >
        <Text style={slideStyles.title}>{slide.title}</Text>
        <Text style={slideStyles.body}>{slide.body}</Text>
        {slide.showTwoStages && <TwoStageFlow />}
      </Animated.View>
    </View>
  );
}

const slideStyles = StyleSheet.create({
  slide: {
    width,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  illustrationArea: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  illustrationCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.bluePale,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  emoji: {
    fontSize: 64,
  },
  textArea: {
    width: '100%',
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
});

export default function OnboardingScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = (e) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentPage(page);
  };

  const goNext = () => {
    const next = currentPage + 1;
    if (next < ONBOARDING_SLIDES.length) {
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setCurrentPage(next);
    }
  };

  const isLast = currentPage === ONBOARDING_SLIDES.length - 1;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Skip button */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Survey')}
          style={styles.skipBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.slideScroll}
        contentContainerStyle={styles.slideContent}
      >
        {ONBOARDING_SLIDES.map((slide, i) => (
          <Slide key={slide.id} slide={slide} isActive={i === currentPage} />
        ))}
      </ScrollView>

      {/* Bottom area: dots + CTA */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + spacing.lg }]}>
        {/* Pagination dots */}
        <View style={styles.dots}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentPage ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* CTA button */}
        <TouchableOpacity
          style={[styles.nextBtn, isLast && styles.nextBtnPrimary]}
          onPress={isLast ? () => navigation.navigate('Survey') : goNext}
          activeOpacity={0.85}
        >
          <Text style={[styles.nextBtnText, isLast && styles.nextBtnTextPrimary]}>
            {isLast ? 'Start My First Surveys →' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  skipBtn: {
    padding: spacing.sm,
  },
  skipText: {
    ...typography.bodyMed,
    color: colors.textSecondary,
  },
  slideScroll: {
    flex: 1,
  },
  slideContent: {
    alignItems: 'center',
  },
  bottom: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.blue,
  },
  dotInactive: {
    width: 8,
    backgroundColor: colors.border,
  },
  nextBtn: {
    width: '100%',
    paddingVertical: spacing.md + 4,
    borderRadius: radius.full,
    alignItems: 'center',
    backgroundColor: colors.bluePale,
  },
  nextBtnPrimary: {
    backgroundColor: colors.blue,
    ...shadows.colored(colors.blue),
  },
  nextBtnText: {
    ...typography.h4,
    color: colors.blue,
  },
  nextBtnTextPrimary: {
    color: '#FFFFFF',
  },
});
