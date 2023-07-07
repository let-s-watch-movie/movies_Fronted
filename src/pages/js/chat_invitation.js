var server_ip_port = "http://192.168.159.207:8080/"
// var server_ip_port = "http://localhost:8080/"

$(document).ready(function () {
  $.ajaxSetup({
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    async: false,
  });



  /**
   * js  来处理页面元素 +  定义js数据 和 函数 实现交互
   * 必须遵守，先定义，后使用，先存在，后处理的基本原理，就是需要注意时间顺序，在其它框架里称之为生命周期
   * 不然，就是无法操作的，即写的代码没用的
   */

  /**
   * 1. data定义阶段与存储区
   */
  var data = {
    mine_info: {
      user_name: "用户A",
      user_avatar:
        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp",
    },
    modal_value: {
      movieId: "",
      objectName: "",
      type: ""
    },
    now_tab_id: "all-tab",

    invite_all_list: [
      {
        inviteId: 1,
        movieId: "我邀请的电影名1", // 电影id，要获取电影名字
        inviterAccount: "我自己",
        receiverAccount: "user2",
        status: 0, // TODO: 0表示未处理，1表示同意，2表示拒绝
        inviteTime: "2021/07/03 11:37:26",
      },

    ],

    invite_agreed_both_list: [
      {
        inviteId: 3,
        movieId: "我邀请的电影名",
        inviterAccount: "我自己",
        receiverAccount: "user2",
        status: 1,
        inviteTime: "2021/07/03 11:37:26",
      },
    ],

    invite_my_invite_unhandled_list: [
      {
        inviteId: 1,
        movieId: "我邀请的电影名",
        inviterAccount: "我自己",
        receiverAccount: "user2",
        status: 0,
        inviteTime: "2021/07/03 11:37:26",
      },
    ],
    invite_my_receive_unhandled_list: [
      {
        inviteId: 2,
        movieId: "我被邀请的电影名",
        inviterAccount: "user2",
        receiverAccount: "我自己",
        status: 0,
        inviteTime: "2021/07/03 11:37:26",
      },
    ],
  };

  /**
   * 2. methods定义阶段
   */

  function setModalValues(movieId, objectName, type) {
    data.modal_value.movieId = movieId;
    data.modal_value.objectName = objectName;
    data.modal_value.type = type;
  }

  var get_movie_poster_by_id = function (movie_id) {
    // TODO
    let movie_info = get_movie_info_with_id(movie_id);
    return movie_info.poster;
  };
  var get_movie_name_by_id = function (movie_id) {
    // TODO
    let movie_info = get_movie_info_with_id(movie_id);
    return movie_info.movieName;
  };
  var get_user_avatar_by_name = function (user_name) {
    // TODO
    return getAvatar(user_name)
  };
  var get_stataus_text_by_status = function (status) {
    switch (status) {
      case 0:
        return "等待中";
      case 1:
        return "已同意";
      case 2:
        return "已拒绝";
    }
  };

  var get_all_with_me_invite = function () {
    // 这里写一个ajax请求，获取所有的邀约信息
    // $.ajax({
    //   url: "/api/invitations",
    //   method: "GET",
    //   success: function (data) {
    //     console.log(data);
    //     // 在这里处理返回的邀约信息
    //   },
    //   error: function (jqXHR, textStatus, errorThrown) {
    //     console.error(
    //       "Error fetching invitations:",
    //       textStatus,
    //       errorThrown
    //     );
    //   },
    // });

    return [
      {
        inviteId: 1,
        movieId: "我邀请的电影名1",
        inviterAccount: "我自己",
        receiverAccount: "user2",
        status: 0, // 0表示未处理，1表示同意，2表示拒绝
        inviteTime: "2021/07/03 11:37:26",
      },
      {
        inviteId: 2,
        movieId: "我被邀请的电影名1",
        inviterAccount: "user2",
        receiverAccount: "我自己",
        status: 0,
        inviteTime: "2021/07/03 11:37:26",
      },
      {
        inviteId: 3,
        movieId: "我邀请的电影名2",
        inviterAccount: "我自己",
        receiverAccount: "user2",
        status: 1,
        inviteTime: "2021/07/03 11:37:26",
      },
    ];
  };

  var get_my_invite_unhandled = function () {

    data.invite_my_invite_unhandled_list = data.invite_all_list.filter(function (item) {
      return (
        // 筛选，inviter_account == mine_info.user_name && status == 0 // 所有未处理的，划到我的邀请
        item.inviterAccount == data.mine_info.user_name && item.status == 0
      );
    });
  };

  var get_my_receive_unhandled = function () {
    data.invite_my_receive_unhandled_list = data.invite_all_list.filter(function (item) {
      return (
        // 筛选, receiver_account == mine_info.user_name && status == 0 // 所有未处理的，划到我的新被邀约请求
        item.receiverAccount == data.mine_info.user_name && item.status == 0
      );
    });
  };

  var get_agreed_both = function () {
    data.invite_agreed_both_list = data.invite_all_list.filter(function (item) {
      // 筛选, status == 1 // 所有同意的，就是双方都同意的 划到我的相约
      return item.status == 1;
    });
  };

  function get_type_by_receiver_account(receiver_account) {
    if (receiver_account == data.mine_info.user_name) {
      return "来源";
    } else {
      return "对象";
    }
  }

  var show_content_in_container = function (tab_id) {
    $("#invite_content_container").empty();
    console.log(tab_id);
    let content_to_show = [];
    switch (tab_id) {
      case "all-tab":
        content_to_show = data.invite_all_list;
        break;

      case "agreed-both-tab":
        content_to_show = data.invite_agreed_both_list;
        break;

      case "my-invite-unhandled-tab":
        content_to_show = data.invite_my_invite_unhandled_list;
        break;

      case "my-receive-unhandled-tab":
        content_to_show = data.invite_my_receive_unhandled_list;
        break;
    }
    for (i of content_to_show) {
      let type = get_type_by_receiver_account(i.receiverAccount);
      let obeject_account = i.receiverAccount; // 默认是，当前用户是发起者，那么对象就是接收者
      if (type == "来源") {
        obeject_account = i.inviterAccount;
      }
      let status_class = "badge-success";
      switch (i.status) {
        case 0:
          status_class = "badge-warning";
          break;
        case 1:
          status_class = "badge-success";
          break;
        case 2:
          status_class = "badge-danger";
          break;
      }

      $("#invite_content_container").append(
        '<tr><td id="' + i.movieId + '"><div class="d-flex align-items-center"><img src="' +
        get_movie_poster_by_id(i.movieId) +
        '" style="width: 45px; height: 45px" class="rounded-circle"/><div class="ms-3"><p class="movie_id fw-bold mb-1">' +
        get_movie_name_by_id(i.movieId) +
        '</p><p class="invite_time text-muted mb-0">' +
        i.inviteTime +
        '</p></div></div></td><td><div class="d-flex align-items-center"><p class="fw-normal mb-1">' + type + '</p><img src="' +
        get_user_avatar_by_name(obeject_account) +
        '" style="width: 45px; height: 45px" class="rounded-circle ms-3"/><p class="text-muted mb-0  ms-3">' +
        obeject_account +
        '</p></div></td><td><span class="badge ' + status_class + ' rounded-pill d-inline">' +
        get_stataus_text_by_status(i.status) +
        '</span></td><td><button type="button" class="fix btn btn-link btn-sm btn-rounded" data-mdb-toggle="modal" data-mdb-target="#changeInvitationStatusModal" style="border: 1px solid #ced4da">修改</button></td></tr>'
      );

      $(".fix").click(function () {
        setModalValues(i.movieId, obeject_account, type);
      }
      );
    }
  };



  var handle_my_invite_unhandled = function (invite_id, status) { };

  // var justify_backend_invite_all_data = function (raw) {
  //   对齐前后端数据格式   !!!!前端，直接用后端的格式了
  //   let result = [];
  //   return result;
  // };

  /**
   * 3. 页面打开初始化阶段
   */
  // 获取我的信息
  data.mine_info = get_mine_info();

  // 获取所有的邀约信息
  $.ajax({
    url: server_ip_port + "invite/queryRequestAll",
    // url:"http://192.168.100.201:8080/invite/queryRequestByReceiver",
    method: "POST",
    data: JSON.stringify({ "inviterAccount": data.mine_info.user_name }),

    success: function (response) {
      console.log("Success fetching invitations:");
      console.log(response);
      // 在这里处理返回的邀约信息
      data.invite_all_list = response.data;

      get_agreed_both(); // 更新data.invite_agreed_both_list 
      get_my_invite_unhandled(); // data.invite_my_invite_unhandled_list
      get_my_receive_unhandled(); // 更新data.invite_my_invite_unhandled_list
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error fetching invitations:", textStatus, errorThrown);
    },
  });

  // 更新data.handle_all_list 之后 就更新所有的列表，并且更新页面
  function update_other_list_and_show() {
    get_agreed_both(); // 更新data.invite_agreed_both_list 
    get_my_invite_unhandled(); // data.invite_my_invite_unhandled_list
    get_my_receive_unhandled(); // 更新data.invite_my_invite_unhandled_list
    show_content_in_container(data.now_tab_id);

  }


  // 获取所有的用户信息

  /**
   * 4.事件绑定阶段
   */

  $("#all-tab").click(function () {
    show_content_in_container("all-tab");
    data.now_tab_id = "all-tab";
  });
  $("#agreed-both-tab").click(function () {
    show_content_in_container("agreed-both-tab");
    data.now_tab_id = "agreed-both-tab";
  });
  $("#my-invite-unhandled-tab").click(function () {
    show_content_in_container("my-invite-unhandled-tab");
    data.now_tab_id = "my-invite-unhandled-tab";
  });
  $("#my-receive-unhandled-tab").click(function () {
    show_content_in_container("my-receive-unhandled-tab");
    data.now_tab_id = "my-receive-unhandled-tab";
  });

  $("#rejectInvitation").click(function () {
    let req_data = {}
    if (data.modal_value.type == "来源") {
      req_data = { "inviterAccount": data.modal_value.objectName, "receiverAccount": data.mine_info.user_name, "movieId": data.modal_value.movieId }
    } else {
      req_data = { "inviterAccount": data.mine_info.user_name, "receiverAccount": data.modal_value.objectName, "movieId": data.modal_value.movieId }
    }
    console.log(req_data)
    $.ajax({
      url: server_ip_port + "invite/refuse",
      method: "POST",
      data: JSON.stringify(req_data),
      success: function (response) {
        console.log("修改邀约状态为拒绝，成功")
        console.log(response);

        // 更新data.invite_all_list 将对应的邀约状态改为2
        for (let i = 0; i < data.invite_all_list.length; i++) {
          if (data.invite_all_list[i].movieId == data.modal_value.movieId && data.invite_all_list[i].inviterAccount == data.modal_value.account) {
            data.invite_all_list[i].status = 2;
            break;
          }
        }
        update_other_list_and_show();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error fetching invitations:", textStatus, errorThrown);
        alert("修改邀约状态为拒绝，失败")
      }

    });
  });
  $("#acceptInvitation").click(function () {
    let req_data = {}
    if (data.modal_value.type == "来源") {
      req_data = { "inviterAccount": data.modal_value.objectName, "receiverAccount": data.mine_info.user_name, "movieId": data.modal_value.movieId }
    } else {
      req_data = { "inviterAccount": data.mine_info.user_name, "receiverAccount": data.modal_value.objectName, "movieId": data.modal_value.movieId }
    }
    console.log(req_data)
    $.ajax({
      url: server_ip_port + "invite/accept",
      method: "POST",
      data: JSON.stringify(req_data),
      success: function (response) {
        console.log("修改邀约状态为已同意，成功")
        console.log(response);

        // 更新data.invite_all_list 将对应的邀约状态改为1
        for (let i = 0; i < data.invite_all_list.length; i++) {
          if (data.invite_all_list[i].movieId == data.modal_value.movieId && data.invite_all_list[i].inviterAccount == data.modal_value.account) {
            data.invite_all_list[i].status = 1;
            break;
          }
        }
        update_other_list_and_show();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error fetching invitations:", textStatus, errorThrown);
        alert("修改邀约状态失败");
      }

    });
  });


  // 页面最开始显示的是全部邀约
  show_content_in_container("all-tab");

  // TODO: 也是要一个后台线程定时刷新的

});
