/**
 * RoadmapPanel — Experiment 1 implementation roadmap.
 *
 * 5-bucket information architecture (NOT a flat phase list):
 *   NOW            → Experiment 1 MVP
 *   NEXT           → FF1, FF2, Evidence-Driven Iteration
 *   PLATFORM       → Admin Point Governance (not member-facing)
 *   MAJOR MILESTONES → Milestone 1 (Unified New-Member), Milestone 2 (Existing-Member)
 *   FUTURE MODEL   → Influencer, Co-creator, point depreciation (params TBD)
 *
 * No predetermined FF3/FF4. Depreciation is a maintenance model, not a milestone.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { EXPERIMENT_ROADMAP, EXPERIMENT_HYPOTHESIS } from '../data/journey';
import { colors, typography, spacing, radius, shadows } from '../theme';

// Bucket display config — label, icon, accent color
const BUCKET_META = {
  NOW:               { icon: '🚀', accent: '#1E56C8', bg: '#EFF4FF' },
  NEXT:              { icon: '⚡', accent: '#8B5CF6', bg: '#F5F3FF' },
  PLATFORM:          { icon: '⚙️', accent: '#F59E0B', bg: '#FFFBEB' },
  'MAJOR MILESTONES':{ icon: '🏁', accent: '#10B981', bg: '#ECFDF5' },
  'FUTURE MODEL':    { icon: '🔮', accent: '#64748B', bg: '#F8FAFC' },
};

// Group roadmap entries by bucket (preserving order of first occurrence)
function groupByBucket(entries) {
  const order = [];
  const map = {};
  for (const entry of entries) {
    if (!map[entry.bucket]) {
      map[entry.bucket] = [];
      order.push(entry.bucket);
    }
    map[entry.bucket].push(entry);
  }
  return order.map((b) => ({ bucket: b, entries: map[b] }));
}

function RoadmapEntry({ entry, accent, isLast }) {
  const [expanded, setExpanded] = useState(entry.bucket === 'NOW'); // NOW expanded by default

  return (
    <View style={[entry_s.wrapper, !isLast && entry_s.wrapperBorder]}>
      <TouchableOpacity
        style={entry_s.header}
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.7}
      >
        <View style={entry_s.headerLeft}>
          <Text style={[entry_s.entryLabel, { color: accent }]}>{entry.label}</Text>
          <Text style={entry_s.entryTitle}>{entry.title}</Text>
        </View>
        <Text style={[entry_s.chevron, expanded && entry_s.chevronOpen]}>›</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={entry_s.body}>
          {/* Learning question */}
          {entry.learningQuestion && (
            <View style={[entry_s.questionBox, { borderLeftColor: accent }]}>
              <Text style={[entry_s.questionLabel, { color: accent }]}>Learning question</Text>
              <Text style={entry_s.questionText}>"{entry.learningQuestion}"</Text>
            </View>
          )}

          {/* Audience tag (NOW only) */}
          {entry.audience && (
            <View style={entry_s.audienceRow}>
              <View style={[entry_s.audienceTag, { backgroundColor: accent + '18', borderColor: accent + '40' }]}>
                <Text style={[entry_s.audienceText, { color: accent }]}>👤 {entry.audience}</Text>
              </View>
            </View>
          )}

          {/* Build items */}
          {entry.items && entry.items.length > 0 && (
            <View style={entry_s.itemsList}>
              {entry.items.map((item, i) => (
                <View key={i} style={entry_s.item}>
                  <Text style={[entry_s.itemDot, { color: accent }]}>·</Text>
                  <Text style={entry_s.itemText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Note */}
          {entry.note && (
            <View style={entry_s.noteBox}>
              <Text style={entry_s.noteText}>{entry.note}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

function BucketSection({ bucket, entries }) {
  const meta = BUCKET_META[bucket] ?? { icon: '•', accent: colors.blue, bg: colors.bluePale };
  const [bucketExpanded, setBucketExpanded] = useState(true);

  return (
    <View style={[bucket_s.section, shadows.sm]}>
      {/* Bucket header */}
      <TouchableOpacity
        style={[bucket_s.header, { backgroundColor: meta.bg }]}
        onPress={() => setBucketExpanded((v) => !v)}
        activeOpacity={0.8}
      >
        <View style={bucket_s.headerLeft}>
          <Text style={bucket_s.headerIcon}>{meta.icon}</Text>
          <Text style={[bucket_s.headerLabel, { color: meta.accent }]}>{bucket}</Text>
        </View>
        <Text style={[bucket_s.chevron, bucketExpanded && bucket_s.chevronOpen]}>›</Text>
      </TouchableOpacity>

      {/* Entries */}
      {bucketExpanded && (
        <View style={bucket_s.entries}>
          {entries.map((entry, i) => (
            <RoadmapEntry
              key={entry.id}
              entry={entry}
              accent={meta.accent}
              isLast={i === entries.length - 1}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export default function RoadmapPanel() {
  const grouped = groupByBucket(EXPERIMENT_ROADMAP);

  return (
    <View style={panel.container}>
      {/* Panel header */}
      <View style={panel.header}>
        <View style={panel.headerRow}>
          <Text style={panel.headerIcon}>🔭</Text>
          <Text style={panel.title}>Experiment 1 — Implementation Roadmap</Text>
        </View>
        <Text style={panel.subtitle}>
          What we're building and why, in order of evidence confidence.
        </Text>
      </View>

      {/* Bucket sections */}
      <View style={panel.body}>
        {grouped.map(({ bucket, entries }) => (
          <BucketSection key={bucket} bucket={bucket} entries={entries} />
        ))}
      </View>

      {/* Hypothesis anchor */}
      <View style={panel.hypothesis}>
        <Text style={panel.hypothesisLabel}>Experiment hypothesis</Text>
        <Text style={panel.hypothesisText}>"{EXPERIMENT_HYPOTHESIS}"</Text>
      </View>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const panel = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.roadmapBorder,
    overflow: 'hidden',
    ...shadows.md,
  },
  header: {
    backgroundColor: colors.roadmapBg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.roadmapBorder,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: 3 },
  headerIcon: { fontSize: 13 },
  title: { ...typography.label, color: colors.roadmapLabel, letterSpacing: 0.4 },
  subtitle: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },
  body: { padding: spacing.md, gap: spacing.sm },
  hypothesis: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    marginTop: spacing.xs,
    backgroundColor: colors.bluePale,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.blue,
  },
  hypothesisLabel: { ...typography.label, color: colors.blue, fontSize: 10, marginBottom: spacing.xs },
  hypothesisText: { ...typography.small, color: colors.text, lineHeight: 20, fontStyle: 'italic' },
});

const bucket_s = StyleSheet.create({
  section: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  headerIcon: { fontSize: 14 },
  headerLabel: { ...typography.label, fontSize: 10, letterSpacing: 0.8 },
  chevron: { fontSize: 18, color: colors.textMuted, lineHeight: 20 },
  chevronOpen: { transform: [{ rotate: '90deg' }] },
  entries: { borderTopWidth: 1, borderTopColor: colors.border },
});

const entry_s = StyleSheet.create({
  wrapper: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  wrapperBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight, paddingBottom: spacing.sm },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: spacing.xs,
  },
  headerLeft: { flex: 1, paddingRight: spacing.sm },
  entryLabel: { ...typography.label, fontSize: 10, marginBottom: 2 },
  entryTitle: { ...typography.smallMed, color: colors.text, lineHeight: 20 },
  chevron: { fontSize: 16, color: colors.textMuted, lineHeight: 20, paddingTop: 2 },
  chevronOpen: { transform: [{ rotate: '90deg' }] },
  body: { paddingBottom: spacing.md },
  questionBox: {
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  questionLabel: { ...typography.label, fontSize: 10, marginBottom: spacing.xs },
  questionText: { ...typography.small, color: colors.text, lineHeight: 20, fontStyle: 'italic' },
  audienceRow: { marginBottom: spacing.sm },
  audienceTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  audienceText: { ...typography.captionMed, fontSize: 11 },
  itemsList: { gap: 4 },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  itemDot: { ...typography.h4, lineHeight: 20, width: 10 },
  itemText: { flex: 1, ...typography.small, color: colors.textSecondary, lineHeight: 20 },
  noteBox: {
    marginTop: spacing.sm,
    backgroundColor: colors.goldLight,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  noteText: { ...typography.caption, color: colors.goldDark, lineHeight: 18 },
});
