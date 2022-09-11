import { run } from './jisp';

function main() {
  const prog = `
    (begin
      (define a 10)
      (define b 2)
      (define sum (lambda (x y) (+ x y)))
      (sum a b)
    )`;
  const result = run(prog);
  console.log(result);
}

main();
