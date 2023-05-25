addEventListener("keydown", function(KeyDown){
    console.log(KeyDown.code)
    if(KeyDown.code = 'KeyD') vx = 5;
    if(KeyDown.code = 'KeyA') vx = -5;
    if(KeyDown.code = 'KeyW') vy = -5;
    if(KeyDown.code = 'KeyS') vy = 5;
})

addEventListener("keyup", function(KeyUp){
    console.log(KeyUp.code)
    if(KeyUp.code = 'KeyD') vx = 0;
    if(KeyUp.code = 'KeyA') vx = 0;
    if(KeyUp.code = 'KeyS') vy = 0;
    if(KeyUp.code = 'KeyD') vy = 0;
})