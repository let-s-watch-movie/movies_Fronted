$(document).ready(function(){
  $.ajaxSetup({
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
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
  movies = [];
  let account = sessionStorage.getItem("account");
  let new_avatar = "";
  let user_info = {
    sex:"女",
    age:30,
    register_time:"20230703",
    description:"  快乐星球"
  };
  //主函数
  initialize_users();
  show_user_info(user_info);
  initialize_movies();
  AddToMovieCards();
  // $(".sex .alterable").text("男");
  // $(".age .alterable").text("20");
  // $(".register_time .alterable").text("20230414");
  // $(".description p").text("今天是13月81");
  //其它函数

  //1.用户头像和昵称初始化
  function initialize_users(){
    let avatar = sessionStorage.getItem('avatar');
    console.log(avatar);
    if(avatar)
    {
      console.log("进入了头像的更新");
      $(".avatar").attr("src",avatar);
      $(".account").text(account);
    }
    else{
      console.log("avatar为空，使用默认头像");
    }
  }

  //2. 请求:获取用户加入的电影列表并展示
  function initialize_movies() {

    let data = {
      account:account
    };
    console.log("用户账号:"+data);
    $.ajax({
      url: "http://127.0.0.1:8080/test02", // 后端提供的电影列表接口
      type: "POST",
      data: JSON.stringify(data),
      async:false,
      success: function (response) {
        // 请求成功的回调函数，处理返回的电影列表数据
        var re_movies = response.data;
        var temp_movies = [];

        // 存储电影 信息
        re_movies.forEach(function (movie) {
          var m = {
            id: movie.movie_id,
            imageUrl: movie.poster,
            name: movie.movie_name,
          };
          temp_movies.push(m);
        });
        movies = temp_movies;
        //添加到电影卡片中,放在外面执行
        //AddToMovieCards();
      },
      error: function (error) {
        // 请求失败的回调函数，处理错误情况
        console.log("Error:", error);
      },
    });
  }

  //3. 添加电影卡片
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
    if (count % 6 !== 0) {
      $(".movie_cards").append(row);
    }
  }

  //4.电影点击函数
  $(".movie_cards .card").click(function () {
    //获取电影id
    movie_id = $(this).attr("mid");
    //存电影id
    sessionStorage.setItem("movie_id", movie_id);
    console.log("被点击的电影的id:"+movie_id);
    //跳转页面
    window.location.href = "movie.html";
  });

  //5. 请求:个人信息填充
  function get_per_info(){
    let data = {
      account:account
    }
    console.log("用户详细信息初始化: "+data);
    $.ajax({
      url:"http://192.168.159.207:8080/user/getUserInfo",
      type:"POST",
      data: JSON.stringify(data),
      success:function(res){
        console.log("返回信息: " + res);
        //赋值操作
        user_info = {
          sex:res.data.sex,
          age:res.data.age,
          register_time:res.data.register_time,
          description:res.data.description
        };
        show_user_info(user_info);

        // $(".sex .alterable").text(res.data.sex);
        // $(".age .alterable").text(res.data.age);
        // $(".register_time .alterable").text(res.data.register_time);
        // $(".description p").text(res.data.description);
      },
      error:function(err){
        console.log("获取用户详细信息的请求出错"+err);
      }
    })
  }

  function show_user_info(info){
    $(".sex .alterable").text(info.sex);
    $(".age .alterable").text(info.age);
    $(".register_time .alterable").text(info.register_time);
    $(".description p").text(info.description);
  }

  //6. 用户详细信息修改
  //6.0 输入框初始值填充
  $(edit_info_btn).click(function(){
    $("#avatar-preview img" ).attr("src",sessionStorage.getItem('avatar'));
    $("#edit_info .name input").val(account);
    $("#edit_info #gender-select").val(user_info.sex);
    $("#edit_info .age input").val(user_info.age);
    $("#edit_info textarea").val(user_info.description);

  })
  //6.1 头像上传
  $("#avatar-upload input").change(function(){
    var file = $(this)[0].files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      new_avatar = e.target.result;
      $('#avatar-preview img').attr('src', new_avatar);
    }
    reader.readAsDataURL(file);
  })

  //6.2信息的提交
  $("#Form").submit(function(e){

    e.preventDefault(); // 阻止表单默认提交行为

    var form = $(this);
    var formData = new FormData(this);

    //头像
    var avatarFile = $('#input_avatar')[0].files[0];
    formData.append('avatar', avatarFile);

    //let new_account = $("#input_name").val();
    let new_sex = $("#edit_info #gender-select").val();
    let new_age = $("#input_age").val();
    let new_description = $("#input_intro").val();
    
    //formData.append('account', new_account);
    formData.set('sex', new_sex);
    formData.set('age', new_age);
    formData.set('description', new_description);

    // //测试数据
    // console.log("待上传修改后的个人信息: ");
    // formData.forEach(function(value, key) {
    //   console.log(key + ': ' + value);})


    $.ajax({
      url:"http://127.0.0.1:8080/test",
      type: "POST",
      data: formData,
      processData: false, // 不对表单数据进行处理
      contentType: false, // 不设置内容类型
      success:function(res){
        console.log("后端返回: " + res);
        if(res.status_code == "200"){
          sessionStorage.setItem("avatar", new_avatar);
          //sessionStorage.setItem("account", new_account);
          //account = new_account;
          //面板个人信息的更新
          initialize_users();//更新头像和昵称
          user_info.sex=new_sex;
          user_info.age = new_age;
          user_info.description = new_description;
          show_user_info(user_info);
          alert("修改成功!");
          // $("#edit_info").hide();
        }else{
          alert("账号重复,请重新取个名字吧!");
        }
      },
      error:function(err){
        console.log("上传信息失败: " + err);
      }
    })


  })

  //6.3 用户密码的修改
  $("#edit_ps submit").click(function(){
    //1. 获取输入框的值
    let password = $("#edit_ps #old").val();
    let password1 = $("#edit_ps #new1").val();
    let password2 = $("#edit_ps #new2").val();
    //2. 判断2次输入 的密码是否相同
    if (password1 != password2) {
      alert("2次密码不一致！");
      return;
    } 
    
    let data={
      account:account,
      old_password:password,
      new_password:password1
    }

    $.ajax({
      url:"修改密码",
      type:"POST",
      data: JSON.stringify(data),
      success:function(res){
        console.log("修改密码时返回的数据: " + res);
        alert("密码修改成功");
      },
      error:function(err){
        console.log("修改密码请求出错: " + err);
        alert("密码修改失败");
      }
    })
  })

  //7. 返回上一个页面
  $(".goback").click(function(){
    window.history.back();
  })
})