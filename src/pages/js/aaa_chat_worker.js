var server_ip_port = "http://192.168.159.207:8080/"
// var server_ip_port = "http://localhost:8080/"


// 导入依赖项

// importScripts("code.jquery.com_jquery-3.7.0.min.js"); worker不支持dom，不能导入
var getAvatar = function (user_name) {
    // TODO: 还是需要一个web worker开线程，不然会阻塞         //根据用户名获取头像
    const xhr = new XMLHttpRequest();
    xhr.open('POST', server_ip_port + 'user/getUserInfo', false);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    xhr.onload = () => {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log('获取头像成功');
            console.log(response);
            // 将头像链接替换，把 http://localhost:8080/ 替换为 server_ip_port
            response.data.avatar = response.data.avatar.replace("http://localhost:8080/", server_ip_port);
            return response.data.avatar;
        } else {
            console.log('获取头像失败');
            console.log(xhr.statusText);
            return undefined;
        }
    };
    xhr.onerror = () => {
        console.log('获取头像失败');
        console.log(xhr.statusText);
        return undefined;
    };
    xhr.send(JSON.stringify({ account: user_name }));
}
var justify_backend_chat_object_list_data = function (serverResponse) {
    // 遍历聊天对象列表，对齐数据

    var serverData = serverResponse.data;
    const transformedData = [];

    serverData.forEach((chat) => {
        const userIndex = transformedData.findIndex(
            (user) => user.user_name === chat.sendingAccount
        );

        var chat_message = {
            message: chat.content,
            time: chat.timeStamp.replace("T", " "),
        }
        if (userIndex === -1) {

            transformedData.push({
                user_name: chat.sendingAccount,
                user_avatar: getAvatar(chat.sendingAccount),
                latest_message: chat.content.length > 10 ? chat.content.slice(0, 10) + "..." : chat.content,
                latest_message_time: chat.timeStamp.replace("T", " "),
                is_online: true,
                new_messages: [chat_message], // 将第一条消息添加到new_messages数组中
                new_messages_count: 1,
            });
        } else {
            transformedData[userIndex].latest_message =
                chat.content.length > 10 ? chat.content.slice(0, 10) + "..." : chat.content;
            transformedData[userIndex].latest_message_time = chat.timeStamp.replace("T", " ");; // TODO: 根据时间戳计算时间
            transformedData[userIndex].is_online = true; // TODO: 判断用户是否在线
            transformedData[userIndex].new_messages.push(chat_message); // 将新消息添加到new_messages数组中
            transformedData[userIndex].new_messages_count++; // 更新未读消息数 未来善后
        }
    });

    return transformedData;
};


function data_get_chat_object_list(mine_name) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', server_ip_port + 'chat/queryMessage', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ receiverAccount: mine_name }));
    if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        console.log('xhr成功获取聊天对象列表');
        console.log(response.data);
        const object_list = justify_backend_chat_object_list_data(response);
        console.log("xhr返回:")
        console.log(object_list);
        if (object_list == undefined) {
            console.log('xhr获取到的聊天对象列表为undefined');
            return [];
        } else {
            return object_list;
        }
    } else {
        console.log('xhr获取聊天对象列表失败');
        console.log(xhr.statusText);
        return undefined;
    }
}


// console.log("进入chat_worker.js")

// 监听消息
self.addEventListener('message', function (event) {
    // 接收消息
    var message = event.data.message;
    var mine_name = event.data.mine_name;
    console.log("aaa_chat_worker.js: 收到消息: ");
    console.log(event);

    // 如果消息是"start"，则执行data_get_chat_object_list函数
    if (message === 'start') {
        console.log("chat_worker.js: 收到start消息，开始执行data_get_chat_object_list函数");

        var result = data_get_chat_object_list(mine_name);
        console.log("aaa_chat_worker.js: data_get_chat_object_list函数执行完毕，返回结果为：");
        console.log(result);
        if (result == undefined) {
            // 发送消息
            response = {
                message: "获取聊天对象列表失败",
                data: result
            }
        } else {
            // 发送消息
            response = {
                message: "获取一次新的聊天列表成功",
                data: result
            }
        }

        console.log("chat_worker.js:退出chat_worker.js, 返回消息为：");
        console.log(response);
        self.postMessage(response);
    }
});







