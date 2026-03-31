Pi.init({ version: "2.0" });

let username = "";

async function login(){
  const user = await Pi.authenticate(["username"]);
  username = user.user.username;

  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get("ref");

  if(ref){
    await fetch("/api/ref", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username, ref})
    });
  }

  loadUser();
}

async function loadUser(){
  const res = await fetch("/api/user/" + username);
  const data = await res.json();

  document.getElementById("balance").innerText = "Balance: " + data.balance + " Pi";
  document.getElementById("ref").innerText = data.ref;
}

async function pay(){
  await Pi.createPayment({
    amount: 0.01,
    memo: "Upgrade",
    metadata: {}
  },{
    onReadyForServerCompletion: function(paymentId, txid){
      fetch("/api/upgrade", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username})
      }).then(()=>{
        alert("Upgraded ✅");
        loadUser();
      });
    }
  });
}

function task(){
  fetch("/api/task", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username})
  }).then(loadUser);
}

function copyRef(){
  const text = document.getElementById("ref").innerText;
  navigator.clipboard.writeText(text);
  alert("Copied: " + text);
}