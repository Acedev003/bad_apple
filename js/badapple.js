let screen    = document.getElementById("screen");

let video  = document.createElement("video");
let canvas = document.createElement("canvas");


let checkboxes = [];

let vid_w = 100;
let vid_h = 75;

let strt_button = document.getElementById("start_button");
strt_button.onclick = () =>{
    strt_button.style.display = "none";

    video.src = "videos/badapple.webm";

    canvas.width  = vid_w;
    canvas.height = vid_h;

    playVideo(screen);

};


let playVideo = (parent) =>{
    let left = 0;
    let top  = 0;    

    parent.style.height = (13*75) + "px";
    parent.style.width =  (13*100) + "px";

    if(window.Worker)
    {
        const worker = new Worker("js/worker.js");
        worker.postMessage(["init_elements",vid_h,vid_w]);
        worker.onmessage = (event) =>{
            window.requestAnimationFrame(()=>{
                parent.innerHTML = event.data;
                startVideo();
            })
        };

        checkboxes = document.getElementsByTagName("input");
    }
    else
    {
        for (let i = 0; i < vid_h; i++) 
        {
            for (let j = 0; j < vid_w; j++) 
            {
                let input = document.createElement("input");
                input.type = "checkbox";
                input.style.left = left + "px";
                input.style.top = top + "px";
                left += 13;
                parent.appendChild(input);
                checkboxes.push(input);
            }
            top += 13;
            left = 0;
        }
        startVideo();
    }
    
    
};


let startVideo = ()=>
{
    let context  = canvas.getContext("2d");
    let clck_cnt = 0;
    parent.onclick = () =>{
        clck_cnt++;
        if(clck_cnt > 1)
        {
            if(video.paused)
            {
                video.play();
            }
            else
            {
                video.pause();
            }
        }
    };
    
    video.play();
    let count = 0;
    let draw = (now, metadata) => {
        if(count%3==0)
        {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            let data = context.getImageData(0, 0, canvas.width, canvas.height);
            let pix = data.data;
            let text = "";

            for (let i = 0; i < pix.length; i += 4) {
                let greyscale = (pix[i] + pix[i + 1] + pix[i + 2]) / 3;

                if (greyscale    < 127.5) {
                    checkboxes[i / 4].checked = false;
                }
                else {
                    checkboxes[i / 4].checked = true;
                }

            }
        }
        count++;
        video.requestVideoFrameCallback(draw);
    };

    video.requestVideoFrameCallback(draw);
}