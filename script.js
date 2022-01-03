let videoStream = document.querySelector(".video-stream");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let timerCont = document.querySelector(".timer-cont");
let timer = document.querySelector(".timer");
let imgFilter = document.querySelector(".img-filter");
let filtersArr = document.querySelectorAll(".filter");

let recording = false;
let capturing = false;

let mediaRecorder;
let chunks = [];

// color of the active filter
let activeColor = "transparent";

let constraints = {
    audio: true,
    video: true
}


for (let i = 0; i < filtersArr.length; i++) {
    filtersArr[i].addEventListener("click", function (e) {
        activeColor = window.getComputedStyle(filtersArr[i]).getPropertyValue('background-color');
        imgFilter.style.backgroundColor = activeColor;
        console.log("color:", activeColor);
        console.log("img color:", window.getComputedStyle(imgFilter).getPropertyValue('background-color'));
    })
}

navigator.mediaDevices.getUserMedia(constraints)
    .then(function (mediaStream) {
        videoStream.srcObject = mediaStream;
        mediaRecorder = new MediaRecorder(mediaStream);

        // // when the recording starts, clear out the old recorded array
        mediaRecorder.addEventListener("start", function (e) {
            chunks = [];
        });

        // the media recorder api dosen't record continuouisly
        // but records in chunks so need to store all the chunks;
        mediaRecorder.addEventListener("dataavailable", function (e) {
            chunks.push(e.data);
        });

        // // mediaRecorder.stop calls this callback
        // // recording has stopped
        mediaRecorder.addEventListener("stop", function (e) {

            // once the recording has stopped need to combine the chunks
            let blob = new Blob(chunks, { 'type': 'video/mp4' });
            let videoUrl = URL.createObjectURL(blob);

            let a = document.createElement("a");
            a.href = videoUrl;
            a.download = "stream.mp4";
            a.click();
        });

    })
    .catch(function (e) {
        console.log("Media Devices not there!");
    });

recordBtnCont.addEventListener("click", function (e) {

    // if mediaRecorder is not yet initialized
    // and someone clicked on record
    // don't do anything
    if (!mediaRecorder) {
        return;
    }

    recording = !recording;

    if (recording) {
        recordBtn.classList.add("scale-record-btn");
        mediaRecorder.start();
        startTimer();
    }

    else {
        recordBtn.classList.remove("scale-record-btn");
        mediaRecorder.stop();
        stopTimer();
    }
});

// start the timer when record button is clicked
let count = 0;
let timerId;

function startTimer() {

    timerCont.style.display = "block";
    count = 0;

    function increaseTime() {
        count++;
        let seconds = count;

        let hours = Number.parseInt(seconds / 3600);
        seconds = count % 3600;
        let minutes = Number.parseInt(seconds / 60);
        seconds = seconds % 60;

        let displayHour = hours.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        let displayMin = minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        let displaySec = seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });

        timer.innerText = `${displayHour} : ${displayMin} : ${displaySec}`;
    }

    timerId = setInterval(increaseTime, 1000);
}

function stopTimer() {
    timerCont.style.display = "none";
    clearInterval(timerId);
    timer.innerText = "00:00:00";
}

captureBtn.addEventListener("click", function (e) {

    let canvas = document.createElement("canvas");
    canvas.width = videoStream.videoWidth;
    canvas.height = videoStream.videoHeight;
    let tool = canvas.getContext("2d");

    tool.drawImage(videoStream, 0, 0, canvas.width, canvas.height);
    tool.fillStyle = activeColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);
    console.log("fillStyle:", tool.fillStyle);

    let canvasUrl = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = canvasUrl;
    a.download = "image.jpg";
    a.click();
})