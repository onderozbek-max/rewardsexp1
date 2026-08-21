/**
 * Demo phase selector — prototype-only control.
 *
 * Purple-tinted to signal it is NOT part of the member-facing product UI.
 *
 * Phases:
 *   Ctrl → Control: baseline Community experience (no rewards progression)
 *   MVP  → Experiment 1 MVP: Member + Explorer + Contributor at 200 pts
 *   FF1  → Fast Follow 1: MVP + persistent benefit visibility on Home
 *   FF2  → Fast Follow 2: FF1 + enhanced activity-completion feedback
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useJourney } from '../context/JourneyContext';
import { typography, spacing, radius } from '../theme';

const PHASES = [
  { key: 'control', label: 'Ctrl' },
  { key: 'mvp',     label: 'MVP'  },
  { key: 'ff1',     label: 'FF1'  },
  { key: 'ff2',     label: 'FF2'  },
];

export default function PhaseSelector() {
  const { currentPhase, switchPhase } = useJourney();

  return (
    <View style={styles.wrapper}>
      <Text style={styles.icon}>🧪</Text>
      <View style={styles.pills}>
        {PHASES.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.pill, currentPhase === key && styles.pillActive]}
            onPress={() => switchPhase(key)}
            activeOpacity={0.75}
          >
            <Text style={[styles.pillText, currentPhase === key && styles.pillTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const PROTO = '#7C3AED';

const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  icon: { fontSize: 13 },
  pills: {
    flexDirection: 'row',
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.25)',
    padding: 2,
    gap: 1,
  },
  pill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.full,
    minWidth: 34,
    alignItems: 'center',
  },
  pillActive: { backgroundColor: PROTO },
  pillText: { ...typography.label, fontSize: 10, color: PROTO },
  pillTextActive: { color: '#FFFFFF' },
});
