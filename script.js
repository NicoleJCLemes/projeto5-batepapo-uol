let answer = prompt("Qual o seu lindo nome?");
let personName = {
    name: answer
}
let arrayMsg = [];

function statusOnOff() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", personName);
    promise.then(success);
    promise.catch(failed);
}

const inicialPromise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", personName);
inicialPromise.then(success);
inicialPromise.catch(error);

function error(nameError) {
    console.log(nameError.response.status)
    if (nameError.response.status === 400){
        answer = prompt("Nome indisponível, pense em outro");
        personName = {
            name: answer
        }
    }
    const inicialPromise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", personName);
    inicialPromise.catch(error);
    inicialPromise.then(success);
}

function failed(nameError) {
    console.log(nameError.response.status);
}

function success(success) {
    console.log(success.status);
}

setInterval(statusOnOff, 5000);

const message = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
message.then(takeMessages);

function takeMessages(object) {
    arrayMsg = object.data;
    arrayMsg.forEach(showMessages);
}

function showMessages(msg){
    const insert = document.querySelector("section main");

    if(msg.type === "status") {
        insert.innerHTML = insert.innerHTML + `
        <p class="status"><time>(${msg.time})</time> <b>${msg.from}</b> para <b>${msg.to}</b>: ${msg.text}</p>
        `
    } else if ((msg.type === "private_message") && ((msg.from === answer) || (msg.to === answer))){
        insert.innerHTML = insert.innerHTML + `
        <p class="private"><time>(${msg.time})</time> <b>${msg.from}</b> para <b>${msg.to}</b>: ${msg.text}</p>
        `
    } else {
        insert.innerHTML = insert.innerHTML + `
        <p><time>(${msg.time})</time> <b>${msg.from}</b> para <b>${msg.to}</b>: ${msg.text}</p>
        `
    }
}

function showSidebar() {
    const sidebar = document.querySelector("aside");
    sidebar.classList.remove("hidden");
    const section = document.querySelector(".background");
    section.classList.add("dark");
}

function hideSidebar() {
    const sidebar = document.querySelector("aside");
    sidebar.classList.add("hidden");
    const section = document.querySelector(".background");
    section.classList.remove("dark");
}

/*function marked(selected) {   ---tá cagado---
    const check = document.querySelector(".checkmark");
    const unchecked = document.querySelector(`${selected} .checkmark`);
    check.classList.add("hidden");
    unchecked.classList.remove("hidden");
}*/

