import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class BlasterScene extends THREE.Scene
{
	private readonly camera: THREE.PerspectiveCamera    

    private readonly gltfLoader = new GLTFLoader()

	constructor(camera: THREE.PerspectiveCamera)
	{
		super()

		this.camera = camera
	}

    async initialize()
    {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('app') as HTMLCanvasElement
        });
        renderer.setSize(width, height);

        // create the 4 targets
        const t1 = await this.createTarget()
        t1.position.x = 0
        t1.position.z = -3

        const t2 = await this.createTarget()
        t2.position.x = 1
        t2.position.z = -3

        const t3 = await this.createTarget()
        t3.position.x = 2
        t3.position.z = -3

        const t4 = await this.createTarget()
        t4.position.x = -2
        t4.position.z = -3

        this.add(t1, t2, t3, t4)


        this.camera.position.z = 1
	    this.camera.position.y = 0.5

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(0, 3, 2)

        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        this.add(dirLight, ambientLight);
    }

    update() {

    }

    private async createTarget()
    {
        const targetGltf = await this.gltfLoader.loadAsync('assets/target-small.glb')

        targetGltf.scene.rotateY(Math.PI * 0.5)

        return targetGltf.scene;
    }

    private async createBlaster()
    {
        const blasterGltf = await this.gltfLoader.loadAsync('assets/blaster-a.glb')

        return blasterGltf.scene;
    }

}