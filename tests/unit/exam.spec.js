import Exam from '../../src/services/exam';

describe('exam', () => {
  test('check result', () => {
    const questions = [
      {
        id: 1,
        data: {
          question: 'correct 2',
          correct: 2,
          options: [
            { text: 'incorrect', id: 1 },
            { text: 'correct', id: 2 },
            { text: 'incorrect', id: 3 },
          ],
        },
      },
    ];
    const submittedCorrect = {
      1: '2',
    };

    // const submittedIncorrect = {
    //   1: '3',
    // };

    const resultCorrect = {
      total: 1,
      submitted: 1,
      correct: 1,
      incorrect: 0,
      skipped: 0,
      questions: {
        1: {
          submitted: '2',
          correct: '2',
          isCorrect: true,
        },
      },
    };

    expect(Exam.checkAnswer(questions, submittedCorrect)).toMatchObject(resultCorrect);
  });
});
