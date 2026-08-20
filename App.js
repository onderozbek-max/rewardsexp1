import 'react-native-gesture-handler';
import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { JourneyProvider } from './src/context/JourneyContext';
import { RoadmapProvider } from './src/context/RoadmapContext';
import AppNavigator from './src/navigation/AppNavigator';

// ─── Web phone frame constants ────────────────────────────────────────────────
// iPhone 14 Pro logical dimensions
const PHONE_W = 393;
const PHONE_H = 852;
const BEZEL = 14;

// Simulate iPhone 14 Pro safe-area insets on web.
// bottom = 0 so the tab bar stays normal height; home indicator is a visual overlay only.
const WEB_METRICS = {
  frame: { x: 0, y: 0, width: PHONE_W, height: PHONE_H },
  insets: { top: 47, right: 0, bottom: 0, left: 0 },
};

// ─── Status bar mock ──────────────────────────────────────────────────────────
function WebStatusBar() {
  return (
    <View style={phone.statusBar} pointerEvents="none">
      <Text style={phone.statusTime}>9:41</Text>
      {/* Dynamic Island — absolute black pill centered at top */}
      <View style={phone.dynamicIsland} />
      <View style={phone.statusRight}>
        <Text style={phone.statusIcon}>●●●</Text>
        <Text style={phone.statusIcon}>▲</Text>
        <Text style={phone.statusIcon}>▌▌▌</Text>
      </View>
    </View>
  );
}

// ─── Home indicator mock ──────────────────────────────────────────────────────
function WebHomeIndicator() {
  return (
    <View style={phone.homeArea} pointerEvents="none">
      <View style={phone.homePill} />
    </View>
  );
}

// ─── Phone shell ──────────────────────────────────────────────────────────────
function PhoneFrame({ children }) {
  return (
    <View style={phone.desktop}>
      {/* Ambient glow behind the phone */}
      <View style={phone.glow} />

      <View style={phone.shadow}>
        <View style={phone.bezel}>
          {/* Volume / mute buttons – left side */}
          <View style={[phone.btn, phone.btnMute]} />
          <View style={[phone.btn, phone.btnVolUp]} />
          <View style={[phone.btn, phone.btnVolDn]} />
          {/* Power button – right side */}
          <View style={[phone.btn, phone.btnPower]} />

          {/* Screen — hard clips everything to PHONE_W × PHONE_H */}
          <View style={phone.screen}>
            {/*
              Explicit hard-bounded container directly around navigation.
              This is the containment layer that prevents screens from
              escaping to viewport dimensions on web.
            */}
            <View style={phone.clip}>
              {children}
            </View>

            {/* Overlays that sit on top of app content */}
            <WebStatusBar />
            <WebHomeIndicator />
          </View>
        </View>
      </View>

      <Text style={phone.label}>Member's Mark Community · Interactive Prototype</Text>
    </View>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    return (
      <PhoneFrame>
        <SafeAreaProvider initialMetrics={WEB_METRICS}>
          <JourneyProvider>
            <RoadmapProvider>
              <NavigationContainer>
                <StatusBar style="light" />
                <AppNavigator />
              </NavigationContainer>
            </RoadmapProvider>
          </JourneyProvider>
        </SafeAreaProvider>
      </PhoneFrame>
    );
  }

  return (
    <SafeAreaProvider>
      <JourneyProvider>
        <RoadmapProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <AppNavigator />
          </NavigationContainer>
        </RoadmapProvider>
      </JourneyProvider>
    </SafeAreaProvider>
  );
}

// ─── Phone frame styles ───────────────────────────────────────────────────────
const phone = StyleSheet.create({
  desktop: {
    flex: 1,
    backgroundColor: '#0E1117',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: PHONE_H + 80,
    paddingVertical: 40,
  },
  glow: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(30, 86, 200, 0.12)',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -250 }, { translateY: -250 }],
  },
  shadow: {
    borderRadius: 54,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.7,
    shadowRadius: 48,
    elevation: 30,
  },
  bezel: {
    width: PHONE_W + BEZEL * 2,
    height: PHONE_H + BEZEL * 2,
    borderRadius: 54,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  screen: {
    width: PHONE_W,
    height: PHONE_H,
    borderRadius: 44,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
  },
  // Hard clip: explicit pixel dimensions + overflow hidden.
  // Unlike position:absolute, flex children cannot escape this box on web.
  clip: {
    width: PHONE_W,
    height: PHONE_H,
    overflow: 'hidden',
    flexShrink: 0,
  },
  // Status bar overlay
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 47,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 999,
  },
  statusTime: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    minWidth: 44,
  },
  dynamicIsland: {
    position: 'absolute',
    top: 5,
    alignSelf: 'center',
    left: (PHONE_W - 126) / 2,
    width: 126,
    height: 37,
    borderRadius: 19,
    backgroundColor: '#000000',
    zIndex: 1000,
  },
  // Dynamic Island pill rendered via the parent View — pure black pill
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 44,
    justifyContent: 'flex-end',
  },
  statusIcon: {
    fontSize: 10,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  // Home indicator overlay
  homeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 34,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
    zIndex: 999,
  },
  homePill: {
    width: 134,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  // Side hardware buttons
  btn: {
    position: 'absolute',
    backgroundColor: '#2C2C2E',
    borderRadius: 3,
  },
  btnMute: {
    left: -BEZEL - 3,
    top: 100,
    width: 4,
    height: 32,
  },
  btnVolUp: {
    left: -BEZEL - 3,
    top: 148,
    width: 4,
    height: 56,
  },
  btnVolDn: {
    left: -BEZEL - 3,
    top: 216,
    width: 4,
    height: 56,
  },
  btnPower: {
    right: -BEZEL - 3,
    top: 160,
    width: 4,
    height: 80,
  },
  // Prototype label under phone
  label: {
    marginTop: 24,
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 0.5,
  },
});
