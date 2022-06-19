window.addEventListener('load',get_chat)
const content = document.getElementsByClassName('content')[0]
const nam = document.getElementsByClassName('name')[0]
const sandesh = document.getElementById('message')
const bhejo = document.getElementById('send')
nam.innerHTML = sessionStorage.getItem('sender').split('-')[1]


bhejo.addEventListener('click', async ()=>{
    await axios.post('http://localhost:3000/home/send/messages',{
        receiver:sessionStorage.getItem('sender').split('-')[0]
    },{
        headers:{
            'Authorization': sessionStorage.getItem('token')
        }
    })
    .then()
})


async function get_chat(){
    await axios.post('http://localhost:3000/home/get/allmessages',{sender:sessionStorage.getItem('sender')},{
        headers:{
            'Authorization': sessionStorage.getItem('token')
        }
    })
    .then(result =>{
        let sender = sessionStorage.getItem('sender').split('-')[0]
        let list_message = result.data.response.sort(function(a,b){return a.id-b.id})
        list_message.forEach(mess => {
            let div = document.createElement('div')
            div.innerHTML = mess.message
            if(mess.senderId==sender){
                div.classList = "message theres"
                div.id = mess.id
            }else{
                div.classList = "message ours"
                div.id = mess.id
            }
            content.appendChild(div)
        });
    })
}

//call api every 0.5sec
setInterval(async()=>{
    const last_mess_id = content.lastChild.id
    await axios.post('http://localhost:3000/user/get/message',{
            last:last_mess_id,
            sender:sessionStorage.getItem('sender')},{
        headers:{
            'Authorization': sessionStorage.getItem('token')
        }
    })
})