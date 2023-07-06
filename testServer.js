const http = require("http");

const server = http.createServer((req, res) => {
    console.log(req.url);
    console.log(req.method);
    if (req.url === "/chat/queryMessage") {
        const data = [
            {
                user_name: "用户A",
                user_avatar:
                    "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp",

                latest_message: "我发来3条消息", // TODO: 如果消息过长，只显示前面一部分，后面用省略号代替
                latest_message_time: "刚刚", // TODO: 日期变换一下，显示为“刚刚”、“几分钟前”、“几小时前”、“几天前”，超过7天显示日期，然后考虑啥时候更新，比如每次打开聊天页面时更新一下

                is_online: true, // TODO: 判断，如果用户在线，显示绿色，否则显示灰色

                new_messages: [
                    // TODO: 新消息，直接补充到历史聊天记录后面
                    {
                        message: "我发来3条消息, 这是第1条",
                        time: "2023/07/03 11:37:26",
                    },
                    {
                        message: "我发来3条消息, 这是第2条",
                        time: "2023/07/03 11:37:26",
                    },
                    {
                        message: "我发来3条消息, 这是第3条",
                        time: "2023/07/03 11:37:26",
                    },
                ],
                new_messages_count: 3, // TODO: 未读消息数，如过大于0，显示在头像右上角，否则不显示
            },
            {
                user_name: "用户B",
                user_avatar:
                    "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp",

                latest_message: "我发来1条消息",
                latest_message_time: "昨天",

                is_online: false,
                new_messages: [
                    // TODO: 新消息，直接补充到历史聊天记录后面
                    {
                        message: "我发来3条消息, 这是第1条",
                        time: "2023/07/03 11:37:26",
                    },
                    {
                        message: "我发来3条消息, 这是第2条",
                        time: "2023/07/03 11:37:26",
                    },
                    {
                        message: "我发来3条消息, 这是第3条",
                        time: "2023/07/03 11:37:26",
                    },
                ],

                new_messages_count: 1,
            },
        ];
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*"); // 设置CORS头
        res.statusCode = 200; // 设置HTTP响应状态码为200
        res.statusMessage = "OK"; // 设置HTTP响应状态消息为OK
        res.end(JSON.stringify(data));
    } else {
        res.statusCode = 404; // 设置HTTP响应状态码为404
        res.statusMessage = "Not Found"; // 设置HTTP响应状态消息为Not Found
        res.end();
    }
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
