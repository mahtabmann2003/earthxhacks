// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };
var track = null;

// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger");

// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
    // track.stop();
};

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);


// Install ServiceWorker
if ('serviceWorker' in navigator) {
  console.log('CLIENT: service worker registration in progress.');
  navigator.serviceWorker.register( '/camera-app/part-2/sw.js' , { scope : ' ' } ).then(function() {
    console.log('CLIENT: service worker registration complete.');
  }, function() {
    console.log('CLIENT: service worker registration failure.');
  });
} else {
  console.log('CLIENT: service worker is not supported.');
}

var image = document.getElementById("camera--output");

// Take action when the image has loaded
  image.addEventListener("load", function savelink() {
    var imgCanvas = document.createElement("canvas"),
        imgContext = imgCanvas.getContext("2d");

    // Make sure canvas is as big as the picture
    imgCanvas.width = image.width;
    imgCanvas.height = image.height;

    // Draw image into canvas element
    imgContext.drawImage(image, 0, 0, image.width, image.height);

    // Get canvas contents as a data URL
    var imgAsDataURL = imgCanvas.toDataURL("image/png");

    // Save image into localStorage
    try {
        localStorage.setItem("image", imgAsDataURL);
    }
    catch (e) {
        console.log("Storage failed: " + e);
    }
}, false); 