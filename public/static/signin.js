const form = document.getElementById('form')

form.addEventListener('submit',handleSubmit)

async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    console.log(data.get('aggrement'))
    const email = data.get('email');
    const password = data.get('password')

    let obj = {
        'email':email,
        'password':password
    }
    await axios.post('http://localhost:3000/home/sign-in',obj)
    .then(response => {
        if (response.status===200){
            window.location.href = '/main/home';
        }else{
            console.log(response.status)
        }
    })
    .catch(err =>{console.log(err)})
}