let contentCont=document.querySelector(".content-cont");
// fetching all the videos from the database takes time
setTimeout(() => {
    if (db) {
        let videoTransaction = db.transaction("videos", "readonly");

        // retrieve videos from index db
        let videoStore = videoTransaction.objectStore("videos");
        // is event triggered 
        let videoRequest = videoStore.getAll();

        // when all data is retrieved then this event
        // listner is called
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            
            for(let i=0;i<videoResult.length;i++){

                let id=videoResult[i].id;
                let videoBlob=videoResult[i].blobData;
                // console.log(id,videoBlob);
                let videoUrl=URL.createObjectURL(videoBlob);
                let div=document.createElement("div");
                div.setAttribute("class","content-card");
                div.setAttribute("id",id);

                div.innerHTML=`<div class="media-cont">
                                    <video class="gallery-video-stream" autoplay muted loop src="${videoUrl}"> </video>
                                </div>
                                
                                <div class="btn download-btn-cont">
                                    <div class="download-btn"> DOWNLOAD </div>
                                </div>
                                <div class="btn delete-btn-cont">
                                    <div class="delete-btn"> DELETE </div>
                                </div>`;

                contentCont.appendChild(div);

                //find the delete and download button from the created element
                // and not from the entire document
                let downloadBtn=div.querySelector(".download-btn-cont");
                let deleteBtn=div.querySelector(".delete-btn-cont");

                downloadBtn.addEventListener("click",handleDownloadClick);
                deleteBtn.addEventListener("click",handleDeleteClick);
            }
        };
        
        // retrieve images from index db
        // retrieve videos from index db
        let imageTransaction = db.transaction("images", "readonly");
        let imageStore = imageTransaction.objectStore("images");
        // is event triggered 
        let imageRequest = imageStore.getAll();

        // when all data is retrieved then this event
        // listner is called
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            
            for(let i=0;i<imageResult.length;i++){

                let id=imageResult[i].id;
                let imageUrl=imageResult[i].url;
                let div=document.createElement("div");
                div.setAttribute("class","content-card");
                div.setAttribute("id",id);

                div.innerHTML=`<div class="media-cont">
                                    <img class="gallery-video-stream" src="${imageUrl}"/>
                                </div>
                                
                                <div class="btn download-btn-cont">
                                    <div class="download-btn"> DOWNLOAD </div>
                                </div>
                                <div class="btn delete-btn-cont">
                                    <div class="delete-btn"> DELETE </div>
                                </div>`;

                contentCont.appendChild(div);

                let downloadBtn=div.querySelector(".download-btn");
                let deleteBtn=div.querySelector(".delete-btn");

                downloadBtn.addEventListener("click",handleDownloadClick);
                deleteBtn.addEventListener("click",handleDeleteClick);
            }
        };
    }
}, 100)


function handleDownloadClick(e){
    let id=e.target.parentElement.parentElement.getAttribute("id");
    // console.log("id:",id);
    
    // db change
    if(id.slice(0,3)=="img"){
        
        let imageTransaction = db.transaction("images", "readwrite");
        // retrieve videos from index db
        let imageStore = imageTransaction.objectStore("images");
        let imageRequest=imageStore.get(id);
        
        imageRequest.onsuccess=(e)=>{
            let imageResult=imageRequest.result;
            let imageUrl=imageResult.url;
            
            let imgName=prompt("enter image name","image");
            let a = document.createElement("a");
            a.href = imageUrl;
            a.download = `${imgName}.jpg`;
            a.click();
        }
    }

    else if(id.slice(0,3)=="vid"){
        let videoTransaction = db.transaction("videos", "readwrite");
        // retrieve videos from index db
        let videoStore = videoTransaction.objectStore("videos");
        let videoRequest=videoStore.get(id);
        
        videoRequest.onsuccess=(e)=>{
            let videoResult=videoRequest.result;
            let videoBlob=videoResult.blobData;

            let videoUrl = URL.createObjectURL(videoBlob);
            
            let videoName=prompt("enter video name","stream");
            let a = document.createElement("a");
            a.href = videoUrl;
            a.download = `${videoName}.mp4`;
            a.click();
        }   
    }
}

function handleDeleteClick(e){
    
    let id=e.target.parentElement.parentElement.getAttribute("id");
    // console.log("id:",id);
    
    // db change
    if(id.slice(0,3)=="img"){
        let imageTransaction = db.transaction("images", "readwrite");
        // retrieve videos from index db
        let imageStore = imageTransaction.objectStore("images");
        imageStore.delete(id);
    }

    else if(id.slice(0,3)=="vid"){
        let videoTransaction = db.transaction("videos", "readwrite");
        // retrieve videos from index db
        let videoStore = videoTransaction.objectStore("videos");
        videoStore.delete(id);   
    }

    // ui change
    e.target.parentElement.parentElement.remove();
}