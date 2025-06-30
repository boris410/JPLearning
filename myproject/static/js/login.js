$(document).ready(function(){

  document.getElementById("guestLogin").addEventListener("click", function () {
    guestLogin()
  });

  document.getElementById("googleLogin").addEventListener("click", function () {
    // 假設是要導到後端 Google OAuth（請自行串接 Google 登入）
    location.href = "/auth/google";
  });
})
