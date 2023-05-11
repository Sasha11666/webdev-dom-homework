import { gainData, postData, loginUser, postLikesData, deleteComment } from "./api.js";
import {renderLoginComponent} from './components/login-component.js';
import { format } from 'date-fns';


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
let token = "Bearer asb4c4boc86gasb4c4boc86g37k3bk3cg3c03ck3k37w3cc3bo3b8";
token = null;
let formIsShown = false;

let toggleLoader = () => {
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

// async function delay(interval = 300) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, interval);
//   });
// }

console.log('toggle start');
let isLoading = true;
let isStarting = true;
console.log(formElement);
toggleLoader();

async function getData () {
  console.log('getData fired');
  console.log(formElement);
    gainData({token})
    .then((responseData) => {
      const appComments = responseData.comments.map((comment) => {
        const createDate = format(new Date(comment.date), 'dd/MM/yyyy hh:mm');
        // const date = new Date(comment.date);
        // let day = date.getDate();
        // let month = date.getMonth();
        // let minutes = date.getMinutes();
        // day < 10 ? day = '0' + day : day;
        // month < 10 ? month = '0' + (month + 1) : month;
        // minutes < 10 ? minutes = '0' + minutes : minutes; 
        return {
          name: comment.author.name,
          review: comment.text,
          // date:  `${day}.${month}.${date.getFullYear().toString().substr(2,2)} ${date.getHours()}:${date.getMinutes()}`,
          date: `${createDate}`,
          likes: comment.likes,
          isLiked: comment.isLiked,
          isEdit: false,
          active: "",
          isAnimated: "",
          id: comment.id
        }
      })
      console.log('toggled to false');
      comments = appComments;
      isLoading = false;
      console.log(formElement);
      toggleLoader();
      renderComment();
    })
    .catch((error) => {
      console.warn(error);
      if(error.message == 'Сервер сломался.. попробуй позже') {
        addComment();
      } else {
        alert(error.message);
      }
     }) 
    .finally(() => {
      // isLoading = false;
      // toggleLoader();
    })
    return comments;
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
      console.log(comments[index].isLiked);
      const id = comments[index].id;
      if(!comments[index].isLiked) {
        comments[index].active = '-active-like';
        comments[index].isLiked = true;
        comments[index].likes += 1;
      } else {
        comments[index].isLiked = false;
        comments[index].active = '';
        comments[index].likes -= 1;
      }
      renderComment();
      let likes = comments[index].likes;
      let isLiked = comments[index].isLiked;
      postLikesData({id, likes, isLiked, token});
    })
  }
}

const initDeleteButton = () => {
  const deleteButtons = document.querySelectorAll('.delete-button');
  for( const deleteButton of deleteButtons) {
    const index = deleteButton.dataset.index;
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = comments[index].id;
      deleteComment({id, token});
      getData();
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
  const getComments = (comment, index) => {
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
    <div class="buttons">
    <button data-index="${index}" class="edit-button" type="button">Редактировать</button>
    <button data-index="${index}" class="delete-button" type="button">Удалить комментарий</button>
    </div>
  </li>`
  } 

  let commentsHTML;
  commentsHTML = comments.map((comment, index) => {
    return getComments(comment, index);
  })
  .join("");
  commentsList.innerHTML = commentsHTML;

  if(!token) {
    console.log('all hidden');
    formElement.classList.add('hidden');
    startLoader.classList.add('hidden');
    console.log(formElement);
    document.getElementById('authorisation').innerHTML =`<a id="authorisation-link">${formIsShown ? "Продолжить без авторизации" : "Перейти к авторизации"}</a>`;
  }else {
    formIsShown = false;
    document.getElementById('authorisation').innerHTML = "";
    initLikesButtons();
    initEditButtons();
    initSaveButton();
    initCommentCommments();
    initDeleteButton();
    }

    document.getElementById('authorisation-link') && document.getElementById('authorisation-link').addEventListener('click', () => {
      formIsShown = !formIsShown;
      renderComment();
    })

  formIsShown && renderLoginComponent({ commentsList, setToken: (newToken) => {token = newToken}, getData });
}

// renderComment();

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

   postData({inputName, inputComment, token})
   .then(() => {
    return getData();
   })
   .then(() => {
    inputComment.value = '';
   })
   .catch((error) => {
    // console.warn(error);
    isLoading = false;
    toggleLoader( );
    if(error.message == 'Сервер сломался.. попробуй позже') {
      addComment();
    } else {
      alert(error.message);
    }
   })
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



