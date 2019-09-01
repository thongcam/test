let original = {};
let currentID = 0;

const reqInfo = () => {fetch("http://localhost:3000/",{
  method: 'get',
  headers: {'Content-Type':  'application/json'}
})
  .then(response => response.json())
  .then(data => {
    if (data === 'Authentication required') {
      $('.placeholder').hide();
      $('#login').show();
    } else
    {
      const data = response.json();
      original = data;
      data.sort((a, b) => (a.question_id > b.question_id) ? 1 : -1);
      data.reverse().forEach((question,i) => {
          $(".question-list").prepend(`
          <div class="question-item" id="${question.question_id}">
            <p class="item-heading">Câu hỏi ${data.length-i}</p>
            <p class="item-question">${question.cau_hoi}</p>
          </div>`);
          $('#'+question.question_id).click(() => {
            currentID = question.question_id;
            $(".placeholder").hide();
            $(".main").show();
            $(".title").text("Câu hỏi " + String(data.length-i));
            $("#cau-hoi").val(question.cau_hoi);
            $("#cau-tra-loi").val(question.cau_tra_loi);
            $("#phan-thi").val(question.phan_thi);
            if ($(".create").is(":visible")) {
              $(".create").hide();
            }
            if ($(".discard").is(":visible")) {
              $(".discard").hide();
            }
            $(".edit").show();
            $(".edit").attr("class","button edit deactivated");
            $(".delete").show();
          })
      })
    }
  })}

const checkEmpty = () => {
  let ok = true;
  $('textarea').each((index,elem) => {
    if ($('textarea').eq(index).val() === "") {
      ok = false;
    }
  })
  return ok;
}

const rerender = () => {
  $(".question-item").remove();
  reqInfo();
}

const clearScr = () => {
  $("textarea").val("");
  $(".main").hide();
  $(".placeholder").show();
}

reqInfo();

$(".toggler").click(() => {
  $(".menu").animate({"left":"0"},200)
  $(".main").animate({width:"70vw","margin-left":"30vw"},200);
  $(".plus").animate({"margin-left":"30vw"},200);
  $(".toggler").text("");
});

$(".back-button").click(() => {
  $(".menu").animate({"left":"-30vw"},200);
  $(".main").animate({'width':'100vw','margin-left':'0'},200);
  $(".plus").animate({"margin-left":"0"},50);
  $(".toggler").text("< CÁC CÂU HỎI");
})

$(".plus").click(() => {
  $(".placeholder").hide();
  $("textarea").val("");
  $(".main").show()
  $(".title").text("Tạo câu hỏi mới");
  $(".discard").show();
  $(".create").show();
  if ($(".delete").is(":visible")) {
    $(".delete").hide();
  }
  if ($(".edit").is(":visible")) {
    $(".edit").hide();
  }
})

$("textarea").on("input", () => {
  if ($(".title").text() === "Tạo câu hỏi mới") {
    $(".create").attr("class","button create activated");
  }
  if ($("#cau-hoi").val() === ""||$("#cau-tra-loi").val() === ""||$("#phan-thi").val() === "") {
    $(".create").attr("class", "button create deactivated");
  }
  if ($(".edit").is(":visible")) {
    $(".edit").attr("class","button edit deactivated");
    const originalItem = original.filter(elem => elem.question_id === currentID)[0];
    $('textarea').each((index,elem) => {
      if ($('textarea').eq(index).val() !== originalItem[Object.keys(originalItem)[index+1]]) {
        $(".edit").attr("class","button edit activated")
      }
    })
    if(!checkEmpty()){
      $(".edit").attr("class","button edit deactivated");
    }
  }
})

$(".create").click(() => {
  if (!checkEmpty()) {
    alert("Còn bỏ trống");
  }
  if ($(".create").css("filter") === "saturate(0.7)") {
    fetch("http://localhost:3000/add-question", {
      method:"post",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        cau_hoi: $("#cau-hoi").val(),
        cau_tra_loi: $("#cau-tra-loi").val(),
        phan_thi: $("#phan-thi").val()
      })})
    .then(response => {return response.json()})
    .then(response => {
      $(".question-item").remove();
      $("textarea").val("");
      reqInfo();
      alert(response);
    })
  }
})

$(".discard").click(() => {
  clearScr();
})

$(".delete").click(() => {
  fetch("http://localhost:3000/delete-question/"+currentID,{
    method: 'delete',
    headers: {'Content-Type':  'application/json'}
  }).then(response => response.json()).then(response => {
    clearScr();
    rerender();
    alert(response);
  })
})

$(".edit").click(() => {
  if (!checkEmpty()) {
    alert("Còn bỏ trống");
  } else if ($(".edit").css("filter") === "saturate(0.7)") {
    console.log('heyyy');
    fetch("http://localhost:3000/edit-question/"+currentID, {
      method:"put",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        cau_hoi: $("#cau-hoi").val(),
        cau_tra_loi: $("#cau-tra-loi").val(),
        phan_thi: $("#phan-thi").val()
      })})
      .then(response => {return response.json()})
      .then(response => {
        rerender();
        alert(response);
      })
  }
})

$('#google').click(() => {
  fetch('http://localhost:3000/auth/google', {
    method: 'get',
    redirect: 'follow',
    headers: {'Content-Type':  'application/json','cookie' : '{cookie}'},
    mode: 'cors',
    credentials: 'include'
  })
  .then(response => {console.log(response);return response.json()})
  .then(data => {
    console.log(data);
    if (data === 'Authentication required') {
      $('.placeholder').hide();
      $('#login').show();
    } else
    {
      const data = response.json();
      original = data;
      data.sort((a, b) => (a.question_id > b.question_id) ? 1 : -1);
      data.reverse().forEach((question,i) => {
          $(".question-list").prepend(`
          <div class="question-item" id="${question.question_id}">
            <p class="item-heading">Câu hỏi ${data.length-i}</p>
            <p class="item-question">${question.cau_hoi}</p>
          </div>`);
          $('#'+question.question_id).click(() => {
            currentID = question.question_id;
            $(".placeholder").hide();
            $(".main").show();
            $(".title").text("Câu hỏi " + String(data.length-i));
            $("#cau-hoi").val(question.cau_hoi);
            $("#cau-tra-loi").val(question.cau_tra_loi);
            $("#phan-thi").val(question.phan_thi);
            if ($(".create").is(":visible")) {
              $(".create").hide();
            }
            if ($(".discard").is(":visible")) {
              $(".discard").hide();
            }
            $(".edit").show();
            $(".edit").attr("class","button edit deactivated");
            $(".delete").show();
          })
      })
    }
  })
})
