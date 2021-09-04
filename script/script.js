const setCircleStartPoint = (element, circumference, offsetDeg) => {
	const fromDegToLen = offsetDeg * circumference / 360;
	element.style.strokeDashoffset = fromDegToLen;

	return fromDegToLen;
};

const setCircleProgress = (element, circumference, ratio) => {
	const dashSize = circumference * ratio;
	const dashGap = circumference - dashSize;
	element.style.strokeDasharray = `${circumference * ratio} ${dashGap}`;
};

const getMouseAng = ({ clientX, clientY }, center, offsetDeg) => {
	const anchor = {
		x: clientX - center.x,
		y: (clientY - center.y) * 1,
	};

	const radians = Math.atan(anchor.y / anchor.x);
	let degrees = Math.abs(radians * (180 / Math.PI));

	// Convert degrees from 90 to 360 using quadrants
	let quadrant;
	if (anchor.x > 0 && anchor.y > 0) {
		// Quadrant: 1
		degrees = degrees;
	} else if (anchor.x < 0 && anchor.y > 0) {
		// Quadrant: 2
		degrees = 90 + (90 - degrees);
	} else if (anchor.x < 0 && anchor.y < 0) {
		// Quadrant: 3
		degrees = 180 + degrees;
	} else {
		// Quadrant: 4
		degrees = 270 + (90 - degrees);
	}

	degrees += offsetDeg;

	if (degrees > 360) { degrees = degrees - 360; }
	if (degrees < 0) { degrees = degrees + 360; }

	return degrees;
};

let minutes = 0;
let lastSec;
const setTimer = (ratio) => {
	const getTimer = document.querySelector("#time");
	const seconds = Math.ceil(ratio * 60);
	const minutesStr = minutes > 9 ? minutes : `0${minutes}`;
	const secondsStr = seconds > 9 ? seconds : `0${seconds}`;
	getTimer.textContent = `${minutesStr}:${secondsStr}`;

	if (seconds === 1 && lastSec === 60 && minutes !== 60) { minutes++; }
	if (seconds === 60 && lastSec === 1 && minutes !== 0) { minutes--; }

	lastSec = seconds;
};

document.addEventListener('DOMContentLoaded', () => {
	const getMain = document.querySelector('main');
	const mainCircle = document.getElementById('main-circle');
	const radius = parseFloat(mainCircle.getAttribute('r'));
	const circumference = 2 * Math.PI * radius;
	const offsetDeg = 90;
	const center = {
		x: mainCircle.getBoundingClientRect().x + mainCircle.getBoundingClientRect().width / 2,
		y: mainCircle.getBoundingClientRect().y + mainCircle.getBoundingClientRect().height / 2,
	};
	setCircleStartPoint(mainCircle, circumference, offsetDeg);

	getMain.addEventListener('mousemove', (event) => {
		const angle = getMouseAng(event, center, offsetDeg);
		const ratio = angle / 360;

		setCircleProgress(mainCircle, circumference, ratio);
		setTimer(ratio);
	});
});
