var server_ip_port = "http://192.168.159.207:8080/"


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
        user_name: sessionStorage.getItem("account"),
        user_avatar: sessionStorage.getItem("avatar")
    };
}

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


function get_movie_info_with_id(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', server_ip_port + 'movie/info?movie_id=' + id, false);
    xhr.send();
    if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        console.log('获取电影信息');
        console.log(response);
        return response.data;
    } else {
        console.error('获取电影信息失败');
        console.log(xhr);
        return undefined;
    }
}