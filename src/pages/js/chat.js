var server_ip_port = "http://192.168.159.207:8080/"
// var server_ip_port = "http://localhost:8080/"


$(document).ready(function () {
    console.log("成功进入聊天页了");

    /**
     * 1. data 定义阶段与存储区
     */
    var data = {
        mine_info: {
            user_name: "用户A",
            user_avatar:
                "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp",
        },

        chat_object_now_name: "用户B",

        chat_object_list: [
            // {
            //     user_name: "用户B",
            //     user_avatar:
            //         "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp",

            //     latest_message: "我发来3条消息",  // 只给聊天列表用，显示最新消息
            //     latest_message_time: "刚刚", 

            //     is_online: true, // TODO: 判断，如果用户在线，显示绿色，否则显示灰色

            //     new_messages: [  
            //         //  新消息，直接补充到历史聊天记录后面 只给聊天页面用，显示聊天记录
            //         {
            //             message: "我发来3条消息, 这是第1条",
            //             time: "2023/07/03 11:37:26",
            //         },
            //         {
            //             message: "我发来3条消息, 这是第2条",
            //             time: "2023/07/03 11:37:26",
            //         },
            //         {
            //             message: "我发来3条消息, 这是第3条",
            //             time: "2023/07/03 11:37:26",
            //         },
            //     ],
            //     new_messages_count: 3, 
            // },
            // {
            //     user_name: "用户C",
            //     user_avatar:
            //         "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp",

            //     latest_message: "我发来1条消息",
            //     latest_message_time: "昨天",

            //     is_online: false,
            //     new_messages: [
            //         // TODO: 新消息，直接补充到历史聊天记录后面
            //         {
            //             message: "我发来3条消息, 这是第1条",
            //             time: "2023/07/03 11:37:26",
            //         },
            //         {
            //             message: "我发来3条消息, 这是第2条",
            //             time: "2023/07/03 11:37:26",
            //         },
            //         {
            //             message: "我发来3条消息, 这是第3条",
            //             time: "2023/07/03 11:37:26",
            //         },
            //     ],

            //     new_messages_count: 1,
            // },
        ],



    };
    /**
     * 2. method 定义阶段与存储区  存储区，就先当一个堆函数的地方，“垃圾堆”
     */

    /** 对齐后端聊天列表数据*/
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
                    user_avatar:
                        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp",
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

    /** 根据新获取的obejct_list更新data.chat_object_list */
    var update_chat_object_list = function (object_list) {
        // 遍历object_list，更新聊天对象列表data.chat_object_list, 如果有不同，就相应更新data.chat_object_list

        $.each(object_list, function (index, object) { //!!!!!!!! 不能删index


            var chat_object = $.grep(data.chat_object_list, function (chat) {
                return chat.user_name === object.user_name;
            })[0];

            if (chat_object) {
                chat_object.latest_message = object.latest_message;
                chat_object.latest_message_time = object.latest_message_time;
                chat_object.is_online = object.is_online;
                chat_object.new_messages_count += object.new_messages_count;
                chat_object.new_messages = chat_object.new_messages.concat(object.new_messages);
            } else {
                if (!Array.isArray(data.chat_object_list)) {
                    data.chat_object_list = [];
                }
                data.chat_object_list.push(object);
            }
        });
    }

    /** 按照指定聊天对象名字，清空聊天对象的新消息列表和未读消息数*/
    var clear_chat_object_new_contents_by_name = function (chat_object_name) {
        for (let i = 0; i < data.chat_object_list.length; i++) {
            if (data.chat_object_list[i].user_name == chat_object_name) {
                data.chat_object_list[i].new_messages = [];
                data.chat_object_list[i].new_messages_count = 0; // 清空 未读消息数
                return;
            }
        }
    }

    /** 当前用户向当前聊天用户发送邀约 */
    var send_invite = function () {
        // 提示用户输入电影名
        // var movie_name = prompt("请输入电影名", "电影名");

        $.ajax({
            url: server_ip_port + "invite/request",
            type: "POST",
            async: "false",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "inviterAccount": data.mine_info.user_name,
                "receiverAccount": data.chat_object_now_name,
                "movieId": $("#movieId").val(),
            }),
            success: function (response) {
                if (response.code == 200) {
                    alert("邀约成功");
                } else {
                    alert("邀约失败");
                }
            },
            error: function (response) {
                console.log(response);
                alert("发送错误,请检查电影id是否输入正确或者是否已经邀约过该用户");
            }


        })
    }

    /** 工具类函数：向聊天框中添加消息，区分send or receive*/
    var chat_append_message = function (
        chat_object_name,
        message,
        time,
        send_or_receive
    ) {
        let avatar = getAvatar(chat_object_name);
        if (send_or_receive == "send") {
            $("#messageContainer").append(
                '<div class="d-flex flex-row justify-content-end"><div><p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">' +
                message +
                '</p><p class="small me-3 mb-3 rounded-3 text-muted">' +
                time +
                '</p></div><img src="' +
                avatar +
                '" alt="avatar 1"style="width: 45px; height: 100%;"></div>'
            );
        } else {
            $("#messageContainer").append(
                '<div class="d-flex flex-row justify-content-start"><img src="' +
                avatar +
                '" alt="avatar 1"style="width: 45px; height: 100%;"><div><p class="small p-2 ms-3 mb-1 rounded-3" style="background-color: #f5f6f7">' +
                message +
                '</p><p class="small ms-3 mb-3 rounded-3 text-muted">' +
                time +
                "</p></div></div>"
            );
        }
    };


    /** 按照指定聊天对象的名字，获取聊天新消息list的内容，为了更新消息容器*/
    var get_chat_object_new_contents_by_name = function (chat_object_name) {
        for (let i = 0; i < data.chat_object_list.length; i++) {
            if (data.chat_object_list[i].user_name == chat_object_name) {
                return data.chat_object_list[i].new_messages;
            }
        }
    }



    /**点开一个聊天对象的处理 */
    var chat_object_click = function (chat_object_name) {
        // 修改左边：更新聊天列表的表现
        let updata_dom_id = "#" + data.chat_object_now_name;
        $(updata_dom_id).removeClass("active");
        $(updata_dom_id + " .user_name").attr("style", "color: #757575;");

        data.chat_object_now_name = chat_object_name; // 更新当前聊天对象的名字
        updata_dom_id = "#" + data.chat_object_now_name;
        $(updata_dom_id).addClass("active");
        $(updata_dom_id + " .user_name").attr("style", "color: blue;");

        $(updata_dom_id + " .new-messages-count").remove();  // 消除未读消息数

        // 修改右边：消息容器的表现
        $("#chat_object_now").text(chat_object_name); // 修改聊天对象名字
        $("#messageContainer").empty(); // 清空原来页面
        $("#messageInput").val(""); // 清空输入框

        // 获取并显示消息：
        if (localStorage.getItem("messages" + chat_object_name) == undefined) { //从本地存储中获取以前保存的消息
            localStorage.setItem("messages" + chat_object_name, "");
        }
        var savedMessages = localStorage.getItem("messages" + chat_object_name);
        if (savedMessages) {
            $("#messageContainer").append(savedMessages);
        }

        var new_messages = get_chat_object_new_contents_by_name(chat_object_name); // // 获取并加载新消息
        if (new_messages.length != 0) {
            console.log("获取到的新消息不为空");
            for (let i = 0; i < new_messages.length; i++) {
                chat_append_message(
                    chat_object_name,
                    new_messages[i].message,
                    new_messages[i].time,
                    "receive"
                );
            }
            localStorage.setItem( // 更新本地存储中的消息
                "messages" + chat_object_name,
                $("#messageContainer").html()
            );

            // 更新data.chat_object_list中的数据和缓存中data.chat_object_list：new_messages置空, 未读消息数置0
            clear_chat_object_new_contents_by_name(chat_object_name); // 清空新消息,否则会重复加载，将获取的消息都放到本地，然后data里面置空
            localStorage.setItem("chat_object_list", JSON.stringify(data.chat_object_list));// 更新缓存中的聊天对象列表
        }


        const messageContainer = $("#messageContainer"); // // 将消息框滚动到底部
        $("#messageContainer").scrollTop(messageContainer.prop("scrollHeight"));

        // 检查是否中止了聊天
        if (localStorage.getItem(data.chat_object_now_name + "_abort")) {
            // 将发送邀请按钮禁用
            $("#sendInvite").attr("disabled", "disabled");
            $("#sendMessage").attr("disabled", "disabled");
        } else {
            // 将发送邀请按钮启用
            $("#sendInvite").removeAttr("disabled");
            $("#sendMessage").removeAttr("disabled");
        }
    };

    /**关于发送消息的处理 */
    var chat_send_message = function (chat_object_name) {
        // 获取输入框中的内容
        var messageInput = $("#messageInput");
        var messageText = messageInput.val();
        if (messageText == "") {
            return;
        }
        console.log("获取到要发送的聊天信息：" + messageText);
        messageInput.val(""); // 清空输入框


        // 发送消息到服务器
        const xhr = new XMLHttpRequest();
        xhr.open('POST', server_ip_port + 'chat/sendMessage', false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
            if (xhr.status === 200) {
                console.log('成功发送消息到服务器: ' + messageText);
                //alert("成功发送消息: " + messageText);
                console.log(xhr.responseText);

                // 更新消息容器
                chat_append_message( // 将文本添加到消息容器中
                    data.mine_info.user_name,
                    messageText,
                    getTimeNow(),
                    "send"
                );
                const messageContainer = $("#messageContainer"); // 将消息框滚动到底部
                $("#messageContainer").scrollTop(messageContainer.prop("scrollHeight"));

                // 更新本地存储中的消息记录
                console.log("更新本地存储中的消息记录:");
                console.log($("#messageContainer").html());
                localStorage.setItem("messages" + chat_object_name, $("#messageContainer").html());


                // 更新js数据的聊天对象列表
                for (let i = 0; i < data.chat_object_list.length; i++) {
                    if (data.chat_object_list[i].user_name == chat_object_name) {
                        data.chat_object_list[i].latest_message = messageText; // 只更新latest_message
                        data.chat_object_list[i].latest_message_time = getTimeNow(); // 只更新latest_message_time
                        break;
                    }
                }
                // 更新chatlist列表中的时间显示和最新消息值dom显示
                dom_build_chat_object_list(data.chat_object_list);
                dom_bind_chat_object_click_event();

                // 更新缓存中的聊天对象列表
                localStorage.setItem("chat_object_list", JSON.stringify(data.chat_object_list));

            } else {
                console.log('发送消息到服务器失败: ' + messageText);
                alert("发送消息失败: " + messageText);
                console.log(xhr.statusText);
            }
        };
        xhr.onerror = () => {
            console.log('发送消息到服务器失败: ' + messageText);
            alert("发送消息失败: " + messageText);
            console.log(xhr.statusText);
        };
        xhr.send(JSON.stringify({
            sendingAccount: data.mine_info.user_name,
            receiverAccount: data.chat_object_now_name,
            content: messageText,
        }));

    };

    var data_get_chat_object_list = function (build_dom) {
        $.ajax({
            type: "POST",
            async: false,
            url: server_ip_port + "chat/queryMessage", //TODO: 从服务器获取聊天对象列表
            data: JSON.stringify({
                receiverAccount: data.mine_info.user_name,
            }),
            contentType: "application/json", // 指定发送到服务器的数据是json格式
            dataType: "json", // 指定返回的数据类型，设置为json
            //ps : 要求后端的返回数据就是json的，对象列表的数据结构
            success: function (response) {
                console.log("成功获取聊天对象列表");
                let object_list = justify_backend_chat_object_list_data(response);

                if (object_list == undefined) {
                    console.log("获取到的聊天对象列表为空");
                    return;
                }

                if (object_list.length != 0) {
                    update_chat_object_list(object_list); /// !!!必须在这里先 更新data.chat_object_list聊天对象列表， 不然之后绑定点击出错
                }

                // 构建dom
                if (build_dom == undefined) {
                    console.log("build_dom is undefined");
                    return
                }
                console.log("渲染聊天对象列表使用的data.chat_object_list:")
                console.log(data.chat_object_list);
                if (data.chat_object_list != null || data.chat_object_list.length != 0) {
                    build_dom(data.chat_object_list);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("获取聊天对象列表失败");
                console.log(xhr);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }

    /** 根据data.chat_object_list每个对象的isonline返回对应需要的html片段 */
    function judge_online_style(is_online) {
        if (is_online) {
            return '<span class="badge bg-success badge-dot"></span>';
        } else {
            return '<span class="badge bg-danger badge-dot"></span>';
        }
    }

    /** 根据data.chat_object_list数据渲染列表 */
    var dom_build_chat_object_list = function (object_list) { // 这是基于data.chat_object_list重新完全构建dom
        $("#chat_object_list").empty();
        for (let object of object_list) {

            if (object.new_messages_count == 0) {
                $("#chat_object_list").append(
                    '<li class="chat_object p-2 border-bottom">' +
                    '<a class="nav-link d-flex justify-content-between" id="' + object.user_name + '">' +
                    '<div class="d-flex flex-row">' +
                    '<div>' +
                    '<img src="' + object.user_avatar + '"' +
                    'alt="avatar" class="d-flex align-self-center me-3" width="60" />' +
                    judge_online_style(object.is_online) +
                    '</div>' +
                    '<div class="pt-1">' +
                    '<p class="user_name fw-bold mb-2" style="color:#757575;">' + object.user_name + '</p>' +
                    '<p class="small text-muted">' + object.latest_message + '</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="pt-1">' +
                    '<p class="small text-muted mb-2">' + formatTime(object.latest_message_time) + '</p>' +
                    // '<span class="new-messages-count  badge bg-danger rounded-pill float-end">' + object.new_messages_count + '</span>' +
                    '</div></a></li>'
                );
            } else {

                $("#chat_object_list").append(
                    '<li class="chat_object p-2 border-bottom">' +
                    '<a class="nav-link d-flex justify-content-between" id="' + object.user_name + '">' +
                    '<div class="d-flex flex-row">' +
                    '<div>' +
                    '<img src="' + object.user_avatar + '"' +
                    'alt="avatar" class="d-flex align-self-center me-3" width="60" />' +
                    judge_online_style(object.is_online) +
                    '</div>' +
                    '<div class="pt-1">' +
                    '<p class="user_name fw-bold mb-2" style="color:#757575;">' + object.user_name + '</p>' +
                    '<p class="small text-muted">' + object.latest_message + '</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="pt-1">' +
                    '<p class="small text-muted mb-2">' + formatTime(object.latest_message_time) + '</p>' +
                    '<span class="new-messages-count  badge bg-danger rounded-pill float-end">' + object.new_messages_count + '</span>' +
                    '</div></a></li>'
                );
            }
        }
    }
    /** 为dom_build_chat_object_list()函数的构建之后绑定事件*/
    var dom_bind_chat_object_click_event = function () {
        $(".chat_object").click(function () {
            console.log("点击了聊天对象");
            console.log("点击了聊天对象：" + $(this).children("a").attr("id"));
            $("#page_right").css("display", "block");
            chat_object_click($(this).children("a").attr("id"));
        });


    }

    // **************************************************************************************************
    // 时间顺序
    // 初始化
    // 1. js数据获取
    // 2. 页面dom构建 (其实是dom更新，在原页面里写了不显示的静态dom) !!---> 需要html元素的类或者id 对应
    // 3. 绑定dom事件 !!---> 需要html元素的类或者id 对应   、、、、、事件绑定一定要等到有dom才能绑，不然绑了也没用，或者造一个不显示的dom也行
    //     3.1 点击聊天对象
    //     3.2 js数据获取
    //     3.3 页面dom更新

    // // 周期活动
    // 1. js数据更新
    // 2. 页面dom更新
    // **************************************************************************************************



    ////////////////////////////////////////////////////////////////初始化
    // 获取数据之，更新我自己的信息
    data.mine_info = get_mine_info();

    // 获取数据之，从缓存中获取聊天对象列表 
    data.chat_object_list = JSON.parse(localStorage.getItem("chat_object_list"));
    if (data.chat_object_list == null || data.chat_object_list == undefined) {
        data.chat_object_list = [];
        localStorage.setItem("chat_object_list", JSON.stringify(data.chat_object_list));

    }
    // 获取数据之，获取聊天对象列表
    // dom构建之，构建聊天对象列表(传入dom_build函数)
    data_get_chat_object_list(dom_build_chat_object_list, dom_bind_chat_object_click_event, chat_object_click);
    // 绑定dom事件之，绑定点击聊天对象事件（传入dom_bind函数）
    dom_bind_chat_object_click_event();
    // 更新缓存中的聊天对象列表
    localStorage.setItem("chat_object_list", JSON.stringify(data.chat_object_list));

    // 不点击第一个聊天对象了, 在data.chat_object_list消除未读消息数和未读消息，并且更新聊天记录
    // if (data.chat_object_list.length != 0) {
    //     chat_object_click(data.chat_object_list[0].user_name);
    // }

    // 绑定发送按钮点击事件（dom元素原本就有）
    $("#sendMessage").click(function () {
        chat_send_message(data.chat_object_now_name);
    });

    // 绑定按下回车键事件 （dom元素原本就有）
    $("#messageInput").keydown(function (event) {
        if (event.keyCode == 13) {
            chat_send_message(data.chat_object_now_name);
        }
    });
    $("#abortChat").click(function () {
        $.ajax({
            type: "POST",
            url: server_ip_port + "chat/refuse",
            async: false,
            data: JSON.stringify({ "inviterAccount": data.mine_info.user_name, "receiverAccount": data.chat_object_now_name }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                console.log("拒绝聊天成功");
                console.log(response);
                alert("拒绝聊天成功");

                // 将禁用状态存入缓存
                localStorage.setItem(data.chat_object_now_name + "_abort", "true");
                // 将发送邀请按钮禁用
                $("#sendInvite").attr("disabled", "disabled");
                $("#sendMessage").attr("disabled", "disabled");

            },
            error: function (response) {
                console.log("网络错误");
                alert("网络错误");
                console.log(response);
            }

        });

    });

    $("#resumeChat").click(function () {
        $.ajax({
            type: "POST",
            url: server_ip_port + "chat/accept",
            async: false,
            data: JSON.stringify({ "inviterAccount": data.mine_info.user_name, "receiverAccount": data.chat_object_now_name }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                console.log("接受聊天成功");
                console.log(response);
                alert("接受聊天成功");
                // 将禁用状态从缓存中删除
                localStorage.removeItem(data.chat_object_now_name + "_abort");
                // 将发送邀请按钮启用
                $("#sendInvite").removeAttr("disabled");
                $("#sendMessage").removeAttr("disabled");
            },
            error: function (response) {
                console.log("网络错误");
                alert("网络错误");
                console.log(response);
            }
        })
    })

    $("#sendInviteConfirmly").click(function () {
        send_invite();
        // 关闭模态框
        $("#sendInvitationModal").modal("hide");
    })


    ////////////////////////////////////////////////////////////////周期活动

    /**
     * 5.
     * 定时询问服务器是否有新消息
     */
    // 创建一个新的Web Worker
    var worker = new Worker("./js/aaa_chat_worker.js");

    // 在定时器中向Web Worker发送消息
    setInterval(function () {
        // console.log("向Web Worker发送消息,要求更新聊天对象列表");
        var req = {
            message: "start",
            mine_name: data.mine_info.user_name
        }
        worker.postMessage(req);
    }, 5000); // 5秒询问一次

    // 监听Web Worker的消息
    worker.onmessage = function (event) {
        // console.log("回到chat.js")
        // console.log("chat.js收到:");
        // console.log(event);
        if (event.data.message == "获取一次新的聊天列表成功") {
            console.log("chat.js最后获取聊天对象列表成功")
            console.log("event.data.data是")
            console.log(event.data.data)
            update_chat_object_list(event.data.data);
            console.log("进入chat.js的更新dom函数")
            dom_build_chat_object_list(data.chat_object_list);
            dom_bind_chat_object_click_event();
            localStorage.setItem("chat_object_list", JSON.stringify(data.chat_object_list));// 更新缓存中的聊天对象列表


        } else {
            console.log("chat.js最后获取聊天对象列表失败")
        }

    };
});
