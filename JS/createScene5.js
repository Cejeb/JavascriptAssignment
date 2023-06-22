// references https://www.babylonjs-playground.com/#15EY4F#15
var keyDownMap =[];

function importMesh(scene, x, y) {
    let tempItem = { flag: false }
    let item = BABYLON.SceneLoader.ImportMesh("", "./assets/models/", "dummy3.babylon", scene, function(newMeshes, particleSystems ,skeletons) {
        let mesh = newMeshes[0];
        let skeleton = skeletons[0];
        skeleton.animationPropertiesOverride = new BABYLON.AnimationPropertiesOverride();
        skeleton.animationPropertiesOverride.enableBlending = true;
        skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
        skeleton.animationPropertiesOverride.loopMode = 1;
        
        var walkRange = skeleton.getAnimationRange("YBot_Walk");
        var animating = false;

        scene.onBeforeRenderObservable.add(()=> {
            var keydown = false;
            if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
                mesh.position.z += 0.1;
                mesh.rotation.y = 0;
                keydown=true;
            }
            if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
                mesh.position.x -= 0.1;
                mesh.rotation.y = 3 * Math.PI / 2;
                keydown=true;
            }
            if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
                mesh.position.z -= 0.1;
                mesh.rotation.y = 2 * Math.PI / 2;
                keydown=true;
            }
            if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
                mesh.position.x += 0.1;
                mesh.rotation.y = Math.PI / 2;
                keydown=true;
            }

            if(keydown){
                if(!animating){
                    animating = true;
                    scene.beginAnimation(skeleton, walkRange.from, walkRange.to, true);
                }
            }else{
                animating = false;
                scene.stopAnimation(skeleton)
            }
        });

        scene.actionManager.registerAction(
            new BABYLON.IncrementValueAction(
                BABYLON.ActionManager.OnEveryFrameTrigger,
                mesh,
                'rotation.y',
                0.1,
                new BABYLON.PredicateCondition(
                    mesh.actionManager,
                    function () {
                        return tempItem.flag == true
                    }
                )
            )
        ); 

        mesh.actionManager = new BABYLON.ActionManager(scene);
    
    
        mesh.actionManager.registerAction(
            new BABYLON.SetValueAction(
                BABYLON.ActionManager.OnPickDownTrigger,
                tempItem,
                'flag',
                true
            )
        );
        
        mesh.actionManager.registerAction(
            new BABYLON.SetValueAction(
                BABYLON.ActionManager.OnLongPressTrigger,
                tempItem,
                'flag',
                false
            )
        ); 

    });

    return item
}    
    
function actionManager(scene){
    scene.actionManager = new BABYLON.ActionManager(scene);

    scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            {
            trigger: BABYLON.ActionManager.OnKeyDownTrigger,  
            },
            function(evt) {keyDownMap[evt.sourceEvent.key] = true; }
        )
    );

    scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            {
            trigger: BABYLON.ActionManager.OnKeyUpTrigger
            
            },
            function(evt) {keyDownMap[evt.sourceEvent.key] = false; }
        )
    );   


    return scene.actionManager;
}

function addRotation(target, scene){
}

function createGround(scene){
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {height: 10, width: 10, subdivisions: 4});
    return ground;
}

function createLight(scene) {
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
    light.intensity = 0.7;
    return light;
}

function createArcRotateCamera(scene) {
    let camAlpha = -Math.PI / 2;
    let camBeta = Math.PI / 2.5;
    let camDist = 20;
    let camTarget = new BABYLON.Vector3(0, 0, 0);
    let camera = new BABYLON.ArcRotateCamera("camera1", camAlpha, camBeta, camDist, camTarget, scene);
    return camera;
}

export default function createStartScene(engine) {
    let that = {};
    let scene = (that.scene = new BABYLON.Scene(engine));

    let light = (that.light = createLight(scene));
    let camera = (that.camera = createArcRotateCamera(scene));
    let manager = (that.actionManager = actionManager(scene));
    let mesh1 = (that.mesh1 = importMesh(scene, 0, 0));
    addRotation(mesh1, scene);
    
    let ground = (that.ground = buildGround(scene));
    let skybox = (that.skybox = buildSkybox(scene));
    let dwellings = (that.dwellings = buildDwellings(scene));
    return that;
}

function buildSkybox(scene) {
    //Creates the skybox. For some reason placing this inside a function like the ground causes errors...
	var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/skybox", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;

    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogDensity = 0.01;
    scene.fogStart = 20.0;
    scene.fogEnd = 60.0;
    scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);
    return skybox;
}

const buildGround = () => {
    //Create Village ground
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/valleygrass.png");
    groundMat.diffuseTexture.hasAlpha = true;

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:24, height:24});
    ground.material = groundMat;

    //large ground
    const largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");
    largeGroundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/valleygrass.png");

    const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", "https://assets.babylonjs.com/environments/villageheightmap.png", 
        {width:150, height:150, subdivisions: 20, minHeight:0, maxHeight: 4});
    largeGround.material = largeGroundMat;
    largeGround.position.y = -0.01;
}

//Build Functions
const buildDwellings = () => {
    
    //calls a function which sets up the single house, and a default rotation and position for it.
    //This is classes as the first house type for the build house function, allowing the other building to be house type 2
    const singleHouse = buildHouse(1);
    singleHouse.rotation.y = -Math.PI / 16;
    singleHouse.position.x = -6.8;
    singleHouse.position.z = 2.5;

    //calls a function which sets up the double house, and a default rotation and position for it.
    //This is classes as the second house type for the build house function
    const doubleHouse = buildHouse(2);
    doubleHouse.rotation.y = -Math.PI / 16;
    doubleHouse.position.x = -4.5;
    doubleHouse.position.z = 3;

    //allows for creating the various houses around the map, giving each it's own location and rotation, while also deciding between whether it's a single or double house
    const places = []; //[house type, rotation, x, z]
    places.push([2, -Math.PI / 16, -12, -12 ]);
    places.push([2, -Math.PI / 3, 12, 12 ]);
    places.push([2, 15 * Math.PI / 24, 10, 4 ]);
    places.push([1, 15 * Math.PI / 1, 4, 10 ]);
    places.push([2, 15 * Math.PI / 12, -6, -3 ]);
    places.push([1, 5 * Math.PI / 4, 0, -1 ]);
    places.push([1, Math.PI + Math.PI / 2.5, 7, -3 ]);
    places.push([2, Math.PI + Math.PI / 2.1, -9, -5 ]);
    places.push([1, Math.PI + Math.PI / 2.25, 13, -7 ]);
    places.push([2, Math.PI / 19, 5, -10 ]);
    places.push([1, Math.PI / 18, 8, -12 ]);
    places.push([2, Math.PI / 7, 10, -5 ]);
    places.push([1, Math.PI / 2, -10, 7 ]);
    places.push([2, -Math.PI / 6, 4, 2 ]);
    places.push([1, -Math.PI / 14, 6, 4 ]);
    places.push([2, Math.PO / 7, -3, 13]);

    //Create instances from the first two that were built 
    const houses = [];
    for (let i = 0; i < places.length; i++) {
        if (places[i][0] === 1) {
            houses[i] = singleHouse.createInstance("house" + i);
        }
        else {
            houses[i] = doubleHouse.createInstance("house" + i);
        }
        houses[i].rotation.y = places[i][1];
        houses[i].position.x = places[i][2];
        houses[i].position.z = places[i][3];
    }
}

//function which creates a house by merging a box and roof mesh into a single house mesh
const buildHouse = (width) => {
    const box = buildBox(width);
    const roof = buildRoof(width);

    return BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);
}

//creates the box part of the house, assigning a material to it depending on which house type is being built
const buildBox = (width) => {
    //texture
    const boxMat = new BABYLON.StandardMaterial("boxMat");
    if (width == 2) {
        //uses a double texture for the double house, to make sure the main house texture is not stretched
        boxMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/semihouse.png") 
    }
    else {
        //uses a single width texture for the single house to fit properly
        boxMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/cubehouse.png");   
    }

    //options parameter to set different images on each side
    const faceUV = [];
    if (width == 2) {
        //sets the sides of the double house image, so the material is rotated correctly
        faceUV[0] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0); //rear face
        faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0); //front face
        faceUV[2] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //right side
        faceUV[3] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //left side
    }
    else {
        //sets the sides of the double house image, so the material is rotated correctly
        faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); //rear face
        faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); //front face
        faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0); //right side
        faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0); //left side
    }
    // top 4 and bottom 5 are not seen so not set

    //World Objects
    //creates the default box mesh and material, as well as a default starting y position
    const box = BABYLON.MeshBuilder.CreateBox("box", {width: width, faceUV: faceUV, wrap: true});
    box.material = boxMat;
    box.position.y = 0.5;

    return box;
}

const buildRoof = (width) => {
    //texture
    //sets a material textuer for the roof pieces
    const roofMat = new BABYLON.StandardMaterial("roofMat");
    roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg");

    const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
    roof.material = roofMat;
    roof.scaling.x = 0.75;
    roof.scaling.y = width;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.22;

    return roof;
}