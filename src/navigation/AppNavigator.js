import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import WelcomeScreen from '../screens/WelcomeScreen';
import MemberCelebrationScreen from '../screens/MemberCelebrationScreen';
import SurveyScreen from '../screens/SurveyScreen';
import CelebrationScreen from '../screens/CelebrationScreen';  // ExplorerCelebration
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import StageTransitionScreen from '../screens/StageTransitionScreen';

import PhaseSelector from '../components/PhaseSelector';
import { useJourney } from '../context/JourneyContext';
import { useRoadmap } from '../context/RoadmapContext';
import { colors, typography, spacing, radius } from '../theme';

const Stack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ── Header controls ───────────────────────────────────────────────────────────

function RoadmapToggle() {
  const { roadmapMode, toggleRoadmapMode } = useRoadmap();
  return (
    <TouchableOpacity
      onPress={toggleRoadmapMode}
      style={[styles.toggle, roadmapMode ? styles.toggleActive : styles.toggleInactive]}
      activeOpacity={0.8}
    >
      <Text style={styles.toggleEmoji}>🔭</Text>
      <Text style={[styles.toggleText, roadmapMode ? styles.toggleTextActive : styles.toggleTextInactive]}>
        Roadmap
      </Text>
    </TouchableOpacity>
  );
}

// ── Tab icon ──────────────────────────────────────────────────────────────────

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={tabStyles.wrap}>
      <Text style={[tabStyles.emoji, focused ? tabStyles.emojiOn : tabStyles.emojiOff]}>{emoji}</Text>
      <Text style={[tabStyles.label, focused ? tabStyles.labelOn : tabStyles.labelOff]}>{label}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 4 },
  emoji: { fontSize: 22, marginBottom: 1 },
  emojiOn: { opacity: 1 },
  emojiOff: { opacity: 0.5 },
  label: { fontSize: 10, fontWeight: '500' },
  labelOn: { color: colors.tabActive },
  labelOff: { color: colors.tabInactive },
});

// ── Shared header options ─────────────────────────────────────────────────────

const sharedHeaderOptions = {
  headerStyle: { backgroundColor: colors.bg },
  headerShadowVisible: false,
  headerLeft: () => <PhaseSelector />,
  headerLeftContainerStyle: { paddingLeft: spacing.md },
  headerRight: () => <RoadmapToggle />,
  headerRightContainerStyle: { paddingRight: spacing.md },
};

// ── Tab navigator ─────────────────────────────────────────────────────────────

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.tabBg,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 4,
        },
        tabBarShowLabel: false,
        headerShown: true,
        ...sharedHeaderOptions,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: '',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: '',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

// ── Main stack (tabs + Contributor transition screen) ─────────────────────────

function MainStackNavigator() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Tabs" component={MainTabs} />
      <MainStack.Screen
        name="StageTransition"
        component={StageTransitionScreen}
        options={{ animation: 'fade' }}
      />
    </MainStack.Navigator>
  );
}

// ── Root navigator ────────────────────────────────────────────────────────────

export default function AppNavigator() {
  const { hasOnboarded } = useJourney();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {!hasOnboarded ? (
        <>
          {/* Join flow — Member → Explorer → Contributor progression education */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen
            name="MemberCelebration"
            component={MemberCelebrationScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Survey"
            component={SurveyScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ExplorerCelebration"
            component={CelebrationScreen}
            options={{ animation: 'fade' }}
          />
        </>
      ) : (
        <Stack.Screen name="Main" component={MainStackNavigator} options={{ animation: 'fade' }} />
      )}
    </Stack.Navigator>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.sm + 2, paddingVertical: spacing.xs + 2,
    borderRadius: radius.full, gap: 4,
  },
  toggleActive: {
    backgroundColor: colors.roadmapAccent + '18',
    borderWidth: 1, borderColor: colors.roadmapAccent + '60',
  },
  toggleInactive: {
    backgroundColor: colors.borderLight,
    borderWidth: 1, borderColor: colors.border,
  },
  toggleEmoji: { fontSize: 14 },
  toggleText: { ...typography.captionMed, fontWeight: '600' },
  toggleTextActive: { color: colors.roadmapAccent },
  toggleTextInactive: { color: colors.textSecondary },
});
