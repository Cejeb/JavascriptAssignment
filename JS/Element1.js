const createScene =  () => {
    const scene = new BABYLON.Scene(engine);

    //Set camera and light
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
    
    //calls a function to setup the ground for the area.
    const ground = buildGround();

    //calls a function to create the actual buildings in the world
    buildDwellings();
    
    return scene;
}

const buildGround = () => {
    //sets the material and colour of the ground
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
    
    //gives the ground a proper mesh and assigns the material to it.
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:30, height:30});
    ground.material = groundMat;
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