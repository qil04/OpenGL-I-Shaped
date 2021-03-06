var canvas;
var gl;
var program;

var points = [];
var indices = [];
var UVs = [];
var normals = [];
var nFaces;

var axis = 0;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var theta = [0, 0, 0];

var displacement_y = 2.;
var velocity_y = 0.;
var pvelocity_y = 0;
var pause = false;

window.onload = function init()
{
    initGL();

    cube();

    rectangle();

    initTexture();

    //event listeners for buttons

    document.getElementById("xButton").onclick = function () {
        axis = xAxis;
    };
    document.getElementById("yButton").onclick = function () {
        axis = yAxis;
    };
    document.getElementById("zButton").onclick = function () {
        axis = zAxis;
    };
    document.getElementById("sButton").onclick = function () {
        axis = null
    };

    document.onkeydown = OnKeyDown;

    render();
}

function initGL()
{
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
}

var buffers = [];
function rectangle()
{
    r = 0.2;
    R = 1.;

    var xRes = 40;
    var yRes = 40;
    for (i = 0; i <= xRes; i++) {
        for (j = 0; j <= yRes; j++) {
            phi = Math.PI * (i * 2. / xRes - 1.);
            psi = Math.PI * (j * 2. / yRes - 1.);
            points.push(vec3(Math.cos(phi) * (R + Math.cos(psi) * r), Math.sin(phi) * (R + Math.cos(psi) * r), Math.sin(psi) * r));
            UVs.push(phi / Math.PI * 5., psi / Math.PI);
            normals.push(Math.cos(phi) * Math.cos(psi), Math.sin(phi) * Math.cos(psi), Math.sin(psi));
        }
    }

    for (i = 0; i < xRes; i++) {
        for (j = 0; j < yRes; j++) {
            indices.push([i * (yRes + 1) + j, (i + 1) * (yRes + 1) + j, (i + 1) * (yRes+1) + j + 1]);
            indices.push([i * (yRes + 1) + j, (i + 1) * (yRes + 1) + j + 1, i * (yRes + 1) + j + 1]);
        }
    }

    nFaces = indices.length;

    //Create buffer to store the vertex coordinates
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    buffers.push(vBuffer);

    //Create buffer to store the normals
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
    buffers.push(nBuffer);

    //Create buffer to store the texture coordinates
    var tcBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(UVs), gl.STATIC_DRAW);
    buffers.push(tcBuffer);

    //Create buffer to store the triangle elements
    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(flatten(indices)), gl.STATIC_DRAW);
    buffers.push(tBuffer);
}

var points2 = [];
var normals2 = [];
var UVs2 = [];
var indices2 = [];
var buffers2 = [];

var points3 = [];
var normals3 = [];
var UVs3 = [];
var indices3 = [];
var buffers3 = [];

function cube() {
    points2.push(
        vec3(-0.25, -0.85, 0.25),
        vec3(-0.25, 1.35, 0.25),
        vec3(0.25, 1.35, 0.25),
        vec3(0.25, -0.85, 0.25),
        vec3(-0.25, -0.85, -0.25),
        vec3(-0.25, 1.35, -0.25),
        vec3(0.25, 1.35, -0.25),
        vec3(0.25, -0.85, -0.25)
        );
    
    points3.push(
        vec3(-0.25, -1.6, 0.25),
        vec3(-0.25, -1.1, 0.25),
        vec3(0.25, -1.1, 0.25),
        vec3(0.25, -1.6, 0.25),
        vec3(-0.25, -1.6, -0.25),
        vec3(-0.25, -1.1, -0.25),
        vec3(0.25, -1.1, -0.25),
        vec3(0.25, -1.6, -0.25)
        );
    
    //Inaccurate normals just for testing.
    normals2.push (
        normalize(vec3(-0.25, -0.85, 0.25)),
        normalize(vec3(-0.25, 1.35, 0.25)),
        normalize(vec3(0.25, 1.35, 0.25)),
        normalize(vec3(0.25, -0.85, 0.25)),
        normalize(vec3(-0.25, -0.85, -0.25)),
        normalize(vec3(-0.25, 1.35, -0.25)),
        normalize(vec3(0.25, 1.35, -0.25)),
        normalize(vec3(0.25, -0.85, -0.25))
        );
    
    normals3.push (
        normalize(vec3(-0.25, -1.6, 0.25)),
        normalize(vec3(-0.25, -1.1, 0.25)),
        normalize(vec3(0.25, -1.1, 0.25)),
        normalize(vec3(0.25, -1.6, 0.25)),
        normalize(vec3(-0.25, -1.6, -0.25)),
        normalize(vec3(-0.25, -1.1, -0.25)),
        normalize(vec3(0.25, -1.1, -0.25)),
        normalize(vec3(0.25, -1.6, -0.25))
        );

    UVs2.push(
	vec2(0., 0.),
	vec2(1., 0.),
	vec2(1., 1.),
	vec2(0., 1.),
	vec2(1., 1.),
	vec2(0., 1.),
	vec2(0., 0.),
	vec2(1., 0.),

    vec2(1., 0.),
	vec2(0., 0.),
	vec2(0., 1.),
	vec2(1., 1.)
    );
    
    UVs3.push(
        vec2(0., 0.),
        vec2(1., 0.),
        vec2(1., 1.),
        vec2(0., 1.),
        vec2(1., 1.),
        vec2(0., 1.),
        vec2(0., 0.),
        vec2(1., 0.)
    );

    indices2.push(
        1, 0, 3, 1, 3, 2,
        2, 3, 7, 2, 7, 6,
        3, 0, 4, 3, 4, 7,
        6, 5, 1, 6, 1, 2,
        4, 5, 6, 4, 6, 7,
        5, 4, 0, 5, 0, 1
    );
    
    indices3.push(
        1, 0, 3, 1, 3, 2,
        2, 3, 7, 2, 7, 6,
        3, 0, 4, 3, 4, 7,
        6, 5, 1, 6, 1, 2,
        4, 5, 6, 4, 6, 7,
        5, 4, 0, 5, 0, 1
    );

    var vBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points2), gl.STATIC_DRAW);
    buffers2.push(vBuffer2);

    var nBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals2), gl.STATIC_DRAW);
    buffers2.push(nBuffer2);

    var tcBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(UVs2), gl.STATIC_DRAW);
    buffers2.push(tcBuffer2);

    var tBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tBuffer2);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(flatten(indices2)), gl.STATIC_DRAW);
    buffers2.push(tBuffer2);

    //
    var vBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points3), gl.STATIC_DRAW);
    buffers3.push(vBuffer3);

    var nBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals3), gl.STATIC_DRAW);
    buffers3.push(nBuffer3);

    var tcBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(UVs3), gl.STATIC_DRAW);
    buffers3.push(tcBuffer3);

    var tBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tBuffer3);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(flatten(indices3)), gl.STATIC_DRAW);
    buffers3.push(tBuffer3);
}

var squareTexture;
var letterTexture;

function initTexture() {
    squareTexture = gl.createTexture();
    var squareImage = new Image();
    squareImage.onload = function () { handleTextureLoaded(squareImage, squareTexture); }
    squareImage.src = "Material/plank01.bmp";

    letterTexture = gl.createTexture();
    var letterImage = new Image();
    letterImage.onload = function () { handleTextureLoaded(letterImage, letterTexture); }
    letterImage.src = "Material/marble10.png";
}

function handleTextureLoaded(image, texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}


function render()
{   
    if (pause == false) {
        velocity_y = 0.9999 * velocity_y - 0.1;
        displacement_y = displacement_y + velocity_y * 0.03;
        if (displacement_y < -2.) {
            displacement_y = -2.;
            velocity_y = -velocity_y;
            if (velocity_y == 0) {
                velocity_y=2
            }
        }
    }
    gl.uniform1f(gl.getUniformLocation(program, "displacement_y"), displacement_y);

    theta[axis] += 2.0;
    gl.uniform3fv(gl.getUniformLocation(program, "theta"), theta);

    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, squareTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uSampler"), 0);
    
    //Link data to vertex shader input
    var vPosition = gl.getAttribLocation(program, "vPosition");
    var vNormal = gl.getAttribLocation(program, "vNormal");
    var vUV = gl.getAttribLocation(program, "vUV");

    //Draw letter
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers2[0]);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers2[1]);
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers2[2]);
    gl.vertexAttribPointer(vUV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vUV);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffers2[3]);

    gl.uniform1i(gl.getUniformLocation(program, "useTexture"), true);
    gl.uniform1i(gl.getUniformLocation(program, "useShading"), true);
    gl.drawElements(gl.TRIANGLES, 12 * 3, gl.UNSIGNED_SHORT, 0);

    //Draw samll cube
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers3[0]);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers3[1]);
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers3[2]);
    gl.vertexAttribPointer(vUV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vUV);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffers3[3]);

    gl.uniform1i(gl.getUniformLocation(program, "useTexture"), true);
    gl.uniform1i(gl.getUniformLocation(program, "useShading"), true);
    gl.drawElements(gl.TRIANGLES, 12 * 3, gl.UNSIGNED_SHORT, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, letterTexture);
    //Draw Torus
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0]);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[1]);
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[2]);
    gl.vertexAttribPointer(vUV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vUV);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers[3]);

    gl.uniform1i(gl.getUniformLocation(program, "useTexture"), true);
    gl.uniform1i(gl.getUniformLocation(program, "useShading"), true);
    gl.drawElements(gl.TRIANGLES, nFaces * 3, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(render);
}

function OnKeyDown(event)
{
    if (event.keyCode == 37) {
        theta[1] -= 30.0;
    }
    if (event.keyCode == 38) {
        theta[0] -= 30.0;
    }
    if (event.keyCode == 39) {
        theta[1] += 30.0;
    }
    if (event.keyCode == 40) {
        theta[0] += 30.0;
    }
    if (event.keyCode == 80) {
        if (pause == false) {
            pause = true;
            pvelocity_y = velocity_y;
            velocity_y = 0.0;
        }
        else {
            pause = false;
            velocity_y = pvelocity_y;
        }
    }
}