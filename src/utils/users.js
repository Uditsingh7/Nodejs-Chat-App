const users = []

// addUser, removeUser, getUser, getUserInRomm

const addUser = ({id, username, room})=>{
   //Clean Data
   username = username.trim().toLowerCase()
   room = room.trim().toLowerCase()

   // Validate the data

   if (! username || ! room) {
       return {
           error: 'Username and room are required!'
       }
   }

   const existingUser = users.find((user)=>{
       return user.room === room && user.username === username
   })

   // Validate user name
   if (existingUser) {
       return {
           error: 'Username is in use'
       }
   }

   // Store user
   const user = {id, username, room}
   users.push(user)
   return {user}

}

// addUser({
//     id:22,
//     username: 'udit  ',
//     room:'club'
// })

// console.log(users)

// const res = addUser({
//     id:33,
//     username:'Udit',
//     room:'club69'
// })

//console.log(res)

const removeUser = (id)=>{
    const index =  users.findIndex((user)=>user.id===id)
    if (index!==-1){
        return users.splice(index, 1)[0]


    }
}

const getUser = (id)=>{
    return users.find((user)=>user.id===id)

}

const getUserInRoom = (room)=>{
    return users.filter((user)=>user.room === room)
}


// addUser({
//     id:22,
//     username: 'udit  ',
//     room:'club'
// })
// addUser({
//     id:222,
//     username: 'udit1  ',
//     room:'club'
// })
// addUser({
//     id:223,
//     username: 'udit7  ',
//     room:'club69'
// })

// console.log(users)

// const removedUser = removeUser(22)

// console.log(removeUser)
// console.log(users)

// const user = getUser(224)

// console.log(user)

// const userList = getUserInRoom('club695')
// console.log(userList)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}