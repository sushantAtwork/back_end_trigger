import os
import requests

# GitHub API credentials (personal access token)
github_token = os.environ.get(process.env.TEST_REPO)

def generate_table_rows():
    try:
        owner = 'sushantAtwork'
        repo = 'front-end-trigger'

        branches_url = f'https://api.github.com/repos/{owner}/{repo}/branches'
        prs_url = f'https://api.github.com/repos/{owner}/{repo}/pulls?state=open'

        branches_response = requests.get(branches_url, headers={'Authorization': f'token {github_token}'})
        prs_response = requests.get(prs_url, headers={'Authorization': f'token {github_token}'})

        branches = branches_response.json()
        prs = prs_response.json()

        table_rows = []
        table_rows.append('| Branch Name | Key | Description | Link to Branch |')
        table_rows.append('|------------|-----|-------------|----------------|')

        for branch in branches:
            table_rows.append(f'| {branch["name"]} | Key | Desc1 | [Link to Branch](https://github.com/sushantAtwork/front-end-trigger/tree/{branch["name"]}) |')

        for pr in prs:
            table_rows.append(f'| PR #{pr["number"]} | Key | {pr["title"]} | [Link to PR]({pr["html_url"]}) |')

        return '\n'.join(table_rows)
    except Exception as e:
        # print('Error:', str(e))  # Changed 'number(e)' to 'str(e)'
        exit(1)

def update_readme_table():
    try:
        readme_file = 'README.md'
        with open(readme_file, 'r', encoding='utf-8') as file:
            readme_content = file.read()

        dynamic_rows = generate_table_rows()
        updated_content = readme_content.replace('<!-- TABLE_ROWS -->', dynamic_rows)

        with open(readme_file, 'w', encoding='utf-8') as file:
            file.write(updated_content)

        print('README.md table updated successfully.')
    except Exception as e:
        # print('Error:', str(e))  # Changed 'number(e)' to 'str(e)'
        exit(1)

update_readme_table()
