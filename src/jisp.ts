// Declare type ASTNode
type AstNode = string | number | symbol | AstNode[] | Function | null;

const DEBUG = false;

function atom(token: string): number | string | symbol {
  const tryNumber = Number(token);
  if (!isNaN(tryNumber)) {
    return tryNumber;
  }
  return Symbol.for(token);
}

function tokenize(input: string): string[] {
  const parantheses = new Set(['(', ')']);
  const whitespaces = new Set([' ', '\n', '\t', '\r']);

  const output = [];
  let pos = 0;
  while (pos < input.length) {
    const char = input[pos];
    if (parantheses.has(char)) {
      output.push(char);
      pos++;
    // else if char is a whitespace including newline and tab
    } else if (whitespaces.has(char)) {
      pos++;
    } else {
      let token = '';
      while (pos < input.length &&
        !(whitespaces.has(input[pos]) || parantheses.has(input[pos]))) {
        token += input[pos];
        pos++;
      }
      output.push(atom(token));
    }
  }
  return output;
}

function buildAst(tokens: string[]): AstNode {
  if (tokens.length === 0) {
    throw new Error('Unexpected end of input');
  }

  const token = tokens.shift();
  if (token === '(') {
    const list: AstNode[] = [];
    while (tokens[0] !== ')') {
      list.push(buildAst(tokens));
    }
    tokens.shift();
    return list;
  } else if (token === ')') {
    throw new Error('Unexpected )');
  } else {
    return token;
  }
}

export function parse(input: string): AstNode {
  const tokens = tokenize(input);
  return buildAst(tokens);
}

export function stdEnv(): Map<symbol, AstNode> {
  const env = new Map();
  const ops = {
    // Maths
    '+': (a: number, b: number) => a + b,
    '-': (a: number, b: number) => a - b,
    '*': (a: number, b: number) => a * b,
    '/': (a: number, b: number) => a / b,
    '>': (a: number, b: number) => a > b,
    '<': (a: number, b: number) => a < b,
    '>=': (a: number, b: number) => a >= b,
    '<=': (a: number, b: number) => a <= b,
    '=': (a: number, b: number) => a === b,
    pi: Math.PI,
    abs: (a: number) => Math.abs(a),
    expt: (a: number) => Math.exp(a),
    max: (a: number, b: number) => Math.max(a, b),
    min: (a: number, b: number) => Math.min(a, b),
    not: (a: boolean) => !a,

    'eq?': (a: AstNode, b: AstNode) => a === b,
    'equal?': (a: AstNode, b: AstNode) => a == b,

    // Types
    'null?': (a: AstNode) => a === null,
    'number?': (a: AstNode) => typeof a === 'number',
    'bool?': (a: AstNode) => typeof a === 'boolean',
    'symbol?': (a: AstNode) => typeof a === 'string',
    'list?': (a: AstNode) => Array.isArray(a),

    // Lists
    list: (...args: AstNode[]) => args,
    append: (a: AstNode[], b: AstNode[]) => a.concat(b),
    apply: (fn: Function, args: AstNode[]) => fn(...args),
    car: (a: AstNode[]) => a[0],
    cdr: (a: AstNode[]) => a.slice(1),
    cons: (a: AstNode, b: AstNode[]) => [a].concat(b),
    length: (a: AstNode[]) => a.length,
    // @ts-ignore
    map: (fn: Function, a: AstNode[]) => a.map(fn),

    begin: (...args: AstNode[]) => args[args.length - 1],
    print: (...args: AstNode[]) => {
      console.log(...args);
    },
  };

  for (const key in ops) {
    env.set(Symbol.for(key), ops[key]);
  }
  return env;
}

function evaluate(ast: AstNode, env = stdEnv()): AstNode {
  let result: AstNode = null;
  // if ast is a symbol, look it up in the environment
  if (typeof ast === 'symbol') {
    result = env.get(ast);
  } else if (typeof ast === 'number') {
    result = ast;
  } else if (typeof ast === 'string') {
    result = ast;
  } else if (Array.isArray(ast)) {
    // Handle 'if'
    const [op, ...args] = ast;
    if (op === Symbol.for('if')) {
      const [test, conseq, alt] = ast.slice(1);
      const expr = evaluate(test, env) ? conseq : alt;
      result = evaluate(expr, env);
    } else if (op === Symbol.for('def')) {
      const [symbol, expr] = ast.slice(1);
      env.set(symbol as symbol, evaluate(expr, env));
      result = 0;
    } else if (op === Symbol.for('fn')) {
      const [params, body] = args;
      result = (...args: AstNode[]) => {
        const newEnv = new Map(env);
        (params as AstNode[]).forEach((param: symbol, i: number) => {
          newEnv.set(param, args[i]);
        });
        return evaluate(body, newEnv);
      };
    } else {
      const proc = evaluate(op, env) as Function;
      if (typeof proc === 'function') {
        const args = ast.slice(1).map((arg) => evaluate(arg, env));
        result = proc(...args);
      } else {
        throw new Error(`Cannot call ${String(op)}`);
      }
    }
  }
  if (DEBUG) {
    console.log('evaluate', ast);
    console.log('result', result);
  }
  return result;
}

export function run(input: string) {
  const ast = parse(input);
  return evaluate(ast);
}
