let rowNum =0;
let rowWord = "row";
let guessword = [];  // declare globally so winscreen can access it

function randomword() {
    const randWordList = [
      "APPLE","BERRY","GRAPE","PEACH","MANGO","LEMON","JUICE","HONEY","IVORY","STRAW",
      "NYMPH","SALET","AUDIO","VIVID","ZESTY","QUILT","FUZZY","JAZZY","WHACK","VIXEN",
      "BLITZ","CABIN","DWARF","EAGLE","FABLE","GLOOM","HATCH","INBOX","JOLLY","KNOCK",
      "LUCKY","MIRTH","NOBLE","OCEAN","PIANO","QUARK","RAVEN","SLOPE","TIGER","ULTRA",
      "VAPOR","WALTZ","XENON","YACHT","ZEBRA"
    ];
    const randomIndex = Math.floor(Math.random() * randWordList.length);
    return randWordList[randomIndex];
}
let answerWord = randomword().toUpperCase();
function randomletter() {
    const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v"];
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
}
const randomLetter = randomletter();

// Disable future rows
for(let r=1; r<6; r++){
  let inputs = document.querySelectorAll('.' + rowWord + r);
  inputs.forEach(inp => inp.disabled = true);
}

// Focus first input
let firstInputs = document.querySelectorAll('.' + rowWord + '0');
if(firstInputs.length > 0) firstInputs[0].focus();

// Checks a specific row (0-based). Returns true if guess === answer.
// Checks the current row. Returns true if guess equals the answer.
function checkGuess() {
  guessword = Array.from(document.querySelectorAll('.' + rowWord + rowNum));

  // Ensure we have 5 boxes and all are filled
  if (guessword.length < 5) return false;
  for (let i = 0; i < 5; i++) {
    if (!guessword[i].value || guessword[i].value.trim() === '') {
      // incomplete row
      return false;
    }
  }

  // Apply colors
  for (let j = 0; j < 5; j++) {
    let val = guessword[j].value.toUpperCase();
    if (val === answerWord[j]) {
      guessword[j].style.backgroundColor = "green";
    } else if (answerWord.includes(val)) {
      guessword[j].style.backgroundColor = "yellow";
    } else {
      guessword[j].style.backgroundColor = "gray";
    }
  }

  const guessedStr = guessword.map(inp => inp.value.toUpperCase()).join('');
  return guessedStr === answerWord;
}

document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    // Only handle enter when we're within allowed rows
    if (rowNum >= 6) {
      showGameOverModal(false);
      return;
    }

    // Check guess; function returns true only if row is complete and equals answer
    const isCorrect = checkGuess();

    if (!isCorrect) {
      // If the row was incomplete, do nothing (or optionally flash)
      // If row was complete but incorrect, advance to next row after animation
      // Determine if row was complete by checking guessword array values
      const rowComplete = guessword.length === 5 && guessword.every(i => i.value && i.value.trim() !== '');
      if (!rowComplete) return; // don't submit incomplete rows

      // row was complete but incorrect -> advance
      setTimeout(() => {
        rowNum++;
        if (rowNum < 6) {
          let inputs = document.querySelectorAll('.' + rowWord + rowNum);
          inputs.forEach(inp => inp.disabled = false);
          if (inputs.length > 0) inputs[0].focus();
        }
        // show game over if we used up rows
        if (rowNum >= 6) showGameOverModal(false);
      }, 500);
    } else {
      // correct guess
      setTimeout(() => {
        winscreen();
      }, 300);
    }
  } else if (event.key === "Backspace") {
    const currentInputs = Array.from(document.querySelectorAll('.' + rowWord + rowNum));
    const focusedInput = document.activeElement;
    const currentIndex = currentInputs.indexOf(focusedInput);

    // If focus isn't inside the current row, do nothing
    if (currentIndex === -1) return;

    // Prevent browser default navigation when backspace is pressed
    event.preventDefault();

    // If current box has a value, clear it. Otherwise move focus to previous and clear that.
    if (currentInputs[currentIndex].value) {
      currentInputs[currentIndex].value = '';
    } else if (currentIndex > 0) {
      currentInputs[currentIndex - 1].value = '';
      currentInputs[currentIndex - 1].focus();
    }
  }
}); 

// Modal + restart helpers
function showGameOverModal(isWin, attempts) {
  const modal = document.getElementById('game-over-modal');
  const title = document.getElementById('modal-title');
  const message = document.getElementById('modal-message');
  const answerSpan = document.getElementById('modal-answer');

  if (!modal) return;
  if (isWin) {
    title.textContent = 'You Win!';
    message.innerHTML = 'Congratulations — you guessed the word in <strong>' + attempts + '</strong> attempts.';
    answerSpan.textContent = answerWord;
  } else {
    title.textContent = 'Game Over';
    message.innerHTML = 'Out of attempts. The correct word was: <strong>' + answerWord + '</strong>';
    answerSpan.textContent = answerWord;
  }

  modal.style.display = 'flex';
}

function hideGameOverModal() {
  const modal = document.getElementById('game-over-modal');
  if (!modal) return;
  modal.style.display = 'none';
}

function restartGame() {
  // reset state
  rowNum = 0;
  // pick new answer
  answerWord = randomword().toUpperCase();

  // clear and reset inputs
  const allInputs = document.querySelectorAll('input');
  allInputs.forEach(inp => {
    inp.value = '';
    inp.disabled = false;
    inp.style.backgroundColor = '';
  });

  // disable rows 1-5
  for (let r = 1; r < 6; r++) {
    const rowInputs = document.querySelectorAll('.' + rowWord + r);
    rowInputs.forEach(i => i.disabled = true);
  }

  // focus first
  const first = document.querySelector('.' + rowWord + '0');
  if (first) first.focus();

  hideGameOverModal();
}

function winscreen() {
  const guessedStr = guessword.map(inp => inp.value.toUpperCase()).join('');
  if (guessedStr === answerWord) {
    // show modal with success
    showGameOverModal(true, rowNum + 1);
  } else {
    // nothing
  }
}

// wire modal buttons if they exist
window.addEventListener('load', () => {
  const restartBtn = document.getElementById('modal-restart');
  if (restartBtn) restartBtn.addEventListener('click', restartGame);

  const modal = document.getElementById('game-over-modal');
  if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) hideGameOverModal();
  });
});

