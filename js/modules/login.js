const form = document.getElementById("accountForm");
const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");

const username = document.getElementById("username");
const email = document.getElementById("email");
const emailBox = document.getElementById("emailBox");

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const confirmBox = document.getElementById("confirmBox");

const togglePassword = document.getElementById("togglePassword");

const loginOptions = document.getElementById("loginOptions");

const submitBtn = document.getElementById("submitBtn");

const switchText = document.getElementById("switchText");
const switchLink = document.getElementById("switchLink");

const message = document.getElementById("message");

const authCard = document.getElementById("authCard");

let isSignUp = false;
let isSwitchingForm = false;


/* =========================
   MESSAGE FUNCTION
========================= */

function setMessage(text, type = "error") {
    message.textContent = text;

    if (type === "success") {
        message.style.color = "#496c4f";
    } else {
        message.style.color = "#8e252e";
    }
}


/* =========================
   CHANGE LOGIN / SIGNUP MODE
========================= */

function updateFormMode() {

    isSignUp = !isSignUp;

    formTitle.textContent = isSignUp
        ? "Create your profile."
        : "Welcome back.";

    formSubtitle.textContent = isSignUp
        ? "Create a local Kansō Table profile for this browser."
        : "Sign in to continue to your Kansō Table profile.";


    /* Show email only for signup */

    emailBox.hidden = !isSignUp;
    email.required = isSignUp;


    /* Show confirm password only for signup */

    confirmBox.hidden = !isSignUp;
    confirmPassword.required = isSignUp;


    /* Hide remember + forgot password in signup */

    loginOptions.hidden = isSignUp;


    /* Change button text */

    submitBtn.textContent = isSignUp
        ? "CREATE PROFILE"
        : "SIGN IN";


    /* Change bottom text */

    switchText.textContent = isSignUp
        ? "Already have a local profile?"
        : "New to Kansō Table?";

    switchLink.textContent = isSignUp
        ? "Sign in"
        : "Create profile";


    /* Browser autocomplete */

    password.autocomplete = isSignUp
        ? "new-password"
        : "current-password";


    /* Clear old messages */

    message.textContent = "";


    /* Clear passwords when switching */

    password.value = "";
    confirmPassword.value = "";
}


/* =========================
   LOGIN <-> SIGNUP
   COIN TURN ANIMATION
========================= */

switchLink.addEventListener("click", function (event) {

    event.preventDefault();

    if (isSwitchingForm) {
        return;
    }

    isSwitchingForm = true;


    /* Reset animation classes */

    authCard.classList.remove(
        "coin-turn-out",
        "coin-turn-in"
    );


    /* Force browser repaint */

    void authCard.offsetWidth;


    /* Start first half */

    authCard.classList.add("coin-turn-out");


    authCard.addEventListener(
        "animationend",
        function turnOutFinished(event) {

            if (event.animationName !== "kansoCoinTurnOut") {
                return;
            }


            authCard.removeEventListener(
                "animationend",
                turnOutFinished
            );


            /* Change form while card is turned */

            updateFormMode();


            authCard.classList.remove("coin-turn-out");

            void authCard.offsetWidth;


            /* Turn card back */

            authCard.classList.add("coin-turn-in");


            authCard.addEventListener(
                "animationend",
                function turnInFinished(event) {

                    if (
                        event.animationName !==
                        "kansoCoinTurnIn"
                    ) {
                        return;
                    }


                    authCard.removeEventListener(
                        "animationend",
                        turnInFinished
                    );


                    authCard.classList.remove(
                        "coin-turn-in"
                    );


                    isSwitchingForm = false;
                }
            );
        }
    );
});


/* =========================
   SHOW / HIDE PASSWORD
========================= */

togglePassword.addEventListener(
    "click",
    function () {

        const isHidden =
            password.type === "password";


        password.type = isHidden
            ? "text"
            : "password";


        togglePassword.textContent =
            isHidden
                ? "Hide"
                : "Show";


        togglePassword.setAttribute(
            "aria-label",
            isHidden
                ? "Hide password"
                : "Show password"
        );
    }
);


/* =========================
   FORM SUBMIT
========================= */

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            username.value.trim();


        /* Check display name */

        if (!name) {

            username.focus();

            setMessage(
                "Please enter your display name."
            );

            return;
        }


        /* Password validation */

        if (password.value.length < 6) {

            password.focus();

            setMessage(
                "Passphrase must be at least 6 characters."
            );

            return;
        }


        /* Extra checks for signup */

        if (isSignUp) {

            if (
                !email.value.trim() ||
                !email.checkValidity()
            ) {

                email.focus();

                setMessage(
                    "Please enter a valid email address."
                );

                return;
            }


            if (
                password.value !==
                confirmPassword.value
            ) {

                confirmPassword.focus();

                setMessage(
                    "Passphrases do not match."
                );

                return;
            }
        }


        if (submitBtn.disabled) {
            return;
        }


        /* Disable button during animation */

        submitBtn.disabled = true;

        message.textContent = "";


        /* Restart animation */

        submitBtn.classList.remove(
            "coin-flip"
        );

        void submitBtn.offsetWidth;

        submitBtn.classList.add(
            "coin-flip"
        );


        submitBtn.addEventListener(
            "animationend",
            function finishAnimation(event) {

                if (
                    event.animationName !==
                    "kansoCoinFlip"
                ) {
                    return;
                }


                submitBtn.classList.remove(
                    "coin-flip"
                );

                submitBtn.disabled = false;


                /* =========================
                   SIGN UP
                ========================= */

                if (isSignUp) {

                    /*
                    Save only demo profile data.

                    Password is intentionally
                    NOT stored.
                    */

                    localStorage.setItem(
                        "kansoDemoProfile",
                        JSON.stringify({
                            name: name,
                            email: email.value.trim(),
                            createdAt:
                                new Date().toISOString()
                        })
                    );


                    setMessage(
                        "Local profile created successfully. Your passphrase was not stored.",
                        "success"
                    );
                }


                /* =========================
                   LOGIN
                ========================= */

                else {

                    const existingProfile =
                        localStorage.getItem(
                            "kansoDemoProfile"
                        );


                    if (existingProfile) {

                        setMessage(
                            "Demo sign-in complete. Welcome back to your table.",
                            "success"
                        );

                    } else {

                        setMessage(
                            "Demo sign-in complete. Create a profile if you want to save local details.",
                            "success"
                        );
                    }
                }

            }
        );
    }
);


/* =========================
   FORGOT PASSWORD
========================= */

document
    .getElementById("forgotLink")
    .addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            setMessage(
                "Password recovery is unavailable because this is a browser-only demonstration."
            );
        }
    );