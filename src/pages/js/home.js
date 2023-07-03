$(document).ready(function () {
  //页面全局变量
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
  //主函数
  //initialize();
  initialize_users();
  AddToLunBo();
  AddToMovieCards();

  //其它函数
  //1. 页面初始化函数
  //1.1 电影初始化
  function initialize_movies() {
    $.ajax({
      url: "/api/movies", // 后端提供的电影列表接口
      type: "POST",
      success: function (response) {
        // 请求成功的回调函数，处理返回的电影列表数据
        var re_movies = response.data;
        var temp_movies = [];

        // 存储电影 信息
        re_movies.forEach(function (movie) {
          var m = {
            id: movie.movie_id,
            imageUrl: movie.pster,
            name: movie.movie_name,
          };
          temp_movies.push(m);
        });
        movies = temp_movies;
        //添加到电影卡片中
        AddToMovieCards();
        //添加到轮播图中
        AddToLunBo();
      },
      error: function (error) {
        // 请求失败的回调函数，处理错误情况
        console.log("Error:", error);
      },
    });
  }
  //1.2 用户头像初始化
  function initialize_users(){
    let avatar = sessionStorage.getItem('avatar');
    console.log(avatar);
    if(avatar)
    {
      console.log("进入了头像的更新");
      $(".avatar").attr("src",avatar);
    }
    else{
      console.log("avatar为空，使用默认头像");
    }
  }

  //2. 添加电影卡片
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

  //3. 添加轮播图中的电影
  function AddToLunBo() {
    for (var i = 0; i < 5; i++) {
      let img = $("<img>").attr("src", movies[i].imageUrl);
      let div = $("<div>")
        .addClass("swiper-slide cursor-pointer")
        .attr("mid", movies[i].id)
        .append(img);
      $(".swiper-wrapper").append(div);
    }
  }

  //4.电影点击函数
  $(".card,.swiper-slide").click(function () {
    //获取电影id
    movie_id = $(this).attr("mid");
    //存电影id
    sessionStorage.setItem("movie_id", movie_id);
    console.log(movie_id);
    //跳转页面
    window.location.href = "movie.html";
  });

  //轮播图
  var mySwiper = new Swiper(".swiper", {
    autoplay: {
      delay: 2000,
      stopOnLastSlide: false,
      disableOnInteraction: true,
      },
    loop: true, // 循环模式选项
    effect: "coverflow",
    grabCursor:true,
    slidesPerView: 3,
    centeredSlides: true,
    spaceBetween: "10%",
    coverflowEffect: {
      rotate: 5,
      stretch: 5,
      depth: 30,
      modifier: 4,
      slideShadows: true,
    },
  });
});
