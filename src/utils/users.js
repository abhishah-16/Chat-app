const users = []

// adduser 
const addusers = ({id,username,room}) =>{
    // format data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    // validate data
    if(!username || !room){
        return {
            error:'please provide username and room'
        }
    }
    // for validation
    const totaluser = users.find((user)=>{
        return user.room === room && user.username === username
    })
    // validate user data
    if(totaluser){
        return {
            error:'username is already taken'
        }
    }
    // store user
    const user = { id,username,room}
    users.push(user)
    return { user}
}

// remove function
const removeusers = (id) =>{
    const index = users.findIndex((user)=>user.id === id)
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

// get users by id
const getusers = (id) =>{
    const user = users.find((user)=>{
        return user.id === id
    })
    if(!user){
        return {
            error:'user not found'
        } 
    }
    return user
}

// get user by room
const getusersbyroom = (room) =>{
    const user = users.filter((user)=>{
        return user.room === room
    })
    if(user.length == 0){
        return {
            error:'user not found'
        } 
    }
    return user
}
module.exports = {
    addusers,
    removeusers,
    getusers,
    getusersbyroom
}