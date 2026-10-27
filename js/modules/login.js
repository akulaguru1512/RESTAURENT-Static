document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       GET ELEMENTS
    ========================================= */

    const form =
        document.getElementById("accountForm");

    const authCard =
        document.getElementById("authCard");


    const formTitle =
        document.getElementById("formTitle");

    const formSubtitle =
        document.getElementById("formSubtitle");


    const username =
        document.getElementById("username");

    const email =
        document.getElementById("email");

    const emailBox =
        document.getElementById("emailBox");


    const password =
        document.getElementById("password");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const confirmBox =
        document.getElementById("confirmBox");


    const togglePassword =
        document.getElementById("togglePassword");


    const loginOptions =
        document.getElementById("loginOptions");


    const submitBtn =
        document.getElementById("submitBtn");


    const switchText =
        document.getElementById("switchText");

    const switchLink =
        document.getElementById("switchLink");


    const message =
        document.getElementById("message");


    const forgotLink =
        document.getElementById("forgotLink");


    /* =========================================
       SAFETY CHECK
    ========================================= */

    if (
        !form ||
        !authCard ||
        !formTitle ||
        !formSubtitle ||
        !username ||
        !email ||
        !emailBox ||
        !password ||
        !confirmPassword ||
        !confirmBox ||
        !togglePassword ||
        !loginOptions ||
        !submitBtn ||
        !switchText ||
        !switchLink ||
        !message ||
        !forgotLink
    ) {

        console.error(
            "Kansō login: required HTML elements are missing."
        );

        return;
    }


    /* =========================================
       STATE
    ========================================= */

    let isSignUp = false;

    let isAnimating = false;


    /* =========================================
       MESSAGE HELPER
    ========================================= */

    function showMessage(
        text,
        type = "error"
    ) {

        message.textContent =
            text;


        if (type === "success") {

            message.style.color =
                "#496c4f";

        } else {

            message.style.color =
                "#8e252e";

        }

    }


    function clearMessage() {

        message.textContent =
            "";

    }


    /* =========================================
       LOGIN MODE
    ========================================= */

    function showLoginMode() {

        isSignUp =
            false;


        formTitle.textContent =
            "Welcome back.";


        formSubtitle.textContent =
            "Sign in to continue to your Kansō Table profile.";


        emailBox.hidden =
            true;

        email.required =
            false;


        confirmBox.hidden =
            true;

        confirmPassword.required =
            false;


        loginOptions.hidden =
            false;


        submitBtn.textContent =
            "SIGN IN";


        switchText.textContent =
            "New to Kansō Table?";


        switchLink.textContent =
            "Create profile";


        password.autocomplete =
            "current-password";


        password.value =
            "";

        confirmPassword.value =
            "";


        clearMessage();

    }


    /* =========================================
       CREATE PROFILE MODE
    ========================================= */

    function showSignUpMode() {

        isSignUp =
            true;


        formTitle.textContent =
            "Create profile.";


        formSubtitle.textContent =
            "Create a local Kansō Table profile in this browser.";


        emailBox.hidden =
            false;

        email.required =
            true;


        confirmBox.hidden =
            false;

        confirmPassword.required =
            true;


        loginOptions.hidden =
            true;


        submitBtn.textContent =
            "CREATE PROFILE";


        switchText.textContent =
            "Already have a profile?";


        switchLink.textContent =
            "Sign in";


        password.autocomplete =
            "new-password";


        password.value =
            "";

        confirmPassword.value =
            "";


        clearMessage();

    }


    /* =========================================
       CHANGE FORM WITH COIN ANIMATION
    ========================================= */

    function changeMode() {

        if (isAnimating) {
            return;
        }


        isAnimating =
            true;


        authCard.classList.remove(
            "coin-turn-in",
            "coin-turn-out"
        );


        /*
          Force repaint so animation
          can restart every time.
        */

        void authCard.offsetWidth;


        authCard.classList.add(
            "coin-turn-out"
        );


        function cardTurnedOut(event) {

            if (
                event.animationName !==
                "circleCardOut"
            ) {

                return;

            }


            authCard.removeEventListener(
                "animationend",
                cardTurnedOut
            );


            if (isSignUp) {

                showLoginMode();

            } else {

                showSignUpMode();

            }


            authCard.classList.remove(
                "coin-turn-out"
            );


            void authCard.offsetWidth;


            authCard.classList.add(
                "coin-turn-in"
            );


            function cardTurnedIn(event) {

                if (
                    event.animationName !==
                    "circleCardIn"
                ) {

                    return;

                }


                authCard.removeEventListener(
                    "animationend",
                    cardTurnedIn
                );


                authCard.classList.remove(
                    "coin-turn-in"
                );


                isAnimating =
                    false;

            }


            authCard.addEventListener(
                "animationend",
                cardTurnedIn
            );

        }


        authCard.addEventListener(
            "animationend",
            cardTurnedOut
        );

    }


    /* =========================================
       SWITCH LOGIN / SIGN UP
    ========================================= */

    switchLink.addEventListener(
        "click",
        changeMode
    );


    /* =========================================
       PASSWORD SHOW / HIDE
    ========================================= */

    togglePassword.addEventListener(
        "click",
        () => {

            const passwordHidden =
                password.type ===
                "password";


            if (passwordHidden) {

                password.type =
                    "text";

                togglePassword.textContent =
                    "Hide";

                togglePassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                password.type =
                    "password";

                togglePassword.textContent =
                    "Show";

                togglePassword.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );


    /* =========================================
       FORGOT PASSWORD
    ========================================= */

    forgotLink.addEventListener(
        "click",
        () => {

            showMessage(
                "Password recovery is unavailable in this browser-only demonstration."
            );

        }
    );


    /* =========================================
       VALIDATION
    ========================================= */

    function validateForm() {

        const name =
            username.value.trim();


        if (!name) {

            username.focus();


            showMessage(
                "Please enter your display name."
            );


            return false;

        }


        if (
            password.value.length < 6
        ) {

            password.focus();


            showMessage(
                "Passphrase must contain at least 6 characters."
            );


            return false;

        }


        if (isSignUp) {

            const emailValue =
                email.value.trim();


            if (
                !emailValue ||
                !email.checkValidity()
            ) {

                email.focus();


                showMessage(
                    "Please enter a valid email address."
                );


                return false;

            }


            if (
                confirmPassword.value !==
                password.value
            ) {

                confirmPassword.focus();


                showMessage(
                    "Passphrases do not match."
                );


                return false;

            }

        }


        return true;

    }


    /* =========================================
       BUTTON ANIMATION
    ========================================= */

    function animateSubmitButton(
        callback
    ) {

        submitBtn.disabled =
            true;


        submitBtn.classList.remove(
            "coin-flip"
        );


        void submitBtn.offsetWidth;


        submitBtn.classList.add(
            "coin-flip"
        );


        function finished(event) {

            if (
                event.animationName !==
                "circleButtonFlip"
            ) {

                return;

            }


            submitBtn.removeEventListener(
                "animationend",
                finished
            );


            submitBtn.classList.remove(
                "coin-flip"
            );


            submitBtn.disabled =
                false;


            callback();

        }


        submitBtn.addEventListener(
            "animationend",
            finished
        );

    }


    /* =========================================
       CREATE LOCAL PROFILE
    ========================================= */

    function createProfile() {

        const profile = {

            name:
                username.value.trim(),

            email:
                email.value.trim(),

            createdAt:
                new Date().toISOString()

        };


        /*
          IMPORTANT:

          Password is deliberately NOT saved.
        */

        localStorage.setItem(
            "kansoDemoProfile",
            JSON.stringify(profile)
        );


        showMessage(
            "Profile created successfully. Your passphrase was not stored.",
            "success"
        );

    }


    /* =========================================
       DEMO LOGIN
    ========================================= */

    function loginProfile() {

        const savedProfile =
            localStorage.getItem(
                "kansoDemoProfile"
            );


        if (savedProfile) {

            try {

                const profile =
                    JSON.parse(savedProfile);


                showMessage(
                    `Welcome back${profile.name ? ", " + profile.name : ""}.`,
                    "success"
                );

            } catch {

                showMessage(
                    "Welcome back to Kansō Table.",
                    "success"
                );

            }

        } else {

            showMessage(
                "Demo sign-in complete. Create a profile to save local information.",
                "success"
            );

        }

    }


    /* =========================================
       SUBMIT
    ========================================= */

    form.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            clearMessage();


            if (!validateForm()) {

                return;

            }


            animateSubmitButton(
                () => {

                    if (isSignUp) {

                        createProfile();

                    } else {

                        loginProfile();

                    }

                }
            );

        }
    );


    /* =========================================
       INITIAL MODE
    ========================================= */

    showLoginMode();

});