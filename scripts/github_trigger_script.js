const fs = require('fs').promises;
const { Octokit } = require('@octokit/rest');

// Input your GitHub Personal Access Token (PAT) here
const githubToken = process.env.TEST_REPO;

async function generateTableRows() {
  try {
    const octokit = new Octokit({ auth: githubToken });

    const owner = 'sushantAtwork';
    const repo = 'back_end_trigger'; // Corrected repository name

    // Get the list of branches
    const { data: branches } = await octokit.rest.repos.listBranches({
      owner,
      repo,
    });

    // Get the list of open pull requests
    const { data: prs } = await octokit.rest.pulls.list({
      owner,
      repo,
      state: 'open',
    });

    const tableRows = [];

    tableRows.push('| Branch Name | Key | Description | Link to Branch |');
    tableRows.push('|------------|-----|-------------|----------------|');

    branches.forEach((branch) => {
      tableRows.push(`| ${branch.name} | Key | Desc1 | [Link to Branch](https://github.com/${owner}/${repo}/tree/${branch.name}) |`);
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
    const readmeFilePath = 'README.md';

    // Read the current content of the README.md file
    let readmeContent = await fs.readFile(readmeFilePath, 'utf8');

    // Generate the dynamic table rows
    const dynamicRows = await generateTableRows();

    // Replace the <!-- TABLE_ROWS --> placeholder with the dynamic content
    readmeContent = readmeContent.replace('<!-- TABLE_ROWS -->', dynamicRows);

    // Write the updated content back to the README.md file
    await fs.writeFile(readmeFilePath, readmeContent);

    console.log('README.md table updated successfully.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updateReadmeTable();
