async function afficherUsers() {
        const response = await fetch("./users.json");
        const users = await response.json();
        console.log(users);
}

afficherUsers();