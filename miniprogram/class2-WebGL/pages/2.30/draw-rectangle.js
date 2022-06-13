import {
  mat4
} from '../../lib/gl-matrix'

// 绘制一个正方形
function drawRectangle(gl) {

  // 顶点着色器
  // vec4=(1.0,1.0,1.0,1.0)
  // mat4=尺寸为4x4的浮点型矩阵
  // attribute？
  const vsSource = `
attribute vec4 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}`;

  // Fragment shader program
  // 片段着色器
  const fsSource = `
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attribute our shader program is using
  // for aVertexPosition and look up uniform locations.
  // 将前面创建的着色器中的数据，取出来给webgl绘制
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };
  //  gl.getUniformLocation：取得uniform attribute的位置
  // 是从ELES代码中获取到的地址
  // 这个对象不是必须的，但有了会方便简洁

  // 一个Javascript 数组去记录每一个正方体的每一个顶点
  // 有一个顶点，有几行，每行可以有1，2，3或4个值，与下面的size对应
  // 这个是顶点缓存对象，可以是2，或3
  // 顶点顺序：右上、左上、右下、左下
  // const positions = [
  //   1.0,  1.0,  0.0,
  //   -1.0, 1.0,  0.0,
  //   1.0,  -1.0, 0.0,
  //   -1.0, -1.0, 0.0,
  // ];
  // const positions = [
  //   0.5,  0.5,  0.0,
  //   -0.5, 0.5,  0.0,
  //   0.5,  -0.5, 0.0,
  //   -0.5, -0.5, 0.0,
  // ];
  // 白色
  const positions = [
    0.5, 0.5, 2,
    -0.5, 0.5, 2,
    0.5, -0.5, 2,
    -0.5, -0.5, 2,
  ];

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl, positions);

  // Draw the scene
  drawScene(gl, programInfo, buffers, true);

  drawRectangle1(gl)
}

function drawRectangle1(gl) {

  // 顶点着色器
  // vec4=(1.0,1.0,1.0,1.0)
  // mat4=尺寸为4x4的浮点型矩阵
  // attribute？
  const vsSource = `
  attribute vec4 aVertexPosition;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }`;

  // Fragment shader program
  // 片段着色器
  const fsSource = `
void main() {
  gl_FragColor = vec4(1, 0, 0, 1.0);
}`;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attribute our shader program is using
  // for aVertexPosition and look up uniform locations.
  // 将前面创建的着色器中的数据，取出来给webgl绘制
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  //  gl.getUniformLocation：取得uniform attribute的位置
  // 是从ELES代码中获取到的地址
  // 这个对象不是必须的，但有了会方便简洁

  // 一个Javascript 数组去记录每一个正方体的每一个顶点
  // 有一个顶点，有几行，每行可以有1，2，3或4个值，与下面的size对应
  // 这个是顶点缓存对象，可以是2，或3
  // 顶点顺序：右上、左上、右下、左下
  // const positions = [
  //   1.0,  1.0,  0.0,
  //   -1.0, 1.0,  0.0,
  //   1.0,  -1.0, 0.0,
  //   -1.0, -1.0, 0.0,
  // ];
  // 红色
  const positions = [
    1, 1, 1,
    0, 1, 1,
    1, 0, 1,
    0, 0, 1,
  ];
  // const positions = [
  //   0.7,  0.5,  0.0,
  //   -0.3, 0.5,  0.0,
  //   0.7,  -0.5, 0.0,
  //   -0.3, -0.5, 0.0,
  // ];

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl, positions);

  // Draw the scene
  drawScene(gl, programInfo, buffers, false);
}

function initBuffers(gl, positions) {

  // Create a buffer for the square's positions.

  // 调用 gl 的成员函数 createBuffer() 得到了缓冲对象并存储在顶点缓冲器
  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  // 调用 bindBuffer() 函数绑定上下文
  // bindBuffer()方法将给定的WebGLBuffer绑定到目标。
  // void gl.bindBuffer(target, buffer);
  // webgl绘制时，是从缓存中取数据，gl.ARRAY_BUFFER就是待取的位置之一
  // gl.ARRAY_BUFFER: 包含顶点属性的Buffer，如顶点坐标，纹理坐标数据或顶点颜色数据。
  // gl.ELEMENT_ARRAY_BUFFER: 用于元素索引的Buffer。
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the square.



  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  // bufferData()方法创建并初始化了Buffer对象的数据存储区。
  // 将其传到 gl 对象的  bufferData() 方法来建立对象的顶点。
  // 
  // 参数2 如果为null，数据存储区仍会被创建，但是不会进行初始化和定义。
  // 
  gl.bufferData(gl.ARRAY_BUFFER, //gl.ARRAY_BUFFER: 包含顶点属性的Buffer，如顶点坐标，纹理坐标数据或顶点颜色数据。
    new Float32Array(positions), //然后将其转化为 WebGL 浮点型类型的数组,一个ArrayBuffer，SharedArrayBuffer 或者 ArrayBufferView 类型的数组对象
    gl.STATIC_DRAW);


  return {
    position: positionBuffer
  };
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, clearScreen) {
  if (clearScreen) {
    // 指定调用 clear() 方法时使用的颜色值，void gl.clearColor(red, green, blue, alpha);
    // 每个值都在0~1之间
    gl.clearColor(0, 0.0, 0.0, 1.0); // Clear to black, fully opaque，#000000黑色
    // gl.clearColor(0.0, 0.0, 0.0, 1.0); 
    // gl.clearColor(0.0, 0.0, 0.0, 1.0); 

    // 是当清除深度缓冲区的时候使用，默认值为1，清扫所有
    gl.clear(1.0); // Clear everything
    // Clear the canvas before we start drawing on it.
    // 清理，使用上面指定的颜色黑色
    // 用背景色擦除画布
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
  console.log('clearScreen', clearScreen);

  // enable() 方法，用于对该上下文开启某种特性。
  // 如果不指定,按先后顺序
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things


  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  // 
  // zNear:到更近的深度裁剪平面的距离。
  // 沿z轴方向的两裁面之间的距离的近处(正数)
  const zNear = 0.1;
  // zFar:到更远的深度裁剪平面的距离
  // 沿z轴方向的两裁面之间的距离的远处(正数)
  const zFar = 100.0;

  // zNear:到更近的深度裁剪平面的距离。
  // const zNear = 10;
  // zFar:到更远的深度裁剪平面的距离
  // const zFar = 0.1;

  // 接着建立摄像机透视矩阵。设置45度的视图角度，fieldOfView
  // 并且设置一个适合实际图像的宽高比。 aspect
  // 指定在摄像机距离0.1到100单位长度的范围内的物体可见。zNear~zFar
  // projection 是投射，这里是摄像机映射距阵
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix,
    fieldOfView,
    aspect,
    zNear,
    zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  // 模型视图距阵
  // 加载特定位置，并把正方形放在距离摄像机6个单位的的位置
  mat4.translate(modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, -6.0]); // amount to translate

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  // 区块作用域
  {
    // 这与上面的点位置信息对应
    const numComponents = 3;
    const type = gl.FLOAT; //浮点
    const normalize = false;
    const stride = 0;
    const offset = 0;

    // 绑定正方形的顶点缓冲到上下文gl
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);

    // size = numComponents，指定每个顶点属性的组成数量，必须是1，2，3或4。
    // void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);

    // 绑定顶点属性的
    // vertexAttribPointer()方法，
    // 绑定当前缓冲区范围到gl.ARRAY_BUFFER,成为当前顶点缓冲区对象的，通用顶点属性，并指定它的布局
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride, //如果stride为0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块中，下一个顶点的属性紧跟当前顶点之后。
      offset); //指定顶点属性数组中第一部分的字节偏移量

    // 属性有多个，为了激活属性，以便可用
    // 作用于顶点的数据会先储存在attributes。这些数据仅对JavaScript代码和顶点着色器可用。属性由索引号引用到GPU维护的属性列表中。
    // 使用enableVertexAttribArray()方法，来激活每一个属性以便使用，不被激活的属性是不会被使用的。
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL to use our program when drawing

  // 使用着色器程序
  gl.useProgram(programInfo.program);

  // Set the shader uniforms
  // 方法为 uniform variables 指定了矩阵值 
  // uniformMatrix[234]fv() 方法为 uniform variables 指定了矩阵值 
  // 该方法的3个版本 (uniformMatrix2fv(), uniformMatrix3fv(), 和unifomMatrix4fv()) 
  // 分别以二阶,三阶,和四阶方阵作为输入值,它们应是分别具有4,9,16个浮点数的数组
  // uniformMatrix4fv(location, transpose, value); 
  // transpose:指定是否转置矩阵。必须为 false.
  // location:对象包含了要修改的 uniform attribute位置
  // value:Float32Array 型或者是 GLfloat 序列值
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix);

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix);

  // 通过调用 drawArrays() 方法来画出对象
  // void gl.drawArrays(mode, first, count);
  // drawArrays()方法用于从向量数组中绘制图元。
  // mode 指定绘制图元的方式,gl.TRIANGLE_STRIP：绘制一个三角带。
  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

// 
//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  // 顶点着色器和片段着色器的集合，称之为着色器程序。
  // 
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
// 创建指定类型的着色器，上传source源码并编译
function loadShader(gl, type, source) {
  // 调用gl.createShader().创建一个新的着色器。
  const shader = gl.createShader(type);

  // Send the source to the shader object

  // 上传源码
  // 调用gl.shaderSource().将源代码发送到着色器。
  gl.shaderSource(shader, source);

  // Compile the shader program

  // 编译
  // 一旦着色器获取到源代码，就使用gl.compileShader().进行编译。
  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}


export default drawRectangle