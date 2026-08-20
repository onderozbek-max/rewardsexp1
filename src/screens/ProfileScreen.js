import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_MEMBER, POINTS_HISTORY, LEGACY_TOTAL_POINTS } from '../data/profile';
import { colors, typography, spacing, radius, shadows } from '../theme';

function HistoryItem({ item }) {
  return (
    <View style={styles.historyItem}>
      <View style={styles.historyIcon}>
        <Text style={styles.historyIconText}>⭐</Text>
      </View>
      <View style={styles.historyContent}>
        <Text style={styles.historyLabel}>{item.label}</Text>
        <Text style={styles.historyDate}>{item.earnedAt}</Text>
      </View>
      <Text style={styles.historyPoints}>+{item.points}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + spacing.xxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile header */}
      <LinearGradient
        colors={[colors.navy, colors.navyMid]}
        style={[styles.header, { paddingTop: insets.top + spacing.md }]}
      >
        {/* Avatar */}
        <View style={styles.avatarArea}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{MOCK_MEMBER.initials}</Text>
          </View>
          <View style={styles.avatarMeta}>
            <Text style={styles.name}>{MOCK_MEMBER.name}</Text>
            <Text style={styles.memberSince}>Member since {MOCK_MEMBER.memberSince}</Text>
            <Text style={styles.memberNumber}>{MOCK_MEMBER.memberNumber}</Text>
          </View>
        </View>

        {/* Points total (legacy view) */}
        <View style={styles.legacyPointsCard}>
          <Text style={styles.legacyPointsLabel}>Total Reward Points</Text>
          <Text style={styles.legacyPointsNum}>⭐ {LEGACY_TOTAL_POINTS}</Text>
          <Text style={styles.legacyPointsNote}>
            Points are earned by completing community surveys.
          </Text>
        </View>
      </LinearGradient>

      {/* Legacy notice banner */}
      <View style={styles.legacyBanner}>
        <Text style={styles.legacyBannerIcon}>📋</Text>
        <Text style={styles.legacyBannerText}>
          This is the current profile experience — points without context.
        </Text>
      </View>

      {/* Points history */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Reward Points History</Text>
          <Text style={styles.sectionCount}>{POINTS_HISTORY.length} entries</Text>
        </View>
        <View style={[styles.historyCard, shadows.sm]}>
          {POINTS_HISTORY.map((item, i) => (
            <React.Fragment key={item.id}>
              <HistoryItem item={item} />
              {i < POINTS_HISTORY.length - 1 && <View style={styles.historyDivider} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Settings placeholders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={[styles.settingsCard, shadows.sm]}>
          {['Notification Preferences', 'Privacy Settings', 'Help & Support', 'About Community'].map(
            (item, i, arr) => (
              <React.Fragment key={i}>
                <TouchableOpacity style={styles.settingsItem} activeOpacity={0.7}>
                  <Text style={styles.settingsItemText}>{item}</Text>
                  <Text style={styles.settingsChevron}>›</Text>
                </TouchableOpacity>
                {i < arr.length - 1 && <View style={styles.settingsDivider} />}
              </React.Fragment>
            )
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {},
  header: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  avatarArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    ...typography.h3,
    color: '#FFFFFF',
  },
  avatarMeta: {
    flex: 1,
  },
  name: {
    ...typography.h3,
    color: '#FFFFFF',
  },
  memberSince: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },
  memberNumber: {
    ...typography.micro,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  legacyPointsCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  legacyPointsLabel: {
    ...typography.label,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: spacing.xs,
  },
  legacyPointsNum: {
    ...typography.h2,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  legacyPointsNote: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.5)',
  },
  legacyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.goldLight,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gold + '40',
  },
  legacyBannerIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  legacyBannerText: {
    ...typography.caption,
    color: colors.goldDark,
    flex: 1,
    lineHeight: 18,
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionCount: {
    ...typography.caption,
    color: colors.textMuted,
  },
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  historyIconText: {
    fontSize: 16,
  },
  historyContent: {
    flex: 1,
  },
  historyLabel: {
    ...typography.smallMed,
    color: colors.text,
  },
  historyDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  historyPoints: {
    ...typography.bodyMed,
    color: colors.gold,
  },
  historyDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },
  settingsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  settingsItemText: {
    ...typography.bodyMed,
    color: colors.text,
  },
  settingsChevron: {
    ...typography.h3,
    color: colors.textMuted,
  },
  settingsDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },
});
