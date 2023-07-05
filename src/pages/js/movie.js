$(document).ready(function () {
  $.ajaxSetup({
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  //变量初始化
  let movie_id = sessionStorage.getItem("movie_id");
  let account = sessionStorage.getItem("account");
  console.log("用户账号和电影id:" + movie_id + " " + account);

  //用户列表(测试数据)
  let user_list = [
    {
      account: "xiaoxiong",
      avatar:
        "https://img0.baidu.com/it/u=779040798,3900256075&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1688490000&t=38ec55c143e6f84df85131de580f27b3",
    },
    {
      account: "xiaowang",
      avatar:
        "https://img1.baidu.com/it/u=1009672910,2505626862&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
    },
    {
      account: "Alice",
      avatar:
        "https://img1.baidu.com/it/u=819167460,991150941&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
    },
    {
      account: "Mike",
      avatar:
        "https://img2.baidu.com/it/u=1199828651,3513066897&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400",
    },
    {
      account: "John",
      avatar:
        "https://img1.baidu.com/it/u=1579178563,1511000399&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
    },
    {
      account: "Sara",
      avatar:
        "https://img1.baidu.com/it/u=305706708,1807553914&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
    },
    {
      account: "Jane",
      avatar:
        "https://img0.baidu.com/it/u=2544638661,1263898139&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=498",
    },
    {
      account: "xiaowang2",
      avatar:
        "https://img1.baidu.com/it/u=1009672910,2505626862&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
    },
    {
      account: "Alice2",
      avatar:
        "https://img1.baidu.com/it/u=819167460,991150941&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
    },
    {
      account: "Mike2",
      avatar:
        "https://img2.baidu.com/it/u=1199828651,3513066897&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400",
    },
    {
      account: "John2",
      avatar:
        "https://img1.baidu.com/it/u=1579178563,1511000399&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
    },
    {
      account: "Sara2",
      avatar:
        "https://img1.baidu.com/it/u=305706708,1807553914&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
    },
    {
      account: "Jane2",
      avatar:
        "https://img0.baidu.com/it/u=2544638661,1263898139&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=498",
    },
  ];
  user_list = [];

  initialize_users();
  if_InMovie();
  getMovie_userList();
  addUsers();
  getMovieInfo();
  

  //其它函数
  //1. 请求：获取电影简介
  function getMovieInfo() {
    $.ajax({
      url: "http://192.168.159.207:8080/movie/info?"+"movie_id=" + movie_id,
      type: "GET",
      success: function (res) {
        console.log("正在获取电影信息:");
        console.log(res);
        //赋值操作
        $("#director .alterable").text(res.data.director);
        $("#star .alterable").text(res.data.star);
        $("#category .alterable").text(res.data.category);
        $("#srcLocation .alterable").text(res.data.srcLocation);
        $("#language .alterable").text(res.data.language);
        $("#releasedTime .alterable").text(res.data.releasedTime);
        $("#summary .alterable").text(res.data.summary);
        $("#duration .alterable").text(res.data.duration);
        $(".mintro img").attr("src",res.data.poster);
        $("#movie_title").text(res.data.movieName);

        let score = res.data.score;
        if(score == 0){
          $("#score .alterable").text("暂无评分");
        }else{
          $("#score .alterable").text(score);
        }

        if (res.data.summary.length <= 240) {
          $("#summary p").text(res.data.summary);
        } else {
          let string = res.data.summary[239] + "...";
          $("#summary p").text(string);
        }
        $("img-wraper img").attr("src", res.data.movieName);
      },
      error: function (err) {
        console.log("获取电影简介的请求出错" + err);
      },
    });
  }
 
  //2. 请求：获取该电影的想看列表(与用户相距5公里内)
  function getMovie_userList() {
    let data = {
      "account": account,
      "movie_id": movie_id
    };

    $.ajax({
      //url: "http://127.0.0.1:8080/test03",
      async:false,
      url:"http://192.168.159.207:8080/user/within-five-kilometers",
      type: "POST",
      data: data,
      headers:{
        "content-type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        console.log("后端返回的用户列表:");
        console.log(res);
        //处理返回信息的格式
        let temp_list = res;
        for (let i = 0; i < temp_list.length; i++) {
          let user = {
            account: temp_list[i].account,
            avatar: temp_list[i].avatar,
          };
          user_list.push(user);
        }

        console.log("整理好的用户列表：");
        console.log(user_list);
        //把元素添加到html中,放在请求之外执行
      },
      error: function (res) {
        console.log("获取想看列表用户信息出错了");
        console.log(res);
      },
    });
  }

   //3. 承接上个函数将用户信息添加到页面中进行展示
   function addUsers() {
    if(user_list.length == 0){
      $(".mtip div").text("暂无想看该部电影的用户");
    }
    let row = $("<div>").addClass(
      "row justify-content-center align-items-center"
    );
    let len = user_list.length;
    for (let i = 0; i < len; i++) {
      if (i != 0 && i % 10 == 0) {
        $(".user_list").append(row);
        row = $("<div>").addClass(
          "row justify-content-center align-items-center"
        );
      }
      let img = $("<img>")
        .attr("alt", "avatar")
        .attr("src", user_list[i].avatar);
      let user = $("<div>")
        .addClass("col-md-1")
        .attr("uid", user_list[i].account)
        .append(img);
      row.append(user);
    }
    if (len % 10 != 0) {
      $(".user_list").append(row);
    }
  }

  //4. 请求：判断登录用户是否属于当前电影的想看列表
  function if_InMovie() {
    console.log("在判断用户是否在想看列表中:");
    $.ajax({
      url: "http://192.168.159.207:8080/movie/in?"+ "movie_id=" +movie_id+"&account="+account,
      type: "GET",
      async:false,
      success: function (res) {
        console.log(res);
        if (res.data = true) {
          $("#addtolist").hide();
          $("#outoflist").show();
        }
      },
      error: function (res) {
        console.log("判断用户是否在列表中出错啦");
        console.log(res);
      },
    });
  }

  //5.请求（addtolist的点击函数）：加入想看列表
  $("#addtolist button").click(function () {
    let data = {
      movieId: movie_id,
      account: account,
    };
    console.log("正在加入用户列表：");
    console.log(data);

    $.ajax({
      url: "http://192.168.159.207:8080/group",
      type: "POST",
      data: JSON.stringify(data),
      success: function (res) {
        console.log(res);
        if(res.code == 200){
          alert("加入成功！");
          $("#addtolist").hide();
          $("#outoflist").show();
        }else{
          alert("加入失败");
        }
      },
      error: function (res) {
        console.log("加入列表出错啦");
        console.log(res);
        alert("加入失败！");
      },
    });
  });

  //6.请求（outoflist的点击函数）：退出想看列表
  $("#outoflist button").click(function () {
    let data = {
      movie_id: movie_id,
      account: account,
    };
    console.log("正在退出用户列表：");
    console.log(data);

    $.ajax({
      url: "http://192.168.159.207:8080/group?movieId="+ movie_id + "&account=" + account,
      type: "DELETE",
      data: JSON.stringify(data),
      success: function (res) {
        console.log(res);
        alert("退出成功！");
        $("#outoflist").hide();
        $("#addtolist").show();
      },
      error: function (res) {
        console.log("退出列表出错啦");
        console.log(res);
        alert("加入失败！");
      },
    });
  });

  //7.点击：用户头像，跳转到用户个人详情页
  $(".user_list .row div").click(function () {
    console.log("来点反应");
    let account2 = $(this).attr("uid");
    console.log("能否拿到用户B账号：" + account2);
    sessionStorage.setItem("account2", account2);
    console.log("用户b的账号:");
    console.log(account2);
    window.location.href = "users.html";
  });

  //8. 返回上一个页面
  $(".goback").click(function () {
    window.history.back();
  });

  //9.头像初始化
  function initialize_users() {
    let avatar = sessionStorage.getItem("avatar");
    console.log(avatar);
    if (avatar) {
      console.log("进入了头像的更新");
      $(".avatar").attr("src", avatar);
    } else {
      console.log("avatar为空，使用默认头像");
    }
  }
});
