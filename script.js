let videoStream=document.querySelector(".video-stream");
let recordBtnCont=document.querySelector(".record-btn-cont");
let recordBtn=document.querySelector(".record-btn");
let captureBtnCont=document.querySelector(".capture-btn-cont");
let captureBtn=document.querySelector(".capture-btn");
let timerCont=document.querySelector(".timer-cont");
let timer=document.querySelector(".timer");
let recording=false;
let capturing=false;

let mediaRecorder;
let chunks=[];

let constraints={
    audio:true,
    video:true
}

navigator.mediaDevices.getUserMedia(constraints)
.then(function(mediaStream){
    videoStream.srcObject=mediaStream;
    mediaRecorder=new MediaRecorder(mediaStream);

    // when the recording starts, clear out the old recorded array
    mediaRecorder.addEventListener("start",function(e){
        chunks=[];
    });

    // the media recorder api dosen't record continuouisly
    // but records in chunks so need to store all the chunks;
    mediaRecorder.addEventListener("dataavailable",function(e){
        chunks.push(e.data);
    });

    // mediaRecorder.stop calls this callback
    // recording has stopped
    mediaRecorder.addEventListener("stop",function(e){
        
        // once the recording has stopped need to combine the chunks
        let blob = new Blob(chunks, { 'type' : 'video/mp4'});
        let videoUrl=URL.createObjectURL(blob);
        
        let a=document.createElement("a");
        a.href=videoUrl;
        a.download="stream.mp4";
        a.click();
    });

})
.catch(function(e){
    console.log("Media Devices not there!");
});

recordBtnCont.addEventListener("click",function(e){
    recording=!recording;

    if(recording){
        recordBtn.classList.add("scale-record-btn");
        mediaRecorder.start();
        startTimer();
    }

    else{
        recordBtn.classList.remove("scale-record-btn");
        mediaRecorder.stop();
        stopTimer();
    }
});

// start the timer when record button is clicked
let count=0;
let timerId;

function startTimer(){
    
    timerCont.style.display="block";
    count=0;

    function increaseTime(){
        count++;
        let seconds=count;

        let hours=Number.parseInt(seconds/3600);
        seconds=count%3600;
        let minutes=Number.parseInt(seconds/60);
        seconds=seconds%60;

        let displayHour=hours.toLocaleString('en-US', { minimumIntegerDigits: 2,useGrouping: false});
        let displayMin=minutes.toLocaleString('en-US', { minimumIntegerDigits: 2,useGrouping: false});
        let displaySec=seconds.toLocaleString('en-US', { minimumIntegerDigits: 2,useGrouping: false});
        
        timer.innerText=`${displayHour} : ${displayMin} : ${displaySec}`;
    }
    
    timerId=setInterval(increaseTime,1000);
}

function stopTimer(){
    timerCont.style.display="none";
    clearInterval(timerId);
    timer.innerText="00:00:00";
}

captureBtn.addEventListener("click",function(e){
})