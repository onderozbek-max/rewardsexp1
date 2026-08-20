import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from '../theme';

export default function BenefitItem({
  icon,
  title,
  description,
  locked = false,
  compact = false,
  light = false,
}) {
  if (compact) {
    return (
      <View style={[styles.compactContainer, locked && styles.lockedCompact]}>
        <Text style={styles.compactIcon}>{locked ? '🔒' : icon}</Text>
        <Text
          style={[
            styles.compactTitle,
            locked && styles.lockedText,
            light && styles.lightText,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, locked && styles.lockedContainer]}>
      <View style={[styles.iconBox, locked && styles.lockedIconBox]}>
        <Text style={styles.icon}>{locked ? '🔒' : icon}</Text>
      </View>
      <View style={styles.textBox}>
        <Text style={[styles.title, locked && styles.lockedText, light && styles.lightText]}>
          {title}
        </Text>
        {description && !locked && (
          <Text style={[styles.description, light && styles.lightDesc]}>{description}</Text>
        )}
        {locked && (
          <Text style={styles.lockedDesc}>Locked</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  lockedContainer: {
    opacity: 0.5,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.bluePale,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    flexShrink: 0,
  },
  lockedIconBox: {
    backgroundColor: colors.borderLight,
  },
  icon: {
    fontSize: 18,
  },
  textBox: {
    flex: 1,
    paddingTop: 2,
  },
  title: {
    ...typography.smallMed,
    color: colors.text,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  lockedText: {
    color: colors.textMuted,
  },
  lockedDesc: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  lightText: {
    color: 'rgba(255,255,255,0.9)',
  },
  lightDesc: {
    color: 'rgba(255,255,255,0.65)',
  },
  // Compact chip style
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  lockedCompact: {
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  compactIcon: {
    fontSize: 13,
    marginRight: 5,
  },
  compactTitle: {
    ...typography.captionMed,
    color: colors.textInverse,
    maxWidth: 120,
  },
});
