import 'package:bilimai/data/demo_math_repository.dart';
import 'package:bilimai/models/question.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test(
    'Two grade 3 missions resolve ten unique, answerable math questions',
    () async {
      const repository = DemoMathRepository();
      final missions = await repository.missionsFor(Subject.math, 3);
      final ids = <String>{};
      for (final mission in missions) {
        final questions = await repository.questionsFor(mission.id);
        expect(questions.length, 5);
        for (final question in questions) {
          expect(ids.add(question.id), isTrue);
          expect(
            question.options.where((o) => o == question.correctAnswer).length,
            1,
          );
          expect(question.hint, isNotEmpty);
          expect(question.explanation, isNotEmpty);
        }
      }
      expect(ids.length, 10);
      expect(await repository.missionsFor(Subject.math, 1), isEmpty);
      await expectLater(
        repository.questionsFor('missing'),
        throwsArgumentError,
      );
    },
  );
}
