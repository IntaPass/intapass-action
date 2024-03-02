const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const userResponse = core.getInput('review_code');
  console.log(`Response ${userResponse}!`);
  const results = (new Date()).toTimeString();
  core.setOutput("results", results);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
