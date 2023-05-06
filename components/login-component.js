import {loginUser, registerUser} from '../api.js';

export let renderLoginComponent = ({commentsList, setToken, getData}) => {
  let isLoginOn = true;

  const renderForm = () => {
    const loginHTML = `<div class="add-form">
    <h3 class="form-title">Форма ${isLoginOn ? "входа" : "регистрации"}</h3>
    ${
      isLoginOn
        ? ""
        : 
      `<input type="text" class="add-form-name" id="name-input" placeholder="Введите имя"/>`
    }
    <input
      type="text"
      class="add-form-name"
      placeholder="Введите логин"
      id="input-login"
    />
    <input
      type="password"
      class="add-form-name"
      placeholder="Введите пароль"
      id="input-password"
    ></input>
    <div class="add-form-row">
      <button type="button" class="add-form-button" id="login-button" >${
        isLoginOn ? "Войти" : "Зарегистрироваться"
      }</button>

      <button class="add-form-button form-toggle-button" id="toggle-button">Перейти ${
        isLoginOn ? "к регистрации" : "ко входу"
      }</button>
    </div>
    </div>`
    commentsList.innerHTML = loginHTML;
    console.log(document.getElementById('login-button'));

    document.getElementById('login-button').addEventListener('click', () => {
      if(isLoginOn) {
        const login = document.getElementById("input-login").value;
        const password = document.getElementById("input-password").value;
  
        document.getElementById("input-login").classList.remove('error');
        document.getElementById("input-password").classList.remove('error');
        if(document.getElementById("input-login").value == '') {
          document.getElementById("input-login").classList.add('error');
          return;
        }else if(document.getElementById("input-password").value == '') {
          document.getElementById("input-password").classList.add('error');
          return;
        }
  
        loginUser({
          login: login,
          password: password,
        }).then((user) => {
          setToken(`Bearer ${user.user.token}`);
          getData();
          document.getElementById("input-name").setAttribute("value", user.user.name);
          document.getElementById("input-name").setAttribute("disabled", true);
        })
        .catch((error) => {
          alert(error.message);
        });
      }   else {
        const login = document.getElementById("input-login").value;
        const password = document.getElementById("input-password").value;
        const name = document.getElementById("name-input").value;
  
        document.getElementById("input-login").classList.remove('error');
        document.getElementById("input-password").classList.remove('error');
        document.getElementById("name-input").classList.remove('error');
        if(document.getElementById("input-login").value == '') {
          document.getElementById("input-login").classList.add('error');
          return;
        }else if(document.getElementById("input-password").value == '') {
          document.getElementById("input-password").classList.add('error');
          return;
        }else if (document.getElementById("name-input").value == '') {
          document.getElementById("name-input").classList.add('error');
          return;
        }

        registerUser({
          login: login,
          password: password,
          name: name,
        })
          .then((user) => {
            setToken(`Bearer ${user.user.token}`);
            getData();
            document.getElementById("input-name").setAttribute("value", user.user.name);
            document.getElementById("input-name").setAttribute("disabled", true);
          })
          .catch((error) => {
            alert(error.message);
          });
      }
    });

    document.getElementById("toggle-button").addEventListener("click", () => {
      isLoginOn = !isLoginOn;
      renderForm();
    });

    
  }

  renderForm();
    
}