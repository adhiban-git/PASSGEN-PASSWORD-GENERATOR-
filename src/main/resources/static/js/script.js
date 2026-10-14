// ========================================
// PASSGEN - PASSWORD GENERATOR
// JavaScript Frontend Controller
// ========================================

const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");

const passwordOutput = document.getElementById("passwordOutput");
const generateButton = document.getElementById("generateButton");
const copyButton = document.getElementById("copyButton");

const strengthText = document.getElementById("strengthText");
const strengthBars = document.querySelectorAll(".strength-bars span");
const message = document.getElementById("message");

// ========================================
// UPDATE PASSWORD LENGTH
// ========================================

lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
});

// ========================================
// DISPLAY MESSAGES
// ========================================

function showMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle("error", isError);
}

// ========================================
// PASSWORD STRENGTH INDICATOR
// ========================================

function updateStrength(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);

    const variety = [
        hasLower,
        hasUpper,
        hasNumber,
        hasSymbol
    ].filter(Boolean).length;

    if (variety >= 2) score++;

    if (variety >= 3 && password.length >= 12) {
        score++;
    }

    score = Math.min(4, score);

    const labels = [
        "Very weak",
        "Weak",
        "Fair",
        "Strong",
        "Very strong"
    ];

    strengthText.textContent = labels[score];

    strengthBars.forEach((bar, index) => {
        bar.classList.toggle("active", index < score);
    });
}

// ========================================
// GENERATE PASSWORD THROUGH SPRING BOOT
// ========================================

async function generatePassword() {

    const options = {
        length: Number(lengthSlider.value),

        lowercase: document.getElementById("lowercase").checked,

        uppercase: document.getElementById("uppercase").checked,

        numbers: document.getElementById("numbers").checked,

        symbols: document.getElementById("symbols").checked
    };

    const selectedTypes = [
        options.lowercase,
        options.uppercase,
        options.numbers,
        options.symbols
    ];

    // Check whether at least one character type is selected.
    if (!selectedTypes.some(Boolean)) {
        showMessage(
            "Select at least one character type.",
            true
        );
        return;
    }

    generateButton.disabled = true;

    showMessage("Generating your password...");

    try {

        const response = await fetch("/api/password/generate", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(options)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Could not generate password."
            );
        }

        // Display the generated password.
        passwordOutput.textContent = data.password;

        // Update the strength indicator.
        updateStrength(data.password);

        // Store the current password for copying.
        currentPassword = data.password;

        showMessage("Your new password is ready!");

    } catch (error) {

        showMessage(
            error.message || "Something went wrong.",
            true
        );

    } finally {

        generateButton.disabled = false;
    }
}

// ========================================
// COPY PASSWORD TO CLIPBOARD
// ========================================

let currentPassword = "";

copyButton.addEventListener("click", async () => {

    if (!currentPassword) {
        showMessage("Generate a password first.", true);
        return;
    }

    try {

        await navigator.clipboard.writeText(currentPassword);

        showMessage("Password copied to clipboard!");

    } catch (error) {

        showMessage(
            "Clipboard access failed. Copy the password manually.",
            true
        );
    }
});

// ========================================
// GENERATE BUTTON EVENT
// ========================================

generateButton.addEventListener("click", generatePassword);

// ========================================
// AUTOMATICALLY GENERATE FIRST PASSWORD
// ========================================

generatePassword();