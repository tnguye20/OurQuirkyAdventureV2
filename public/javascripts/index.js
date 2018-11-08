jQuery(document).ready(function(){
  var serectCode = "",
      secretEl;
  $("input#secretCode").on("keyup", function(e){
    secretEl = e.target;
    secretCode = e.target.value;
    if(secretCode.match(/pengarunny/)){
      $.ajax({
        url: "/verify",
        type: "POST",
        data: {pass: "success"},
        success: function(response) {
          window.location.replace("/app");
        }
      });
    }
  })
})
