let questions = [];
let currentQuestionIndex = 0;
let userEmail = "";
let usedHint = false;
let followUpAnswered = new Set();
let answeredQuestions = new Set(); // Stores indices of answered questions
let correctCount = 0;
let incorrectCount = 0;
let selectedSectionQuestions = []; // Holds questions for the currently selected section
let currentSessionId = ""; // To store a unique ID for the current quiz session

// Make sure this URL is correct and active for your Google Apps Script
const googleAppsScriptURL = "https://script.google.com/macros/s/AKfycbyhwDLRvLVO7YgwInO8Y29B9OrwZaUgTZ2lElvJMemouw3_o-2u83F-8HK2FhgiOAoCPQ/exec";

document.addEventListener("DOMContentLoaded", () => {
  fetch("questions.json")
    .then(res => res.json())
    .then(data => {
      questions = data; // Load all questions initially
      showSectionList();
    })
    .catch(err => console.error("Failed to load questions.json:", err));

  document.getElementById("startButton").addEventListener("click", () => {
    userEmail = document.getElementById("emailInput").value.trim();
    if (userEmail && userEmail.includes("@")) {
      currentSessionId = Date.now().toString(); // Generate a unique session ID (e.g., timestamp)
      
      document.getElementById("emailScreen").style.display = "none";
      if (selectedSectionQuestions.length > 0) {
        showQuestion(currentQuestionIndex);
      } else {
        alert("No questions found for this section. Please select a section first.");
        document.getElementById("emailScreen").style.display = "none";
        document.getElementById("home").style.display = "block";
      }
    } else {
      alert("Please enter a valid Gmail address.");
    }
  });

  document.getElementById("showHint").addEventListener("click", () => {
    // Corrected to use selectedSectionQuestions and check if answered
    if (selectedSectionQuestions.length > 0 && !answeredQuestions.has(currentQuestionIndex)) {
      const q = selectedSectionQuestions[currentQuestionIndex];
      document.getElementById("hintBox").innerText = q.hint || "";
      document.getElementById("hintBox").classList.add("hint-box");
      usedHint = true;
    }
  });

  document.getElementById("prevButton").addEventListener("click", () => {
    // Corrected to use selectedSectionQuestions
    if (selectedSectionQuestions.length > 0 && !answeredQuestions.has(currentQuestionIndex) && currentQuestionIndex > 0) {
        markQuestionAsSkipped(currentQuestionIndex);
    }
    if (currentQuestionIndex > 0) {
      showQuestion(--currentQuestionIndex);
    }
  });

  document.getElementById("nextButton").addEventListener("click", () => {
    // Corrected to use selectedSectionQuestions
    if (selectedSectionQuestions.length > 0 && !answeredQuestions.has(currentQuestionIndex)) {
        markQuestionAsSkipped(currentQuestionIndex);
    }

    if (currentQuestionIndex < selectedSectionQuestions.length - 1) { // Check against selectedSectionQuestions length
      showQuestion(++currentQuestionIndex);
    } else {
      showScore();
    }
  });
});

function showSectionList() {
  const sectionContainer = document.getElementById("sectionList");
  // Ensure uniqueSections are derived from the full 'questions' array
  const uniqueSections = [...new Set(questions.map(q => q.section))].sort((a, b) => a - b);

  const sectionNames = {
    1: "Subject-Verb Agreement",
    2: "Complete Sentences",
    3: "Sentence Fragments",
    4: "What is a Run-on Sentence",
    5: "How to fix Run-on Sentence",
    6: "Pronoun Agreement",
    7: "Verb Tense" // Explicitly added Verb Tense for Section 7
    // Section 8 has been removed as requested.
  };

  sectionContainer.innerHTML = "";
  uniqueSections.forEach(section => {
    const btn = document.createElement("button");
    btn.className = "section-button";
    btn.innerText = sectionNames[section] || `Section ${section}`; // Use defined name or default
    btn.onclick = () => {
      selectedSectionQuestions = questions.filter(q => q.section === section);
      currentQuestionIndex = 0;
      answeredQuestions.clear();
      correctCount = 0;
      incorrectCount = 0;
      usedHint = false; // Reset hint usage for new section
      followUpAnswered.clear();
      
      selectedSectionQuestions.forEach(q => {
        delete q.userSelectedAnswer;
        delete q.wasCorrectLastTime;
        delete q.lastFeedbackText;
        delete q.followUpNeeded;
        delete q.followUpAnsweredThisTime;
        delete q.lastFollowUpFeedbackText;
        delete q.lastFollowUpAnswerWasCorrect;
        delete q.userSelectedFollowUpAnswer;
        q.startTime = null; 
        q.endTime = null;
      });

      document.getElementById("home").style.display = "none";
      document.getElementById("emailScreen").style.display = "block";
    };
    sectionContainer.appendChild(btn);
  });
}

function showQuestion(index) {
  // Use selectedSectionQuestions for current question logic
  const q = selectedSectionQuestions[index];
  if (!q) { // Handle case where question might not exist (e.g., end of quiz)
    showScore();
    return;
  }

  usedHint = false; // Reset for each question load
  q.startTime = new Date();

  document.getElementById("emailScreen").style.display = "none";
  document.getElementById("scoreScreen").style.display = "none";
  document.getElementById("questionScreen").style.display = "block";

  document.getElementById("questionNumber").innerText = `Question ${index + 1} of ${selectedSectionQuestions.length}`;
  document.getElementById("questionText").innerText = q.question;

  const hintBox = document.getElementById("hintBox");
  hintBox.innerText = "";
  hintBox.classList.remove("hint-box");

  const feedbackBox = document.getElementById("feedback");
  feedbackBox.innerText = "";
  feedbackBox.classList.remove("correct", "incorrect");

  const followUpContainer = document.getElementById("followUpContainer");
  followUpContainer.innerHTML = "";
  followUpContainer.style.display = "none";

  const optionsBox = document.getElementById("optionsBox");
  optionsBox.innerHTML = "";
  q.options.forEach((opt, i) => {
    const label = document.createElement("label");
    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "option";
    radioInput.value = String.fromCharCode(65 + i);

    radioInput.addEventListener("click", () => handleSubmitAnswer(radioInput.value));

    label.appendChild(radioInput);
    label.append(` ${opt}`);
    optionsBox.appendChild(label);
  });

  const isQuestionAnswered = answeredQuestions.has(index);
  document.getElementById("showHint").disabled = isQuestionAnswered;
  document.getElementById("prevButton").disabled = index === 0;
  // Next button is disabled only if it's the last question AND it's already answered
  document.getElementById("nextButton").disabled = (index === selectedSectionQuestions.length - 1 && isQuestionAnswered);


  if (isQuestionAnswered) {
    document.querySelectorAll("input[name='option']").forEach(radio => {
      if (radio.value === q.userSelectedAnswer) {
        radio.checked = true;
      }
      radio.disabled = true;
    });

    feedbackBox.innerText = q.lastFeedbackText;
    feedbackBox.classList.add(q.wasCorrectLastTime ? "correct" : "incorrect");

    if (q.followUpNeeded) {
        showFollowUp(q, true);
    }
  }
}

function handleSubmitAnswer(selectedValue) {
  // Use selectedSectionQuestions for current question logic
  const q = selectedSectionQuestions[currentQuestionIndex];
  
  if (answeredQuestions.has(currentQuestionIndex)) {
    return;
  }

  q.endTime = new Date();
  const timeSpent = (q.endTime - q.startTime) / 1000;

  const wasCorrect = selectedValue === q.correctAnswer;
  const feedbackBox = document.getElementById("feedback");

  q.userSelectedAnswer = selectedValue;
  q.wasCorrectLastTime = wasCorrect;

  let feedbackText = '';
  if (q.feedback) { // Check for old format (q1-q55)
    feedbackText = usedHint ? (wasCorrect ? q.feedback.correct_hint : q.feedback.incorrect_hint) : (wasCorrect ? q.feedback.correct_no_hint : q.feedback.incorrect_no_hint);
  } else { // Handle new format (q56+) that uses explanationCorrect/IncorrectX
    const selectedOptionKey = selectedValue; // e.g., "A", "B", "C", "D"
    if (wasCorrect) {
      feedbackText = `✅ Correct! ${q.explanationCorrect || ''}`;
    } else {
      // Access specific incorrect explanation based on selected value (e.g., explanationIncorrectA)
      feedbackText = `❌ Incorrect. ${q[`explanationIncorrect${selectedOptionKey}`] || ''}`;
    }
  }

  q.lastFeedbackText = feedbackText;
  answeredQuestions.add(currentQuestionIndex);

  feedbackBox.innerText = q.lastFeedbackText;
  if (wasCorrect) {
    feedbackBox.classList.add("correct");
    feedbackBox.classList.remove("incorrect");
    correctCount++;
    // Check for both old (followUpQuestion) and new (followUpCorrect) follow-up fields
    if (q.followUpQuestion || q.followUpCorrect) {
      q.followUpNeeded = true;
      if (!followUpAnswered.has(q.id)) { // Only show if not answered in this session
        showFollowUp(q);
      }
    }
  } else {
    feedbackBox.classList.add("incorrect");
    feedbackBox.classList.remove("correct");
    incorrectCount++;
  }

  document.querySelectorAll("input[name='option']").forEach(radio => radio.disabled = true);
  document.getElementById("showHint").disabled = true;

  logAnswer(
    q.section,
    currentSessionId,
    `${currentQuestionIndex + 1}/${selectedSectionQuestions.length}`, // Use selectedSectionQuestions.length
    usedHint ? "Yes" : "No",
    selectedValue,
    wasCorrect ? "Correct" : "Incorrect",
    timeSpent.toFixed(2),
    q.lastFeedbackText,
    "N/A", // Follow-up answer initially N/A
    "N/A", // Overall score initially N/A
    q.id,
    q.question
  );
}

function markQuestionAsSkipped(index) {
    const q = selectedSectionQuestions[index]; // Use selectedSectionQuestions
    if (!answeredQuestions.has(index)) {
        q.endTime = new Date();
        const timeSpent = (q.endTime - (q.startTime || new Date())) / 1000;

        answeredQuestions.add(index);
        incorrectCount++;
        
        q.userSelectedAnswer = "N/A (Skipped)";
        q.wasCorrectLastTime = false;
        q.lastFeedbackText = "❌ Question skipped.";
        
        logAnswer(
            q.section,
            currentSessionId,
            `${index + 1}/${selectedSectionQuestions.length}`, // Use selectedSectionQuestions.length
            usedHint ? "Yes" : "No",
            "N/A (Skipped)",
            "Skipped",
            timeSpent.toFixed(2),
            q.lastFeedbackText,
            "N/A",
            "N/A",
            q.id,
            q.question
        );
    }
}

function showFollowUp(q, isRevisit = false) {
  const followUp = document.getElementById("followUpContainer");
  // Dynamically choose the follow-up question text based on which field exists
  const followUpQuestionText = q.followUpCorrect || q.followUpQuestion;
  followUp.innerHTML = `<p>${followUpQuestionText}</p>`;

  // Dynamically choose the follow-up options based on which field exists
  const followUpOptions = q.followUpCorrectOptions || q.followUpOptions;

  followUpOptions.forEach((opt, i) => {
    const label = document.createElement("label");
    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "followUp";
    radioInput.value = String.fromCharCode(65 + i);

    radioInput.addEventListener("click", () => handleSubmitFollowUp(radioInput.value, q, followUp));

    label.appendChild(radioInput);
    label.append(` ${opt}`);
    followUp.appendChild(label);

    if (isRevisit && q.followUpAnsweredThisTime) {
        if (radioInput.value === q.userSelectedFollowUpAnswer) {
            radioInput.checked = true;
        }
        radioInput.disabled = true;
    }
  });

  followUp.style.display = "block";

  if (isRevisit && q.followUpAnsweredThisTime) {
      const feedbackParagraph = document.createElement("p");
      feedbackParagraph.innerText = q.lastFollowUpFeedbackText;
      feedbackParagraph.classList.add(q.lastFollowUpAnswerWasCorrect ? "correct" : "incorrect");
      followUp.appendChild(feedbackParagraph);
      followUp.querySelectorAll("input[name='followUp']").forEach(radio => radio.disabled = true);
  }
}

function handleSubmitFollowUp(selectedValue, q, followUpContainer) {
    if (q.followUpAnsweredThisTime) {
        return;
    }

    // Dynamically choose the correct follow-up answer field
    const correct = selectedValue === (q.followUpCorrectAnswer || q.followUpAnswer);
    const feedbackText = correct ? "✅ Correct!" : "❌ Incorrect." ;
    const feedbackParagraph = document.createElement("p");
    feedbackParagraph.innerText = feedbackText;
    feedbackParagraph.classList.add(correct ? "correct" : "incorrect");
    followUpContainer.appendChild(feedbackParagraph);

    followUpAnswered.add(q.id); // Mark follow-up for this question ID as answered

    q.followUpAnsweredThisTime = true;
    q.lastFollowUpFeedbackText = feedbackText;
    q.lastFollowUpAnswerWasCorrect = correct;
    q.userSelectedFollowUpAnswer = selectedValue;

    followUpContainer.querySelectorAll("input[name='followUp']").forEach(radio => radio.disabled = true);

    logAnswer(
        q.section,
        currentSessionId,
        `${currentQuestionIndex + 1}/${selectedSectionQuestions.length} (Follow-up)`, // Use selectedSectionQuestions.length
        "N/A", // Hint status for main question, N/A for follow-up log
        selectedValue, // Answer given for follow-up
        correct ? "Correct" : "Incorrect", // Correct status for follow-up
        "N/A", // Time spent for follow-up
        feedbackText, // Feedback for follow-up
        selectedValue, // This will be the followupAnswer column in your sheet
        "N/A", // Overall score is for final log
        `${q.id}_followup`, // Unique ID for follow-up log
        q.followUpCorrect || q.followUpQuestion // Follow-up question text
    );
}

function logAnswer(
    section,
    sessionId,
    questionNumberDisplay,
    usedHintStatus,
    answerGiven,
    correctStatus,
    timeSpent,
    feedbackText,
    followupAnswerValue, // This parameter will receive the actual follow-up answer when logging main question, and its own selectedValue for follow-up log
    overallScore, // This parameter is relevant for final log only
    questionIdInternal,
    questionTextContent
) {
  const payload = {
    action: "logQuestion",
    email: userEmail,
    sessionId: sessionId,
    section: section, // Added section to payload
    questionNumberDisplay: questionNumberDisplay,
    questionId: questionIdInternal,
    questionText: questionTextContent,
    usedHint: usedHintStatus,
    answerGiven: answerGiven,
    correct: correctStatus,
    timeSpent: timeSpent,
    feedbackShown: feedbackText,
    followupAnswer: followupAnswerValue,
    overallScore: overallScore, // Will be "N/A" for question logs, actual score for final log
    timestamp: new Date().toISOString()
  };

  fetch(googleAppsScriptURL, {
    redirect: "follow",
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "text/plain;charset=utf-8" }
  })
  .then(response => response.json())
  .then(data => {
      if (data.status === "success") {
          console.log("Log successful:", data.message);
      } else {
          console.error("Log failed:", data.message);
      }
  })
  .catch(err => console.error("Log failed (network error or script issue):", err));
}

function logFinalScore(email, sessionId, overallScore) {
    const payload = {
        email,
        sessionId,
        overallScore,  // ✅ Make sure this is something like "7 / 10 (70%)"
        action: "logFinalScore"
    };

    fetch(googleAppsScriptURL, {
        redirect: "follow",
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "text/plain;charset=utf-8" }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            console.log("Final score logged successfully:", data.message);
        } else {
            console.error("Final score log failed:", data.message);
        }
    })
    .catch(err => console.error("Final score log failed (network error or script issue):", err));
}

function showScore() {
  document.getElementById("questionScreen").style.display = "none";
  const scoreScreen = document.getElementById("scoreScreen");
  const finalScore = document.getElementById("finalScore");
  
  const totalQuestions = selectedSectionQuestions.length; // Use selectedSectionQuestions.length for score
  const percentage = totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(2) : 0;

  finalScore.innerHTML = `
    <h2>Quiz Completed!</h2>
    <p>Correct Answers: ${correctCount}</p>
    <p>Incorrect Answers: ${incorrectCount}</p>
    <p>Score: ${percentage}%</p>
    <button id="restartQuizButton">Take Another Quiz</button>
  `;
  scoreScreen.style.display = "block";
  logAnswer(
    "Final", // Section (Column M)
    currentSessionId,
    "Final Score", // Q#
    "N/A", // Used Hint
    "N/A", // Answer Given
    "N/A", // Correct
    "N/A", // Time Spent
    `✅ Final Score: ${correctCount} / ${totalQuestions} (${percentage}%)`, // Feedback
    "N/A", // Follow-up
    `${correctCount} / ${totalQuestions} (${percentage}%)`, // Result column (K)
    "FINAL_SCORE", // Question ID
    "Final Score" // Question Text
  );

  logFinalScore(correctCount, incorrectCount, totalQuestions, percentage);

  document.getElementById("restartQuizButton").addEventListener("click", () => {
    currentQuestionIndex = 0;
    answeredQuestions.clear();
    correctCount = 0;
    incorrectCount = 0;
    usedHint = false;
    followUpAnswered.clear();
    selectedSectionQuestions = []; // Clear questions for previous section
    currentSessionId = "";

    document.getElementById("scoreScreen").style.display = "none";
    document.getElementById("emailInput").value = "";
    document.getElementById("emailScreen").style.display = "none";
    document.getElementById("home").style.display = "block";
    showSectionList();
  });
}
