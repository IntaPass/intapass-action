# IntaPass Action for Github

IntaPass provides automated code reviews, performance optimization suggestions, and security vulnerability detection for developers and teams.

# How to deploy

## Setup action code

Create a new file in your repo as `.github/workflows/main.yml` and add the following code:

    on: [push]

    jobs:
    code_review_job:
        runs-on: ubuntu-latest
        name: Review code and advise on best practices
        steps:
        - name: Checkout repository
            uses: actions/checkout@v4
        - name: Get changed files
            id: files
            uses: lots0logs/gh-action-get-changed-files@2.2.2
            with:
            token: ${{ secrets.GITHUB_TOKEN }}
        - name: Code review
            id: review_code
            uses: intapass/intapass-action@0.1.4
            with:
            files: ${{ steps.files.outputs.all }}
            token: ${{ secrets.INTAPASS_TOKEN }}
        - name: Get the review results
            run: echo "Results ${{ steps.review_code.outputs.results }}"


## Configure IntaPass access token

Navigate to the repository settings and locate secrets and variables. Create a new entry labeled `INTAPASS_TOKEN` and add your token obtained from [IntaPass](https://intapass.com)