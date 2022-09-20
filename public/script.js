let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");

const register_btn = document.querySelector("#register-btn")
const login_btn = document.querySelector("#login-btn")

const email_sign_in = document.querySelector("#email-sign-in");
const username_sign_in = document.querySelector("#username-sign-in");
const pass_sign_in = document.querySelector("#pass-sign-in");

const container = document.querySelector(".container");

async function checkMail() {

	let email = email_sign_in.value;
	if (!email.match(regexEmail)) {
		email_sign_in.setCustomValidity("Informe um e-mail válido!")
		return false;
	} else {
		email_sign_in.setCustomValidity("")
	}
	let sql = await (await fetch('https://darker.wtf/api/sql/get?email=' + email)).json()

	if (Object.keys(sql)[0]) {
		window.alert("Email já existente! Prossiga para o login");
		container.classList.remove("sign-up-mode");
		return false;
	}
	if (!sql.verified) {
		window.alert("Há e-mails pendentes em sua caixa de correios!\n\nPor favor verifique novamente, e confira a caixa de SPAM")
		return false;
	}
	return email;
}

async function checkNumber() {
	let number = username_sign_in.value;
	if (!number || number.match(/^\D/g)) {
		username_sign_in.setCustomValidity("Informe um número válido e completo, incluindo código do país");
		return false;
	} else {
		username_sign_in.setCustomValidity("")
	}
	let sql = await (await fetch('https://darker.wtf/api/sql/get?number=' + number)).json()
	if (Object.keys(sql)[0]) {
		window.alert("Número já existente! Prossiga para o login");
		container.classList.remove("sign-up-mode");
		return false;
	}
	if (sql.verified == "false") {
		window.alert("Há e-mails pendentes em sua caixa de correios!\n\nPor favor verifique novamente, e confira a caixa de SPAM")
		return false;
	}
	return number;
}

function checkPass() {
	let pass = pass_sign_in.value;
	if (!pass) {
		pass_sign_in.setCustomValidity("Informe uma senha");
		return false;
	} else {
		pass_sign_in.setCustomValidity("")
	}
	return pass
}

sign_up_btn.addEventListener("click", () => {
	container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
	container.classList.remove("sign-up-mode");
});

register_btn.addEventListener("click", async () => {
	let b1 = await checkMail();
	if (b1) {
		let b2 = await checkNumber();
		if (b2) {
			let b3 = checkPass();
			if (b3) {
				let resp = await fetch(`https://darker.wtf/api/sql/insert?email=${b1}&password=${b3}&number=${b2}`)
				container.classList.remove("sign-up-mode");
			}
		}
	}
	//window.history.pushState("", "", "https://darker.wtf/battery");
	//window.location.reload();
})
