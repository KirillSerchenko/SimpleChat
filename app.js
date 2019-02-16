const express = require('express')
const app = express()


//set the template engine ejs
app.set('view engine' , 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/',(req,res)=>{
    res.render('index')
})


//Listen om port 3000
const io= require("socket.io")(app.listen(3000))

io.on('connection',(socket)=>{
    let messagesID=0;
    let connectedUsers=0;
    
    
   
   

    //listen on change_username
    socket.on("change_username",(data)=>{
        ++connectedUsers
        socket.username=data.username
        io.sockets.emit("change_username",{username:socket.username,connectedUsers})
    })

     //listen on change_username
     socket.on("add_likes",(data)=>{
        socket.emit("add_likes",{likes:"liked",id:data.id})
        socket.broadcast.emit("add_likes",{likes:`${++data.likes} likes`,id:data.id})
    })
    
    //listen on new_message
    socket.on("new_message",(data)=>{
        messagesID+=1
        io.sockets.emit("new_message",{id:messagesID,message:data.message,username:socket.username,likes:0})
    })

    //listen on typing 
    socket.on("typing",()=>{
        io.sockets.emit("typing",{username:socket.username,message:" is typing a message..."})
    })
})

