// scripts/update-fallbacks.js
const fs = require('fs');
const path = require('path');

const USERNAME = 'Dv1de29';
// We will pass this token from GitHub Actions so we don't hit the 60/hr limit
const headers = process.env.GITHUB_TOKEN ? {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
} : {};

async function updateFallbacks() {
    try {
        console.log('Fetching repositories...');
        const repoRes = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated`, { headers });
        
        if (!repoRes.ok) throw new Error(`Repo fetch failed: ${repoRes.statusText}`);
        const repos = await repoRes.json();
        
        const myRepos = repos.filter(repo => !repo.fork);
        
        // 1. Save Fallback Repos
        const reposPath = path.join(__dirname, '../src/data/fallback-repos.json');
        fs.writeFileSync(reposPath, JSON.stringify(myRepos, null, 2));
        console.log(`Saved ${myRepos.length} repos to fallback-repos.json`);

        // 2. Fetch and Save Languages
        const languageMap = {};
        console.log('Fetching languages for each repo...');
        
        for (const repo of myRepos) {
            const langRes = await fetch(repo.languages_url, { headers });
            if (langRes.ok) {
                const langData = await langRes.json();
                languageMap[repo.id] = langData;
                console.log(`Fetched languages for ${repo.name}`);
            } else {
                console.warn(`Failed to fetch languages for ${repo.name}`);
            }
        }

        const langsPath = path.join(__dirname, '../src/data/fallback-languages.json');
        fs.writeFileSync(langsPath, JSON.stringify(languageMap, null, 2));
        console.log('Saved all languages to fallback-languages.json');
        console.log('Update complete!');

    } catch (error) {
        console.error('Error updating fallbacks:', error);
        process.exit(1);
    }
}

updateFallbacks();