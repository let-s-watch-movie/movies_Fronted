var server_ip_port = "http://192.168.159.207:8080/"
// var server_ip_port = "http://localhost:8080/"


$(document).ready(function () {
    console.log("*************************************chat_new_chat.js ready!*******************************************************");

    /**
     * 1. data 定义阶段与存储区
     * // 本页面与chat页面基本一致，就代码内容就不改了，只是数据不同
     */
    var data = {
        mine_info: {
            user_name: "用户A",
            user_avatar:
                "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp",
        },

        handle_object_now_name: "用户B",
        handle_object_list: [
            // {
            //     "chatId": 8,
            //     "inviterAccount": "用户B",
            //     "receiverAccount": "用户A",
            //     "status": 1,
            //     "inviteTime": "2023-07-04T17:18:48",
            //     "content": ""
            // },
            // {
            //     "chatId": 8,
            //     "inviterAccount": "用户B",
            //     "receiverAccount": "用户A",
            //     "status": 1,
            //     "inviteTime": "2023-07-04T17:18:48",
            //     "content": ""
            // },
        ],



    };
    /**
     * 2. method 定义阶段与存储区  存储区，就先当一个堆函数的地方，“垃圾堆”
     */
    //




    /// 更新聊天列表的状态
    // 输入：一个聊天对象的名字，
    // 处理：最新的消息，最新消息的时间，是否在线，未读消息数
    // 输出：更新聊天列表的页面

    /// TODO: 更新聊天对象的内容 更新所有的聊天对象的内容
    var update_chat_object_content = function (chat_object_name) {
        data.chat_object_new_contents.object_name = chat_object_name;
        data.chat_object_new_contents.object_avatar = getAvatar(chat_object_name);

        // TODO: 更新聊天对象的内容，根据聊天对象的名字，从服务器获取新消息
        data.chat_object_new_contents.new_messages = [
            {
                message: "获取到的新消息1",
                time: "2023/07/03 11:37:26",
            },
            {
                message: "获取到的新消息2",
                time: "2023/07/03 11:37:26",
            },
            {
                message: "获取到的新消息3",
                time: "2023/07/03 11:37:26",
            },
        ];

        return data.chat_object_new_contents;
    };

    /// 根据聊天对象的名字，获取聊天对象新消息的内容
    var get_chat_object_new_contents_by_name = function (chat_object_name) {
        for (let i = 0; i < data.chat_object_list.length; i++) {
            if (data.chat_object_list[i].user_name == chat_object_name) {
                return data.chat_object_list[i].new_messages;
            }
        }
    }
    var clear_chat_object_new_contents_by_name = function (chat_object_name) {
        for (let i = 0; i < data.chat_object_list.length; i++) {
            if (data.chat_object_list[i].user_name == chat_object_name) {
                data.chat_object_list[i].new_messages = [];
                data.chat_object_list[i].new_messages_count = 0;
                return;
            }
        }
    }


    /// 关于点开聊天对象的处理
    var handle_object_click = function (handle_object_name) {

        let updata_dom_id = "#" + data.handle_object_now_name;
        $(updata_dom_id).removeClass("active");

        data.handle_object_now_name = handle_object_name; // 更新当前聊天对象的名字
        updata_dom_id = "#" + data.handle_object_now_name;
        $(updata_dom_id).addClass("active");

        if ($("#page_right").css("display") == "none") {
            $("#page_right").css("display", "block");
        }
        $("#request_avatar").attr("src", getAvatar(handle_object_name));
        for (let i = 0; i < data.handle_object_list.length; i++) {
            if (data.handle_object_list[i].inviterAccount == handle_object_name) {
                $("#request_content").text(data.handle_object_list[i].content);
                $("#request_time").text(data.handle_object_list[i].inviteTime);
                break;
            }
        }



    };


    /**
     * 功能就是，加入新的聊天对象到聊天列表中
     */
    var update_handle_object_list = function (object_list) {
        console.log(object_list)
        for (var object of object_list) { // in 与 of 的区别: in是索引，of是值
            // 就是如果聊天对象列表中没有这个对象，就加入这个对象
            if (data.handle_object_list.indexOf(object) == -1) {
                data.handle_object_list.push(object);
                //将时间的T去掉
                object.inviteTime = object.inviteTime.replace("T", " ");
            }
        }

    }




    var data_get_handle_object_list = function (build_dom) {
        $.ajax({
            type: "POST",
            async: false,
            url: server_ip_port + "chat/queryRequestByReceiver",
            data: JSON.stringify({
                receiverAccount: data.mine_info.user_name,
            }),
            contentType: "application/json", // 指定发送到服务器的数据是json格式
            dataType: "json", // 指定返回的数据类型，设置为json
            success: function (response) {
                console.log("成功获取新聊天请求对象列表");
                console.log(response.data);


                let object_list = response.data;

                if (object_list == undefined) {
                    console.log("新聊天请求对象列表为空");
                    return;
                }

                if (object_list.length != 0) {
                    update_handle_object_list(object_list); /// !!!必须在这里先 更新data.handle_object_list聊天对象列表， 不然之后绑定点击出错
                }

                // 构建dom
                if (build_dom == undefined) {
                    console.log("build_dom is undefined");
                    return
                }
                console.log(data.handle_object_list);
                if (data.handle_object_list != null || data.handle_object_list.length != 0) {
                    build_dom(data.handle_object_list);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("获取新聊天请求列表失败");
                console.log(xhr);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }
    var dom_build_handle_object_list = function (object_list) { // 这是基于data.chat_object_list重新完全构建dom
        $("#handle_object_list").empty();
        for (let object of object_list) {
            let status_html = '<span class="badge bg-primary rounded-pill float-end">新</span>';
            switch (object.status) {
                case 0:
                    status_html = '<span class="badge bg-primary rounded-pill float-end">新</span>';
                    break;
                case 1:
                    status_html = '<span class="badge bg-success rounded-pill float-end">已同意</span>';
                    break;
                case 2:
                    status_html = '<span class="badge bg-danger rounded-pill float-end">已拒绝</span>';
                    break;
            }


            $("#handle_object_list").append(
                '<li class="handle_object p-2 border-bottom">' +
                '<a class="nav-link d-flex justify-content-between" id="' + object.inviterAccount + '"">' +
                '<div class="d-flex flex-row">' +
                '<div><img src="' + 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp' + '" class="d-flex align-self-center me-3" width="60" />' +
                '</div>' +
                '<div class="pt-1">' +
                '<p class="fw-bold mb-0">' + object.inviterAccount + '</p>' +
                '<p class="small text-muted">' + object.content + '</p>' +
                '</div>' +
                '</div>' +
                '<div class="pt-1">' +
                '<p class="small text-muted mb-1">' + formatTime(object.inviteTime) + '</p>' +
                status_html +
                "</div></a></li>"

            );
        }
    }
    var dom_bind_handle_object_click_event = function () {
        $(".handle_object").click(function () {
            console.log("点击了聊天请求对象");
            console.log("点击了聊天请求对象：" + $(this).children("a").attr("id"));
            handle_object_click($(this).children("a").attr("id"));
        });
    }

    function handle_reject_click() {
        $.ajax({
            type: "POST",
            async: false,
            url: server_ip_port + "chat/refuse",
            data: JSON.stringify({
                receiverAccount: data.mine_info.user_name,
                inviterAccount: data.handle_object_now_name,
            }),
            contentType: "application/json", // 指定发送到服务器的数据是json格式
            dataType: "json", // 指定返回的数据类型，设置为json
            success: function (response) {
                console.log(response);
                alert("拒绝成功");
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("出现了错误");
                console.log(xhr);
                console.log(textStatus);
                console.log(errorThrown);
            }
        })
    }
    function hand_agree_click() {
        $.ajax({
            type: "POST",
            async: false,
            url: server_ip_port + "chat/accept",
            data: JSON.stringify({
                receiverAccount: data.mine_info.user_name,
                inviterAccount: data.handle_object_now_name,
            }),
            contentType: "application/json", // 指定发送到服务器的数据是json格式
            dataType: "json", // 指定返回的数据类型，设置为json
            success: function (response) {
                console.log(response);
                alert("同意成功");
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("出现了错误");
                console.log(xhr);
                console.log(textStatus);
                console.log(errorThrown);
            }
        })

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

    // 从缓存中获取历史新请求列表 //  TODO: 先不写
    // data.chat_object_list = localStorage.getItem("chat_object_list");
    // if (data.chat_object_list == null) {
    //     data.chat_object_list = [];
    // }

    // 获取数据之，获取新聊天请求对象列表
    // dom构建之，构建新聊天请求对象列表(传入dom_build函数)
    data_get_handle_object_list(dom_build_handle_object_list);
    // 绑定dom事件之，绑定点击聊天请求对象事件
    dom_bind_handle_object_click_event();


    // // 存储新聊天请求列表表到缓存中 // TODO: 先不写
    // localStorage.setItem("chat_object_list", data.chat_object_list);

    // 绑定同意按钮点击事件（dom元素原本就有）
    $("#agree_click").click(function () {
        hand_agree_click();
    });

    // 绑定拒绝事件 （dom元素原本就有）
    $("#reject_click").click(function () {
        handle_reject_click();
    });


    ////////////////////////////////////////////////////////////////周期活动

    /**
     * 5.
     * 定时询问服务器是否有新消息
     */
    // // 创建一个新的Web Worker
    // var worker = new Worker("./js/aaa_chat_worker.js");

    // // 在定时器中向Web Worker发送消息
    // setInterval(function () {
    //     console.log("向Web Worker发送消息,要求更新聊天对象列表");
    //     var req = {
    //         message: "start",
    //         mine_name: data.mine_info.user_name
    //     }
    //     worker.postMessage(req);
    // }, 5000); // 5秒询问一次

    // // 监听Web Worker的消息
    // worker.onmessage = function (event) {
    //     console.log("回到chat.js")
    //     console.log("chat.js收到:");
    //     console.log(event);
    //     // TODO:这里有啥
    //     if (event.data.message == "获取一次新的聊天列表成功") {
    //         console.log("chat.js最后获取聊天对象列表成功")
    //         if (data.chat_object_list == null || data.chat_object_list == undefined) {
    //             data.chat_object_list = []
    //         }

    //         console.log("进入chat.js的更新dom函数")
    //         update_chat_object_list(event.data.data);
    //         dom_build_chat_object_list(data.chat_object_list);

    //     } else {
    //         console.log("chat.js最后获取聊天对象列表失败")
    //     }

    // };
});
