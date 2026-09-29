document.addEventListener("DOMContentLoaded", () => {
	const form = document.querySelector("form");
	if (!form) return;

	const fields = Array.from(form.querySelectorAll("input"));
	const username = form.querySelector('[name="username"]') || fields[0];
	const password = form.querySelector('[name="password"]') || fields.find((field) => field.type === "password");
	const confirmPassword = form.querySelector('[name="confirmPassword"], [name="confirm-password"]') ||
		fields.filter((field) => field.type === "password")[1];

	function errorElementFor(input) {
		return input.errorElement ||
			(input.id && document.getElementById(`${input.id}-error`)) ||
			(input.name && form.querySelector(`[data-error-for="${input.name}"]`)) ||
			input.parentElement?.querySelector(".error-message, .error, [role=" + '"alert"' + "]");
	}

	function validate(input) {
		const errorElement = errorElementFor(input);
		let message = "";

		if (!input.validity.valid) {
			if (input.validity.valueMissing) message = "This field is required.";
			else if (input.validity.typeMismatch) message = "Please enter a valid value.";
			else if (input.validity.tooShort) message = `Please enter at least ${input.minLength} characters.`;
			else if (input.validity.tooLong) message = `Please enter no more than ${input.maxLength} characters.`;
			else if (input.validity.patternMismatch) message = "Please match the requested format.";
			else if (input.validity.rangeUnderflow || input.validity.rangeOverflow) message = "Please enter a value within the allowed range.";
			else message = input.validationMessage || "Please check this field.";
		} else if (input === confirmPassword && password && input.value !== password.value) {
			message = "Passwords do not match.";
		}

		if (errorElement) errorElement.textContent = message;
		input.setAttribute("aria-invalid", String(Boolean(message)));
		return !message;
	}

	if (username) {
		const savedUsername = localStorage.getItem("username");
		if (savedUsername) username.value = savedUsername;
	}

	fields.forEach((input) => {
		input.addEventListener("input", () => {
			validate(input);
			if (input === password && confirmPassword?.value) validate(confirmPassword);
		});
	});

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		const invalidField = fields.find((input) => !validate(input));
		if (invalidField) {
			invalidField.focus();
			return;
		}

		if (username) localStorage.setItem("username", username.value);
		const status = form.querySelector('[role="status"], .status-message');
		if (status) status.textContent = "Form submitted successfully.";
		else alert("Form submitted successfully.");
	});
});
