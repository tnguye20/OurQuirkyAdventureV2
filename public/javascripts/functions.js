function makeRequest(method, url, data){
  return new Promise( function(resolve, reject){
    const request =  new XMLHttpRequest();
    request.open(method, url);

    request.onload = function(){
      if(request.status === 200){
        const response = JSON.parse(request.responseText);
        resolve(response);
      }else{
        reject({
          status: request.status,
          desc: request.statusText
        });
      }
    };

    request.onerror = function(){
      reject({
        status: request.status,
        desc: request.statusText
      });
    }

    request.send(data);
  });
}

