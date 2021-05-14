const socket = io()

// socket.on('countUpdated', (count)=>{
//     console.log("The count has been updated!", count)
// })

// document.querySelector('#increment').addEventListener('click', ()=>{
//     console.log('clicked')
//     socket.emit('increment')
// })'


// Elements

const $messageForm = document.querySelector('#message-form')

const $messageFormInput = $messageForm.querySelector('input')

const $messageFormButton = $messageForm.querySelector('button')

const $locationButton = document.querySelector('#send-location')

const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


// Options

const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix:true })

const autoscroll = ()=>{
    // New Message Element
    const $newMessage = $messages.lastElementChild

    //Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const $newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //console.log(newMessageMargin)

    // Visible Height

    const visibleHeight =  $messages.offsetHeight

    // Height of messages container

    const constainerHeigth = $messages.scrollHeight

    // How far have I scrolled?

    const scrollOffset = $messages.scrollTop + visibleHeight
   

    if (constainerHeigth - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }

}

socket.on('message', (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message:message.text,
        createdAt: moment(moment.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()


})

socket.on('locationMessage', (message)=>{
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        
        username: message.username,
        url:message.url,
        createdAt: moment(moment.createdAt).format('h:mm a')
       
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room , users})=>{
    // console.log(room)
    // console.log(users)
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    // disable
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error)=>{
        // enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        //console.log('The message was delivered!', message)
        console.log('Message delivered!')
    })
})


document.querySelector('#send-location').addEventListener('click', (message)=>{
   if (! navigator.geolocation){
       return alert('Geolocation is not supported by your browser.')

   }
   // Disable
   $locationButton.setAttribute('disabled', 'disabled')

   

   navigator.geolocation.getCurrentPosition((position)=>{
       //console.log(position)
       socket.emit('sendLocation', {
           latitude: position.coords.latitude,
           longitude: position.coords.longitude
       }, ()=>{
           // enabled
           $locationButton.removeAttribute('disabled')
           console.log('Location Shared!')
       })

   })
   
})

socket.emit('join', {username, room}, (error)=>{
    if (error) {
        alert(error)
        location.href = '/'
    }
})
