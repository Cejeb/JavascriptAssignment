const createScene = function() {
    const scene =  new BABYLON.Scene(engine);

    //Asset Container creation
    var container = new BABYLON.AssetContainer(scene);

    //Add a camera to the scene and attach it to the canvas
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);

    //setting up skybox
	var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/skybox", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;	

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(1, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 10;

    //set sphere to be yellow
    const sphereMat = new BABYLON.StandardMaterial("sphereMat");
    sphereMat.diffuseColor = new BABYLON.Color3.Yellow()
    sphere.material = sphereMat;

    // Our built-in 'ground' shape.
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 50, height: 50}, scene);

    // imports a box, then moves this to the specified location
    const box = BABYLON.MeshBuilder.CreateBox("box", {});
    box.position.x = 3;
    box.position.y = 3;
    box.position.z = 3;

    // Changes the ground to have a green colour
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
    ground.material = groundMat;

    //makes a robot walking
    const player = BABYLON.SceneLoader.Append("assets/", "robot.glb", scene, function(meshes) {
        scene.createDefaultCameraOrLight(false, false, false);
    }); 

    let vx = 0;
    let vy = 0;

    function update(){
        box.position.x += vx;
        box.position.y += vy;
        requestAnimationFrame(update);
    }


    //Always stays at the bottom!
    return scene;
}