const list = document.getElementsByClassName('contact')[0]
const heading = document.getElementsByClassName('name')[0]
window.addEventListener('load', contact)

async function get_chat(e){
    sessionStorage.setItem('sender',e.target.id+'-'+e.target.innerHTML)
    window.location.href = '../chats.html'
}

async function contact (e){
    e.preventDefault()
    await axios.get('http://localhost:3000/home/get-contact',{
        headers:{
            'Authorization': sessionStorage.getItem('token')
        }
    })
    .then(response =>{
        response.data.forEach(user => {
            let div = document.createElement('div')
            div.id = user.id
            div.innerHTML = user.name
            div.addEventListener('click',get_chat)
            list.appendChild(div)
        });
    })
    .catch(err => {
        console.log(err)
        window.location.href = '../sign-in.html';
    })
}