const API = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes";

let qtyQuestions;
let qtyLevels;

let quizz;
let userQuizzesIdList = [];
let userQuizzesKeyList = [];

let elQuizzRules;
let elQuizzQuestions;
let elQuizzLevels;
let elQuizzFinished;



function isValidURL(str) {
    const a  = document.createElement('a');
    a.href = str;
    return (a.host && a.host != window.location.host && a.host.includes("."));
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function isHexColor(str) {
    const regex = /^#[0-9A-F]{6}$/i;
    return regex.test(str);
}

function edit(el) {
    const elQuestionForm = el.parentNode.parentNode.querySelector(".fields");
    elQuestionForm.classList.toggle("hidden");
}

function backHome() {
    const elQuizzList = document.querySelector(".quizzes-list");
    const elQuizzCreation = document.querySelector(".quizz-creation");
    
    elQuizzList.classList.remove("hidden");
    elQuizzCreation.remove();
    document.querySelector('.container').scrollIntoView();
    getUserQuizzes();
}

function loadQuizzRules() {
    const elContainer = document.querySelector(".container");
    quizz = {
        title: "",
        image: "",
        questions: "",
        levels: ""
    };

    elContainer.innerHTML += `
        <div class="quizz-creation">
            <div class="page-form">
                <span>Comece pelo começo</span>
                <div class="form-box">
                    <input type="text" placeholder="Título do seu quizz">
                    <input type="text" placeholder="URL da imagem do seu quizz">
                    <input type="text" placeholder="Quantidade de perguntas do quizz">
                    <input type="text" placeholder="Quantidade de níveis do quizz">
                </div>
                <button onclick="goToCreateQuestions()">Prosseguir para criar perguntas</button>
            </div>
        </div>
        `;
    document.querySelector(".quizzes-list").classList.add("hidden");
}

function loadQuestionFields() {
    const elQuizzCreation = document.querySelector(".quizz-creation");
    elQuizzCreation.innerHTML += `
        <div class="page-form hidden">
            <span>Crie suas perguntas</span>
        </div>
    `;
    elQuizzQuestions = elQuizzCreation.querySelector(".page-form:nth-child(2)");

    for(let i = 1; i <= qtyQuestions; i++) {
        elQuizzQuestions.innerHTML += `
        <div class="form-box">
            <div class="edit-entry">
                <span>Pergunta ${i}</span>
                <img src="img/edit.svg" alt="edit" onclick="edit(this)">
            </div>
            <div class="fields hidden">
                <div>
                    <input type="text" placeholder="Texto da pergunta">
                    <input type="text" placeholder="Cor de fundo da pergunta">
                </div>
                <div>
                    <span>Resposta Correta</span>
                    <input type="text" placeholder="Resposta correta">
                    <input type="text" placeholder="URL da imagem">
                </div>
                <div>
                    <span>Respostas Incorretas</span>
                    <div>
                        <input type="text" placeholder="Resposta incorreta 1">
                        <input type="text" placeholder="URL da imagem 1">
                    </div>
                    <div>
                        <input type="text" placeholder="Resposta incorreta 2">
                        <input type="text" placeholder="URL da imagem 2">
                    </div>
                    <div>
                        <input type="text" placeholder="Resposta incorreta 3">
                        <input type="text" placeholder="URL da imagem 3">
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    elQuizzQuestions.innerHTML += `
        <button onclick="goToCreateLevels()">Prosseguir para criar níveis</button>
        `;
    elQuizzQuestions.querySelector(".form-box:nth-child(2) .fields")
        .classList.remove("hidden");

}

function loadLevels() {

    const elQuizzCreation = document.querySelector(".quizz-creation");
    elQuizzCreation.innerHTML += `
        <div class="page-form hidden">
            <span>Agora, decida os níveis</span>
        </div>
        `;
    elQuizzLevels = elQuizzCreation.querySelector(".page-form:nth-child(3)");

    for(let i = 1; i <= qtyLevels; i++) {
        elQuizzLevels.innerHTML += `
            <div class="form-box">
                <div class="edit-entry">
                    <span>Nível ${i}</span>
                    <img src="img/edit.svg" alt="edit" onclick="edit(this)">
                </div>
                <div class="fields hidden">
                    <input type="text" placeholder="Título do nível">
                    <input type="text" placeholder="% de acerto mínima">
                    <input type="text" placeholder="URL da imagem do nível">
                    <textarea type="text" placeholder="Descrição do nível"></textarea>
                </div>
            </div>
            `;
    }

    elQuizzLevels.innerHTML += `
        <button onclick="finishQuizz()">Finalizar Quizz</button>
        `;
    elQuizzLevels.querySelector(".form-box:nth-child(2) .fields").classList.remove("hidden");

}

function loadQuizzFinished(response) {

    const elQuizzCreation = document.querySelector(".quizz-creation");
    elQuizzLevels = document.querySelector(".quizz-creation .page-form:nth-child(3)");
    getUserQuizz(response);
    const index = userQuizzesIdList.length - 1;
    const idQuizzCreated = userQuizzesIdList[index];

    elQuizzCreation.innerHTML += `
        <div class="page-form hidden">
            <span>Seu quizz está pronto!</span>
            <div class="quizz-finished">
                <div class="quizz">
                    <img src=${quizz.image} />
                    <div class="overlay">
                        <h4 class="title">${quizz.title}</h4>
                    </div>
                </div>
            </div>
            <button onclick="getQuizzDetails(${idQuizzCreated})">Acessar Quizz</button>
            <button class="back-home" onclick="backHome()">Voltar para home</button>
        </div>
        `;
    elQuizzFinished = elQuizzCreation.querySelector(".page-form:nth-child(4)");
    elQuizzLevels = document.querySelector(".quizz-creation .page-form:nth-child(3)");
    elQuizzLevels.classList.add("hidden");
    elQuizzFinished.classList.remove("hidden");

}

function goToCreateQuestions() {

    elQuizzRules = document.querySelector(".quizz-creation .page-form:nth-child(1)");
    const titleQuizz = elQuizzRules.querySelector("input:nth-child(1)").value;
    const urlImg = elQuizzRules.querySelector("input:nth-child(2)").value;
    qtyQuestions = elQuizzRules.querySelector("input:nth-child(3)").value;
    qtyLevels = elQuizzRules.querySelector("input:nth-child(4)").value;

    qtyQuestions = Number(qtyQuestions);
    qtyLevels = Number(qtyLevels);

    const titleQuizzCond = titleQuizz.length >= 20 && titleQuizz.length <= 65;
    const urlImgCond = isValidURL(urlImg);
    const qtyQuestionsCond = qtyQuestions >= 3;
    const qtyLevelsCond = qtyLevels >= 2;

    if(!(titleQuizzCond && urlImgCond && qtyQuestionsCond && qtyLevelsCond)) {
        alert("Preencha os dados corretamente por favor!");
    }

    if(titleQuizzCond && urlImgCond && qtyQuestionsCond && qtyLevelsCond) {
        loadQuestionFields();
        elQuizzRules = document.querySelector(".quizz-creation .page-form:nth-child(1)");
        elQuizzRules.classList.add("hidden");
        elQuizzQuestions.classList.remove("hidden");
        quizz.title = capitalizeFirstLetter(titleQuizz);
        quizz.image = urlImg;
    }
    
}

function goToCreateLevels() {

    let questions = [];
    let aux = 0;
    const count = qtyQuestions + 1;

    
    for (let i = 2; i <= count; i++) {

        let elFormBox = elQuizzQuestions.querySelector(`.form-box:nth-child(${i})`);

        const question = elFormBox
            .querySelector('[placeholder="Texto da pergunta"]').value;
        const backgroundColor = elFormBox
            .querySelector('[placeholder="Cor de fundo da pergunta"]').value;
        const correctAnswer = elFormBox
            .querySelector('[placeholder="Resposta correta"]').value;
        const urlImgCorrect = elFormBox
            .querySelector('[placeholder="URL da imagem"]').value;
        const incorrectAnswer1 = elFormBox
            .querySelector('[placeholder="Resposta incorreta 1"]').value;
        const urlImgIncorrect1 = elFormBox
            .querySelector('[placeholder="URL da imagem 1"]').value;
        const incorrectAnswer2 = elFormBox
            .querySelector('[placeholder="Resposta incorreta 2"]').value;
        const urlImgIncorrect2 = elFormBox
            .querySelector('[placeholder="URL da imagem 2"]').value;
        const incorrectAnswer3 = elFormBox
            .querySelector('[placeholder="Resposta incorreta 3"]').value;
        const urlImgIncorrect3 = elFormBox
            .querySelector('[placeholder="URL da imagem 3"]').value;

        const questionCond = question.length >= 20;
        const colorCond = isHexColor(backgroundColor);
        const correctAnswerCond = correctAnswer !== "";
        const urlImgCorrectCond = isValidURL(urlImgCorrect);
        const incorrectAnswerCond = (incorrectAnswer1 !== "" && isValidURL(urlImgIncorrect1))
            || (incorrectAnswer2 !== "" && isValidURL(urlImgIncorrect2))
            || (incorrectAnswer3 !== "" && isValidURL(urlImgIncorrect3));
        const conditions = questionCond && colorCond && correctAnswerCond
            && urlImgCorrectCond && incorrectAnswerCond;

        if (conditions) {

            questions.push({
                title: question,
                color: backgroundColor,
                answers: [
                    {
                        text: correctAnswer,
                        image: urlImgCorrect,
                        isCorrectAnswer: true
                    }
                ]
            });

            if (incorrectAnswer1 !== "" && isValidURL(urlImgIncorrect1)) {
                questions[aux].answers.push({
                    text: incorrectAnswer1,
                    image: urlImgIncorrect1,
                    isCorrectAnswer: false
                });
            }

            if (incorrectAnswer2 !== "" && isValidURL(urlImgIncorrect2)) {
                questions[aux].answers.push({
                    text: incorrectAnswer2,
                    image: urlImgIncorrect2,
                    isCorrectAnswer: false
                });
            }

            if (incorrectAnswer3 !== "" && isValidURL(urlImgIncorrect3)) {
                questions[aux].answers.push({
                    text: incorrectAnswer3,
                    image: urlImgIncorrect3,
                    isCorrectAnswer: false
                });
            }
            aux++;
        }

    }
    
    if(questions.length < qtyQuestions) {
        alert("Preencha os dados corretamente por favor!");
    }
    else {
        quizz.questions = questions;
        loadLevels();
        elQuizzQuestions = document
            .querySelector(".quizz-creation .page-form:nth-child(2)");
        elQuizzQuestions.classList.add("hidden");
        elQuizzLevels.classList.remove("hidden");
    }

}

function finishQuizz() {

    let levels = [];
    const count = qtyLevels + 1;
    let aux = 0;

    for(let i = 2; i <= count; i++) {
        let elFormBox = elQuizzLevels.querySelector(`.form-box:nth-child(${i})`);

        const title = elFormBox
            .querySelector('[placeholder="Título do nível"]').value;
        const minSuccessRate = Number(elFormBox
            .querySelector('[placeholder="% de acerto mínima"]').value);
        const urlImg = elFormBox
            .querySelector('[placeholder="URL da imagem do nível"]').value;
        const description = elFormBox
            .querySelector('[placeholder="Descrição do nível"]').value;

        const titleCond = title.length >= 10;
        const minSuccessRateCond = minSuccessRate >= 0 && minSuccessRate <= 100;
        const urlImgCond = isValidURL(urlImg);
        const descriptionCond = description.length >= 30;
        const conditions = titleCond && minSuccessRateCond && urlImgCond && descriptionCond;

        if(conditions) {
            levels.push({
                title: title,
                image: urlImg,
                text: description,
                minValue: minSuccessRate
            });
        }
    }

    for(let i = 0; i < levels.length; i++) {
        if(levels[i].minValue === 0) {
            aux++;
        }
    }

    if((levels.length === qtyLevels) && (aux !== 0)) {
        quizz.levels = levels;
        sendQuizz();
    } else {
        alert("Preencha os dados corretamente por favor!");
    }
}

function sendQuizz() {
    const promise = axios.post(API, quizz);
    promise.then(loadQuizzFinished);
}

function getUserQuizz(response) {
    const quizzId = response.data.id;
    const quizzKey = response.data.key;
    let idListLocal = JSON.parse(localStorage.getItem("userQuizzIds"));
    let keyListLocal = JSON.parse(localStorage.getItem("userQuizzKeys"));

    if(idListLocal !== null) {
        userQuizzesIdList = idListLocal;
        userQuizzesKeyList = keyListLocal;
    }
    userQuizzesIdList.push(quizzId);
    userQuizzesKeyList.push(quizzKey);
    
    localStorage.setItem("userQuizzIds", JSON.stringify(userQuizzesIdList));
    localStorage.setItem("userQuizzKeys", JSON.stringify(userQuizzesKeyList));
}

