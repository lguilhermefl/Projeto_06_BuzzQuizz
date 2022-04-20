const API_URL = "https://mock-api.driven.com.br/api/v6/buzzquizz";

function getQuizzDetails(idQuizz) {
    const loadingMessage = document.querySelector('.quizz-details .loading-message');
    loadingMessage.classList.remove('hidden');

    axios
        .get(`${API_URL}/quizzes/${idQuizz}`)
        .then(response => {
            loadingMessage.classList.add('hidden');
            renderQuizz(response.data);
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

function renderQuizz(quizz) {
    renderQuizzTop(quizz.image, quizz.title);

    renderQuizzQuestions(quizz.questions);
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
        <li class="answer">
            <img src="${answer.image}">
            <h3>${answer.text}</h3>
        </li>   
    `).join('');
}
