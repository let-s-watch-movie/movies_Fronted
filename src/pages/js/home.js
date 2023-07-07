$(document).ready(function () {
  $.ajaxSetup({
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  //页面全局变量
  let movies = [];
  sessionStorage.setItem("avatar","../../../static/img/R.jpg");
  // let movies = [
  //   {
  //     id: 1,
  //     imageUrl:
  //       "https://img9.doubanio.com/view/photo/l/public/p1784591124.webp",
  //     name: "AAA",
  //   },
  //   {
  //     id: 2,
  //     imageUrl:
  //       "https://img1.doubanio.com/view/photo/l/public/p2888303427.webp",
  //     name: "bbb",
  //   },
  //   {
  //     id: 3,
  //     imageUrl: "https://img2.doubanio.com/view/photo/l/public/p480747492.webp",
  //     name: "ccc",
  //   },
  //   {
  //     id: 4,
  //     imageUrl:
  //       "https://img1.doubanio.com/view/photo/l/public/p2557573348.webp",
  //     name: "ddd",
  //   },
  //   {
  //     id: 5,
  //     imageUrl:
  //       "https://img9.doubanio.com/view/photo/l/public/p2886792276.webp",
  //     name: "eee",
  //   },
  //   {
  //     id: 6,
  //     imageUrl:
  //       "https://img1.doubanio.com/view/photo/l/public/p2888303427.webp",
  //     name: "fff",
  //   },
  //   {
  //     id: 7,
  //     imageUrl:
  //       "https://img1.doubanio.com/view/photo/l/public/p2888303427.webp",
  //     name: "ggg",
  //   },
  //   {
  //     id: 8,
  //     imageUrl:
  //       "https://img1.doubanio.com/view/photo/l/public/p2888303427.webp",
  //     name: "hhh",
  //   },
  // ];

  // AddToLunBo();
  // AddToMovieCards();
  initialize_movies();
  AddToMovieCards();
  AddToLunBo();
  get_per_info();
  initialize_users();

  //其它函数
  //页面初始化函数
  //1.1 电影初始化
  function initialize_movies() {
    $.ajax({
      //url: "http://127.0.0.1:8080/test02", // 后端提供的电影列表接口
      url:"http://192.168.159.207:8080/movie/list",
      type: "GET",
      async:false,
      success: function (res) {
        // 请求成功的回调函数，处理返回的电影列表数据
        console.log("电影信息：");
        console.log(res);
        let re_movies = res.data;
        let temp_movies = [];
        let m;

        // 存储电影 信息
        re_movies.forEach(function (movie) {
          m = {
            id: movie.movieId,
            imageUrl: movie.poster,
            name: movie.movieName,
          };

          temp_movies.push(m);
        });
        movies = temp_movies;
      },
      error: function (error) {
        // 请求失败的回调函数，处理错误情况
        console.log("Error:", error);
      },
    });
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
    //余数电影也要记得加进去
    if (count % 6 !== 0) {
      $(".movie_cards").append(row);
    }
  }

  //3. 添加轮播图中的电影
  function AddToLunBo() {
    $(".swiper-wrapper").empty();
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
    console.log("movie_id:"+movie_id);
    // console.log("movie_id:"+sessionStorage.getItem("movie_id"));
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
    grabCursor: true,
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
