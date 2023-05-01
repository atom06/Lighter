const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askUser() {
  rl.question('Enter a file to split (or type "exit" to stop): ', (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    if (!fs.existsSync(input)) {
      console.log(`File not found: ${input}`);
      askUser();
      return;
    }

    const fileStat = fs.statSync(input);
    if (!fileStat.isFile()) {
      console.log(`Not a file: ${input}`);
      askUser();
      return;
    }

    rl.question(`Enter segment size for file ${input} (in MB): `, (segmentSize) => {
      const fileSize = fileStat.size;
      const segmentSizeBytes = segmentSize * 1024 * 1024;

      if (fileSize <= segmentSizeBytes) {
        console.log(`File size is smaller than the segment size. No need to split.`);
        askUser();
        return;
      }

      const { dir: fileDir, name: fileName, ext: fileExt } = path.parse(input);
      
      const numParts = Math.ceil(fileSize / segmentSizeBytes);
      const dirName = `${fileName}_parts`;
      fs.mkdirSync(dirName, { recursive: true });

      const fileData = fs.readFileSync(input);
      for (let i = 0; i < numParts; i++) {
        const partPath = path.join(
          dirName,
          `${fileName}_part${i + 1}${fileExt}`
        );
        const start = i * segmentSizeBytes;
        const end = Math.min((i + 1) * segmentSizeBytes, fileSize);
        const partData = fileData.slice(start, end);
        fs.writeFileSync(partPath, partData);
        console.log(`Created file: ${partPath}`);
      }

      askUser();
    });
  });
}

askUser();