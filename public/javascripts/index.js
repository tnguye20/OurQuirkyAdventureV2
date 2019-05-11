
document.addEventListener("DOMContentLoaded", function() {
  var serectCode = "",
      secretEl;
  document.querySelector("input#secretCode").addEventListener("keyup", function(e){
    secretEl = e.target;
    secretCode = e.target.value;
    const formData = new FormData();
    if(secretCode.length >= 10){
      formData.append("passPhrase", secretCode);
      makeRequest("POST", "/verify", formData)
        .then((res) => {
            console.log(res)
            if(res == true){
              window.location.replace("/app");
            }
        })
    }
  })
})
