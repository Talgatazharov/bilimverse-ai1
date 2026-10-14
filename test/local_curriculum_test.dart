import 'package:flutter_test/flutter_test.dart';
import 'package:bilimai/data/local_curriculum_repository.dart';
import 'package:bilimai/models/question.dart';

void main() {
  test('every grade and local subject has a playable mission', () async {
    const content = LocalCurriculumRepository();
    for (var grade = 1; grade <= 4; grade++) {
      for (final subject in Subject.values) {
        final missions = await content.missionsFor(subject, grade);
        expect(missions, isNotEmpty, reason: '${subject.name} grade $grade');
        for (final mission in missions) {
          final questions = await content.questionsFor(mission.id);
          expect(questions.length, 5, reason: mission.id);
          expect(questions.map((q) => q.id).toSet().length, 5);
          for (final question in questions) {
            expect(question.options, contains(question.correctAnswer));
            expect(question.grade, grade);
          }
        }
      }
    }
  });
}
