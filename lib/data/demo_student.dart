import '../models/student_progress.dart';

StudentProgress createDemoStudent() => StudentProgress(
  name: 'Аян',
  grade: 3,
  xp: 1250,
  streak: 6,
  currency: 340,
  worldUnlocks: {'math', 'home'},
);
