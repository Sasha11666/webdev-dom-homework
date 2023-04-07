const submitButton = document.getElementById('submit-button');
const inputName = document.getElementById('input-name');
const inputComment = document.getElementById('input-comment');
const commentsList = document.getElementById('comments-list');
const likesButtons = document.querySelectorAll('.like-button');
const editButtons = document.querySelectorAll('.edit-button');
const saveButtons = document.querySelectorAll('.save-button');
const editedTextArea = document.querySelectorAll('.edit-text');

const comments = [
  {
    name: 'Глеб Фокин',
    review: 'Это будет первый комментарий на этой странице',
    date: '12.02.22 12:18',
    likes: 3,
    isEdit: false,
    clicked: false,
    active: "",
  },
  {
    name: 'Варвара Н.',
    review: 'Мне нравится как оформлена эта страница! ❤',
    date: '13.02.22 19:22',
    likes: 75,
    isEdit: false,
    clicked: false,
    active: "",
  }
];



const initLikesButtons = () => {
  const likesButtons = document.querySelectorAll('.like-button');
  for( const likesButton of likesButtons) {
    const index = likesButton.dataset.index;
    likesButton.addEventListener('click', () => {
      if(!comments[index].clicked) {
        comments[index].clicked = true;
        comments[index].active = '-active-like';
        comments[index].likes += 1;
        // likesCounter.textContent++;
        

      } else {
        comments[index].clicked = false;
        comments[index].active = '';
        comments[index].likes -= 1;
        // likesCounter.textContent--;
        
      }
      renderComment();
    })
  }
}

const initEditButtons = () => {
  const editButtons = document.querySelectorAll('.edit-button');
  for( const editButton of editButtons) {
    const index = editButton.dataset.index;
    editButton.addEventListener('click', () => {
      console.log(comments[index]);
      comments[index].isEdit == false ? comments[index].isEdit = true : comments[index].isEdit = false;
      renderComment();
    })
  }
}

const initSaveButton = () => {
  const saveButtons = document.querySelectorAll('.save-button');
  for(const saveButton of saveButtons) {
    const index = saveButton.dataset.index;
    const editedComment = document.getElementById(`${index}0`);
    saveButton.addEventListener('click', () => {
      comments[index].review = editedComment.value;
      comments[index].isEdit = false;
      renderComment();
    })
  }
}

const renderComment = () => {
  const commentsHTML = comments.map((comment, index) => {
    return comment.isEdit == true ? 
    `<li class="comment">
    <div class="comment-header">
      <div>${comment.name}</div>
      <div>${comment.date}</div>
    </div>  
    <div class="comment-body">
      <textarea id="${index}0" class="edit-text" type="textarea"></textarea>
    </div>
    <div class="comment-footer">
      <div class="likes">
        <span id="${index}" class="likes-counter">${comment.likes}</span>
        <button data-index="${index}" data-name="${comment.name}" data-review="${comment.review}" data-likes="${comment.likes}" data-index="${index}" class="like-button ${comment.active}"></button>
      </div>
    </div>
    <button data-index="${index}" class="save-button" type="button">Сохранить</button>
  </li>`
     :
   `<li class="comment">
    <div class="comment-header">
      <div>${comment.name}</div>
      <div>${comment.date}</div>
    </div> 
    <div class="comment-body">
      <div class="comment-text">
        ${comment.review}
      </div>
    </div>
    <div class="comment-footer">
      <div class="likes">
        <span id="${index}" class="likes-counter">${comment.likes}</span>
        <button data-index="${index}" data-name="${comment.name}" data-review="${comment.review}" data-likes="${comment.likes}" data-index="${index}" class="like-button ${comment.active}"></button>
      </div>
    </div>
    <button data-index="${index}" class="edit-button" type="button">Редактировать</button>
  </li>`
  })
  .join("");
  commentsList.innerHTML = commentsHTML;

  initLikesButtons();
  initEditButtons();
  initSaveButton();
}

renderComment();


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

  comments.push(
    {
      name: inputName.value,
      review: inputComment.value,
      date: `${day}.${month}.${date.getFullYear().toString().substr(2,2)} ${date.getHours()}:${date.getMinutes()}`,
      likes: 0,
      isEdit: false,
      clicked: false,
    }
  )

  renderComment();
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