# Jisp
Jisp is a minimal Lisp like language with an interpreter written in Typescript.
J stands for JavaScript or Jeanno, if that matters.

## Example
You can write simple programs like this in `examples/fac.jisp`.
```
(begin
  (def fac (fn (n)
    (if (= 0 n)
      1
      (* n (fac (- n 1))))))
  (print (fac 100))
)
```

Or something more complicated like this in `examples/fib.jisp`.
```
(begin
  (def fib (fn (n)
    (if (= 0 n)
      0
      (if (= 1 n)
        1
        (+ (fib (- n 2)) (fib (- n 1)))))))
  (def loopFib (fn (start maxN)
    (begin
      (print (fib start))
      (if (= start maxN)
        0
        (loopFib (+ 1 start) maxN)))))
  (loopFib 0 30)
)
```

## Run
```
npm install
npm start run ./examples/fac.jisp

> jisp@0.0.1 start
> ts-node src/index.ts

3628800
```

## TODO
Jisp is a production ready programming language except that there are still
quite a few fundamentals to be implemented.

More cutting edge features to come:
- Support string type
- Write a hello world program
- Support comments
- Better REPL environment
- Move math related ops and constants (e.g. pi) into library
- `import` keyword
- Macros
