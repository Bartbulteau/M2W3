module.exports = function (io) {
    var express = require('express');
    var router = express.Router();

    // set-up database
    var mongoose = require('mongoose');

    // bring in model
    var Message = require('../models/message');

    var clients = [] // all connected clients


    /**
    * Socket.io
    */
    io.on("connection", function (socket) {
        // events

        socket.on('get_messages', function() {
            console.log('get_messages');
            Message.find({}, (err, messages) => {
                if (err) {
                  console.log('ERROR /!\\ : ');
                  console.log(err);
                  socket.emit('post_message_fail', err);
                }
                else {
                //   console.log(messages);
                  socket.emit('messages', messages);
                }
            });
        });


        socket.on('post_message', function (msg) {
            var message = new Message();
            message.content = msg.content;
            message.author = msg.author;

            // save message to db
            message.save(err => {
                // check if it works
                // if it doesn't, send the error
                if (err) {
                    console.log(err);
                    socket.emit('post_message_fail', err);
                }
                // if it does, send the messages
                else {
                    console.log('New message posted by ' + msg.author);
                    console.log('[message] ' + msg.content);
                    io.emit('new_message', message);
                }
            });
        });

        socket.on('general_update', function() {
            Message.find({}, (err, messages) => {
                if (err) {
                  console.log('ERROR /!\\ : ');
                  console.log(err);
                  socket.emit('general_update_fail', err);
                }
                else {
                  console.log(messages);
                  io.emit('messages', messages);
                }
            });
        });

        socket.on('delete_messages', function() {
            Message.remove({}, err => {if(err) throw err});

        });

        socket.on('_connect', function(username) {
            console.log('/!\\ New user connected : ' + username);
            var isAlreadyConnected = false
            for (let i = 0; i < clients.length; i++) {
                const element = clients[i];
                if  (element === username) {
                    isAlreadyConnected = true
                }
                
            }
            if (!isAlreadyConnected) {
                clients.push(username);
            }
            io.emit('updateUsers', clients);
        });

        socket.on('disconnect', function(username) {
            console.log('/!\\ A user disconnected : ' + username)
            clients.splice(clients.indexOf(username), 1);
            io.emit('updateUsers', clients);
        });

        socket.on('get_users', function(){
            socket.emit('updateUsers', clients);
        });


    });



   
    router.get('/', function (req, res, next) {
        res.send('API route');
    });

    return router;
}