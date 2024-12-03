// DOM Elements
const lengthInput = document.querySelector("#length")
const specialCharactersCheckbox = document.querySelector("#special-characters")
const generateButton = document.querySelector("#generate")
const passwordInput = document.querySelector("#password")
const copyButton = document.querySelector("#copy")

// Generate Password
function generateSecurePassword(length, includeSpecialChars) {
  // Define characters to use in the password
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const numbers = "0123456789"
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?"
  const characters = letters + numbers + (includeSpecialChars ? special : "")

  let passwordArray = []

  // Generate password of the specified length
  while (passwordArray.length < length) {
    const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % characters.length
    passwordArray.push(characters[randomIndex])
  }

  // Shuffle the password
  const shuffledPassword = shufflePassword(passwordArray.join(""))
  // Validate the password
  const isValidPassword = validatePassword(shuffledPassword, includeSpecialChars)

  // If password is valid, return it, otherwise generate a new one
  return isValidPassword
    ? shuffledPassword
    : generateSecurePassword(length, includeSpecialChars)
}


// Shuffle Password
function shufflePassword(password) {
  const passwordArray = password.split("")
  // Shuffle the password using Fisher-Yates algorithm
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1)
    // Swap elements
    let temp = passwordArray[i]
    passwordArray[i] = passwordArray[randomIndex]
    passwordArray[randomIndex] = temp
    // [passwordArray[i], passwordArray[suffleIndex]] = [passwordArray[suffleIndex], passwordArray[i]]
  }
  return passwordArray.join("")
}

// Validate Password
function validatePassword(password, includeSpecialChars) {
  // Check for the presence of different character types
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumbers = /[0-9]/.test(password)
  const hasSpecialChars = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)

  return includeSpecialChars
    ? hasUppercase && hasLowercase && hasNumbers && hasSpecialChars
    : hasUppercase && hasLowercase && hasNumbers
}

// Generate Button Click Event
generateButton.addEventListener("click", () => {
  const length = parseInt(lengthInput.value, 10)
  const includeSpecialChars = specialCharactersCheckbox.checked

  // Validate the password length and generate the password accordingly
  if (length >= 8 && length <= 32) {
    const password = generateSecurePassword(length, includeSpecialChars)
    passwordInput.value = password
  } else if (length < 8) {
    lengthInput.value = 8
    passwordInput.value = generateSecurePassword(8, includeSpecialChars)
  } else if (length > 32) {
    lengthInput.value = 32
    passwordInput.value = generateSecurePassword(32, includeSpecialChars)
  } else {
    alert("Password length must be between 8 and 32 characters.")
  }
})

// Custom Alert Function
function showCustomAlert(message, type = "success") {
  const alertBox = document.createElement("div")
  alertBox.classList.add("custom-alert")
  alertBox.classList.add(type)
  alertBox.textContent = message
  document.body.appendChild(alertBox)

  // Remove the alert
  setTimeout(() => {
    alertBox.remove()
  }, 3000)
}

// Copy Button Click Event
copyButton.addEventListener("click", () => {
  // passwordInput.select()

  // Write the password to the clipboard
  navigator.clipboard.writeText(passwordInput.value)
    .then(() => {
      showCustomAlert("Copied!", "success")
    })
    .catch(() => {
      showCustomAlert("Copy failed", "failure")
    })
})
