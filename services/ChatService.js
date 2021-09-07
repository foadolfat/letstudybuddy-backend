const ServiceLocator = require("./ServiceLocator");
const MessagesService = require("./MessagesService");


const jwt = require("jsonwebtoken");
const secret= "super-duper-secret";

const NEW_MESSAGE_EVENT = "new-message-event";
const NEW_ROOM = "new-room-event"; 

module.exports = (socket) => {
    

    
    socket.on(NEW_ROOM, (data) => {
        socket.join(data);
        console.log("joining room ",data)
        
    });

    socket.on(NEW_MESSAGE_EVENT, async (data, room) => {
        console.log("chatservice")
        //console.log(token)
        // let user_id = '';
        // jwt.verify(token, secret, (err, decoded) => {
        //     if (err) {
        //         socket.emit(NEW_MESSAGE_EVENT, {
        //             error:"token issue"
        //         });
        //     }
        //     if (decoded) {

        //         user_id = decoded.id;
        //     }

        //   });
        // console.log(user_id)
        let user_id = '';
        if (!socket.token) {

          }
        
        jwt.verify(socket.token, secret, (err, decoded) => {
            if (err) {
                console.log(err)
            }
            else {
                //console.log(decoded)
                user_id = decoded.id;
            }

        });
        //let user_id = jwt.verify(socket.token, secret).id;
        //console.log("chatservice ",socket.token)
        const messagesService = ServiceLocator.getService(MessagesService.name);
        try{
            const { payload: result, error } = await messagesService.createMessage({
                content:data.content,
                room_id:room
            }, user_id);

            // if(result) console.log("result is ", result);
            // if(error) console.log("error is ", error)

            if(error) {
                socket.to(room).emit(NEW_MESSAGE_EVENT, {
                    error:error
                });
            } else if (!result){
                socket.to(room).emit(NEW_MESSAGE_EVENT, {
                    error:"MESSAGE_ADD_FAILED"
                });
            } else {
                //console.log(socket.username)
                socket.to(room).emit(NEW_MESSAGE_EVENT, {
                    content:data.content,
                    username:socket.username,
                    date_sent:data.date
                });
            }
        }catch(e){
            console.log("an error occured", e);
            socket.to(room).emit(NEW_MESSAGE_EVENT, {
                error:e
            });
        }
        // const messagesService = ServiceLocator.getService(MessagesService.name);
        // const { payload: result, error } = await messagesService.createMessage({
        //     content:data.content,
        //     room_id:room
        // }, user_id);
        // if(result) console.log("result is ", result);
        // if(error) console.log("error is ", error)
        // socket.to(room).emit(NEW_MESSAGE_EVENT, {
        //     content:data.content,
        //     username:data.username,
        //     date:data.date
        // });
    });

    socket.on("disconnect", () => {
        socket.leave();
    });
}
// module.exports = (socket) => {
//     socket.on(NEW_ROOM, (data) => {
//         console.log("joining room ",data)
//         socket.join(data);
//     });

//     socket.on(NEW_MESSAGE_EVENT, (data) => {

//         io.emit(NEW_MESSAGE_EVENT, data);
//     });

//     socket.on("disconnect", () => {
//         socket.leave();
//     });
// }


