window.onload = function(){

    var registerButton = document.getElementById('register');
    var sendButton = document.getElementById('send');
    var loginContainer = document.getElementById('loginContainer');
    var chatContainer = document.getElementById('chatContainer');
    var nameText = document.getElementById('name');
    var users = document.getElementById('users');
    var field = document.getElementById('field');
    var content = document.getElementById('content');

    var socket = io.connect();

    socket.on('incoming', function(data){
        content.innerHTML += data.user + data.message + "<br>";
        users.innerHTML = '(all)';
        data.users.forEach(function(item){
            users.innerHTML += '<option>' + item + '</option>';
        });
    });

    socket.on('getMessage', function(data){
        content.innerHTML += new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") + " - <i>" + data.from + "</i> says to <b>" + data.to + "</b>: " + data.message + "<br>";
    });

    registerButton.onclick = function(){
        if(nameText.value.length > 0){
            socket.emit('register', { name: nameText.value});
            loginContainer.style.visibility = 'hidden';
            chatContainer.style.visibility = 'visible';
        } else {
            alert('Entre com o seu nome');
        }
    };

    sendButton.onclick = function(){
        if(field.value.length > 0){
            socket.emit('sendMessage', { from: nameText.value, message: field.value, to: users.options[users.selectedIndex].text });
            field.value = '';
        }
    };
};