function getTimeNow() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();

    // 将月份、日期、小时、分钟、秒数转换为两位数格式
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;

    // 返回格式化后的时间字符串
    return (
        year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second
    );
}

function get_mine_info() {
    return {
        user_name: "用户A", // TODO: 从sessionStorage中获取
        user_avatar:
            "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp",
    };
}
var getAvatar = function (user_name) {
    // TODO: 还是需要一个web worker开线程，不然会阻塞

    // $.ajax({
    //     url: server_ip_port + "user/getUserInfo",
    //     type: "POST",
    //     data: JSON.stringify({
    //         "account": user_name,
    //     }),
    //     contentType: "application/json;charset=utf-8",
    //     dataType: "json",
    //     success: function (data) {
    //         console.log("获取头像成功");
    //         console.log(data);
    //         return data.avatar;
    //     },
    //     error: function (data) {
    //         console.log("获取头像失败");
    //     },
    // });

    if (user_name == "我自己")
        // TODO: 根据用户名获取头像
        return "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp";
    if (user_name == "用户A")
        return "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp";
    if (user_name == "用户B")
        return "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp";
    else
        return "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp";
};


function formatTime(timeString) {
    const now = new Date();
    const time = new Date(timeString);
    const diff = (now - time) / 1000; // 时间差，单位为秒

    if (diff < 60 * 60) { // 一小时内
        const minutes = Math.floor(diff / 60);
        return `${minutes}分钟前`;
    } else if (diff < 60 * 60 * 24) { // 一天内
        const hours = Math.floor(diff / (60 * 60));
        return `${hours}小时前`;
    } else { // 超过一天
        const year = time.getFullYear();
        const month = time.getMonth() + 1;
        const day = time.getDate();
        return `${year}-${month}-${day}`;
    }
}