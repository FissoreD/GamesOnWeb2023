import { FreeCamera, HemisphericLight, MeshBuilder, Scene, Sprite, SpriteManager, StandardMaterial, Texture, Vector3 } from "babylonjs";
import { canvas, engine, sphere1 } from "./main";
import { createWall } from "./tools";
export var light: HemisphericLight;
export var gravity: number;

export class MyScene extends Scene {
    constructor() {
        // This creates a basic Babylon Scene object (non-mesh)
        super(engine!)

        window.scene = this;

        this.createCamera()
        this.createLight()
        this.createGround()
        createWall()

        this.createSprites()

        // sphere1 = new Avatar(scene, "Well", "");
        gravity = -0.02;
        this.collisionsEnabled = true;

        this.beforeRender = () => {

            sphere1?.isJumping ? this.applyJump() : this.applyGravity()
        }
    }

    createCamera() {
        // This creates and positions a free camera (non-mesh)
        var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), this);

        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
    }

    createLight() {
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        light = new HemisphericLight("light1", new Vector3(0, 1, 0), this);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
    }

    createGround() {
        // Our built- shape. Params: name, width, depth, subdivs, scene
        var ground = MeshBuilder.CreateGround("ground1", { width: 50, height: 50, subdivisions: 2 }, this);
        const groundMaterial = new StandardMaterial("groundMaterial", this);
        groundMaterial.diffuseTexture = new Texture("./img/grass.png");
        ground.material = groundMaterial;
        ground.checkCollisions = true;
        //ground.rotate(Axis.Z, 0.5)

    }

    createSprites() {
        var spriteManagerTrees = new SpriteManager("grassesManager", "./img/herb.png", 2000, 800, this);

        //Creation of 2000 trees at random positions
        for (var i = 0; i < 2000; i++) {
            let herb = new Sprite("herb", spriteManagerTrees);
            herb.height = Math.random() * 2
            herb.width = Math.random() * 2
            herb.position.x = Math.random() * 50 - 25;
            herb.position.z = Math.random() * 50 - 25;
            herb.position.y = 0.5;
        }
    }

    applyGravity() {
        //sphere1?.moveWithCollisions(new Vector3(0, -0.5, 0))
        if (sphere1) {
            var hits = this.multiPickWithRay(sphere1.ray, (m) => { return m.isPickable });

            var filtered = (hits?.filter(e => e.pickedMesh?.name !== sphere1?.sphere.name))

            if (filtered !== undefined && filtered.length > 0) {
                var hit = filtered[0]
                if (hit !== null && hit.pickedPoint && sphere1.position.y > hit.pickedPoint.y + 1.2) {
                    sphere1.position.y += gravity
                }
            } else {
                sphere1.position.y += gravity * 4
            }
        }
    }

    applyJump() {
        if (sphere1) {
            var hits = this.multiPickWithRay(sphere1.jumpRay, (m) => { return m.isPickable });

            var filtered = (hits?.filter(e => e.pickedMesh?.name !== sphere1?.sphere.name))

            if (filtered !== undefined && filtered.length > 0) {
                var hit = filtered[0]
                if (hit !== null && hit.pickedPoint && sphere1.position.y < hit.pickedPoint.y - 1.2) {
                    sphere1.position.y -= gravity
                }
            } else {
                sphere1.position.y -= gravity * 6
            }
        }
    }

};