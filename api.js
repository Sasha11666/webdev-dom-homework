

let gainData = ({token}) => {
  console.log("!!!" + token);
  return fetch("https://webdev-hw-api.vercel.app/api/v2/sasha-basova/comments", {
  method: "GET",
  headers: {
    Authorization: token,
  },
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

let postData = ({inputName, inputComment, token}) => {
  console.log(token);
  const date = new Date();
  return fetch("https://webdev-hw-api.vercel.app/api/v2/sasha-basova/comments", {
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
      likes: 0,
      isLiked: false,
    }),
    headers: {
      Authorization: token,
    },
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

let postLikesData = ({id, isLiked, likes, token}) => {
  return fetch(`https://webdev-hw-api.vercel.app/api/v2/sasha-basova/comments/${id}/toggle-like`, {
    method: "POST",
    body: JSON.stringify({
      likes: likes,
      isLiked: isLiked,
    }),
    headers: {
      Authorization: token,
    },
  })
 .then((response) => {
   return response.json()
 })
}

let deleteComment = ({id, token}) => {
  return fetch(`https://webdev-hw-api.vercel.app/api/v2/sasha-basova/comments/${id}`, {
    method: "DELETE",
    body: JSON.stringify({
      
    }),
    headers: {
      Authorization: token,
    },
  })
 .then((response) => {
   return response.json()
 })
}
  


let registerUser = ({ login, password, name }) => {
  return fetch("https://webdev-hw-api.vercel.app/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

let loginUser = ({login, password}) => {
  return fetch("https://webdev-hw-api.vercel.app/api/user/login", {
    method: "POST",
    body: JSON.stringify({
     login,
     password,
    }),
  })
   .then((response) => {
    if(response.status == 400) {
      throw new Error('Неверный логин или пароль')
    }
     return response.json()
   })
}

export {postData, gainData, loginUser, registerUser, postLikesData, deleteComment};