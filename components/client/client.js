fs = require('fs');
const readline = require('readline');
let fetch = require('node-fetch');

const filename = process.argv[2],
start_counter = process.argv[3] || 0,
address_api_server = process.argv[4] || 'http://localhost:3001/api/documents/text';

var counter = 0;

console.log('filename: ' + filename, 'start_counter: ' + start_counter);

(async function processLineByLine() {
    const fileStream = fs.createReadStream('./files/' + filename);
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
  
    for await (const line of rl) {
        if (counter++ < start_counter)
            continue;

        try {

        const jsonline = JSON.parse(line);
        const newjsonline = {
            reviewText: jsonline.reviewText,
            overall: jsonline.overall
        }

        const res = await fetch(address_api_server, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newjsonline)
            });

        console.log(`line: ${counter-1} has been sent correctly`);
        }catch(error) {
            console.log(`error line: ${counter-1}, error: ${error}`);
        }
    }
  })();