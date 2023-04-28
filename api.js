

let gainData = () => {
  return fetch("https://webdev-hw-api.vercel.app/api/v1/:sasha-basova/comments", {
  method: "GET",
  })
    .then((response) => {
      if(response.status == 400) {
        throw new Error('Имя и комментарий должны быть не короче 3х символов!');
      } else if(response.status == 500) {
        throw new Error('Сервер сломался.. попробуй позже')
      }
      return response.json()
    })
}

let postData = (inputName, inputComment) => {
  const date = new Date();
  return fetch("https://webdev-hw-api.vercel.app/api/v1/:sasha-basova/comments", {
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
      forceError: true,
    }),
  })
   .then((response) => {
    if(response.status == 400) {
      throw new Error('Имя и комментарий должны быть не короче 3х символов!');
    } else if(response.status == 500) {
      throw new Error('Сервер сломался.. попробуй позже')
    }
     return response.json()
   })
   
}

export {postData, gainData};