
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
    <button data-index="${index}" class="edit-button" type="button">Редактировать</button>
  </li>`
}

 export const renderFunction = (data, element) => {
  const commentsHTML = data.map((comment, index) => {
    return getComments(comment, index)
  })
  .join("");
  element.innerHTML = commentsHTML;
}
