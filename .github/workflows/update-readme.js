const fs = require('fs').promises;
const { Octokit } = require('@octokit/rest');

// GitHub API credentials (personal access token)
const octokit = new Octokit({
  auth: process.env.TEST_REPO,
});

async function generateTableRows() {
  try {
    // Fetch branches from your repository
    const { data: branches } = await octokit.request('GET /repos/{owner}/{repo}/branches', {
      owner: 'sushantAtwork',
      repo: 'front-end-trigger',
    });

    // Fetch open PRs from your repository
    const { data: prs } = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
      owner: 'sushantAtwork',
      repo: 'front-end-trigger',
      state: 'open',
    });

    // Generate Markdown table rows based on branch and PR information
    const tableRows = [];
    
    branches.forEach((branch) => {
      tableRows.push(`| ${branch.name} | Key | Description | [Link to Branch](https://github.com/sushant0999/React_and_springboot/tree/${branch.name}) |`);
    });

    prs.forEach((pr) => {
      tableRows.push(`| PR #${pr.number} | Key | Description | [Link to PR](https://github.com/sushant0999/React_and_springboot/pull/${pr.number}) |`);
    });

    return tableRows.join('\n');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

async function updateReadmeTable() {
  try {
    // Read the existing README.md content using fs.promises.readFile
    let readmeContent = await fs.readFile('README.md', 'utf8');

    // Generate the dynamic table rows
    const dynamicRows = await generateTableRows();

    // Replace the <!-- TABLE_ROWS --> placeholder with the dynamic rows
    readmeContent = readmeContent.replace('<!-- TABLE_ROWS -->', dynamicRows);

    // Write the updated content back to README.md using fs.promises.writeFile
    await fs.writeFile('README.md', readmeContent);

    console.log('README.md table updated successfully.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updateReadmeTable();
