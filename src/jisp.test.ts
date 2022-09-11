import { run } from './jisp';

test('simple program', () => {
  const prog = '(begin (define r 10) (* pi (* r r)))';
  const result = run(prog);
  expect(result).toBe(314.1592653589793);
});

test('sum function', () => {
  const prog = `
    (begin
      (define a 10)
      (define b 2)
      (define sum (lambda (x y) (+ x y)))
      (sum a b)
    )`;
  const result = run(prog);
  expect(result).toBe(12);
});
