// https://github.com/sindresorhus/valid-filename
// by Sindre Sorhus
// MIT licensed

function filenameReservedRegex() {
	return /[<>:"/\\|?*\u0000-\u001F]/g;
}

function windowsReservedNameRegex() {
	return /^(con|prn|aux|nul|com\d|lpt\d)$/i;
}

export default function isValidFilename(string) {
	if (!string || string.length > 255) {
		return false;
	}

	if (filenameReservedRegex().test(string) || windowsReservedNameRegex().test(string)) {
		return false;
	}

	if (string === '.' || string === '..') {
		return false;
	}

	return true;
}