const form = document.getElementById('form')

form.addEventListener('submit',handleSubmit)

async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    if (data.get('aggrement')==='on'){
        console.log(data.get('aggrement'))
        const name = data.get('name');
        const email = data.get('email');
        const phone = data.get('phone_no')
        const password = data.get('password')
        let obj = {
            'name':name,
            'email':email,
            'phone_no':phone,
            'password':password
        }
        await axios.post('http://localhost:3000/home/sign-up',obj)
        .then(response => {
            if (response.status===200){
                window.location.href = '/main/home';
            }else{
                console.log(response.status)
            }
        })
        .catch(err =>{console.log(err)})
    }else {
        console.log('click on aggrement')
    }
}

//google sign up

// function onSuccess(googleUser) {
//     console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
//   }
//   function onFailure(error) {
//     console.log(error);
//   }
//   function renderButton() {
//     gapi.signin2.render('my-signin2', {
//       'scope': 'profile email',
//       'width': 240,
//       'height': 50,
//       'longtitle': true,
//       'theme': 'dark',
//       'onsuccess': onSuccess,
//       'onfailure': onFailure
//     });
//   }