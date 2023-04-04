const submitButton = document.getElementById('submit-button');
const inputName = document.getElementById('input-name');
const inputComment = document.getElementById('input-comment');
const commentsList = document.getElementById('comments-list');

function addComment() {
  inputName.classList.remove('error');
  inputComment.classList.remove('error');
  if(inputName.value == '') {
    inputName.classList.add('error');
    return;
  }else if(inputComment.value == '') {
    inputComment.classList.add('error');
    return;
  }
  
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth();
  let minutes = date.getMinutes();
  day < 10 ? day = '0' + day : day;
  month < 10 ? month = '0' + (month + 1) : month;
  minutes < 10 ? minutes = '0' + minutes : minutes;  

  commentsList.innerHTML = commentsList.innerHTML + `<li class="comment">
  <div class="comment-header">
    <div>${inputName.value}</div>
    <div>${`${day}.${month}.${date.getFullYear().toString().substr(2,2)} ${date.getHours()}:${date.getMinutes()}`}</div>
  </div>
  <div class="comment-body">
    <div class="comment-text">
      ${inputComment.value}
    </div>
  </div>
  <div class="comment-footer">
    <div class="likes">
      <span class="likes-counter">0</span>
      <button class="like-button -active-like"></button>
    </div>
  </div>
</li>`
  inputName.value = '';
  inputComment.value = '';
}

document.addEventListener('keyup', () => {
  if(event.keyCode === 13) {
    addComment();
  }
})

submitButton.addEventListener('click', () => {
  addComment();
})
