const { sendMessage, sendNotification } = require('./IOService');

const ServiceLocator = require("./ServiceLocator");
const MessagesService = require("./MessagesService");
const RoomMemberService = require("./RoomMemberService");
const NotificationService = require("./NotificationService");
const SocketService = require("./SocketService");

const jwt = require("jsonwebtoken");
const secret= "super-duper-secret";

const NEW_MESSAGE_EVENT = "new-message-event";
const NEW_ROOM = "new-room-event"; 
const NEW_PEER = "new_peer_event";
const NEW_MESSAGE_ALERT = "new-message-alert";

module.exports = (socket) => {

    socket.on(NEW_ROOM, (data) => {
        
        socket.join(data);
        console.log("joining room ",data)
    
    });

    socket.on(NEW_MESSAGE_EVENT, async (data, room) => {
        console.log("chatserviceV2")
        let user_id = '';
        if (!socket.token) {
            console.log("no token for socket")
        }
        
        jwt.verify(socket.token, secret, (err, decoded) => {
            if (err) {
                console.log(err)
            }
            else {

                user_id = decoded.id;
            }

        });

        const messagesService = ServiceLocator.getService(MessagesService.name);
        try{
            const { payload: result, error } = await messagesService.createMessage({
                content:data.content,
                room_id:room
            }, user_id);


            if(error) {
                // socket.to(room).emit(NEW_MESSAGE_EVENT, {
                //     error:error
                // });
            } else if (!result){
                // sendMessage(room, NEW_MESSAGE_EVENT, {
                //     error:"MESSAGE_ADD_FAILED"
                // })

            } else {
                // socket.to(room).emit(NEW_MESSAGE_EVENT, {
                //     content:data.content,
                //     username:socket.username,
                //     date_sent:data.date
                // });
                sendMessage(room, NEW_MESSAGE_EVENT, {
                    content:data.content,
                    username:socket.username,
                    date_sent:data.date
                }, room)

                const roomMemberService = ServiceLocator.getService(RoomMemberService.name);

                try{
                    const { payload: results, error } = await roomMemberService.getMembersByRoom(room);
                    if(error){
                        console.log(error)

                    } else if (!results){
                        console.log("no results for getMemberByRoom in chatservicev2")
        
                    } else {
                        const socketService = ServiceLocator.getService(SocketService.name);
                        const notificationService = ServiceLocator.getService(NotificationService.name);
                        for(const r of results) {
                            if(r.USER_ID !== user_id){
                                try{
                                    const { payload: notifications, error } = await notificationService.createNotification(r.USER_ID, room, NEW_MESSAGE_ALERT, 1);
                                    if(error) {
                                        console.log(error)
                                    } else {
                                        try{
                                            const { payload: sock, error } = await socketService.getSocket(r.USER_ID);
                                            if(error){
                                                console.log(error)
            
                                            } else if (!sock) {
                                                console.log("User not online ", r.user_id)
                                            } else if(sock.SOCKET_ID!==socket.id){
                                                console.log(sock)
                                                //const notificationService = ServiceLocator.getService(NotificationService.name);
                                                try{
                                                    //const { payload: notifications, error } = await notificationService.createNotification(r.USER_ID, room, NEW_MESSAGE_ALERT, 1);
                                                    if(error){
                                                        console.log(error)
                                                    } else {
                                                        console.log("notifications to be sent ",notifications)
                                                        if(notifications && notifications.length){
                                                            for(let notification of notifications){
                                                                sendNotification(sock.SOCKET_ID, notification.EVENT_KEY, notification.ROOM_ID);
                                                            }
                                                        }
                                                        // else
                                                        //     sendNotification(sock.SOCKET_ID, notifications.EVENT_KEY, notifications.ROOM_ID);
                                                        
                                                    }
                                                } catch(e){
                                                    console.log("an error occured in ChatServiceV2 - 0", e);
                                                }
            
                                            }
                                            } catch(e){
                                                console.log("an error occured in ChatServiceV2 - 1", e);
            
                                            }
                                    }
                                } catch(e){
                                    console.log("an error occured in ChatServiceV2 - 0", e);
                                }
                                
                            }
                        }
                    }
                } catch(e){
                    console.log("an error occured in ChatServiceV2 - 2", e);

                }

            }
        }catch(e){
            console.log("an error occured in ChatServiceV2 - 3", e);

        }

    });

    socket.on("disconnect", () => {
        socket.leave();
    });

    socket.on(NEW_PEER, async (peer_id) => {
        console.log(socket.user_id," ", peer_id)
        const roomMemberService = ServiceLocator.getService(RoomMemberService.name);
        const notificationService = ServiceLocator.getService(NotificationService.name);
        const socketService = ServiceLocator.getService(SocketService.name);
        //socket.user_id, peer_id
        try{
            const { payload: commonRoom, error } = await roomMemberService.checkForCommonRoom(socket.user_id, peer_id);
            if(error) {
                console.log(error)
            } else {
                console.log("Chatservicev2 new_peer",commonRoom)
                if(commonRoom){
                    try{
                        const { payload: userNotifications, userNotificationsError } = await notificationService.createNotification(socket.user_id, commonRoom.room_id, NEW_PEER, 1);
                        const { payload: peerNotifications, peerNotificationsError } = await notificationService.createNotification(peer_id, commonRoom.room_id, NEW_PEER, 1);
                        if(error){
                            console.log(userNotificationsError)
                            console.log(peerNotificationsError)
                        } else{
                            try{
                                const { payload: sock, error } = await socketService.getSocket(peer_id);
                                if(error) {
                                    console.log(error)
                                } else{
                                    console.log(userNotifications)
                                    if(userNotifications && userNotifications.length){
                                        for(let notification of userNotifications){
                                            sendNotification(socket.id, notification.EVENT_KEY, notification.ROOM_ID);
                                        }
                                    }
                                    // else
                                    //     sendNotification(socket.id, userNotifications.EVENT_KEY, userNotifications.ROOM_ID);
                                    
                                    console.log(peerNotifications)
                                    if(peerNotifications && peerNotifications.length){
                                        for(let notification of peerNotifications){
                                            sendNotification(sock.SOCKET_ID, notification.EVENT_KEY, notification.ROOM_ID);
                                        }
                                    }
                                    // else
                                    //     sendNotification(sock.SOCKET_ID, peerNotifications.EVENT_KEY, peerNotifications.ROOM_ID);
                                }
                            } catch(e) {
                                console.log("something went wrong chatservicev2 - 5",e)
                            }
                        }
                            

                    } catch (e){
                        console.log(e)
                    }
                    
                    // const socketService = ServiceLocator.getService(SocketService.name);

                    // try{
                    //     const { payload: sock, error } = await socketService.getSocket(peer_id);
                    //     if(error) {
                    //         console.log(error)
                    //     } else {
                    //         const notificationService = ServiceLocator.getService(NotificationService.name);
                    //                 try{
                    //                     const { payload: userNotifications, userNotificationsError } = await notificationService.createNotification(socket.user_id, room, NEW_PEER, 1);
                    //                     const { payload: peerNotifications, peerNotificationsError } = await notificationService.createNotification(peer_id, room, NEW_PEER, 1);
                    //                     if(error){
                    //                         console.log(userNotificationsError)
                    //                         console.log(peerNotificationsError)
                    //                     } else {
                    //                         console.log(userNotifications)
                    //                         if(userNotifications && userNotifications.length){
                    //                             for(let notification of userNotifications){
                    //                                 sendNotification(socket.id, notification.EVENT_KEY, notification.ROOM_ID);
                    //                             }
                    //                         }
                    //                         else
                    //                             sendNotification(socket.id, notifications.EVENT_KEY, notifications.ROOM_ID);
                                            
                    //                         console.log(peerNotifications)
                    //                         if(peerNotifications && peerNotifications.length){
                    //                             for(let notification of peerNotifications){
                    //                                 sendNotification(sock.SOCKET_ID, notification.EVENT_KEY, notification.ROOM_ID);
                    //                             }
                    //                         }
                    //                         else
                    //                             sendNotification(sock.SOCKET_ID, notifications.EVENT_KEY, notifications.ROOM_ID);
                                            
                    //                     }
                    //                 } catch(e){
                    //                     console.log("an error occured in ChatServiceV2 - 0", e);
                    //                 }



                    //     }
                    // }catch(e){
                    //     console.log("an error occured in ChatServiceV2 - 4", e);
                    // }
                }
            }
        }catch(e){
            console.log("an error occured in ChatServiceV2 - 5", e);
        }
    });
}

