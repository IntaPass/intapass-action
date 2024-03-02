const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios')
const fs = require('fs');
const path = require('path');

const languageMap = {
  '.py': 'Python',
  '.js': 'JavaScript',
  '.java': 'Java',
  '.cpp': 'C++',
  '.cs': 'C#',
  '.rb': 'Ruby',
  '.php': 'PHP',
  '.swift': 'Swift',
  '.go': 'Go',
  '.ts': 'TypeScript',
  '.yml': 'Yalm',
  '.yaml': 'Yalm',
};

function determineLanguage(filename) {
  // Extract the file extension
  const extension = filename.slice(filename.lastIndexOf('.'));

  // Lookup the language in the map
  const language = languageMap[extension];

  // Return the language or a default message
  return language ? language : 'Unknown language';
}

function requestReview(codeData, lang) {
  const url = "https://backend-dev.portanex.com/review";
  const payload = { code: codeData, lang: lang };
  const config = { headers: { ContentType: "application/json" } };
  return axios.post(url, payload, config)
}

try {
  function processFile(files) {
    return new Promise((resolve, reject) => {
      let results = []
      for (let fileItem = 0; fileItem < files.length; fileItem++) {
        let lang = determineLanguage(files[fileItem])
        const filePath = path.join(__dirname, '..', files[fileItem]);
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error('Error reading the file:', err);
            return reject(err);
          }

          requestReview(data, lang)
            .then((resp) => {
              results.push(JSON.stringify(resp.data))
            })
            .catch((err) => {
              return reject(err)
            })
        });

        console.log(`Files: ${fileItem}`)
      }
      console.log("results", results)
      return resolve(results)
    })
  }

  // const files = JSON.parse(core.getInput('files'));
  let files = JSON.parse('["./intapass-action/test.js"]')
  console.log(`Changed files ${files}!`);

  async function abccall(){
    let results =  await processFile(files)
    core.setOutput("results", results)
  }
  abccall()
  
    // .then((results) => { core.setOutput("results", results) })
    // .catch((err) => { throw err })
} catch (error) {
  core.setFailed(error.message);
}
