class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        //this.userId    = userId;
        this.socket = io.connect('http://localhost:5000');

        if (this.userEmail){
            this.connectionHandler();
        }

    }


    connectionHandler(){
        let self = this;
        let connectionSelf = this;
        this.socket.on('connect', function(){
           // console.log('connection established using sockets...!');


            self.socket.emit('join_chat', {
                user_email: self.userEmail,
               // user_id   : self.userId,
                //chatroom: 'codeial'
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
            })


        });

        // CHANGE :: send a message on clicking the send message button
        $('#send-message').click(function(){
            let self=this;
            let msg = $('#chat-message-input').val();
            let farmerId = $(self).attr('data-farmerId');
            let buyerId  = $(self).attr('data-buyerId');
            let userType = $(self).attr('data-userType');
            if (msg != ''){
                connectionSelf.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    farmerId:farmerId,
                    buyerId:buyerId,
                    userType:userType
                });
                
                let newMessage = $('<li>');

                newMessage.append($('<span>', {
                    'html': msg
                }));
    
                newMessage.addClass('self-message');
                $('#chat-message-input').val('');
                $('#chat-messages-list').append(newMessage);
                $('#chat-messages-list').scrollTop($("#chat-messages-list")[0].scrollHeight);
            }
            $('#chat-messages-list').scrollTop($("#chat-messages-list")[0].scrollHeight);
        });

        $('#negotiate-button').click(function(){
            let self=this;
            let farmerId = $(self).attr('data-farmerId');
            let buyerId  = $(self).attr('data-buyerId');
            console.log("Invite sent")
                connectionSelf.socket.emit('send_invite', {
                    user_email: self.userEmail,
                    farmerId:farmerId,
                    buyerId:buyerId
                });
        });

        self.socket.on('receive_message', function(data){
           // console.log('message received', data.message);


            let newMessage = $('<li>');

            let messageType = 'other-message';


            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
            $('#chat-messages-list').scrollTop($("#chat-messages-list")[0].scrollHeight);
        })


        self.socket.on('invite_received', function(data){
            console.log('invite received', data.message);
            $('#send-message').attr('data-buyerId',data.buyerId);
            $('#send-message').attr('data-userType','farmer');
            $('#user-chat-box').addClass("show");
         })

        $('#lock-buyer').click(function () {
            let BuyerForm = $('#chat-message-lock-container');
            BuyerForm.submit(function (e) {
                e.preventDefault();
                $.ajax({
                    type: 'post',
                    url: '/shop/:id',
                    data: BuyerForm.serialize(),
                    success: function (data) {
                        // show tick
                    },
                    error: function (error) {
                        console.log(error.responseText);
                    }
                })
            })
        })
    }
}