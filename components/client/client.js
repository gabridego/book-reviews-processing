fs = require('fs');
const readline = require('readline');
let fetch = require('node-fetch');

const filename = process.argv[2],
start_counter = process.argv[3] || 0,
address_api_server = (process.argv[4] && (process.argv[4][process.argv[4].length-1] == "/" ? process.argv[4] + 'api/documents/text' : process.argv[4] + '/api/documents/text')) || 'http://localhost:3001/api/documents/text';



console.log('filename: ' + filename, 'start_counter: ' + start_counter, 'address_api_server: ' + address_api_server);

(async function processLineByLine() {
    let counter = 0;
    let current_loop = 0;

    while(true) {
        console.log(`starting loop number: ${current_loop}`);

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
                //mode: "cors",
                headers: {'Content-Type': 'application/json'},
                //headers: {'Content-Type': 'application/json', 'Connection': 'keep-alive','User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36', 'Accept': '*/*', 'Accept-Encoding': 'gzip, deflate', 'Accept-Language': 'en-IT,en;q=0.9,fr-IT;q=0.8,fr;q=0.7,it-IT;q=0.6,it;q=0.5,en-GB;q=0.4,en-US;q=0.3'},
                body: JSON.stringify(newjsonline)
                });
            
            console.log(`line: ${counter-1} has been sent correctly`);
            }catch(error) {
                console.log(`error line: ${counter-1}, error: ${error}`);
            }
        }

        fileStream.close();
        current_loop++;
        counter = 0;
    }
  })();