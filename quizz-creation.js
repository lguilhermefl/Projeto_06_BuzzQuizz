let qtyQuestions;
let qtyLevels;

let quizz;
let userQuizzesIdList = [];
let userQuizzesKeyList = [];
let userQuizzToEdit;
let idQuizzToEdit;

let elQuizzRules;
let elQuizzQuestions;
let elQuizzLevels;
let elQuizzFinished;

function isValidURL(str) {
    const a = document.createElement("a");
    a.href = str;
    return a.host && a.host != window.location.host && a.host.includes(".");
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
    document.querySelector(".container").scrollIntoView();
    getQuizzes();
}

function loadQuizzRules() {
    hideLoadingDiv();
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
                    <div class="user-input">
                        <input type="text" placeholder="Título do seu quizz">
                        <p class="input-error-msg hidden">O título precisa ter entre 20 e 65 caracteres</p>
                    </div>
                    <div class="user-input">
                        <input type="text" placeholder="URL da imagem do seu quizz">
                        <p class="input-error-msg hidden">O valor informado não é uma URL válida</p>
                    </div>
                    <div class="user-input">
                        <input type="text" placeholder="Quantidade de perguntas do quizz">
                        <p class="input-error-msg hidden">O quizz deve ter no mínimo 3 perguntas</p>
                    </div>
                    <div class="user-input">
                        <input type="text" placeholder="Quantidade de níveis do quizz">
                        <p class="input-error-msg hidden">O quizz deve ter no mínimo 2 níveis</p>
                    </div>
                </div>
                <button onclick="goToCreateQuestions()">Prosseguir para criar perguntas</button>
            </div>
        </div>
        `;
    if (userQuizzToEdit !== undefined) {
        renderRulesToEdit(userQuizzToEdit);
        changeOnClickAtt(
            document.querySelector(".quizz-creation"),
            "goToCreateQuestions(userQuizzToEdit)"
        );
    }

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

    for (let i = 1; i <= qtyQuestions; i++) {
        elQuizzQuestions.innerHTML += `
        <div class="form-box">
            <div class="edit-entry">
                <span>Pergunta ${i}</span>
                <img src="img/edit.svg" alt="edit" onclick="edit(this)">
            </div>
            <div class="fields hidden">
                <div>
                    <div class="user-input">
                        <input type="text" placeholder="Texto da pergunta">
                        <p class="input-error-msg hidden">A pergunta precisa ter ao menos 20 caracteres</p>
                    </div>
                    <div class="user-input">
                        <input type="text" placeholder="Cor de fundo da pergunta">
                        <p class="input-error-msg hidden">A cor precisa ser em formato hexadecimal (#000000)</p>
                    </div>
                </div>
                <div class="answers-creation">
                    <span>Resposta Correta</span>
                    <div class="user-input">
                        <input type="text" placeholder="Resposta correta">
                        <p class="input-error-msg hidden">A resposta correta é um campo obrigatório</p>
                    </div>
                    <div class="user-input">
                        <input type="text" placeholder="URL da imagem">
                        <p class="input-error-msg hidden">O valor informado não é uma URL válida</p>
                    </div>
                </div>
                <div class="answers-creation">
                    <span>Respostas Incorretas</span>
                    <div class="incorrect-answer">
                        <div class="user-input">
                            <input type="text" placeholder="Resposta incorreta 1">
                            <p class="input-error-msg hidden">Informe ao menos uma resposta incorreta</p>
                        </div>
                        <div class="user-input">
                            <input type="text" placeholder="URL da imagem 1">
                            <p class="input-error-msg hidden">O valor informado não é uma URL válida</p>
                        </div>
                    </div>
                    <div class="incorrect-answer">
                        <div class="user-input">
                            <input type="text" placeholder="Resposta incorreta 2">
                            <p class="input-error-msg hidden">Informe a resposta incorreta</p>
                        </div>
                        <div class="user-input">
                            <input type="text" placeholder="URL da imagem 2">
                            <p class="input-error-msg hidden">O valor informado não é uma URL válida</p>
                        </div>
                    </div>
                    <div class="incorrect-answer">
                        <div class="user-input">
                            <input type="text" placeholder="Resposta incorreta 3">
                            <p class="input-error-msg hidden">Informe a resposta incorreta</p>
                        </div>
                        <div class="user-input">
                            <input type="text" placeholder="URL da imagem 3">
                            <p class="input-error-msg hidden">O valor informado não é uma URL válida</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    elQuizzQuestions.innerHTML += `
        <button onclick="goToCreateLevels()">Prosseguir para criar níveis</button>
        `;

    if (userQuizzToEdit !== undefined) {
        renderQuestionsToEdit(userQuizzToEdit);
        changeOnClickAtt(elQuizzQuestions, "goToCreateLevels(userQuizzToEdit)");
    }

    elQuizzQuestions
        .querySelector(".form-box:nth-child(2) .fields")
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

    for (let i = 1; i <= qtyLevels; i++) {
        elQuizzLevels.innerHTML += `
            <div class="form-box">
                <div class="edit-entry">
                    <span>Nível ${i}</span>
                    <img src="img/edit.svg" alt="edit" onclick="edit(this)">
                </div>
                <div class="fields hidden">
                    <div class="user-input">
                        <input type="text" placeholder="Título do nível">
                        <p class="input-error-msg hidden">O título de ter ao menos 10 caracteres</p>
                    </div>
                    <div class="user-input">
                        <input type="text" placeholder="% de acerto mínima">
                        <p class="input-error-msg hidden">A % de acerto deve ser um número entre 0 e 100</p>
                    </div>
                    <div class="user-input">
                        <input type="text" placeholder="URL da imagem do nível">
                        <p class="input-error-msg hidden">O valor informado não é uma URL válida</p>
                    </div>
                    <div class="user-input">
                        <textarea type="text" placeholder="Descrição do nível"></textarea>
                        <p class="input-error-msg hidden">A descrição de ter ao menos 30 caracteres</p>
                    </div>
                </div>
            </div>
            `;
    }

    elQuizzLevels.innerHTML += `
        <button onclick="finishQuizz()">Finalizar Quizz</button>
        `;

    if (userQuizzToEdit !== undefined) {
        renderLevelsToEdit(userQuizzToEdit);
        changeOnClickAtt(elQuizzLevels, "finishQuizz(userQuizzToEdit)");
    }

    elQuizzLevels
        .querySelector(".form-box:nth-child(2) .fields")
        .classList.remove("hidden");
}

function loadQuizzFinished(response) {
    const elQuizzCreation = document.querySelector(".quizz-creation");
    elQuizzLevels = document.querySelector(
        ".quizz-creation .page-form:nth-child(3)"
    );
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
    elQuizzLevels = document.querySelector(
        ".quizz-creation .page-form:nth-child(3)"
    );
    elQuizzLevels.classList.add("hidden");
    elQuizzFinished.classList.remove("hidden");
}

function addErrorMsg(cond, el) {
    if(!cond) {
        el.classList.add('input-error-bg');
        el.parentNode.querySelector('.input-error-msg').classList.remove('hidden');
    }
    if(cond) {
        if(el.classList.contains('input-error-bg')) {
            el.classList.remove('input-error-bg');
            el.parentNode.querySelector('.input-error-msg').classList.add('hidden');
        }
    }
}

function goToCreateQuestions(userQuizzToEdit) {
    elQuizzRules = document.querySelector(
        ".quizz-creation .page-form:nth-child(1)"
    );
    const elTitleQuizz = elQuizzRules.querySelector('[placeholder="Título do seu quizz"]');
    const elUrlImg = elQuizzRules.querySelector('[placeholder="URL da imagem do seu quizz"]');
    const elQtyQuestions = elQuizzRules.querySelector('[placeholder="Quantidade de perguntas do quizz"]');
    const elQtyLevels = elQuizzRules.querySelector('[placeholder="Quantidade de níveis do quizz"]');

    qtyQuestions = Number(elQtyQuestions.value);
    qtyLevels = Number(elQtyLevels.value);

    const titleQuizzCond = elTitleQuizz.value.length >= 20 && elTitleQuizz.value.length <= 65;
    const urlImgCond = isValidURL(elUrlImg.value);
    const qtyQuestionsCond = qtyQuestions >= 3;
    const qtyLevelsCond = qtyLevels >= 2;

    //MENSAGENS DE ERRO

    addErrorMsg(titleQuizzCond, elTitleQuizz);
    addErrorMsg(urlImgCond, elUrlImg);
    addErrorMsg(qtyQuestionsCond, elQtyQuestions);
    addErrorMsg(qtyLevelsCond, elQtyLevels);

    //FIM MENSAGENS DE ERRO

    if (!(titleQuizzCond && urlImgCond && qtyQuestionsCond && qtyLevelsCond)) {
        alert("Preencha os dados corretamente por favor!");
        document.querySelector('.container').scrollIntoView();
    }

    if (titleQuizzCond && urlImgCond && qtyQuestionsCond && qtyLevelsCond) {
        loadQuestionFields(userQuizzToEdit);
        elQuizzRules = document.querySelector(
            ".quizz-creation .page-form:nth-child(1)"
        );
        elQuizzRules.classList.add("hidden");
        elQuizzQuestions.classList.remove("hidden");
        quizz.title = capitalizeFirstLetter(elTitleQuizz.value);
        quizz.image = elUrlImg.value;
    }
}

function storeIncorrectAnswers(elIncorrectAnswer, elUrlImgIncorrect, questions, aux) {
    if (elIncorrectAnswer.value !== "" && isValidURL(elUrlImgIncorrect.value)) {
        questions[aux].answers.push({
            text: elIncorrectAnswer.value,
            image: elUrlImgIncorrect.value,
            isCorrectAnswer: false
        });
    }
}

function goToCreateLevels() {
    let questions = [];
    let aux = 0;
    const count = qtyQuestions + 1;

    for (let i = 2; i <= count; i++) {
        let elFormBox = elQuizzQuestions.querySelector(`.form-box:nth-child(${i})`);

        const elQuestion = elFormBox.querySelector('[placeholder="Texto da pergunta"]');
        const elBackgroundColor = elFormBox.querySelector('[placeholder="Cor de fundo da pergunta"]');
        const elCorrectAnswer = elFormBox.querySelector('[placeholder="Resposta correta"]');
        const elUrlImgCorrect = elFormBox.querySelector('[placeholder="URL da imagem"]');
        const elIncorrectAnswer1 = elFormBox.querySelector('[placeholder="Resposta incorreta 1"]');
        const elUrlImgIncorrect1 = elFormBox.querySelector('[placeholder="URL da imagem 1"]');
        const elIncorrectAnswer2 = elFormBox.querySelector('[placeholder="Resposta incorreta 2"]');
        const elUrlImgIncorrect2 = elFormBox.querySelector('[placeholder="URL da imagem 2"]');
        const elIncorrectAnswer3 = elFormBox.querySelector('[placeholder="Resposta incorreta 3"]');
        const elUrlImgIncorrect3 = elFormBox.querySelector('[placeholder="URL da imagem 3"]');

        const questionCond = elQuestion.value.length >= 20;
        const colorCond = isHexColor(elBackgroundColor.value);
        const correctAnswerCond = elCorrectAnswer.value !== "";
        const urlImgCorrectCond = isValidURL(elUrlImgCorrect.value);
        const incorrectAnswerCond =
            (elIncorrectAnswer1.value !== "" && isValidURL(elUrlImgIncorrect1.value)) ||
            (elIncorrectAnswer2.value !== "" && isValidURL(elUrlImgIncorrect2.value)) ||
            (elIncorrectAnswer3.value !== "" && isValidURL(elUrlImgIncorrect3.value));
        const conditions =
            questionCond &&
            colorCond &&
            correctAnswerCond &&
            urlImgCorrectCond &&
            incorrectAnswerCond;

        //MENSAGENS DE ERRO

        addErrorMsg(questionCond, elQuestion);
        addErrorMsg(colorCond, elBackgroundColor);
        addErrorMsg(correctAnswerCond, elCorrectAnswer);
        addErrorMsg(urlImgCorrectCond, elUrlImgCorrect);

        if(!incorrectAnswerCond) {
            if(!(elIncorrectAnswer1.value !== "")) {
                elIncorrectAnswer1.classList.add('input-error-bg');
                elIncorrectAnswer1.parentNode.querySelector('.input-error-msg').classList.remove('hidden');
            }
            if(!(isValidURL(elUrlImgIncorrect1.value))) {
                elUrlImgIncorrect1.classList.add('input-error-bg');
                elUrlImgIncorrect1.parentNode.querySelector('.input-error-msg').classList.remove('hidden');
            }
        }

        if(!incorrectAnswerCond) {
            if(elIncorrectAnswer1.value !== "") {
                elIncorrectAnswer1.classList.remove('input-error-bg');
                elIncorrectAnswer1.parentNode.querySelector('.input-error-msg').classList.add('hidden');

            }
            if(isValidURL(elUrlImgIncorrect1.value)) {
                elUrlImgIncorrect1.classList.remove('input-error-bg');
                elUrlImgIncorrect1.parentNode.querySelector('.input-error-msg').classList.add('hidden');
            }
        }

        if(incorrectAnswerCond) {
            if(elIncorrectAnswer1.value !== "") {
                elIncorrectAnswer1.classList.remove('input-error-bg');
                elIncorrectAnswer1.parentNode.querySelector('.input-error-msg').classList.add('hidden');

            }
            if(isValidURL(elUrlImgIncorrect1.value)) {
                elUrlImgIncorrect1.classList.remove('input-error-bg');
                elUrlImgIncorrect1.parentNode.querySelector('.input-error-msg').classList.add('hidden');
            }
        }

        //FIM MENSAGENS DE ERRO

        if (conditions) {
            questions.push({
                title: elQuestion.value,
                color: elBackgroundColor.value,
                answers: [
                    {
                        text: elCorrectAnswer.value,
                        image: elUrlImgCorrect.value,
                        isCorrectAnswer: true
                    }
                ]
            });

            storeIncorrectAnswers(elIncorrectAnswer1, elUrlImgIncorrect1, questions, aux);
            storeIncorrectAnswers(elIncorrectAnswer2, elUrlImgIncorrect2, questions, aux);
            storeIncorrectAnswers(elIncorrectAnswer3, elUrlImgIncorrect3, questions, aux);
            aux++;
        }
    }

    if (questions.length < qtyQuestions) {
        alert("Preencha os dados corretamente por favor!");
        document.querySelector('.container').scrollIntoView();
    } else {
        quizz.questions = questions;
        loadLevels(userQuizzToEdit);
        elQuizzQuestions = document.querySelector(
            ".quizz-creation .page-form:nth-child(2)"
        );
        elQuizzQuestions.classList.add("hidden");
        elQuizzLevels.classList.remove("hidden");
    }
}

function finishQuizz(userQuizzToEdit) {
    let levels = [];
    const count = qtyLevels + 1;
    let aux = 0;

    for (let i = 2; i <= count; i++) {
        let elFormBox = elQuizzLevels.querySelector(`.form-box:nth-child(${i})`);

        const elTitle = elFormBox.querySelector('[placeholder="Título do nível"]');
        const elMinSuccessRate = elFormBox.querySelector('[placeholder="% de acerto mínima"]');
        const elUrlImg = elFormBox.querySelector('[placeholder="URL da imagem do nível"]');
        const elDescription = elFormBox.querySelector('[placeholder="Descrição do nível"]');
        let minSuccessRate = elMinSuccessRate.value;

        if(minSuccessRate === "") {
            minSuccessRate = 150;
        }

        const titleCond = elTitle.value.length >= 10;
        const minSuccessRateCond = Number(minSuccessRate) >= 0 && Number(minSuccessRate) <= 100;
        const urlImgCond = isValidURL(elUrlImg.value);
        const descriptionCond = elDescription.value.length >= 30;
        const conditions =
            titleCond && minSuccessRateCond && urlImgCond && descriptionCond;
        
        //MENSAGENS DE ERRO

        addErrorMsg(titleCond, elTitle);
        addErrorMsg(minSuccessRateCond, elMinSuccessRate);
        addErrorMsg(urlImgCond, elUrlImg);
        addErrorMsg(descriptionCond, elDescription);

        //FIM MENSAGENS DE ERRO

        if (conditions) {
            levels.push({
                title: elTitle.value,
                image: elUrlImg.value,
                text: elDescription.value,
                minValue: Number(minSuccessRate)
            });
        }
    }

    for (let i = 0; i < levels.length; i++) {
        if (levels[i].minValue === 0) {
            aux++;
        }
    }

    //MENSAGENS DE ERRO

    if(aux === 0 && levels.length === qtyLevels) {
        Array.from(elQuizzLevels.querySelectorAll('[placeholder="% de acerto mínima"]'), el => {
            el.classList.add('input-error-bg');
            el.parentNode.querySelector('.input-error-msg')
                .innerText = 'Ao menos um um nível deve possuir % de acerto de 0%';
            el.parentNode.querySelector('.input-error-msg').classList.remove('hidden')
        });
    }

    if(aux !== 0) {
        Array.from(elQuizzLevels.querySelectorAll('[placeholder="% de acerto mínima"]'), el => {
            el.classList.remove('input-error-bg');
            el.parentNode.querySelector('.input-error-msg')
                .innerText = 'A % de acerto deve ser um número entre 0 e 100';
            el.parentNode.querySelector('.input-error-msg').classList.add('hidden')
        });
    }

    //FIM MENSAGENS DE ERRO

    if (levels.length === qtyLevels && aux !== 0) {
        quizz.levels = levels;
        if (userQuizzToEdit) {
            sendEditedQuizz();
        } else {
            sendQuizz();
        }
    } else {
        alert("Preencha os dados corretamente por favor!");
        document.querySelector('.container').scrollIntoView();
    }
}

function sendQuizz() {
    const promise = axios.post(`${API_URL}/quizzes`, quizz);
    promise.then(loadQuizzFinished);
}

function getUserQuizz(response) {
    const quizzId = response.data.id;
    const quizzKey = response.data.key;
    let idListLocal = JSON.parse(localStorage.getItem("userQuizzIds"));
    let keyListLocal = JSON.parse(localStorage.getItem("userQuizzKeys"));

    if (idListLocal !== null) {
        userQuizzesIdList = idListLocal;
        userQuizzesKeyList = keyListLocal;
    }
    userQuizzesIdList.push(quizzId);
    userQuizzesKeyList.push(quizzKey);

    localStorage.setItem("userQuizzIds", JSON.stringify(userQuizzesIdList));
    localStorage.setItem("userQuizzKeys", JSON.stringify(userQuizzesKeyList));
}

function editQuizz(el) {

    showLoadingDiv();
    idQuizzToEdit = el.parentNode.parentNode
        .querySelector(".overlay")
        .getAttribute("onclick");
    const indexStart = idQuizzToEdit.indexOf("(") + 1;
    const indexEnd = idQuizzToEdit.indexOf(")");
    idQuizzToEdit = Number(idQuizzToEdit.slice(indexStart, indexEnd));

    axios.get(`${API_URL}/quizzes/${idQuizzToEdit}`).then((response) => {
        userQuizzToEdit = response.data;
        setTimeout(() => {loadQuizzRules(userQuizzToEdit);}, FIVE_HUNDRED);
    });
}

function renderRulesToEdit(userQuizzToEdit) {
    elQuizzRules = document.querySelector(
        ".quizz-creation .page-form:nth-child(1)"
    );
    elQuizzRules.querySelector('[placeholder="Título do seu quizz"]').value =
        userQuizzToEdit.title;
    elQuizzRules.querySelector('[placeholder="URL da imagem do seu quizz"]').value =
        userQuizzToEdit.image;
    elQuizzRules.querySelector('[placeholder="Quantidade de perguntas do quizz"]').value =
        userQuizzToEdit.questions.length;
    elQuizzRules.querySelector('[placeholder="Quantidade de níveis do quizz"]').value =
        userQuizzToEdit.levels.length;
}

function renderIncorrectAnswersToEdit(elFormBox, aux) {

    for(let i = 1; i <= 3; i++) {
        if (userQuizzToEdit.questions[aux].answers[i]) {
            elFormBox.querySelector(`[placeholder="Resposta incorreta ${i}"]`).value =
                userQuizzToEdit.questions[aux].answers[i].text;
            elFormBox.querySelector(`[placeholder="URL da imagem ${i}"]`).value =
                userQuizzToEdit.questions[aux].answers[i].image;
        }
    
    }

}

function renderQuestionsToEdit(userQuizzToEdit) {
    const elQuizzCreation = document.querySelector(".quizz-creation");
    elQuizzQuestions = elQuizzCreation.querySelector(".page-form:nth-child(2)");
    const count = userQuizzToEdit.questions.length + 1;
    let aux = 0;

    for (let i = 2; i <= count; i++) {
        let elFormBox = elQuizzQuestions.querySelector(`.form-box:nth-child(${i})`);

        elFormBox.querySelector('[placeholder="Texto da pergunta"]').value =
            userQuizzToEdit.questions[aux].title;
        elFormBox.querySelector('[placeholder="Cor de fundo da pergunta"]').value =
            userQuizzToEdit.questions[aux].color;
        elFormBox.querySelector('[placeholder="Resposta correta"]').value =
            userQuizzToEdit.questions[aux].answers[0].text;
        elFormBox.querySelector('[placeholder="URL da imagem"]').value =
            userQuizzToEdit.questions[aux].answers[0].image;
        
        renderIncorrectAnswersToEdit(elFormBox, aux);
        aux++;
    }
}

function renderLevelsToEdit(userQuizzToEdit) {
    elQuizzLevels = document.querySelector(
        ".quizz-creation .page-form:nth-child(3)"
    );
    const count = userQuizzToEdit.levels.length + 1;
    let aux = 0;

    for (let i = 2; i <= count; i++) {
        let elFormBox = elQuizzLevels.querySelector(`.form-box:nth-child(${i})`);

        elFormBox.querySelector('[placeholder="Título do nível"]').value =
            userQuizzToEdit.levels[aux].title;
        elFormBox.querySelector('[placeholder="% de acerto mínima"]').value =
            userQuizzToEdit.levels[aux].minValue;
        elFormBox.querySelector('[placeholder="URL da imagem do nível"]').value =
            userQuizzToEdit.levels[aux].image;
        elFormBox.querySelector('[placeholder="Descrição do nível"]').value =
            userQuizzToEdit.levels[aux].text;

        aux++;
    }
}

function sendEditedQuizz() {
    
    const userQuizzesIds = JSON.parse(localStorage.getItem("userQuizzIds"));
    const userQuizzesKeys = JSON.parse(localStorage.getItem("userQuizzKeys"));

    for (let i = 0; i < userQuizzesIds.length; i++) {
        if (userQuizzesIds[i] === idQuizzToEdit) {
            
            axios
                .put(`${API_URL}/quizzes/${idQuizzToEdit}`, quizz, {
                    headers: {
                        "Secret-Key": userQuizzesKeys[i]
                    }
                })
                .then(renderQuizzEdited(quizz));
        }
    }

    userQuizzToEdit = undefined;
    idQuizzToEdit = undefined;
}

function renderQuizzEdited(quizz) {
    
    const elQuizzCreation = document.querySelector(".quizz-creation");
    elQuizzLevels = document.querySelector(
        ".quizz-creation .page-form:nth-child(3)"
    );

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
            <button onclick="getQuizzDetails(${idQuizzToEdit})">Acessar Quizz</button>
            <button class="back-home" onclick="backHome()">Voltar para home</button>
        </div>
        `;
    elQuizzFinished = elQuizzCreation.querySelector(".page-form:nth-child(4)");
    elQuizzLevels = document.querySelector(
        ".quizz-creation .page-form:nth-child(3)"
    );
    elQuizzLevels.classList.add("hidden");
    elQuizzFinished.classList.remove("hidden");
}

function changeOnClickAtt(el, value) {
    el.querySelector("button").setAttribute("onclick", value);
}
