/*
Implement a node app called fetcher.js.

It should take two command line arguments:

1. a URL
2. a local file path
It should download the resource at the URL to the local path on your machine. Upon completion, it should print out a message like Downloaded and saved 1235 bytes to ./index.html.
*/

const agrs = process.argv.slice(2);
const url = agrs[0];
const filePath = agrs[1];
const request = require('request');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

request(url, (error, response, body) => {
  console.log('statusCode:', response.statusCode);
  if (response.statusCode > 400) {
    console.log("URL is invalid");
    return;
  } else {
    fs.open(filePath, err => {
      if (err) {
        console.error(err);
        console.log(`File path does not exist, please check again`);
        return;
      } else {
        fs.access(filePath, fs.F_OK, (err) => {
          if (!err) {
            rl.question(`File already exist! Do you want to override?`, (response) => {
              if (response === 'Y') {
                fs.writeFile(filePath, body, err => {
                  if (err) {
                    console.error(err);
                    return;
                  } else {
                    const stat = fs.statSync(filePath);
                    let fileSize = stat["size"];
                    console.log(`Downloaded and saved ${fileSize} bytes to ${filePath}`);
                    rl.close();
                    return;
                  }
                });
              } else {
                rl.close();
              }
            });
          } else {
            fs.writeFile(filePath, body, err => {
              if (err) {
                console.error(err);
              } else {
                const stat = fs.statSync(filePath);
                let fileSize = stat["size"];
                console.log(`Downloaded and saved ${fileSize} bytes to ${filePath}`);
                return;
              }
            });
          }
        });
      }
    });
  }
});

/** For stretch, I have also done
 * Edge Case 1: File Already Exists
If the file path already exists, right now your app will overwrite it! If you want to change this, let the user know and prompt them to type in Y(followed by the enter key) to overwrite the file, otherwise skip and exit the app. We suggest using the readline module, which we've previously used.

Edge Case 2: File Path is Invalid
If the file path is invalid, the app should fail and let the user know about this issue.

Edge Case 3: URL is Invalid
If the URL is invalid, terminate the app explaining to the user what went wrong, and not write the response body to the file.
 */
