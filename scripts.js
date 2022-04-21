const API_URL = "https://mock-api.driven.com.br/api/v6/buzzquizz";
const TWO_SECONDS = 2 * 1000;
const ONE_HUNDRED = 100;

let currentQuizz = {};
let qtyAnswers = 0;
let qtyCorrectAnswers = 0;
let score = 0;

function renderQuizzesInElement(quizzess, element) {
    const quizzesTemplate = quizzess.map(quizz => {
        return `
            <div class="quizz" onClick="getQuizzDetails(${quizz.id})">
                <img src="${quizz.image}" />
                <div class="overlay">
                    <h4 class="title">${quizz.title}</h4>
                </div>
            </div>
        `;
    }).join('');

    element.innerHTML = quizzesTemplate;
}

function getQuizzes() {
    axios
        .get(`${API_URL}/quizzes`)
        .then(response => {
            renderQuizzesInElement(response.data, document.querySelector('.all-quizzes .quizzes'));
        })
        .catch(() => {
            document.querySelector('.quizzes-list').innerHTML = `<p>Não foi possível obter a lista de quizzes</p>`;
        });
}

function openQuizzDetails() {
    document.querySelector('.quizzes-list').classList.add('hidden');
    document.querySelector('.quizz-details').classList.remove('hidden');
}

function getQuizzDetails(idQuizz) {
    openQuizzDetails();

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
    const quizzQuestionsTemplate = questions.map(question => {
        return `
            <li class="question">
                <div class="question-top" style="background-color: ${question.color};">
                    ${question.title}
                </div>

                <ul class="answers">
                    ${getAnswersTemplate(question)}
                </ul>
            </li>
        `;
    });

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
    const shuffledAnswers = shuffleArray(question.answers);

    return shuffledAnswers.map(answer => `
        <li class="answer" onClick="selectAnswer(this)">
            <img src="${answer.image}">
            <h3>${answer.text}</h3>
        </li>   
    `).join('');
}

function getQuestionByTitle(questionTitle) {
    let currentQuestion = null;
    currentQuizz.questions.forEach(question => {
        if(question.title === questionTitle) {
            currentQuestion = question;
        }
    });

    return currentQuestion;
}

function isCorrect(answerEl, correctAnswer) {
    const answerImage = answerEl.querySelector('img').src;
    const answerTitle = answerEl.querySelector('h3').innerHTML;

    return answerImage === correctAnswer.image && answerTitle === correctAnswer.text;
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
    const currentQuestion = getQuestionByTitle(currentQuestionEl.querySelector('.question-top').innerText);
    
    const [ correctAnswer ] = currentQuestion.answers.filter(answer => answer.isCorrectAnswer);

    if(isCorrect(answerEl, correctAnswer)) {
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
    document.querySelector('.quizz-details').classList.add('hidden');
    document.querySelector('.quizzes-list').classList.remove('hidden');
    document.querySelector('.top').scrollIntoView();
}

getQuizzes();
