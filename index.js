const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const fs = require('fs').promises; // Use fs promises for easier async handling
const path = require('path');
import { jsonToPlainText } from "json-to-plain-text";

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

function requestReview(codeData, lang, fileName) {
  const url = "https://api.intapass.com/review";
  const payload = { code: codeData, lang: lang, file_name: fileName };
  const token = core.getInput('const')
  const config = { 
    headers: { 
      ContentType: "application/json",
      Token: token
    } 
  };
  return axios.post(url, payload, config);
}

async function processFile(files) {
  let promises = files.map(async (fileItem) => {
    const lang = determineLanguage(fileItem);
    const filePath = path.join(process.env.GITHUB_WORKSPACE, fileItem);

    try {
      const data = await fs.readFile(filePath, 'utf8');
      const resp = await requestReview(data, lang, fileItem);
      return {file: fileItem, resp: resp.data};
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
    core.setOutput("results", jsonToPlainText(results));
  })
  .catch(error => {
    console.error("Failed to process files:", error);
    core.setFailed(error.message);
  });
