function breadPath(){
  if(localStorage.getItem("nowPage"))
  {
    localStorage.setItem("lastPage",localStorage.getItem("nowPage"))
  }
  
  localStorage.setItem("nowPage",location.href)
}

function loadData(apiUrl, callback) {
    axios.get(apiUrl)
      .then(function (response) {
        if (typeof callback === 'function') {
          callback(response.data);
        }
      })
      .catch(function (error) {
        console.error('載入失敗：', error);
      });
}

function guestLogin() {
  const usersData = {
    type: "guest",
    uid: localStorage.getItem("_uid_") || ""
  };

  fetch("/api/gLogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken")  // 如果是 Django，這行不能少
    },
    body: JSON.stringify(usersData)
  })
  .then(response => response.json())
  .then(result => {
    if (result.code === 1001 || result.code === 1002) {
      // 登入成功
      localStorage.setItem("_uid_", result.user.uid);
      localStorage.setItem("name", result.user.name);
      window.location.href = localStorage.getItem("lastPage"); // 導向首頁
    } else {
      // 回傳非預期狀態
      alert("登入失敗：" + (result.message || "未知錯誤"));
      console.warn(result);
    }
  })
  .catch(error => {
    alert("伺服器錯誤，請稍後再試！");
    console.error("錯誤：", error);
  });
}

function sendRecord(record_data) {
  fetch("/api/sendData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken")  // Django 的 CSRF 保護
    },
    body: JSON.stringify(record_data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("伺服器錯誤：" + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log("✅ 成功儲存紀錄：", data);
  })
  .catch(error => {
    alert("❌ 錯誤：資料儲存失敗");
    console.error("❌ 錯誤：", error);
  });
}


function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
      let cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          let cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

$(document).ready(function(){
  breadPath();
})
