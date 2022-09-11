import { run } from './jisp';

test('simple program', () => {
  const prog = '(begin (def r 10) (* pi (* r r)))';
  const result = run(prog);
  expect(result).toBe(314.1592653589793);
});

test('sum function', () => {
  const prog = `
    (begin
      (def a 10)
      (def b 2)
      (def sum (fn (x y) (+ x y)))
      (sum a b)
    )`;
  const result = run(prog);
  expect(result).toBe(12);
});
