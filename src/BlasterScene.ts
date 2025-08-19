import * as THREE from 'three'


export default class BlasterScene extends THREE.Scene
{
	initialize()
	{
        const width = window.innerWidth;
        const height = window.innerHeight;

        const renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('app') as HTMLCanvasElement
        });
        renderer.setSize(width, height);

        const mainCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
        this.add(mainCamera);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 1, -5);
        this.add(cube);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        this.add(light);

        renderer.render(this, mainCamera);
    }
}