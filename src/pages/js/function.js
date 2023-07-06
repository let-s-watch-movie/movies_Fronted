function get_per_info(){
  let data = {
    account:sessionStorage.getItem("account")
  }
  console.log("用户详细信息初始化: ");
  console.log(data);
  $.ajax({
    //url:"获取用户详细信息",
    url:"http://192.168.159.207:8080/user/getUserInfo",
    type:"POST",
    data: JSON.stringify(data),
    async:false,
    success:function(res){
      console.log("后端返回信息: ");
      console.log(res);
      //赋值操作
      if(res.data.avatar){
        let s = res.data.avatar.replace("localhost","192.168.159.207");
        console.log(s);
        sessionStorage.setItem("avatar",s);
      }
    },
    error:function(err){
      console.log("获取用户详细信息的请求出错"+err);
    }
  })
}

function initialize_users() {
  let avatar = sessionStorage.getItem("avatar");
  console.log(avatar);
  if (avatar) {
    console.log("进入了头像的更新");
    console.log(avatar);
    $(".avatar").attr("src", avatar);
  } else {
    console.log("avatar为空，使用默认头像");
  }
}

// get_per_info();
// initialize_users();