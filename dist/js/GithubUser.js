export class GithubUser {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`;
        return fetch(endpoint)
            .then(dados => dados.json())
            .then(({login, name, url, public_repos, followers}) => ({
                login,
                name,
                url,
                public_repos,
                followers
            }))
    }
}