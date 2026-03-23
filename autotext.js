document.addEventListener('input', function(e) {
  if (e.target.tagName === 'INPUT' && e.target.type === 'text' && !e.target.disabled) {
    e.target.value = e.target.value.toUpperCase();
    if(e.target.value.length === 1){
      // move to next input in row
      let id = e.target.id;
      let num = parseInt(id.slice(0,2));
      let row = Math.floor((num-1)/5);
      let col = (num-1) % 5;
      if(col < 4){
        let nextNum = (row*5 + col + 2).toString().padStart(2,'0') + 'Char';
        let nextInput = document.getElementById(nextNum);
        if(nextInput && !nextInput.disabled){
          nextInput.focus();
        }
      }
    }
  }
});