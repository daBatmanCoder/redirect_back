document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  const userAddress = urlParams.get('user_address');

  if (sessionId && userAddress) {
      document.getElementById('eenGsmInput').style.display = 'none'; 
      document.getElementById('buttonGSM').style.display = 'none'; 
      document.getElementById('headerRedirect').style.display = 'none'; 


      document.getElementById('message').style.display = 'block'; // Show message

      // Construct the URL with parameters
      const apiUrl = `https://us-central1-arnacon-nl.cloudfunctions.net/buy_email_verified?session_id=${encodeURIComponent(sessionId)}&user_address=${encodeURIComponent(userAddress)}`;
      const dataToSend = { session_id: sessionId, user_address: userAddress };
      // Fetch request to the cloud server
      fetch(apiUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend)
      })
      .then(response => response.json())
      .then(data => {
          console.log('Success:', data);
          document.getElementById('message').textContent = 'Request processed successfully!';
          const jsonData = JSON.parse(data);

          const email = jsonData.email;
          const de_sp = jsonData.SP;
      
          const data_to_send = { action: "ITEM", body: { item: email, sp : de_sp } }

          if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.buttonPressed) {
            window.webkit.messageHandlers.buttonPressed.postMessage(JSON.stringify(data_to_send))
          } else if (window.AndroidBridge && window.AndroidBridge.processAction) {
            window.AndroidBridge.processAction(JSON.stringify(data_to_send));
          } else {
            console.log("Native interface not available");
          }
      })
      .catch((error) => {
          console.error('Error:', error);
          document.getElementById('message').textContent = 'Error processing your request.';
      });
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