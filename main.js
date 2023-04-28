import { gainData, postData } from "./api.js";
import { renderFunction } from "./renderComment.js";

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

async function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}


export let isLoading = true;
export let isStarting = true;
toggleLoader();



async function getData () {
    gainData()
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
      })
      comments = appComments;
      isLoading = false;
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
      isLoading = false;
      toggleLoader();
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
  renderFunction(comments, commentsList);

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

   postData(inputName, inputComment)
   .then(() => {
    return getData();
   })
   .then(() => {
    inputName.value = '';
    inputComment.value = '';
   })
   .catch((error) => {
    console.warn(error);
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


export {getData}
