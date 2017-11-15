$(function(){
    var socket = io();

    $("#btn_send_message").click(function(){
        var msg = $("#input_message").val();
        $("#input_message").val("");
        socket.emit("for_all_clients", msg, function(response){
            $("#error").text(response.error);
            $("#error_msg").text(response.msg);
        });
    });

    socket.on("reload_users",function(data){
        console.log("Load users event");
        $.get("http://localhost:3000/update_clients", function(data){
            $("#clients_table").html(data);
        });
    });

});