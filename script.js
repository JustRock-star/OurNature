const views = document.querySelectorAll('.page-view');
const navLinks = document.querySelectorAll('[data-route]');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

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
let currentQuestion = 0;
let footprint = 0;

nextButton.addEventListener('click', () => {
	const selected = questions[currentQuestion].querySelector('input:checked');
	if (!selected) {
		resultMessage.textContent = 'Choose one answer to continue.';
		resultTip.textContent = 'There is no perfect answer here, only a useful starting point.';
		return;
	}
	footprint += Number(selected.value);
	if (currentQuestion < questions.length - 1) {
		currentQuestion += 1;
		questions.forEach((question, index) => question.classList.toggle('active-question', index === currentQuestion));
		progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
		nextButton.innerHTML = currentQuestion === questions.length - 1 ? 'See my estimate <span>→</span>' : 'Next question <span>→</span>';
	} else {
		resultValue.textContent = footprint.toFixed(1);
		resultMessage.textContent = footprint <= 7 ? 'A thoughtful start. Keep building on it.' : 'Small shifts can make a meaningful difference.';
		resultTip.textContent = footprint > 10 ? 'Try one lower-carbon journey this week, then make it a habit.' : 'Your next gentle step: choose one meal, journey, or purchase to rethink this week.';
		nextButton.textContent = 'Start again';
		nextButton.onclick = resetCalculator;
	}
});

function resetCalculator() {
	currentQuestion = 0;
	footprint = 0;
	document.querySelector('#footprint-form').reset();
	questions.forEach((question, index) => question.classList.toggle('active-question', index === 0));
	progressFill.style.width = '25%';
	nextButton.innerHTML = 'Next question <span>→</span>';
	nextButton.onclick = null;
	resultValue.textContent = '—';
	resultMessage.textContent = 'Make a selection to reveal your estimate.';
	resultTip.textContent = 'Your answers stay in this browser. No sign-up needed.';
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
