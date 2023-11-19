#!/usr/bin/env zx
const doc = YAML.parse(fs.readFileSync('./Chart.lock', 'utf8'));
let repoList = [['helm-demo', process.env.AWS_S3]];
doc.dependencies.forEach( repo => {
  repoList.push([repo.name, repo.repository]);
});

const { spawn } = require("child_process");
for (const repo of repoList) {
  let helmAddRepo = spawn('helm', [...['repo', 'add', '--force-update'],...repo]);
  const helmActionList = [ helmAddRepo];
  for (const action of helmActionList) {
      action.stdout.on("data", data => {
         console.log(`stdout: ${data}`);
      });
  
      action.stderr.on("data", data => {
          console.log(`stderr: ${data}`);
      });
      
      action.on("close", code => {
          console.log(`child process exited with code ${code}`);
      });
  }
}
