module.exports = function(io){
    var redis = require('redis');
    var redis_client = redis.createClient(6379,"localhost");

    redis_client.on("connect", function(){
      console.log("Connected with redis");
    });

    redis_client.on("error", function (err) {
      console.log("Error redis" + err);
    });

    io.on('connection', function(socket){
        console.log('a user connected: '+ socket.id);

        socket.on('disconnect', function(id,data){
          console.log('user disconnected: '+ id);
        });
        
        socket.on("register_client", register_client);
        socket.on("client_message",client_message);
        socket.on("for_all_clients",for_all_clients);

        // **** EVENTS ****//

        function register_client( nickname, callback ){
          console.log("id: "+this.id+" nickname: "+nickname);
          redis_client.set(nickname, this.id+"", function(err, reply){
            if (err){
              console.log("Error saving client: "+ err);
            }else{
              redis_client.keys('*',function(err, keys){
                if (err){
                  console.log("Error registering user: "+ err); 
                  response = { error: true, msg: err };
                }else{
                  console.log("User registered: "+ JSON.stringify(keys)); 
                  response = { error: false, msg: "Usuario registrado" };
                  socket.broadcast.emit("reload_users","");
                }
                callback(response);
              });        
            }
          });
        }

        function client_message( msg ){
          console.log("id: "+this.id+" message: "+msg);
        }

        function for_all_clients( msg ){
            console.log("id: "+this.id + " message: "+msg);
            socket.broadcast.emit("server_message", msg);
        }

      });

}

