let screen    = document.getElementById("screen");
let ctrl_disp = document.getElementById("control_disp");

let video  = document.getElementById("video");
let canvas = document.createElement("canvas");

let strt_button = document.getElementById("start_button");
strt_button.onclick = () =>{
    ctrl_disp.style.display = "block";
    strt_button.style.display = "none";

    canvas.width  = video.offsetWidth;
    canvas.height = video.offsetHeight;

    playVideo(screen);

};


let playVideo = (parent) =>{
    parent.style.margin = "10px";

    let vid_w = video.offsetWidth;
    let vid_h = video.offsetHeight;    

    
    for(let i = 0; i < vid_h; i++)
    {
        for(let j = 0; j < vid_w; j++)
        {
            let input  = document.createElement("input");
            input.type = "checkbox";
            parent.appendChild(input);
        }
        let br = document.createElement("br");
        parent.appendChild(br); 
    }
    
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

    let draw = (now, metadata) => {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
        let data = context.getImageData(0, 0,canvas.width, canvas.height);
        let pix  = data.data;
        let text = "";

        for (let i = 0; i < pix.length; i += 4) 
        {
            let greyscale = (pix[i] + pix[i+1] + pix[i+2])/3;

            if(greyscale < 127.5)
            {
                document.getElementsByTagName("input")[i/4].checked = false;
            }
            else
            {
                document.getElementsByTagName("input")[i/4].checked = true;
            }

        }
        video.requestVideoFrameCallback(draw);
    };

    video.requestVideoFrameCallback(draw);
};

