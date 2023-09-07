const fs = require('fs').promises;
const path = require('path');
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.TEST_REPO,
});

async function generateTableRows() {
  try {
    const { data: branches } = await octokit.request('GET /repos/{owner}/{repo}/branches', {
      owner: 'sushantAtwork',
      repo: 'front-end-trigger',
    });

    const { data: prs } = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
      owner: 'sushantAtwork',
      repo: 'front-end-trigger',
      state: 'open',
    });

    const tableRows = [];

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
    
    // DEBUG
    // const currentDirectory = process.cwd();
    // console.log('Current directory:', currentDirectory);

    // const filesInDirectory = await fs.readdir(currentDirectory);
    // console.log('Files in directory:', filesInDirectory);
    // DEBUG
    
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
