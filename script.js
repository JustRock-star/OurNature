const views = document.querySelectorAll('.page-view');
const navLinks = document.querySelectorAll('[data-route]');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const topicModal = document.querySelector('#topic-modal');
const topicCards = document.querySelectorAll('.issue-card');
const topicContent = {
	climate: { number: '01 / CLIMATE', title: 'Cool the climate', description: 'Climate change is shaped by millions of everyday decisions, from the energy we use to the way we move and eat.', detail: 'Why it matters', body: 'A warmer climate means harsher heat, changing rainfall, and more pressure on food, water, and homes. The good news is that clean energy, efficient buildings, and thoughtful everyday choices can move the story in a better direction.', facts: ['Clean energy cuts pollution at its source.', 'Walking, cycling, transit, and shared journeys reduce emissions.', 'Lower-carbon choices become powerful when communities make them together.'], action: 'A useful place to begin is one change you can repeat: choose a car-free journey, switch off unused energy, or plan one lower-carbon meal.', image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1000&q=85' },
	forest: { number: '02 / FORESTS', title: 'Keep forests standing', description: 'Forests protect biodiversity, store carbon, and support the communities whose lives are rooted among the trees.', detail: 'Why it matters', body: 'Forests are living infrastructure. They cool landscapes, hold soil, clean water, and give thousands of species a home. Protecting them also protects the people and cultures that have cared for them across generations.', facts: ['Forests are home to most of the world’s land-based species.', 'Healthy forests help regulate water and local temperatures.', 'Restoration works best when local communities lead it.'], action: 'Buy less and choose durable, certified products. Support restoration that protects native species and respects the people who live with the forest.', image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1000&q=85' },
	ocean: { number: '03 / OCEANS', title: 'Give oceans room', description: 'The ocean regulates our climate and feeds billions. Its recovery depends on the pressure we take off it.', detail: 'Why it matters', body: 'The ocean is a climate ally, a source of food, and a connected web of life. Plastic, warming water, overfishing, and polluted rivers all add pressure, but healthier choices on land can help the sea recover.', facts: ['The ocean absorbs much of the excess heat caused by climate change.', 'Rivers carry land-based waste and pollution to the coast.', 'Protected marine areas give ecosystems space to recover.'], action: 'Waste less, choose thoughtfully, and keep streets and rivers clean. Every piece of litter kept out of a drain has a better chance of staying out of the sea.', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=85' }
};

function openTopic(topic) {
	const content = topicContent[topic];
	if (!content) return;
	document.querySelector('#topic-number').textContent = content.number;
	document.querySelector('#topic-title').textContent = content.title;
	document.querySelector('#topic-description').textContent = content.description;
	document.querySelector('#topic-detail').innerHTML = `<strong>${content.detail}</strong><p>${content.body}</p>`;
	document.querySelector('#topic-sections').innerHTML = `<h3>In focus</h3><ul>${content.facts.map(fact => `<li>${fact}</li>`).join('')}</ul><h3>One gentle next step</h3><p>${content.action}</p>`;
	document.querySelector('#topic-image').style.backgroundImage = `url("${content.image}")`;
	topicModal.classList.add('is-open');
	topicModal.setAttribute('aria-hidden', 'false');
	document.body.classList.add('modal-open');
	topicModal.querySelector('.modal-close').focus();
}

function closeTopic() {
	topicModal.classList.remove('is-open');
	topicModal.setAttribute('aria-hidden', 'true');
	document.body.classList.remove('modal-open');
}

topicCards.forEach(card => {
	card.addEventListener('click', () => openTopic(card.dataset.topic));
});
topicModal.addEventListener('click', event => {
	if (event.target.matches('[data-close-modal]')) closeTopic();
});
document.addEventListener('keydown', event => {
	if (event.key === 'Escape' && topicModal.classList.contains('is-open')) closeTopic();
});

function showView(route) {
	const target = document.querySelector(`[data-view="${route}"]`) || document.querySelector('[data-view="home"]');
	views.forEach(view => view.classList.toggle('active-view', view === target));
	document.querySelectorAll('.main-nav a').forEach(link => link.classList.toggle('active', link.dataset.route === route));
	mainNav.classList.remove('open');
	menuToggle.setAttribute('aria-expanded', 'false');
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

navLinks.forEach(link => link.addEventListener('click', event => {
	const route = link.dataset.route;
	if (!route) return;
	event.preventDefault();
	history.pushState({ route }, '', `#${route}`);
	showView(route);
	if (topicModal.classList.contains('is-open')) closeTopic();
}));

menuToggle.addEventListener('click', () => {
	const isOpen = mainNav.classList.toggle('open');
	menuToggle.setAttribute('aria-expanded', String(isOpen));
});

window.addEventListener('popstate', () => showView(location.hash.slice(1) || 'home'));
showView(location.hash.slice(1) || 'home');

const counters = document.querySelectorAll('.counter');
const animateCounters = () => counters.forEach(counter => {
	const target = Number(counter.dataset.target);
	let current = 0;
	const step = Math.max(1, target / 35);
	const tick = () => {
		current = Math.min(target, current + step);
		counter.textContent = target === 1 ? current.toFixed(1) : Math.floor(current);
		if (current < target) requestAnimationFrame(tick);
	};
	tick();
});
setTimeout(animateCounters, 350);

const questions = [...document.querySelectorAll('.question')];
const nextButton = document.querySelector('#next-question');
const progressFill = document.querySelector('.progress-fill');
const resultValue = document.querySelector('#result-value');
const resultMessage = document.querySelector('#result-message');
const resultTip = document.querySelector('#result-tip');
const quizIntro = document.querySelector('#quiz-intro');
const startQuizButton = document.querySelector('#start-quiz');
const quizFeedback = document.querySelector('#quiz-feedback');
let currentQuestion = 0;
let footprint = 0;
let quizStarted = false;

function setQuizProgress(percent) {
	progressFill.style.width = `${progressFill.parentElement.clientWidth * percent / 100}px`;
}

const feedbackByQuestion = [
	'Every journey has an impact. Walking, cycling, and public transport usually create the lightest footprint.',
	'Energy choices add up at home. Renewable electricity and efficient heating can reduce emissions over time.',
	'Food connects climate, land, and water. More plant-based meals are one practical way to lower impact.',
	'Buying less and choosing secondhand keeps materials in use and reduces the energy behind new products.',
	'Saving water also saves the energy used to clean, heat, and move it through our homes.',
	'Repairing, reusing, and sorting materials helps prevent waste and keeps valuable resources in circulation.',
	'Local and seasonal food can reduce transport, packaging, and pressure on distant ecosystems.',
	'Flights create a large footprint quickly. Choosing rail, video calls, or fewer trips can make a big difference.',
	'Insulation and efficient appliances make homes more comfortable while reducing the energy they need.',
	'Climate action grows from a clear next step. A realistic plan is more useful than a perfect promise.'
];

function selectAnswer() {
	const selected = questions[currentQuestion].querySelector('input:checked');
	if (!selected) return;
	nextButton.disabled = false;
	nextButton.innerHTML = currentQuestion === questions.length - 1 ? 'See my result <span>→</span>' : 'Next question <span>→</span>';
	quizFeedback.className = 'quiz-feedback visible';
	quizFeedback.textContent = feedbackByQuestion[currentQuestion];
}

questions.forEach(question => question.addEventListener('change', selectAnswer));

document.querySelectorAll('.mini-quiz').forEach(quiz => {
	const result = quiz.querySelector('.mini-result');
	const miniQuestions = [...quiz.querySelectorAll('.mini-question')];
	const next = quiz.querySelector('.mini-next');
	const progress = quiz.querySelector('.mini-progress span');
	let miniIndex = 0;
	let miniScore = 0;
	let answered = false;
	let miniComplete = false;
	const showMiniQuestion = () => {
		miniQuestions.forEach((question, index) => question.classList.toggle('active-mini-question', index === miniIndex));
		progress.style.width = `${(miniIndex / miniQuestions.length) * 100}%`;
		next.disabled = true;
		next.innerHTML = 'Choose an answer <span>→</span>';
		answered = false;
	};
	quiz.querySelectorAll('[data-answer]').forEach(option => option.addEventListener('click', () => {
		if (answered) return;
		answered = true;
		const isCorrect = option.dataset.answer === 'correct';
		if (isCorrect) miniScore += 1;
		quiz.querySelectorAll('.mini-question.active-mini-question [data-answer]').forEach(button => button.classList.remove('correct-answer', 'wrong-answer'));
		option.classList.add(isCorrect ? 'correct-answer' : 'wrong-answer');
		result.textContent = isCorrect ? 'Correct. Explain to a partner why this solution helps.' : 'Not quite. Read the choices again and discuss the strongest option.';
		next.disabled = false;
		next.innerHTML = miniIndex === miniQuestions.length - 1 ? 'See your score <span>→</span>' : 'Next question <span>→</span>';
	}));
	next.addEventListener('click', () => {
		if (!answered) return;
		if (miniComplete) return;
		if (miniIndex < miniQuestions.length - 1) {
			miniIndex += 1;
			result.textContent = '';
			showMiniQuestion();
			return;
		}
		progress.style.width = '100%';
		result.textContent = `You scored ${miniScore} / ${miniQuestions.length}. ${miniScore === miniQuestions.length ? 'Excellent work!' : 'Review the answers together and try again.'}`;
		miniComplete = true;
		next.textContent = 'Try again';
		next.onclick = () => {
			miniIndex = 0;
			miniScore = 0;
			miniComplete = false;
			next.onclick = null;
			result.textContent = '';
			showMiniQuestion();
		};
	});
	showMiniQuestion();
});

startQuizButton.addEventListener('click', () => {
	quizStarted = true;
	quizIntro.classList.add('quiz-hidden');
	questions[0].classList.add('active-question');
	setQuizProgress(10);
	nextButton.disabled = true;
	nextButton.innerHTML = 'Choose an answer <span>→</span>';
});

nextButton.addEventListener('click', () => {
	if (!quizStarted) return;
	const selected = questions[currentQuestion].querySelector('input:checked');
	if (!selected) {
		quizFeedback.className = 'quiz-feedback visible error';
		quizFeedback.textContent = 'Choose an answer to continue.';
		return;
	}
	footprint += Number(selected.value);
	if (currentQuestion < questions.length - 1) {
		currentQuestion += 1;
		questions.forEach((question, index) => question.classList.toggle('active-question', index === currentQuestion));
		setQuizProgress(((currentQuestion + 1) / questions.length) * 100);
		nextButton.disabled = true;
		nextButton.innerHTML = 'Choose an answer <span>→</span>';
		quizFeedback.className = 'quiz-feedback';
		quizFeedback.textContent = '';
	} else {
		setQuizProgress(100);
		resultValue.textContent = footprint.toFixed(1);
		resultMessage.textContent = footprint <= 15 ? 'Excellent work. You have a strong low-carbon foundation.' : footprint <= 25 ? 'A thoughtful start. You have clear opportunities to improve.' : 'Small shifts can make a meaningful difference.';
		resultTip.textContent = footprint > 25 ? 'Class discussion: which one change could lower your score most this month?' : 'Class discussion: which answer felt easiest to change, and why?';
		nextButton.textContent = 'Start again';
		nextButton.disabled = false;
		quizFeedback.className = 'quiz-feedback visible success';
		quizFeedback.textContent = 'Quiz complete. Compare your result with a classmate and discuss one realistic next step.';
		nextButton.onclick = resetCalculator;
	}
});

function resetCalculator() {
	currentQuestion = 0;
	footprint = 0;
	document.querySelector('#footprint-form').reset();
	questions.forEach((question, index) => question.classList.toggle('active-question', index === 0));
	questions.forEach(question => question.classList.remove('active-question'));
	quizIntro.classList.remove('quiz-hidden');
	setQuizProgress(0);
	nextButton.innerHTML = 'Choose an answer <span>→</span>';
	nextButton.disabled = true;
	nextButton.onclick = null;
	resultValue.textContent = '—';
	resultMessage.textContent = 'Complete the quiz to see your estimate.';
	resultTip.textContent = 'Your answers stay in this browser. Use the result as a conversation starter.';
	quizFeedback.className = 'quiz-feedback';
	quizFeedback.textContent = '';
	quizStarted = false;
}

document.querySelector('#signup-form').addEventListener('submit', event => {
	event.preventDefault();
	const form = event.currentTarget;
	const status = document.querySelector('#form-status');
	if (!form.checkValidity()) {
		status.className = 'form-status error';
		status.textContent = 'Please complete your name, email, and consent.';
		form.reportValidity();
		return;
	}
	status.className = 'form-status success';
	status.textContent = 'You’re on the list. Welcome to the movement.';
	form.reset();
});
