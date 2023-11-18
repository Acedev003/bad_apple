let startVideo = (element,video_src,video_width,video_height) => {

    let screen = element.parentElement;
    let video  = document.createElement("video");
    let canvas = document.createElement("canvas");
    
    let checkbox_s = 0;
    let checkboxes = [];

    let original_screen_state = [screen.innerHTML,screen.style];

    let vid_w = video_width;
    let vid_h = video_height;
    let scrnw = 0;
    let scrnh = 0;

    let left = 0;
    let top  = 0;

    if(!video_src)
    {
        console.error("Video source can't be empty");
        return false;
    }
    video.src = video_src;

    canvas.width  = vid_w;
    canvas.height = vid_h;

    screen.innerHTML        = "";
    screen.style.position   = "absolute";
    screen.style.width      = "100%";
    screen.style.height     = "100%";
    screen.style.margin     = "0px";
    screen.style.padding    = "0px";
    screen.style.lineHeight = "0px";
    screen.style.display    = "block";

    scrnw = screen.clientWidth;
    scrnh = screen.clientHeight;
    

    if(scrnw < vid_w)
    {
        console.error("Screen too small to display video. Reduce video dimensions");
        return false;
    }

    if(scrnw < scrnh)
    {
        checkbox_s = parseInt(scrnw/vid_w);
    }
    else
    {
        checkbox_s = parseInt(scrnh/vid_h);
    }


    if(window.Worker)
    {
        const worker = new Worker("js/worker.js");
        worker.postMessage(["init_elements",vid_h,vid_w,checkbox_s]);
        worker.onmessage = (event) =>{
            window.requestAnimationFrame(()=>{
                screen.innerHTML = event.data;

                checkboxes = document.getElementsByTagName("input");
                //startVideo();
            })
        };
    }
    else
    {
        for (let i = 0; i < vid_h; i++) 
        {
            for (let j = 0; j < vid_w; j++) 
            {
                let input  = document.createElement("input");
                input.type = "checkbox";
                input.style.top    = top + "px";
                input.style.left   = left + "px";
                input.style.width  = checkbox_s + "px";
                input.style.height = checkbox_s + "px";
                parent.appendChild(input);
                checkboxes.push(input);
                left += checkbox_s;
            }
            top += checkbox_s;
            left = 0;
        }

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

    let count = 0;
    let draw = (now, metadata) => {
        if(count%2==0)
        {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            let data = context.getImageData(0, 0, canvas.width, canvas.height);
            let pix = data.data;
            let text = "";

            for (let i = 0; i < pix.length; i += 4) {
                let greyscale = (pix[i] + pix[i + 1] + pix[i + 2]) / 3;

                try
                {
                    if (greyscale    < 127.5) {
                        checkboxes[i / 4].checked = false;
                    }
                    else {
                        checkboxes[i / 4].checked = true;
                    }
                }
                catch
                {
                    
                }

            }
        }
        count++;
        video.requestVideoFrameCallback(draw);
    };

    try {
        video.requestVideoFrameCallback(draw);
        video.play();
    }
    catch(err) 
    {
        alert("Kindly use a browser with support for  HTMLVideoElement API: requestVideoFrameCallback ")
        video.src = "";
    }
    

    screen.innerHTML = original_screen_state[0];
    screen.style     = original_screen_state[1];

};