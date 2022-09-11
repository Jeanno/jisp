import fs from 'fs';
import { run, repl } from './jisp';

function main() {
  // Take first argument as command
  const command = process.argv[2];
  if (!command) {
    console.error('Jisp: No command given');
    return;
  }

  if (command === 'run') {
    // Run the program
    const filePath = process.argv[3];

    // Read the whole file and pass it to run
    const program = fs.readFileSync(filePath, 'utf8');
    run(program);
  } else if (command === 'repl') {
    repl();
  } else {
    console.error('Jisp: Unknown command ' + command);
  }
}

main();
