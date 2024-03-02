const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios')

function request_review(codeData) {
    axios.post("url", {code: codeData, lang:"python"}, {headers: {ContentType: "application/json"}})
    .then((resp)=>{
        return resp.data
    })
    .catch((err)=>{
        console.log(err)
    })
}

try {
  // `who-to-greet` input defined in action metadata file
  const files = core.getInput('files');
  console.log(`Changed files ${files}!`);

  for (let fileItem = 0; fileItem <files.length; fileItem++){
    console.log(`Files: ${fileItem}`)
  }

//   request_review(files[0])
  
//   const results = (new Date()).toTimeString();
  core.setOutput("results", "results");
  // Get the JSON webhook payload for the event that triggered the workflow
//   const payload = JSON.stringify(github.context.payload, undefined, 2)
//   console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
