import { GithubUser} from "./GithubUser.js";

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load();
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
    }

    delete(user) {
        const userFilter = this.entries.filter(entry => user.login !== entry.login);
        this.entries = userFilter;
        this.save();
    }

    async add(username) {
        try {
            const userExists = this.entries.find(entry => entry.login === username);

            if (userExists){
                throw new Error("Usuário já Cadastrado!")
            }

            const user = await GithubUser.search(username);

            if (user.login === undefined) {
                throw new Error("Usuário não Localizado!");
            }

            this.entries = [user, ...this.entries];
            this.update();
            this.save();
        } catch (e) {
            alert(e.message)
        }
    }
}

export class NewFavorites extends Favorites {
    constructor(root) {
        super(root);

        this.tbody = this.root.querySelector("table tbody");

        this.update();
        this.onAdd();
    }

    onAdd() {
        const button = this.root.querySelector("#add-user");
        button.onclick = () => {
            const input = this.root.querySelector("input");
            this.add(input.value);
            input.value = "";
        }
    }

    novaLinha() {
        const tr = document.createElement("tr");

        tr.innerHTML =
            `<tr>
                <td class="px-4 py-3 rounded-bl-lg">
                    <div class="flex gap-5 items-center">
                        <img id="url" class="w-16 h-16 rounded-full" src="" alt="">
                        <div>
                            <p id="name" class="font-medium"></p>
                            <span id="login"></span>
                        </div>
                    </div>
                </td>
                <td id="public_repos" class="px-4 py-2"></td>
                <td id="followers" class="px-4 py-2"></td>
                <td id="button" class="text-red-400 text-2xl px-4 py-2 cursor-pointer">&times;</td>
            </tr>`

        return tr
    }

    preencherLinha(arr) {
        arr.forEach(item => {
            const linha = this.novaLinha();
            linha.querySelector("#url").src = `https://github.com/${item.login}.png`;
            linha.querySelector("#name").innerText = item.name;
            linha.querySelector("#login").innerText = item.login;
            linha.querySelector("#public_repos").innerText = item.public_repos;
            linha.querySelector("#followers").innerText = item.followers;
            linha.querySelector("#button").onclick = () => {
                const irOk = confirm("Deseja remove?");
                if (irOk) {
                    this.delete(item);
                    this.update();
                }
            }

            this.tbody.append(linha);
        });
    }

    update() {
        this.clearBody();
        this.preencherLinha(this.entries);
    }

    clearBody() {
        this.tbody.querySelectorAll("tr").forEach((item) => {
            item.remove();
        })
    }
}