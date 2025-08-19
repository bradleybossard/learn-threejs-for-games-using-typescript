import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class BlasterScene extends THREE.Scene {
  private readonly camera: THREE.PerspectiveCamera;

  private readonly gltfLoader = new GLTFLoader();

  private readonly keyDown = new Set<string>();

  private blaster?: THREE.Group;

  private directionVector = new THREE.Vector3();

  constructor(camera: THREE.PerspectiveCamera) {
    super();

    this.camera = camera;
  }

  async initialize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("app") as HTMLCanvasElement,
    });
    renderer.setSize(width, height);

    // create the 4 targets
    const t1 = await this.createTarget();
    t1.position.x = 0;
    t1.position.z = -3;

    const t2 = await this.createTarget();
    t2.position.x = 1;
    t2.position.z = -3;

    const t3 = await this.createTarget();
    t3.position.x = 2;
    t3.position.z = -3;

    const t4 = await this.createTarget();
    t4.position.x = -2;
    t4.position.z = -3;

    this.add(t1, t2, t3, t4);

    this.blaster = await this.createBlaster();
    this.blaster.position.z = -1;
    this.add(this.blaster);

    this.blaster.add(this.camera);

    this.camera.position.z = 1;
    this.camera.position.y = 0.5;

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(0, 3, 2);

    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    this.add(dirLight, ambientLight);

    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    this.keyDown.add(event.key.toLowerCase());
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    this.keyDown.delete(event.key.toLowerCase());

    if (event.key === " ") {
      this.createBullet();
    }
  };

  private updateInput() {
    if (!this.blaster) {
      return;
    }

    const shiftKey = this.keyDown.has("shift");

    if (!shiftKey) {
      if (this.keyDown.has("a") || this.keyDown.has("arrowleft")) {
        this.blaster.rotateY(0.02);
      } else if (this.keyDown.has("d") || this.keyDown.has("arrowright")) {
        this.blaster.rotateY(-0.02);
      }
    }

    const dir = this.directionVector;

    this.camera.getWorldDirection(dir);

    const speed = 0.1;

    if (this.keyDown.has("w") || this.keyDown.has("arrowup")) {
      this.blaster.position.add(dir.clone().multiplyScalar(speed));
    } else if (this.keyDown.has("s") || this.keyDown.has("arrowdown")) {
      this.blaster.position.add(dir.clone().multiplyScalar(-speed));
    }

    if (shiftKey) {
      const strafeDir = dir.clone();
      const upVector = new THREE.Vector3(0, 1, 0);

      if (this.keyDown.has("a") || this.keyDown.has("arrowleft")) {
        this.blaster.position.add(
          strafeDir
            .applyAxisAngle(upVector, Math.PI * 0.5)
            .multiplyScalar(speed)
        );
      } else if (this.keyDown.has("d") || this.keyDown.has("arrowright")) {
        this.blaster.position.add(
          strafeDir
            .applyAxisAngle(upVector, Math.PI * -0.5)
            .multiplyScalar(speed)
        );
      }
    }
  }

  update() {
    this.updateInput();
  }

  private async createTarget() {
    const targetGltf = await this.gltfLoader.loadAsync(
      "assets/target-small.glb"
    );

    targetGltf.scene.rotateY(Math.PI * 0.5);

    return targetGltf.scene;
  }

  private async createBlaster() {
    const blasterGltf = await this.gltfLoader.loadAsync("assets/blaster-a.glb");

    return blasterGltf.scene;
  }

  private async createBullet() {
    if (!this.blaster) {
      return;
    }

    const bulletGltf = await this.gltfLoader.loadAsync(
      "assets/bullet-foam.glb"
    );

    this.camera.getWorldDirection(this.directionVector);

    const aabb = new THREE.Box3().setFromObject(this.blaster);
    const size = aabb.getSize(new THREE.Vector3());

    const vec = this.blaster.position.clone();
    vec.y += 0.06;

    bulletGltf.scene.position.add(
      vec.add(this.directionVector.clone().multiplyScalar(size.z * 0.5))
    );

    // rotate children to match gun for simplicity
    bulletGltf.scene.children.forEach((child) => child.rotateX(Math.PI * -0.5));

    // use the same rotation as as the gun
    bulletGltf.scene.rotation.copy(this.blaster.rotation);

    this.add(bulletGltf.scene);
  }
}
