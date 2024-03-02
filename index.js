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

function request_review(codeData, lang) {
    axios.post("https://backend-dev.portanex.com/review", {code: codeData, lang:lang}, {headers: {ContentType: "application/json"}})
    .then((resp)=>{
        return resp.data
    })
    .catch((err)=>{
        console.log(err)
    })
}

try {
  // `who-to-greet` input defined in action metadata file
  const files = JSON.parse(core.getInput('files'));
  console.log(`Changed files ${files}!`);

  let results = []
  for (let fileItem = 0; fileItem <files.length; fileItem++){
    let lang = determineLanguage(files[fileItem])
    const filePath = path.join(__dirname, '..', fileItem);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading the file:', err);
          return;
        }
        console.log('File content:', );
        results.push(request_review(data, lang))
      });
    
    console.log(`Files: ${fileItem}`)
  }
  core.setOutput("results", results);
} catch (error) {
  core.setFailed(error.message);
}
