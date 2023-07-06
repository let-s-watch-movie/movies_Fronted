$(document).ready(function () {
  $.ajaxSetup({
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  //1.窗口切换函数
  $(".login .msg").click(function () {
    $(".login").hide();
    $(".signup").show();
  });
  $(".signup .msg").click(function () {
    $(".signup").hide();
    $(".login").show();
  });

  //2.登录函数,要保存用户账号、图像，还要传经纬度
  $(".login .btn").click(function () {
    //1. 获取输入框的值,以及用户经纬度，构造请求数据
    let account = $(".login .account").val();
    let password = $(".login .key").val();

    //2.获取位置，它是个异步函数，它在尝试执行的时候，后面的代码会继续执行，所以后面所有都要放在函数里
    let longitude = 0.0;
    let latitude = 0.0;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        let data = {
          account: account,
          password: password,
          longitude: longitude,
          latitude: latitude,
        };
<<<<<<< HEAD
        console.log("打印地理位置")

=======
        console.log("位置：");
>>>>>>> 3e514cee25bf2aaad0a02706ba625fc894c45f42
        console.log(data);
        //测试用数据
        // sessionStorage.setItem("account", account);
        // sessionStorage.setItem("avatar", "https://img1.baidu.com/it/u=4000577006,3068272835&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500");
        // window.location.href = "home.html";

        // 2.请求
        $.ajax({
          //url:"http://127.0.0.1:8080/test",
          url: "http://192.168.159.207:8080/user/login",
          type: "POST",
          data: JSON.stringify(data),
          success: function (res) {
            console.log("后端返回数据：");
            console.log(res);
            if (res.code == 200) {
              alert("登录成功");
              sessionStorage.setItem("account", account);
              //sessionStorage.setItem("avatar",res.data.avatar);
              window.location.href = "home.html";
            }
            else {
              alert("登录失败，请检查账号和密码是否正确");
            }
          },
          error: function (err) {
            console.log("登录部分出错，以下是错误信息");
            console.log(err);
            alert("登录失败，请检查账号和密码是否正确");
          }
        })
      });
    } else {
      alert("浏览器不支持地理位置获取。");
    }
  });

  //3.注册函数
  $(".signup .btn").click(function () {
    //1. 获取输入框的值
    let account = $(".signup .account").val();
    let password1 = $(".signup .password1").val();
    let password2 = $(".signup .password2").val();
    //2. 判断2次输入 的密码是否相同
    if (password1 != password2) {
      alert("2次密码不一致！");
      return;
    }
    //3. 发请求
    let data = {
      account: account,
      password: password1
    };
    console.log("注册函数部分");
    console.log(data);

    //测试用数据
    // alert("注册成功，请使用新账号登录");
    // $(".signup").hide();
    // $(".login").show();

    $.ajax({
      //url:"http://127.0.0.1:8080/test",
      url: "http://192.168.159.207:8080/user/register",
      type: "POST",
      data: JSON.stringify(data),
      success: function (res) {
        console.log(res);
        if (res.code == 200) {
          alert("注册成功，请使用新账号登录");
          $(".signup").hide();
          $(".login").show();
        }
        else {
          alert("账号已重复，请输入新账号");
        }
      },
      error: function (err) {
        console.log("注册部分出错，以下是错误信息");
        console.log(err);
      }
    })
  });

  //4. 获取用户经纬度函数
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        return [latitude, longitude];
      });
    } else {
      alert("浏览器不支持地理位置获取。");
    }
  }
});
