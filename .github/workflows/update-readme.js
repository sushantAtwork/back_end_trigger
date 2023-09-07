// const fs = require('fs').promises;
// const { Octokit } = require('@octokit/rest');

// const octokit = new Octokit({
//   auth: process.env.TEST_REPO,
// });

// async function generateTableRows() {
//   try {

//     const { data: branches } = await octokit.request('GET /repos/{owner}/{repo}/branches', {
//       owner: 'sushantAtwork',
//       repo: 'front-end-trigger',
//     });


//     const { data: prs } = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
//       owner: 'sushantAtwork',
//       repo: 'front-end-trigger',
//       state: 'open',
//     });


//     const tableRows = [];
    
//     branches.forEach((branch) => {
//       tableRows.push(`| ${branch.name} | Key | Description | [Link to Branch](https://github.com/sushant0999/React_and_springboot/tree/${branch.name}) |`);
//     });

//     prs.forEach((pr) => {
//       tableRows.push(`| PR #${pr.number} | Key | Description | [Link to PR](https://github.com/sushant0999/React_and_springboot/pull/${pr.number}) |`);
//     });

//     return tableRows.join('\n');
//   } catch (error) {
//     console.error('Error:', error.message);
//     process.exit(1);
//   }
// }

// async function updateReadmeTable() {
//   try {

//     let readmeContent = await fs.readFile('README.md', 'utf8');
//     const dynamicRows = await generateTableRows();
//     readmeContent = readmeContent.replace('<!-- TABLE_ROWS -->', dynamicRows);
//     await fs.writeFile('README.md', readmeContent);
//     console.log('README.md table updated successfully.');
//   } catch (error) {
//     console.error('Error:', error.message);
//     process.exit(1);
//   }
// }

// updateReadmeTable();

const fs = require('fs').promises;
const { Octokit } = require('@octokit/rest');

// Replace with your GitHub PAT
// const githubToken = 'YOUR_GITHUB_PAT_HERE';

const octokit = new Octokit({
  auth: process.env.TEST_REPO,
});

async function generateTableRows() {
  try {
    const { data: branches } = await octokit.request('GET /repos/{owner}/{repo}/branches', {
      owner: 'sushantAtwork', // Replace with your GitHub username or organization
      repo: 'front-end-trigger', // Replace with your repository name
    });

    const { data: prs } = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
      owner: 'sushantAtwork', // Replace with your GitHub username or organization
      repo: 'front-end-trigger', // Replace with your repository name
      state: 'open',
    });

    const tableRows = [];

    // Add header row
    tableRows.push('| Branch Name | Key | Description | Link to Branch |');
    tableRows.push('|------------|-----|-------------|----------------|');

    branches.forEach((branch) => {
      tableRows.push(`| ${branch.name} | Key | Desc1 | [Link to Branch](https://github.com/sushantAtwork/front-end-trigger/tree/${branch.name}) |`);
    });

    prs.forEach((pr) => {
      tableRows.push(`| PR #${pr.number} | Key | ${pr.title} | [Link to PR](${pr.html_url}) |`);
    });

    return tableRows.join('\n');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

async function updateReadmeTable() {
  try {
    let readmeContent = await fs.readFile('README.md', 'utf8');
    const dynamicRows = await generateTableRows();
    readmeContent = readmeContent.replace('<!-- TABLE_ROWS -->', dynamicRows);
    await fs.writeFile('README.md', readmeContent);
    console.log('README.md table updated successfully.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updateReadmeTable();

