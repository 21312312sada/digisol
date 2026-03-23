let rowNum =0;
let rowWord = "row";
let guessword = [];  // declare globally so winscreen can access it

function randomword() {
    const randWordList = ["APPLE", "BERRY", "GRAPE", "PEACH", "MANGO", "LEMON", "JUICE", "HONEY", "IVORY", "STRAW", "NYMPH", "SALET", "xeno", "audio", "vivid", "zesty", "quilt", "fuzzy", "jazzy", "whack", "vixen"];
    const randomIndex = Math.floor(Math.random() * randWordList.length);
    return randWordList[randomIndex];
}
const answerWord = randomword();
function randomletter() {
    const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v"];
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
}
const randomLetter = randomletter();

// Disable future rows
for(let r=1; r<6; r++){
  let inputs = document.querySelectorAll('input[class="row' + r + '"]');
  inputs.forEach(inp => inp.disabled = true);
}

// Focus first input
let firstInputs = document.querySelectorAll('input[class="row0"]');
if(firstInputs.length > 0) firstInputs[0].focus();

// Checks a specific row (0-based). Returns true if guess === answer.
function checkGuess() {
  guessword = Array.from(document.querySelectorAll('input[class=\"' + rowWord + rowNum + '\"]'));
  
  for (let j=0; j<5; j++) {
    let val = guessword[j].value.toUpperCase();
    if (val === answerWord[j]) {
        guessword[j].style.backgroundColor = "green";
    }
      else if (answerWord.includes(val)) { 
        guessword[j].style.backgroundColor = "yellow";
      }
      else {
        guessword[j].style.backgroundColor = "gray";
      } 
    }
  }

document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    if (rowNum < 6) {
      checkGuess();
      // delay winscreen by 500ms to let color changes render first
      setTimeout(() => {
        winscreen();
        rowNum++;
        // Enable next row
        if(rowNum < 6){
          let inputs = document.querySelectorAll('input[class="row' + rowNum + '"]');
          inputs.forEach(inp => inp.disabled = false);
          if(inputs.length > 0) inputs[0].focus();
        }
      }, 500);
    } else {
      alert("Game Over! The correct word was: " + answerWord);
    }
  } else if (event.key === "Backspace") {
    const currentInputs = Array.from(document.querySelectorAll('input[class="' + rowWord + rowNum + '"]'));
    const focusedInput = document.activeElement;
    
    // Find the index of the currently focused input
    const currentIndex = currentInputs.indexOf(focusedInput);
    
    if (currentIndex > 0) {
      // Clear current input and move to previous
      focusedInput.value = '';
      currentInputs[currentIndex - 1].focus();
      currentInputs[currentIndex - 1].value = '';
    } else if (currentIndex === 0) {
      // Just clear the first box
      focusedInput.value = '';
    }
  }
}); 
function winscreen() {
  const guessedStr = guessword.map(inp => inp.value.toUpperCase()).join('');
  if (guessedStr === answerWord) {
    alert("Congratulations! You've guessed the word You gained one skill point it takes 100 skill points to take back a guess while keeping the information");
    alert("You took " + (rowNum+1) + " attempts.");
    alert("some better words to start off with are: salet, audio, nymph");
  } else{
    //nothing
  }
}
