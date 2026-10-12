import 'package:flutter/material.dart';

import 'game_colors.dart';

abstract final class GameLayout {
  static const space = 8.0;
  static const pagePadding = 24.0;
  static const touchTarget = 56.0;
  static const contentWidth = 720.0;
  static const quickMotion = Duration(milliseconds: 140);
  static const progressMotion = Duration(milliseconds: 650);
}

abstract final class GameTheme {
  static ThemeData get light => ThemeData(
    useMaterial3: true,
    fontFamily: 'NotoSans',
    scaffoldBackgroundColor: GameColors.cream,
    colorScheme: const ColorScheme.light(
      primary: GameColors.turquoise,
      onPrimary: GameColors.cream,
      secondary: GameColors.gold,
      onSecondary: GameColors.navy,
      surface: GameColors.cream,
      onSurface: GameColors.navy,
      error: GameColors.terracotta,
    ),
    textTheme: const TextTheme(
      displaySmall: TextStyle(
        fontSize: 36,
        fontWeight: FontWeight.w700,
        height: 1.15,
      ),
      headlineMedium: TextStyle(
        fontSize: 28,
        fontWeight: FontWeight.w700,
        height: 1.25,
      ),
      titleLarge: TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
      titleMedium: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
      bodyLarge: TextStyle(fontSize: 17, height: 1.5),
      bodyMedium: TextStyle(fontSize: 15, height: 1.5),
      labelLarge: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
    ).apply(bodyColor: GameColors.navy, displayColor: GameColors.navy),
  );
}
