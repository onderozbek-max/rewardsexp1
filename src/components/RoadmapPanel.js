import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { EXPERIMENT_ROADMAP, EXPERIMENT_HYPOTHESIS } from '../data/journey';
import { useJourney } from '../context/JourneyContext';
import { colors, typography, spacing, radius, shadows } from '../theme';

const PHASE_COLORS = {
  phase1: '#1E56C8',
  phase2: '#8B5CF6',
  phase3: '#10B981',
};

function PhaseRow({ phase, isActive, isExpanded, onToggle, isLast }) {
  const expandAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  const color = PHASE_COLORS[phase.id] ?? colors.blue;

  return (
    <View style={row.wrapper}>
      {/* Timeline */}
      <View style={row.timeline}>
        <View style={[row.dot, isActive ? { backgroundColor: color, borderColor: color } : row.dotPlanned]} />
        {!isLast && <View style={[row.line, { backgroundColor: isActive ? color + '30' : colors.border }]} />}
      </View>

      {/* Content */}
      <View style={row.content}>
        <TouchableOpacity style={row.header} onPress={onToggle} activeOpacity={0.65}>
          <View style={row.headerLeft}>
            <Text style={[row.phaseLabel, { color }]}>{phase.label}</Text>
            <Text style={row.phaseTitle}>{phase.title}</Text>
          </View>
          <View style={row.headerRight}>
            {isActive ? (
              <View style={[row.badge, { backgroundColor: color + '18' }]}>
                <Text style={[row.badgeText, { color }]}>● Current</Text>
              </View>
            ) : (
              <View style={row.badgePlanned}>
                <Text style={row.badgePlannedText}>Planned</Text>
              </View>
            )}
            <Text style={[row.chevron, isExpanded && row.chevronOpen]}>›</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <Animated.View style={{ opacity: expandAnim }}>
            <View style={row.body}>
              <View style={[row.goalBox, { borderLeftColor: color }]}>
                <Text style={[row.goalLabel, { color }]}>Goal</Text>
                <Text style={row.goalText}>{phase.goal}</Text>
              </View>
              <Text style={row.listLabel}>What ships in this phase</Text>
              {phase.items.map((item, i) => (
                <View key={i} style={row.listItem}>
                  <Text style={[row.listCheck, { color }]}>{isActive ? '✓' : '·'}</Text>
                  <Text style={row.listText}>{item}</Text>
                </View>
              ))}
              {phase.integrationNote && (
                <View style={row.integrationBox}>
                  <Text style={row.integrationLabel}>🔗 Integration Note</Text>
                  <Text style={row.integrationText}>{phase.integrationNote}</Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {!isLast && <View style={{ height: spacing.md }} />}
      </View>
    </View>
  );
}

export default function RoadmapPanel() {
  const { currentPhase } = useJourney();
  // Control mode has no phase number — default to phase1 expanded in roadmap
  const activePhaseId = currentPhase === 'control' ? 'phase1' : `phase${currentPhase}`;
  const [expandedId, setExpandedId] = useState(activePhaseId);

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  // Keep active phase expanded when switching
  useEffect(() => {
    setExpandedId(currentPhase === 'control' ? 'phase1' : `phase${currentPhase}`);
  }, [currentPhase]);

  return (
    <View style={panel.container}>
      {/* Header */}
      <View style={panel.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Text style={{ fontSize: 13 }}>🔭</Text>
          <Text style={panel.title}>Experiment 1 · Phase Roadmap</Text>
        </View>
        <Text style={panel.subtitle}>Value Clarity — three phases, one hypothesis</Text>
      </View>

      {/* Phase list */}
      <View style={panel.body}>
        {EXPERIMENT_ROADMAP.map((phase, i) => {
          const phaseNum = i + 1;
          return (
            <PhaseRow
              key={phase.id}
              phase={phase}
              isActive={currentPhase !== 'control' && phaseNum === currentPhase}
              isExpanded={expandedId === phase.id}
              onToggle={() => toggle(phase.id)}
              isLast={i === EXPERIMENT_ROADMAP.length - 1}
            />
          );
        })}
      </View>

      {/* Hypothesis anchor */}
      <View style={panel.hypothesis}>
        <Text style={panel.hypothesisLabel}>Hypothesis — all three phases</Text>
        <Text style={panel.hypothesisText}>"{EXPERIMENT_HYPOTHESIS}"</Text>
      </View>
    </View>
  );
}

const DOT = 12;

const row = StyleSheet.create({
  wrapper: { flexDirection: 'row' },
  timeline: { width: 32, alignItems: 'center', paddingTop: 3 },
  dot: {
    width: DOT, height: DOT, borderRadius: DOT / 2,
    borderWidth: 2, zIndex: 1,
  },
  dotPlanned: { backgroundColor: colors.card, borderColor: colors.border },
  line: { width: 2, flex: 1, minHeight: 20, marginTop: 3 },
  content: { flex: 1, paddingLeft: spacing.sm },
  header: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', paddingVertical: spacing.xs,
  },
  headerLeft: { flex: 1, paddingRight: spacing.sm },
  phaseLabel: { ...typography.label, fontSize: 10, marginBottom: 1 },
  phaseTitle: { ...typography.smallMed, color: colors.text },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingTop: 2 },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.full },
  badgeText: { ...typography.micro, fontSize: 9 },
  badgePlanned: { backgroundColor: colors.borderLight, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.full },
  badgePlannedText: { ...typography.micro, fontSize: 9, color: colors.textMuted },
  chevron: { fontSize: 18, color: colors.textMuted, lineHeight: 20 },
  chevronOpen: { transform: [{ rotate: '90deg' }], color: colors.textSecondary },
  body: { paddingBottom: spacing.md, paddingRight: spacing.xs },
  goalBox: {
    backgroundColor: colors.bluePale, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.md, borderLeftWidth: 3,
  },
  goalLabel: { ...typography.label, fontSize: 10, marginBottom: spacing.xs },
  goalText: { ...typography.small, color: colors.text, lineHeight: 20 },
  listLabel: { ...typography.label, color: colors.textMuted, fontSize: 10, marginBottom: spacing.xs },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 3 },
  listCheck: { ...typography.smallMed, width: 16, lineHeight: 20 },
  listText: { flex: 1, ...typography.small, color: colors.textSecondary, lineHeight: 20 },
  integrationBox: {
    marginTop: spacing.md, backgroundColor: colors.goldLight,
    borderRadius: radius.md, padding: spacing.md,
    borderLeftWidth: 3, borderLeftColor: colors.gold,
  },
  integrationLabel: { ...typography.label, fontSize: 10, color: colors.goldDark, marginBottom: spacing.xs },
  integrationText: { ...typography.small, color: colors.goldDark, lineHeight: 20 },
});

const panel = StyleSheet.create({
  container: {
    backgroundColor: colors.card, borderRadius: radius.xl,
    borderWidth: 1.5, borderColor: colors.roadmapBorder,
    overflow: 'hidden', ...shadows.md,
  },
  header: {
    backgroundColor: colors.roadmapBg,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.roadmapBorder,
  },
  title: { ...typography.label, color: colors.roadmapLabel, letterSpacing: 0.4 },
  subtitle: { ...typography.h4, color: colors.text, marginTop: 2 },
  body: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  hypothesis: {
    marginHorizontal: spacing.md, marginBottom: spacing.md, marginTop: spacing.sm,
    backgroundColor: colors.bluePale, borderRadius: radius.md,
    padding: spacing.md, borderLeftWidth: 3, borderLeftColor: colors.blue,
  },
  hypothesisLabel: { ...typography.label, color: colors.blue, fontSize: 10, marginBottom: spacing.xs },
  hypothesisText: { ...typography.small, color: colors.text, lineHeight: 20, fontStyle: 'italic' },
});
