const fetchGitHubData = async (username) => {
    const headers = {};
    if (process.env.GITHUB_TOKEN) {
        headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, { headers }),
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, { headers })
    ]);

    if (!userRes.ok) {
        throw new Error("Failed to fetch user profile from GitHub");
    }
    
    if (!reposRes.ok) {
        throw new Error("Failed to fetch user repos from GitHub");
    }

    const profile = await userRes.json();
    const reposData = await reposRes.json();

    const repos = reposData.map((repo) => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
    }));

    const topLanguages = [...new Set(reposData.map(r => r.language).filter(Boolean))];

    return {
        repos,
        topLanguages,
        avatarUrl: profile.avatar_url,
        publicRepos: profile.public_repos,
        followers: profile.followers,
        fetchedAt: new Date(),
    };
};

module.exports = { fetchGitHubData };
