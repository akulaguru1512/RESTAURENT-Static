/* =========================================================
   KANSŌ TABLE — LOGIN MODULE
   Local, browser-only demonstration account access.
   No password is ever stored or transmitted.
========================================================= */

window.LoginModule = (() => {

  const PROFILE_KEY = "profile";
  const SESSION_KEY = "kanso:demoSession";
  const REMEMBER_KEY = "rememberLogin";
  const DEMO_EMAIL = "guest@kansotable.demo";
  const DEMO_PASSWORD = "Kanso@2026";

  let isSignUp = false;
  let els = null;
  let redirectTimer = null;


  /* =======================================================
     ELEMENT LOOKUP
  ======================================================= */

  function collect() {
    return {
      form: document.getElementById("accountForm"),
      formTitle: document.getElementById("formTitle"),
      formSubtitle: document.getElementById("formSubtitle"),

      tabSignin: document.getElementById("tabSignin"),
      tabSignup: document.getElementById("tabSignup"),

      nameField: document.getElementById("nameField"),
      username: document.getElementById("username"),

      email: document.getElementById("email"),

      password: document.getElementById("password"),
      togglePassword: document.getElementById("togglePassword"),

      confirmField: document.getElementById("confirmField"),
      confirmPassword: document.getElementById("confirmPassword"),
      toggleConfirm: document.getElementById("toggleConfirm"),

      forgotLink: document.getElementById("forgotLink"),
      remember: document.getElementById("remember"),

      submitBtn: document.getElementById("submitBtn"),
      submitLabel: document.getElementById("submitLabel"),

      message: document.getElementById("message"),
      demoFill: document.getElementById("demoFill"),

      signedInBanner: document.getElementById("signedInBanner"),
      signedInName: document.getElementById("signedInName"),
      signOutBtn: document.getElementById("signOutBtn"),

      year: document.getElementById("loginYear")
    };
  }

  const fieldOf = (input) => input.closest(".field");


  /* =======================================================
     SMALL HELPERS
  ======================================================= */

  function showMessage(text, tone = "info") {
    els.message.textContent = text;
    els.message.classList.remove("is-error", "is-success", "is-info");
    els.message.classList.add(`is-${tone}`);
  }

  function clearMessage() {
    els.message.textContent = "";
    els.message.classList.remove("is-error", "is-success", "is-info");
  }

  function setFieldState(input, message) {
    const field = fieldOf(input);
    ValidationUtil.markField(input, message);

    if (field) {
      field.classList.toggle(
        "is-valid",
        !message && input.value.trim().length > 0
      );
    }

    return !message;
  }

  function clearFieldState(input) {
    ValidationUtil.markField(input, "");
    fieldOf(input)?.classList.remove("is-valid");
  }

  function clearAllFieldStates() {
    [els.username, els.email, els.password, els.confirmPassword]
      .filter(Boolean)
      .forEach(clearFieldState);
  }

  function friendlyNameFromEmail(email) {
    const local = String(email).split("@")[0] || "Guest";
    const words = local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

    return words.join(" ") || "Guest";
  }


  /* =======================================================
     VALIDATION
  ======================================================= */

  function validateName(silent = false) {
    const value = els.username.value.trim();

    if (!value) {
      return silent || setFieldState(els.username, "Please enter your full name.");
    }

    if (value.length < 2) {
      return silent || setFieldState(els.username, "Name must be at least 2 characters.");
    }

    return setFieldState(els.username, "");
  }

  function validateEmail(silent = false) {
    const value = els.email.value.trim();

    if (!value) {
      return silent || setFieldState(els.email, "Please enter your email address.");
    }

    if (!ValidationUtil.email(value)) {
      return silent || setFieldState(els.email, "Enter a valid email address.");
    }

    return setFieldState(els.email, "");
  }

  function validatePassword(silent = false) {
    const value = els.password.value;

    if (!value) {
      return silent || setFieldState(els.password, "Please enter your password.");
    }

    if (value.length < 6) {
      return silent || setFieldState(els.password, "Use at least 6 characters.");
    }

    return setFieldState(els.password, "");
  }

  function validateConfirm(silent = false) {
    if (!els.confirmPassword.value) {
      return silent || setFieldState(els.confirmPassword, "Please confirm your password.");
    }

    if (els.confirmPassword.value !== els.password.value) {
      return silent || setFieldState(els.confirmPassword, "Passwords do not match.");
    }

    return setFieldState(els.confirmPassword, "");
  }

  function validateAll() {
    const checks = [
      isSignUp ? validateName() : true,
      validateEmail(),
      validatePassword(),
      isSignUp ? validateConfirm() : true
    ];

    return checks.every(Boolean);
  }

  function focusFirstInvalid() {
    const first = els.form.querySelector('.field.has-error input');

    if (first) {
      first.focus();
    }
  }


  /* =======================================================
     MODE SWITCHING
  ======================================================= */

  function setMode(signup, { focusTab = false } = {}) {
    isSignUp = Boolean(signup);

    if (els.nameField) els.nameField.hidden = !isSignUp;
    if (els.confirmField) els.confirmField.hidden = !isSignUp;

    els.username.required = isSignUp;
    els.confirmPassword.required = isSignUp;

    if (els.forgotLink) els.forgotLink.hidden = isSignUp;

    els.tabSignin.classList.toggle("is-active", !isSignUp);
    els.tabSignup.classList.toggle("is-active", isSignUp);

    els.tabSignin.setAttribute("aria-selected", String(!isSignUp));
    els.tabSignup.setAttribute("aria-selected", String(isSignUp));

    els.tabSignin.tabIndex = isSignUp ? -1 : 0;
    els.tabSignup.tabIndex = isSignUp ? 0 : -1;

    els.form.setAttribute(
      "aria-labelledby",
      isSignUp ? "tabSignup" : "tabSignin"
    );

    els.formTitle.textContent = isSignUp ? "Create your account." : "Welcome back.";
    els.formSubtitle.textContent = isSignUp
      ? "Join Kansō Table to save favourites, reservations and demo rewards in this browser."
      : "Sign in to continue to your Kansō Table profile.";

    els.submitLabel.textContent = isSignUp ? "Create account" : "Sign in";

    els.password.autocomplete = isSignUp ? "new-password" : "current-password";
    els.password.placeholder = isSignUp
      ? "Create a password"
      : "Enter your password";

    els.password.value = "";
    els.confirmPassword.value = "";

    clearAllFieldStates();
    clearMessage();

    if (focusTab) {
      (isSignUp ? els.tabSignup : els.tabSignin).focus();
    }
  }


  /* =======================================================
     PASSWORD REVEAL
  ======================================================= */

  function bindReveal(button, input, label) {
    if (!button || !input) return;

    button.addEventListener("click", () => {
      const reveal = input.type === "password";

      input.type = reveal ? "text" : "password";
      button.classList.toggle("is-visible", reveal);
      button.setAttribute("aria-pressed", String(reveal));
      button.setAttribute(
        "aria-label",
        `${reveal ? "Hide" : "Show"} ${label}`
      );

      input.focus({ preventScroll: true });
    });
  }


  /* =======================================================
     SIGNED-IN NOTICE
  ======================================================= */

  function renderSignedIn() {
    if (!els.signedInBanner) return;

    const profile = StorageUtil.get(PROFILE_KEY, {}) || {};

    if (profile.signedIn && profile.name) {
      els.signedInName.textContent = profile.name;
      els.signedInBanner.hidden = false;
    } else {
      els.signedInBanner.hidden = true;
    }
  }

  function signOut() {
    const profile = StorageUtil.get(PROFILE_KEY, {}) || {};

    profile.signedIn = false;
    StorageUtil.set(PROFILE_KEY, profile);

    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* session storage may be unavailable */
    }

    renderSignedIn();
    showMessage("Signed out of this browser demo.", "info");
  }


  /* =======================================================
     SUBMIT
  ======================================================= */

  function rememberPreference() {
    if (!els.remember) return true;

    StorageUtil.set(REMEMBER_KEY, els.remember.checked);
    return els.remember.checked;
  }

  function saveProfile() {
    const email = els.email.value.trim().toLowerCase();
    const stored = StorageUtil.get(PROFILE_KEY, {}) || {};
    const sameEmail = String(stored.email || "").toLowerCase() === email;

    const name = isSignUp
      ? els.username.value.trim()
      : (sameEmail && stored.name) || stored.name || friendlyNameFromEmail(email);

    const profile = {
      ...stored,
      name,
      email,
      signedIn: true,
      lastLogin: new Date().toISOString()
    };

    if (isSignUp) {
      profile.createdAt = stored.createdAt || new Date().toISOString();
    }

    StorageUtil.set(PROFILE_KEY, profile);
    rememberPreference();

    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ name, email })
      );
    } catch {
      /* session storage may be unavailable */
    }

    return profile;
  }

  function finish(profile) {
    const greeting = isSignUp
      ? `Profile created. Welcome, ${profile.name}.`
      : `Welcome back, ${profile.name}.`;

    showMessage(`${greeting} Taking you to your profile…`, "success");

    els.submitBtn.classList.add("is-success");
    els.submitBtn.disabled = true;
    els.submitLabel.textContent = isSignUp ? "Account created" : "Signed in";
    els.form.setAttribute("aria-busy", "true");

    redirectTimer = window.setTimeout(() => {
      window.location.href = "profile.html";
    }, 1100);
  }

  function onSubmit(event) {
    event.preventDefault();
    clearMessage();

    if (redirectTimer) {
      window.clearTimeout(redirectTimer);
    }

    if (!validateAll()) {
      showMessage("Please check the highlighted fields.", "error");
      focusFirstInvalid();
      return;
    }

    const profile = saveProfile();

    renderSignedIn();
    finish(profile);
  }


  /* =======================================================
     EVENTS
  ======================================================= */

  function bindEvents() {
    els.form.addEventListener("submit", onSubmit);

    els.tabSignin.addEventListener("click", () => setMode(false));
    els.tabSignup.addEventListener("click", () => setMode(true));

    [els.tabSignin, els.tabSignup].forEach((tab) => {
      tab.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

        event.preventDefault();
        setMode(event.key === "ArrowRight", { focusTab: true });
      });
    });

    bindReveal(els.togglePassword, els.password, "password");
    bindReveal(els.toggleConfirm, els.confirmPassword, "confirm password");

    els.username.addEventListener("blur", () => {
      if (isSignUp && els.username.value.trim()) validateName();
    });

    els.email.addEventListener("blur", () => {
      if (els.email.value.trim()) validateEmail();
    });

    els.password.addEventListener("blur", () => {
      if (els.password.value) validatePassword();
    });

    els.confirmPassword.addEventListener("blur", () => {
      if (isSignUp && els.confirmPassword.value) validateConfirm();
    });

    [els.username, els.email, els.password, els.confirmPassword].forEach((input) => {
      input.addEventListener("input", () => {
        if (fieldOf(input)?.classList.contains("has-error")) {
          clearFieldState(input);
        }

        if (els.message.textContent) clearMessage();
      });
    });

    els.forgotLink.addEventListener("click", () => {
      showMessage(
        "Password recovery isn’t available in this browser-only demo. Use “Fill demo details” below to continue.",
        "info"
      );
    });

    els.demoFill.addEventListener("click", () => {
      setMode(false);

      els.email.value = DEMO_EMAIL;
      els.password.value = DEMO_PASSWORD;

      clearAllFieldStates();
      showMessage("Demo details filled. Choose Sign in to continue.", "info");

      els.submitBtn.focus();
    });

    els.signOutBtn?.addEventListener("click", signOut);

    els.remember.checked =
      StorageUtil.get(REMEMBER_KEY, true) !== false;
  }


  /* =======================================================
     INIT
  ======================================================= */

  function init() {
    const found = collect();

    const required = [
      "form", "formTitle", "formSubtitle", "tabSignin", "tabSignup",
      "nameField", "username", "email", "password", "togglePassword",
      "confirmField", "confirmPassword", "forgotLink", "remember",
      "submitBtn", "submitLabel", "message", "demoFill"
    ];

    const missing = required.filter((key) => !found[key]);

    if (missing.length) {
      console.error(
        `Kansō login: missing required elements (${missing.join(", ")}).`
      );
      return;
    }

    els = found;

    if (els.year) {
      els.year.textContent = new Date().getFullYear();
    }

    // The login page is standalone, so initialise the shared theme module here.
    window.ThemeModule?.init();

    const wantsSignup =
      new URLSearchParams(window.location.search).get("mode") === "signup";

    setMode(wantsSignup);
    renderSignedIn();
    bindEvents();
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (document.body?.dataset.page === "login") {
      init();
    }
  });

  return { init };

})();
