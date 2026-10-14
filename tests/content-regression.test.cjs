const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

function loadTs(relativePath) {
  const filename = path.join(__dirname, '..', relativePath);
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2018 } }).outputText;
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  loaded._compile(compiled, filename);
  return loaded.exports;
}

const { ALL_MISSIONS } = loadTs('src/data/missions-data.ts');
const { extraQuestionsFor } = loadTs('src/data/question-variants.ts');
const { selectQuestions, questionFingerprint } = loadTs('src/lib/question-selection.ts');
const { LIBRARY_STORIES } = loadTs('src/data/library-stories.ts');

test('all grade 3 missions have a larger pool with stable unique IDs', () => {
  for (const mission of ALL_MISSIONS) {
    const pool = [...mission.questions, ...extraQuestionsFor(mission)];
    assert.ok(pool.length >= 9, `${mission.id} pool has ${pool.length}`);
    assert.equal(new Set(pool.map((question) => question.id)).size, pool.length, mission.id);
    for (const question of extraQuestionsFor(mission)) assert.ok(question.options.includes(question.correctAnswer), question.id);
  }
});

test('sessions contain no duplicate and next session prefers unseen questions', () => {
  for (const mission of ALL_MISSIONS) {
    const pool = [...mission.questions, ...extraQuestionsFor(mission)];
    const first = selectQuestions(pool, 5, [], () => .37);
    assert.equal(first.length, 5, mission.id);
    assert.equal(new Set(first.map((question) => question.id)).size, 5, mission.id);
    const history = first.map((question) => ({ id: question.id, fingerprint: questionFingerprint(question) }));
    const second = selectQuestions(pool, 5, history, () => .37);
    const overlap = second.filter((question) => history.some((entry) => entry.id === question.id)).length;
    assert.ok(overlap <= 1, `${mission.id} repeated ${overlap} questions`);
  }
});

test('similar arithmetic questions share one fingerprint; exhausted pool never repeats an ID in a session', () => {
  const sample = ALL_MISSIONS[0].questions[0];
  const a = { ...sample, question: '5 + 3 = ?', correctAnswer: '8' };
  const b = { ...sample, id: 'different', question: '5+3 неше болады?', correctAnswer: '8' };
  assert.equal(questionFingerprint(a), questionFingerprint(b));
  assert.equal(selectQuestions([a, b], 5, [], () => .4).length, 2);
});

test('matching questions retain valid pair data in the extended pools', () => {
  const matching = ALL_MISSIONS.flatMap((mission) => mission.questions.filter((question) => question.type === 'matching'));
  const dragDrop = ALL_MISSIONS.flatMap((mission) => mission.questions.filter((question) => question.type === 'dragDrop'));
  assert.equal(matching.length, 8);
  assert.equal(dragDrop.length, 1);
  for (const question of [...matching, ...dragDrop]) assert.ok(question.pairItems?.length >= 2, question.id);
});

test('library stories are full reading passages with reflection questions', () => {
  assert.equal(LIBRARY_STORIES.length, 5);
  for (const story of LIBRARY_STORIES) {
    const words = story.paragraphs.join(' ').trim().split(/\s+/).length;
    assert.ok(words >= 250 && words <= 450, `${story.title}: ${words} words`);
    assert.ok(story.paragraphs.length >= 5 && story.paragraphs.length <= 8, story.title);
    assert.equal(story.reflection.length, 3, story.title);
  }
});
