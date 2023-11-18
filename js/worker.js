self.onmessage = (event)=>{

    let data = event.data;
    if(data[0] == "init_elements")
    {
        let vid_h = data[1];
        let vid_w = data[2];
        
        let checkbox_s = data[3]; 

        let text = "";
        let left = 0;
        let top  = 0;
        for (let i = 0; i < vid_h; i++) 
        {
            for (let j = 0; j < vid_w; j++) 
            {
                text += `<input type='checkbox' style='left:${left}px;top:${top}px;width:${checkbox_s}px;height:${checkbox_s}px'>`;
                left += checkbox_s;
            }
            top += checkbox_s;
            left = 0;
        }
        postMessage(text);
    }
};