#!/usr/bin/env node

import {
  existsSync,
  statSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdir
} from 'fs';
import {
  createInterface
} from 'readline';
import {
  parse,
  join
} from 'path';
import chalk from 'chalk';

// Create readline interface
let rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to split file into segments
function splitFile(filename, segmentSize) {
  // Check if file exists
  if (!existsSync(filename)) {
    console.log(chalk.red(`File not found: ${chalk.underline(filename)}`));
    process.exit();
  }

  // Check if segment size is a number
  if (isNaN(segmentSize)) {
    console.log(chalk.red('Not a number'))
    process.exit();
  }

  // Get file stats
  let fileStat = statSync(filename);
  if (!fileStat.isFile()) {
    console.log(chalk.red(`Not a file: ${chalk.underline(filename)}`));
    process.exit();
  }

  // Check if file size is smaller than segment size
  let fileSize = fileStat.size;
  let segmentSizeBytes = segmentSize * 1024 * 1024;
  if (fileSize <= segmentSizeBytes) {
    console.log(chalk.yellow(`File size is smaller than the segment size. No need to split.`));
    process.exit();
  }

  // Create directory to store segments
  let {
    dir: fileDir,
    name: fileName,
    ext: fileExt
  } = parse(filename);
  let numParts = Math.ceil(fileSize / segmentSizeBytes);
  let dirName = `${fileName}_parts`;
  mkdirSync(dirName, {
    recursive: true
  });

  // Split file into segments
  let fileData = readFileSync(filename);
  console.log(chalk.blue(`Spliting ${filename} into ${chalk.underline(numParts)} parts \n\n`))

  for (let i = 0; i < numParts; i++) {
    let partPath = join(dirName, `${fileName}_part${i + 1}${fileExt}`);
    let start = i * segmentSizeBytes;
    let end = Math.min((i + 1) * segmentSizeBytes, fileSize);
    let partData = fileData.slice(start, end);
    writeFileSync(partPath, partData);
    console.log(chalk.green(`File ${(i + 1)}: ${chalk.underline(partPath)}`));
  }

  process.exit();
}

// Function to ask user for input
function askUser() {
  readdir('.', (err, files) => {
    console.clear();
    console.log(chalk.bold.green('Welcome to Smallize: Segment large files into smaller ones \n'));
    console.log(chalk.green.bold('Files:'));
    console.log(chalk.blue(...files), '\n');

    // Prompt user for file and segment size
    rl.question('Enter a file to split (or type "exit" to stop): ', (input) => {
      if (input.toLowerCase() === 'exit') {
        rl.close();
        process.exit();
      }

      // If input is blank, prompt again
      if (input.trim() === '') {
        askUser();
      }

      rl.question(`Enter segment size for file ${input} (in MB): `, (segmentSize) => {
        splitFile(input, segmentSize);
      });
    });
  });
}

if (process.argv.length === 3) {
  if (process.argv.slice(2)[filename] == ('--help' | '-h')) {
    console.log(chalk.green('Welcome to Smallize'))
    console.log(chalk.green('Split your long files intro shorter ones \n\n'))
    console.log(chalk.yellow('1: Run `npx smallize`'))
    console.log(chalk.yellow('2: Enter a file in that dir'))
    console.log(chalk.yellow('3: Enter the spilt size in megabytes  more than 0 and the filesize'))
    console.log(chalk.yellow.bold('OR'))
    console.log(chalk.yellow('1: Run npx smallize filename size'))
  }

  // If the user provides a file name as a command line argument, use a default segment size of 50MB
  const [filename] = process.argv.slice(2);
  const segmentSize = 50;
  splitFile(filename, segmentSize);
} else if (process.argv.length === 4) {
  // If the user provides both a file name and segment size as command line arguments, use them
  const [filename, segmentSize] = process.argv.slice(2);
  splitFile(filename, segmentSize);
} else {
  // Otherwise, ask the user for a file name and segment size through the command line interface
  askUser();
}