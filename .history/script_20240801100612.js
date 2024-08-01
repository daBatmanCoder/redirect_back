

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

      if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.buttonPressed) {
        window.webkit.messageHandlers.buttonPressed.postMessage(JSON.stringify(data_to_send))
      } else if (window.AndroidBridge && window.AndroidBridge.processAction) {
        window.AndroidBridge.processAction(JSON.stringify(data_to_send));
      } else {
        console.log("Native interface not available");
      }


}