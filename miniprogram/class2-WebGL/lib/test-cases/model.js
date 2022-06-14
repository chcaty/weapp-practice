import { registerGLTFLoader } from '../loaders/gltf-loader'
import registerOrbit from "./orbit"

export function renderModel(canvas, THREE) {

  // glTF是一种开放格式的规范，用于更高效地传输、加载3D内容。
  // 是为了使用GLTFLoader，与下面的registerOrbit类似
  registerGLTFLoader(THREE)

  var container, stats, clock, gui, mixer, actions, activeAction, previousAction;
  var camera, scene, renderer, model, face, controls;
  var api = { state: 'Walking' };

  init();
  animate();

  function init() {

    // 创建透视相机，这一透视相机，被用来模拟人眼所看到的景象，这是3D场景渲染中使用最普遍的投影模式。
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.25, 100);
    // 设置相机位置
    camera.position.set(- 5, 3, 10);
    // 相机看向哪个坐标
    camera.lookAt(new THREE.Vector3(0, 2, 0));

    // 创建场景
    // 一个放置物体、灯光和摄像机的地方。
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe0e0e0);
    // 雾，线性雾，雾的密度是随着距离线性增大的
    scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);

    // Three.js时钟对象
    // 是为了计时用的，相当于代替requestAnimationFrame返回时间差
    clock = new THREE.Clock();

    // 创建光源
    // 半球光
    // 光源直接放置于场景之上，光照颜色从天空光线颜色，渐变到地面光线颜色。
    // 不能投射阴影。
    // skyColor : 0xffffff, groundColor : 0x444444,
    var light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 20, 0);
    scene.add(light);
    // 平行光，常用平行光来模拟太阳光的效果
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 20, 10);
    scene.add(light);

    /// 构造带网格的大地辅助
    // 网格Mesh
    // 平面几何体PlaneGeometry，PlaneBufferGeometry是PlaneGeometry中的BufferGeometry接口，使用 BufferGeometry 可以有效减少向 GPU 传输上述数据所需的开销。
    // MeshPhongMaterial，一种用于具有镜面高光表面的材质。
    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
    mesh.rotation.x = - Math.PI / 2;
    scene.add(mesh);
    // 坐标格辅助对象，坐标格实际上是2维数组
    var grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    // 创建加载器，加载模型文件
    var loader = new THREE.GLTFLoader();
    // .GLB 文件
    // 文件类似于GLTF文件，因为它们可能包含嵌入式资源，也可能引用外部资源。如果一个.GLB 文件带有单独的资源，它们很可能是以下文件：
    // 二进制（.BIN ）文件-包含动画、几何图形和其他数据的一个或多个BIN文件。
    // 着色器（GLSL）文件-一个或多个包含着色器的GLSL文件。
    // 图像（.JPG 、.PNG 等）文件-包含三维模型纹理的一个或多个文件。

    loader.load('https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb', function (gltf) {
      // gltf.animations; // Array<THREE.AnimationClip>
      // gltf.scene; // THREE.Group
      // gltf.scenes; // Array<THREE.Group>
      // gltf.cameras; // Array<THREE.Camera>
      // gltf.asset; // Object  
      model = gltf.scene;//三维物体的组
      scene.add(model);
      // 
      createGUI(model, gltf.animations)
    }, undefined, function (e) {
      console.error(e);
    });

    // 创建渲染器，渲染场景
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(wx.getSystemInfoSync().pixelRatio);
    renderer.setSize(canvas.width, canvas.height);
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;

    // 创建控制器
    // Orbit controls，轨道控制器，可以使得相机围绕目标进行轨道运动
    // 表现就是可以使用鼠标或手指旋转物体
    // 在外部需要事件配合传入
    // registerOrbit是为了使用轨道控制器
    const { OrbitControls } = registerOrbit(THREE)
    controls = new OrbitControls(camera, renderer.domElement);

    camera.position.set(5, 5, 10);
    controls.update();
  }

  // 创建混合器
  // 处理动作
  function createGUI(model, animations) {
    var states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
    var emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];
    // 创建帧动画混合器对象AnimationMixer，主要用于播放帧动画，可以播放所有子对象所绑定的帧动画，
    // 执行混合器对象AnimationMixer的方法.clipAction(clip)把包含关键帧数据的剪辑对象AnimationClip作为参数，会返回一个帧动画操作对象AnimationAction，通过AnimationAction对象的方法.play()可以播放帧动画。
    mixer = new THREE.AnimationMixer(model);
    actions = {};
    for (var i = 0; i < animations.length; i++) {
      var clip = animations[i];
      // 取出帧动画操作对象AnimationAction，以备播放用
      var action = mixer.clipAction(clip);
      actions[clip.name] = action;
      // 
      if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
        // 暂停在最后一帧播放的状态
        action.clampWhenFinished = true;
        // 不循环播放
        action.loop = THREE.LoopOnce;
      }
      console.log('clip.name', clip.name);

    }
    // expressions
    // 检索对象的子类对象，然后返回第一个匹配到name的
    // 没有用到
    face = model.getObjectByName('Head_2');

    // 默认的动作
    activeAction = actions['WalkJump'];
    activeAction.play();
  }

  // 平滑切换动作
  function fadeToAction(name, duration = 1) {
    previousAction = activeAction;

    activeAction = actions[name];
    if (previousAction !== activeAction) {
      previousAction.fadeOut(duration);
    }
    // 链式调用
    // TimeScale是时间的比例因子. 值为0时会使动画暂停。值为负数时动画会反向执行。默认值是1。
    // weight，动作的影响程度，取值范围[0, 1]。0 =无影响，1=完全影响，之间的值可以用来混合多个动作。默认值是1
    activeAction
      .reset()
      .setEffectiveTimeScale(1)//设置时间比例（timeScale）以及停用所有的变形
      .setEffectiveWeight(1)//设置权重weight，以及停止所有淡入淡出
      .fadeIn(duration)//在传入的时间间隔内，逐渐将此动作的权重weight，由0升到1
      .play();//让混合器激活动作
  }

  // 循环渲染场景
  function animate() {
    // 简单说.getDelta ()方法的功能就是获得前后两次执行该方法的时间间隔
    // 返回间隔时间单位是秒
    var dt = clock.getDelta();
    if (mixer) mixer.update(dt);//更新混合器，是动画关键
    canvas.requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
  }

  return fadeToAction
}