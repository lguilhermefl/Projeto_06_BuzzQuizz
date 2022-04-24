const API_URL = "https://mock-api.driven.com.br/api/v6/buzzquizz";
const TWO_SECONDS = 2 * 1000;
const ONE_HUNDRED = 100;

let currentQuizz = {};
let qtyAnswers = 0;
let qtyCorrectAnswers = 0;
let score = 0;
let teste2;

function getUserQuizzIds() {
    let userQuizzIds = JSON.parse(localStorage.getItem("userQuizzIds"));

    if(!userQuizzIds) {
        userQuizzIds = [];
    }

    return userQuizzIds;
}

function renderAllQuizzes(quizzes) {
    const quizzesTemplate = quizzes.map(quizz => {
        return `
            <div class="quizz">
                <img src="${quizz.image}" />
                <div class="overlay" onClick="getQuizzDetails(${quizz.id})">
                    <h4 class="title">${quizz.title}</h4>
                </div>
            </div>
        `;
    }).join('');

    document.querySelector('.all-quizzes .quizzes').innerHTML = quizzesTemplate;
}

const getQuizzesError = () => document.querySelector('.quizzes-list').innerHTML = `<p>Não foi possível obter a lista de quizzes</p>`;

const isNotUserQuizz = quizz => {
    const userQuizzIds = getUserQuizzIds();

    return !userQuizzIds.includes(quizz.id);
}

function getAllQuizzes() {
    axios
        .get(`${API_URL}/quizzes`)
        .then(response => {
            const quizzes = response.data.filter(isNotUserQuizz);

            renderAllQuizzes(quizzes);
        })
        .catch(getQuizzesError);
}

function getQuizzesById(quizzIds) {
    const promises = quizzIds.map(id => axios.get(`${API_URL}/quizzes/${id}`));

    return Promise.all(promises);
}

function renderUserQuizzes(quizzes) {
    const quizzesTemplate = quizzes.map(quizz => {
        return `
            <div class="quizz">
                <img src="${quizz.image}" />
                <div class="overlay" onClick="getQuizzDetails(${quizz.id})">
                    <h4 class="title">${quizz.title}</h4>
                </div>
            </div>
        `;
    }).join('');

    document.querySelector('.your-quizzes .quizzes').innerHTML = quizzesTemplate;
    addEditDeleteButtons();
}

function getUserQuizzes() {
    const userQuizzIds = getUserQuizzIds();
    
    if(userQuizzIds.length > 0) {
        getQuizzesById(userQuizzIds)
            .then(responses => {
                const userQuizzes = responses.map(response => response.data);

                renderUserQuizzes(userQuizzes);

                document.querySelector('.create-quizz').classList.add('hidden');
                document.querySelector('.your-quizzes').classList.remove('hidden');
            })
            .catch(getQuizzesError);
    }
}

function getQuizzes() {
    getAllQuizzes();
    getUserQuizzes();
}

function openQuizzDetails() {
    document.querySelector('.quizzes-list').classList.add('hidden');
    document.querySelector('.quizz-details').classList.remove('hidden');
}

function getQuizzDetails(idQuizz) {
    openQuizzDetails();

    qtyAnswers = 0;
    qtyCorrectAnswers = 0;
    score = 0;

    const loadingMessage = document.querySelector('.quizz-details .loading-message');
    loadingMessage.classList.remove('hidden');

    axios
        .get(`${API_URL}/quizzes/${idQuizz}`)
        .then(response => {
            loadingMessage.classList.add('hidden');
            currentQuizz = response.data;
            renderQuizz();
        })
        .catch(() => document.querySelector('.quizz-details .error-message').classList.remove('hidden'));
}

function renderQuizzTop(image, title) {
    const quizzTopTemplate = `
        <img src="${image}">
        <div class="overlay">
            <h2>${title}</h2>
        </div>
    `;

    document.querySelector('.quizz-top').innerHTML = quizzTopTemplate;
}

function renderQuizzQuestions(questions) {
    const quizzQuestionsTemplate = questions.map((question, index) => {
        return `
            <li class="question" data-index="${index}">
                <div class="question-top" style="background-color: ${question.color};">
                    ${question.title}
                </div>

                <ul class="answers">
                    ${getAnswersTemplate(question)}
                </ul>
            </li>
        `;
    }).join('');

    document.querySelector('.questions').innerHTML = quizzQuestionsTemplate;
}

function renderQuizz() {
    renderQuizzTop(currentQuizz.image, currentQuizz.title);

    renderQuizzQuestions(currentQuizz.questions);
}

function shuffleArray(array) {
    return [...array].sort(comparator);
}

function comparator() {
    return Math.random() - 0.5;
}

function getAnswersTemplate(question) {
    const answersWithIndex = question.answers.map((answer, index) => ({ ...answer, originalIndex: index }));
    const shuffledAnswers = shuffleArray(answersWithIndex);

    return shuffledAnswers.map(answer => `
        <li class="answer" onClick="selectAnswer(this)" data-index="${answer.originalIndex}">
            <img src="${answer.image}">
            <h3>${answer.text}</h3>
        </li>   
    `).join('');
}

function isCorrect(answerEl, question) {
    const answerIndex = answerEl.dataset.index;

    return question.answers[answerIndex].isCorrectAnswer;
}

const wasNotAnswered = questionEl => questionEl.querySelector('.selected') === null;

function scrollToNextQuestion() {
    const questionsEl = Array.from(document.querySelectorAll('.question')).filter(wasNotAnswered);

    if(questionsEl.length > 0) {
        const firstNextQuestionEl = questionsEl[0];
        setTimeout(() => firstNextQuestionEl.scrollIntoView(), TWO_SECONDS);
    }
}

function checkAnswer(answerEl) {
    const currentQuestionEl = answerEl.parentNode.parentNode;
    const questionIndex = currentQuestionEl.dataset.index;
    const currentQuestion = currentQuizz.questions[questionIndex];
    
    if(isCorrect(answerEl, currentQuestion)) {
        answerEl.classList.add('correct');
    } else {
        answerEl.classList.add('incorrect');
    }

    answerEl.removeAttribute('onClick');

    if(!answerEl.classList.contains('selected')) {
        answerEl.classList.add('disabled');
    } else if(answerEl.classList.contains('correct')) {
        qtyCorrectAnswers++;
    }
}

function calculateScore() {
    score = Math.round(qtyCorrectAnswers * ONE_HUNDRED / qtyAnswers);
}

const getAscendingLevels = () => [...currentQuizz.levels].sort((level1, level2) => level1.minValue - level2.minValue);

function getLevel() {
    const ascendingLevels = getAscendingLevels();

    let level = null;

    ascendingLevels.forEach(currentLevel => {
        if(score >= currentLevel.minValue) {
            level = currentLevel;
        }
    });

    return level;
}

function renderQuizzResult() {
    const level = getLevel();

    const quizzResultTemplate = `
        <li class="question result">
            <div class="question-top">
                ${score}% de acerto: ${level.title}
            </div>

            <div class="result-details">
                <img src="${level.image}">
                <p>
                    ${level.text}
                </p>
            </div>
        </li>
    `;

    document.querySelector('.questions').innerHTML += quizzResultTemplate;
}

function selectAnswer(answerEl) {
    answerEl.classList.add('selected');

    const answersEl = Array.from(answerEl.parentNode.querySelectorAll('.answer'));

    answersEl.forEach(checkAnswer);
    qtyAnswers = document.querySelectorAll('.answer.selected').length;

    if(qtyAnswers === currentQuizz.questions.length) {
        calculateScore();
        renderQuizzResult();
    }

    scrollToNextQuestion();
}

function resetQuizz() {
    qtyAnswers = 0;
    qtyCorrectAnswers = 0;
    score = 0;

    renderQuizzQuestions(currentQuizz.questions);
    
    document.querySelector('.question').scrollIntoView();
}

function openQuizzesList() {
    getQuizzes();

    document.querySelector('.quizz-details').classList.add('hidden');
    document.querySelector('.quizzes-list').classList.remove('hidden');

    document.querySelector('.top').scrollIntoView();
}

getQuizzes();

function addEditDeleteButtons() {
    Array.from(document.querySelectorAll(".your-quizzes .quizzes .quizz"),
        quizz => quizz.innerHTML += `
            <div class="delete-edit">
                <img src="img/white-edit.svg" alt="edit" onclick="editQuizz(this)">
                <img src="img/delete.svg" alt="delete" onclick="deleteQuizz(this)">
            </div>
            `
    );
}

function deleteQuizz(el) {
    if(confirmDeletion()) {
        let idQuizzClicked = el.parentNode.parentNode.querySelector(".overlay").getAttribute('onclick');
        const indexStart = idQuizzClicked.indexOf("(") + 1;
        const indexEnd = idQuizzClicked.indexOf(")");
        idQuizzClicked = Number(idQuizzClicked.slice(indexStart, indexEnd));
    
        userQuizzesIdList = [];
        userQuizzesKeyList = [];
    
        const userQuizzesIds = JSON.parse(localStorage.getItem("userQuizzIds"));
        const userQuizzesKeys = JSON.parse(localStorage.getItem("userQuizzKeys"));
    
        for(let i = 0; i < userQuizzesIds.length; i++) {
            if(userQuizzesIds[i] === idQuizzClicked) {
    
                axios.delete(`${API_URL}/quizzes/${idQuizzClicked}`, {
                    headers: {
                        'Secret-Key': userQuizzesKeys[i]
                    }
                });
            } else {
                userQuizzesIdList.push(userQuizzesIds[i]);
                userQuizzesKeyList.push(userQuizzesKeys[i]);
            }
        }
    
        localStorage.setItem("userQuizzIds", JSON.stringify(userQuizzesIdList));
        localStorage.setItem("userQuizzKeys", JSON.stringify(userQuizzesKeyList));
        getUserQuizzes();
    }
}

const confirmDeletion = () => window.confirm("Deseja mesmo deletar este Quizz?");