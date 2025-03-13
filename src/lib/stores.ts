import { writable, get } from "svelte/store"

export const timeLeft = writable(15)
export const challengeStarted = writable(false)
export const showSuccessModal = writable(false)
export const showFailureModal = writable(false)
export const formData = writable({ name: "", phone: "", email: "" })

let timerInterval: ReturnType<typeof setInterval> | null = null

// Allows fields to be written and sets 15 seconds for the challenge
export function startChallenge() {
  challengeStarted.set(true)
  timeLeft.set(15)
  formData.set({ name: "", phone: "", email: "" })
  localStorage.removeItem("candidateData")
  startTimer()
}

// Initialize the timer if the button is pressed
function startTimer() {
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    timeLeft.update((t) => {
      if (t <= 1) {
        clearInterval(timerInterval!)
        challengeEnded()
        return 0
      }
      return t - 1
    })
  }, 1000)
}

// Determines the end of the challenge
export function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// Set the buttons to the initial default
function challengeEnded() {
  challengeStarted.set(false)
  showFailureModal.set(true)
  stopTimer()
}

// Configure the page to repeat the challenge
export function resetChallenge() {
  timeLeft.set(15)
  challengeStarted.set(false)
  showSuccessModal.set(false)
  showFailureModal.set(false)
  formData.set({ name: "", phone: "", email: "" })
  localStorage.removeItem("candidateData")
  stopTimer()
}

export function submitChallenge() {
  const currentFormData = get(formData)
  if (get(timeLeft) > 0 && currentFormData.name && currentFormData.phone && currentFormData.email) {
    localStorage.setItem("candidateData", JSON.stringify(currentFormData))
    showSuccessModal.set(true)
    stopTimer()
  }
}

// Initialize the timer if the challenge has already started
if (typeof window !== "undefined") {
  if (localStorage.getItem("challengeStarted") === "true") {
    challengeStarted.set(true)
    const storedTimeLeft = localStorage.getItem("timeLeft")
    if (storedTimeLeft) {
      timeLeft.set(Number.parseInt(storedTimeLeft, 10))
    }
    startTimer()
  }
}

// Save challenge state to localStorage when it changes
challengeStarted.subscribe((value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("challengeStarted", value.toString())
  }
})

timeLeft.subscribe((value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("timeLeft", value.toString())
  }
})

