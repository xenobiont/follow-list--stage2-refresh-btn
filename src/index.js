import { from, mergeMap, fromEvent, startWith, map } from 'rxjs';

// stage 2 The refresh button
// We need two things:
// a stream of click events on the refresh button (anything can be a stream!),
// and we need to change the request stream to depend on the refresh click stream.
const e_refreshButton = document.querySelector('.refresh');
const refreshClick$ = fromEvent(e_refreshButton, 'click');

// refreshClick$.subscribe(console.log);

const request$ = refreshClick$.pipe(
	// we use startWith to also trigger on page load;
	// no need to imitate a real event object, we just need some value (it will be remapped later anyway)
	startWith(null),
	//  now we need to map each click to some url
	map((_) => `https://api.github.com/users?since=${getRandomOffset()}`)
);

const response$ = request$.pipe(
	mergeMap((url) => fetch(url)),
	mergeMap((response) => response.json())
);

// response$.subscribe(console.log);

response$.subscribe((users) => {
	console.log(users);
	['.suggestion1', '.suggestion2', '.suggestion3'].forEach((selector, i) =>
		renderSuggestion(users[i], selector)
	);
});

// now each click gives us new object logged in console

function getRandomUser(usersList) {
	return usersList[Math.floor(Math.random() * usersList.length)];
}

function getRandomOffset() {
	return Math.floor(Math.random() * 500);
}

function renderSuggestion(suggestedUser, selector) {
	const suggestionEl = document.querySelector(selector);

	if (suggestedUser === null) {
		suggestionEl.style.visibility = 'hidden';
	} else {
		suggestionEl.style.visibility = 'visible';

		const usernameEl = suggestionEl.querySelector('.username');
		usernameEl.href = suggestedUser.html_url;
		usernameEl.textContent = suggestedUser.login;

		const imgEl = suggestionEl.querySelector('img');
		imgEl.src = suggestedUser.avatar_url;
	}
}
