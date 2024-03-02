const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const fs = require('fs').promises; // Use fs promises for easier async handling
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
  const extension = filename.slice(filename.lastIndexOf('.'));
  const language = languageMap[extension];
  return language ? language : 'Unknown language';
}

function requestReview(codeData, lang) {
  const url = "https://backend-dev.portanex.com/review";
  const payload = { code: codeData, lang: lang };
  const config = { headers: { ContentType: "application/json" } };
  return axios.post(url, payload, config);
}

async function processFile(files) {
  let promises = files.map(async (fileItem) => {
    const lang = determineLanguage(fileItem);
    const filePath = path.join(__dirname, '..', fileItem);

    try {
      const data = await fs.readFile(filePath, 'utf8');
      const resp = await requestReview(data, lang);
      return JSON.stringify(resp.data); // Convert response to string and return
    } catch (err) {
      console.error('Error processing file:', err);
      throw err; // Rethrow to be caught by Promise.all
    }
  });

  // Wait for all promises to resolve
  return Promise.all(promises);
}

const files = JSON.parse(core.getInput('files'));
processFile(files)
  .then(results => {
    core.setOutput("results", results);
  })
  .catch(error => {
    console.error("Failed to process files:", error);
    core.setFailed(error.message);
  });
