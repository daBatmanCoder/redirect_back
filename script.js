let session_id;

document.addEventListener('DOMContentLoaded', function() {
  window.top.controller = new Controller();

  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');

  if (sessionId) {
      document.getElementById('eenGsmInput').style.display = 'none'; 
      document.getElementById('buttonGSM').style.display = 'none'; 
      document.getElementById('headerRedirect').style.display = 'none'; 


      document.getElementById('message').style.display = 'block'; // Show message
      session_id = sessionId;
      window.top.controller.signData(sessionId);


      
  } else {
      document.getElementById('message').style.display = 'none'; // Hide message if parameters are not found
  }
});

function returnBack() {

    const een_gsm = document.getElementById('eenGsmInput').value;
    // const de_sp = document.getElementById('deSpInput').value;

    // Construct the data to send
    const data_to_send = { 
        action: "ITEM", 
        body: { 
            item: een_gsm, 
            sp: "test.cellact.nl" 
        } 
    };

    console.log(data_to_send);

      if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.buttonPressed) {
        window.webkit.messageHandlers.buttonPressed.postMessage(JSON.stringify(data_to_send))
      } else if (window.AndroidBridge && window.AndroidBridge.processAction) {
        window.AndroidBridge.processAction(JSON.stringify(data_to_send));
      } else {
        console.log("Native interface not available");
      }


}


function send_to_cloud(data){

  const session_signed = data.body.xsign;
  console.log(session_signed);
    // const apiUrl = `https://us-central1-arnacon-nl.cloudfunctions.net/buy_email_verified?session_id=${encodeURIComponent(sessionId)}&user_address=${encodeURIComponent(userAddress)}`;
    const url = 'https://us-central1-arnacon-nl.cloudfunctions.net/buy_email_verified';
    const dataToSend = { session_id: session_id, signed: session_signed };
    console.log("dataTOSENDTO Server: " + dataToSend);
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.text())
    .then(data => {

        console.log('Success:', data);
        document.getElementById('message').textContent = 'Request processed successfully!';
        // const jsonData = JSON.parse(data);

        // const email = jsonData.email;
        // const de_sp = jsonData.SP;
    
        // const data_to_send = { action: "ITEM", body: { item: email, sp : de_sp } }

        // if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.buttonPressed) {
        //   window.webkit.messageHandlers.buttonPressed.postMessage(JSON.stringify(data_to_send))
        // } else if (window.AndroidBridge && window.AndroidBridge.processAction) {
        //   window.AndroidBridge.processAction(JSON.stringify(data_to_send));
        // } else {
        //   console.log("Native interface not available");
        // }
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('message').textContent = 'Error processing your request.';
    });

}




class Controller {

  // var dataSigned; // Declare the global variable outside the constructor
  constructor() {}

  receiveData(_data) {
    console.log(_data);
    const dataSigned = JSON.parse(_data); // Update the global variable
    send_to_cloud(dataSigned);
  }

  sendMessageToNativeApp(jsonData) {

      if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeHandler) {
          window.webkit.messageHandlers.nativeHandler.postMessage(JSON.stringify(jsonData));
      } else if (window.AndroidBridge && window.AndroidBridge.processAction) {
          console.log(JSON.stringify(jsonData));
          window.AndroidBridge.processAction(JSON.stringify(jsonData));
      } else {
          console.log("Native interface not available");
      }
  }

  signData(data) {
      this.sendMessageToNativeApp({
          action: 'sign-data-temp',
          body: {dataToSign: data}
      });
  }
}