$(document).ready(function () {
  $.ajaxSetup({
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  let movies = [
    {
      id: 1,
      imageUrl:
        "https://img9.doubanio.com/view/photo/l/public/p1784591124.webp",
      name: "AAA",
    },
    {
      id: 2,
      imageUrl:
        "https://img1.doubanio.com/view/photo/l/public/p2888303427.webp",
      name: "bbb",
    },
    {
      id: 3,
      imageUrl: "https://img2.doubanio.com/view/photo/l/public/p480747492.webp",
      name: "ccc",
    },
    {
      id: 4,
      imageUrl:
        "https://img1.doubanio.com/view/photo/l/public/p2557573348.webp",
      name: "ddd",
    },
    {
      id: 5,
      imageUrl:
        "https://img9.doubanio.com/view/photo/l/public/p2886792276.webp",
      name: "eee",
    },
    {
      id: 6,
      imageUrl:
        "https://img1.doubanio.com/view/photo/l/public/p2888303427.webp",
      name: "fff",
    },
    {
      id: 7,
      imageUrl:
        "https://img1.doubanio.com/view/photo/l/public/p2888303427.webp",
      name: "ggg",
    },
    {
      id: 8,
      imageUrl:
        "https://img1.doubanio.com/view/photo/l/public/p2888303427.webp",
      name: "hhh",
    },
  ];
  movies = [];
  let account = sessionStorage.getItem("account");
  let account2 = sessionStorage.getItem("account2");
  let user_info = {
    sex: "女",
    age: 30,
    register_time: "20230703",
    description: "  快乐星球",
  };
  //主函数
  get_per_info();
  initialize_users();
  initialize_movies();
  AddToMovieCards();
  //show_user_info(user_info);

  //1.用户昵称初始化
  function initialize_users() {
    $(".navbar .avatar").attr("src", sessionStorage.getItem("avatar"));
    $(".account").text(account2);
  }

  //2. 请求:发送聊天请求
  $("#popchat_resquest .submit").click(function () {
    let data = {
      sendingAccount: account,
      receiverAccount: account2,
      content: $("#popchat_resquest input").val(),
    };
    console.log("发送聊天请求：" + data);
    $.ajax({
      url: "http://192.168.159.207:8080/chat/request",
      type: "POST",
      data: JSON.stringify(data),
      success: function (res) {
        if (res.code == 200) {
          console.log("发送聊天返回的数据");
          console.log(res);
          alert("请求发送成功");
          $(".btn-close").click();
        }else{
          alert("已发送请求，请勿重复发送");
          $(".btn-close").click();
        }
      },
      error: function (err) {
        console.log("聊天请求发送失败: " + err);
      },
    });
  });

  //3. 请求:获取用户加入的电影列表并展示
  function initialize_movies() {
    let data = {
      account: account2,
    };
    console.log("页面用户账号:" + data);
    $.ajax({
      url: "http://192.168.159.207:8080/movie/self", // 后端提供的电影列表接口
      type: "POST",
      data: JSON.stringify(data),
      async: false,
      success: function (response) {
        // 请求成功的回调函数，处理返回的电影列表数据
        console.log(response);
        var re_movies = response.data;
        var temp_movies = [];

        // 存储电影 信息
        re_movies.forEach(function (movie) {
          var m = {
            id: movie.movieId,
            imageUrl: movie.poster,
            name: movie.movieName,
          };
          temp_movies.push(m);
        });
        movies = temp_movies;
        //添加到电影卡片中
        //AddToMovieCards();
      },
      error: function (error) {
        // 请求失败的回调函数，处理错误情况
        console.log("Error:", error);
      },
    });
  }

  //4. 添加电影卡片
  function AddToMovieCards() {
    var row = $("<div>").addClass("row");
    var count = 0;
    movies.forEach(function (movie) {
      count++;
      //构造一个电影卡片
      var card_img = $("<img>")
        .addClass("img-fluid")
        .attr("src", movie.imageUrl)
        .attr("alt", "Movie Image");
      var a_div_p = $("<p>").text(movie.name);
      var a_div = $("<div>")
        .addClass("mask d-flex align-items-center justify-content-center")
        .attr("style", "background-color: rgba(0, 0, 0, 0.619)")
        .append(a_div_p);
      var card_a = $("<a>").append(a_div);
      var card = $("<div>")
        .addClass("bg-image hover-overlay ripple card cursor-pointer")
        .attr("mid", movie.id)
        .append(card_img, card_a);
      var div = $("<div>").addClass("col-md-2").append(card);
      //添加到行里
      row.append(div);
      //6个为一行
      if (count % 6 == 0) {
        $(".movie_cards").append(row);
        row = $("<div>").addClass("row");
      }
    });
    //余数电影也要记得加进去，亲
    if (count % 6 !== 0) {
      $(".movie_cards").append(row);
    }
  }

  //5.获取用户信息
  function get_per_info() {
    let data = {
      account: account2,
    };
    //console.log("用户详细信息初始化: "+data);
    $.ajax({
      url: "http://192.168.159.207:8080/user/getUserInfo",
      type: "POST",
      data: JSON.stringify(data),
      success: function (res) {
        console.log("返回信息: ");
        console.log(res);
        if (res.data.avatar) {
          avatar_src = res.data.avatar.replace("localhost", "192.168.159.207");
        } else {
          avatar_src = "../../../static/img/R.jpg";
        }
        user_info = {
          sex: res.data.sex ? res.data.sex : "还未填写",
          age: res.data.age,
          register_time: res.data.registerTime,
          description: res.data.description ? res.data.description : "还未填写",
          avatar: avatar_src,
        };
        show_user_info(user_info);

        // $(".sex .alterable").text(res.data.sex);
        // $(".age .alterable").text(res.data.age);
        // $(".register_time .alterable").text(res.data.register_time);
        // $(".description p").text(res.data.description);
      },
      error: function (err) {
        console.log("获取用户详细信息的请求出错" + err);
      },
    });
  }

  function show_user_info(info) {
    $(".sex .alterable").text(info.sex);
    $(".age .alterable").text(info.age);
    $(".register_time .alterable").text(info.register_time);
    $(".description p").text(info.description);
    $(".uinfo img").attr("src", info.avatar);
  }

  //6.电影点击函数
  $(".movie_cards .card").click(function () {
    //获取电影id
    movie_id = $(this).attr("mid");
    //存电影id
    sessionStorage.setItem("movie_id", movie_id);
    console.log("被点击的电影的id:" + movie_id);
    //跳转页面
    window.location.href = "movie.html";
  });

  //7. 返回上一个页面
  $(".goback").click(function () {
    window.history.back();
  });
});
