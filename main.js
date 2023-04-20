const submitButton = document.getElementById('submit-button');
const inputName = document.getElementById('input-name');
const inputComment = document.getElementById('input-comment');
const commentsList = document.getElementById('comments-list');
const likesButtons = document.querySelectorAll('.like-button');
const editButtons = document.querySelectorAll('.edit-button');
const saveButtons = document.querySelectorAll('.save-button');
const editedTextArea = document.querySelectorAll('.edit-text');
const formElement = document.getElementById('form');
const loader = document.querySelector('.loading-sign');
const startLoader = document.querySelector('.start-loading-sign');

let comments = [];

const toggleLoader = () => {
  if(isLoading == true && isStarting == false) {
    loader.classList.remove('hidden');
    formElement.classList.add('hidden');
    startLoader.classList.add('hidden');
  } else if(isStarting == true && isLoading == true) {
    startLoader.classList.remove('hidden');
    formElement.classList.add('hidden');
  } else {
    formElement.classList.remove('hidden')
    loader.classList.add('hidden');
    startLoader.classList.add('hidden');
  }
}

async function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

isLoading = true;
isStarting = true;
toggleLoader();

async function getData () {
  return fetch("https://webdev-hw-api.vercel.app/api/v1/:sasha-basova/comments", {
  method: "GET",
  })
    .then((response) => {
      return response.json()
    })
    .then((responseData) => {
      const appComments = responseData.comments.map((comment) => {
        const date = new Date(comment.date);
        let day = date.getDate();
        let month = date.getMonth();
        let minutes = date.getMinutes();
        day < 10 ? day = '0' + day : day;
        month < 10 ? month = '0' + (month + 1) : month;
        minutes < 10 ? minutes = '0' + minutes : minutes; 
        return {
          name: comment.author.name,
          review: comment.text,
          date:  `${day}.${month}.${date.getFullYear().toString().substr(2,2)} ${date.getHours()}:${date.getMinutes()}`,
          likes: 0,
          isEdit: false,
          clicked: false,
          active: "",
          isAnimated: "",
        }
      });
      comments = appComments;
      renderComment();
      isLoading = false;
      toggleLoader();
    })
}

getData();


const initCommentCommments = () => {
  const commentElements = document.querySelectorAll('.comment');
  for(const commentElement of commentElements) {
    const index = commentElement.dataset.index;
    commentElement.addEventListener('click', () => {
      inputComment.value = `QUOTE_BEGIN ${comments[index].review} \n NAME_START ${comments[index].name} NAME_END  QUOTE_END`;
    })
  }
}

const initLikesButtons = () => {
  const likesButtons = document.querySelectorAll('.like-button');
  for( const likesButton of likesButtons) {
    const index = likesButton.dataset.index;
    likesButton.addEventListener('click', (event) => {
      event.stopPropagation();
      comments[index].isAnimated = '-loading-like';
      renderComment();
      delay(2000).then(() => {
        if(!comments[index].clicked) {
          comments[index].clicked = true;
          comments[index].active = '-active-like';
          comments[index].likes += 1;
        } else {
          comments[index].clicked = false;
          comments[index].active = '';
          comments[index].likes -= 1;
        }
        comments[index].isAnimated = '';
        renderComment();
      })
    })
  }
}

const initEditButtons = () => {
  const editButtons = document.querySelectorAll('.edit-button');
  for( const editButton of editButtons) {
    const index = editButton.dataset.index;
    editButton.addEventListener('click', (event) => {
      event.stopPropagation();
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
    saveButton.addEventListener('click', (event) => {
      event.stopPropagation();
      comments[index].review = editedComment.value;
      comments[index].isEdit = false;
      renderComment();
    })
    editedComment.addEventListener('click', (event) => {
      event.stopPropagation();
    })
  }
}

const renderComment = () => {
  const commentsHTML = comments.map((comment, index) => {
    return comment.isEdit == true ? 
    `<li class="comment" data-index="${index}">
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
        <button data-index="${index}" data-name="${comment.name}" data-likes="${comment.likes}" data-index="${index}" class="like-button ${comment.active} ${comment.isAnimated}"></button>
      </div>
    </div>
    <button data-index="${index}" class="save-button" type="button">Сохранить</button>
  </li>`
     :
   `<li class="comment" data-index="${index}">
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
        <button data-index="${index}" data-name="${comment.name}" data-likes="${comment.likes}" data-index="${index}" class="like-button ${comment.active} ${comment.isAnimated}"></button>
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
  initCommentCommments();
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
  console.log('Preparing to post data...');
  fetch("https://webdev-hw-api.vercel.app/api/v1/:sasha-basova/comments", {
    method: "POST",
    body: JSON.stringify({
      name: inputName.value
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;'),
      text: inputComment.value
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('QUOTE_BEGIN', '<p class="quote">')
      .replaceAll('QUOTE_END', '</p>')
      .replaceAll('NAME_START', '<span class="user-name">')
      .replaceAll('NAME_END', '</span>'),
      date: date,
      
    }),
  })
   .then((response) => {
     return response.json()
   })
   .then((responseData) => {
    console.log(responseData);
    console.log('Posted data, about to get it...');
    return getData();
   })

  inputName.value = '';
  inputComment.value = '';
  isLoading = true;
  isStarting = false;
  toggleLoader();
}

document.addEventListener('keyup', () => {
  if(event.keyCode === 13) {
    addComment();
  }
})

submitButton.addEventListener('click', () => {
  addComment();
  
})

