jQuery(document).ready(function(){
  var serectCode = "",
      secretEl;
  $("input#secretCode").on("keyup", function(e){
    secretEl = e.target;
    secretCode = e.target.value;
    if(secretCode.match(/pengarunny/)){
      secretEl.classList.add("is-valid");
      $.ajax({
        url: "/verify",
        type: "POST",
        data: {pass: "success"},
        success: function() {
          console.log("You are worthy!!")
          window.location.replace("/app");
        }
      });
      window.location.replace("/app");
    }
  })
})
