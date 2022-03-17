import { CSS3DRenderer, CSS3DObject } from "/threejs/CSS3DRenderer.js"

import { OrbitControls } from "/threejs/OrbitControls.js"

import { GLTFLoader } from "/threejs/GLTFLoader.js"

// camera... 

const camera = new THREE.PerspectiveCamera( 75, innerWidth/innerHeight, 0.1, 1000 );
camera.position.set(-12.5, 2, -2.2)
camera.rotation.order = "YXZ"

const loader = new GLTFLoader()
const raycaster = new THREE.Raycaster()

// scene...

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x3AC2FA);

const renderer = new THREE.WebGLRenderer({});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.BasicShadowMap
renderer.domElement.style.zIndex = 1; 
renderer.domElement.style.pointerEvents = "none"

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(-12.5, 2, -2.5)
controls.rotateSpeed *= -1
controls.maxPolarAngle = Math.PI/2
controls.maxDistance = 100
controls.enableDamping = true
controls.dampingFactor = 0.25
controls.enableZoom = true
controls.enablePan = false

// DOMrenderer

const DOMrenderer = new CSS3DRenderer();
DOMrenderer.setSize(innerWidth, innerHeight);
document.body.appendChild(DOMrenderer
.domElement);
DOMrenderer.domElement.appendChild(renderer.domElement)

const controls2 = new OrbitControls(camera, DOMrenderer.domElement )
controls2.target.set(-12.5, 2, -2.5)
controls2.rotateSpeed *= -1
controls2.maxPolarAngle = Math.PI/2
controls2.maxDistance = 100
controls2.enableDamping = true
controls2.dampingFactor = 0.25
controls2.enableZoom = true
controls2.enablePan = false

// move controls...

var isMove = false

function Move() {
  var r = camera.rotation.y
  var pi = Math.PI
  var x = controls.target.x
  var z = controls.target.z
  var px = camera.position.x
  var pz = camera.position.z
  if ((r*180/pi) <= -90 && (r*180/pi) > -180) {
    px = x-(0.3*Math.sin(-r))
    pz = z+(0.3*Math.cos(-r))
  }
  if ((r*180/pi) <= 180 && (r*180/pi) > 90) {
    px = x+(0.3*Math.sin(r))
    pz = z+(0.3*Math.cos(r))
  }
  if ((r*180/pi) <= 0 && (r*180/pi) > -90) {
    px = x-(0.3*Math.sin(-r))
    pz = z+(0.3*Math.cos(-r))
  }
  if ((r*180/pi) <= 90 && (r*180/pi) > 0) {
    px = x+(0.3*Math.sin(r))
    pz = z+(0.3*Math.cos(r))
  }
  var point = new THREE.Vector3(((3*x)-px)/1 , -0.1, ((3*z)-pz)/1)
  var direction = new THREE.Vector3(((3*x)-px)/2,-0.1,((3*z)-pz)/2)
  raycaster.set(direction, point)
  const intersects = raycaster.intersectObject(ways)
  if (intersects.length>0) {
  controls.target.x = ((3*x) - px) / 2
  controls2.target.x = ((3*x) - px) / 2
  controls.target.z = ((3*z) - pz) / 2
  controls2.target.z = ((3*z) - pz) / 2
  camera.position.x = (x + px) / 2
  camera.position.z = (z + pz) / 2
  }
}

var move = document.querySelector(".move")
move.addEventListener("mousedown", function() {
  isMove = true
  move.style.border = "3px solid blue"
  move.style.bottom = "12px"
  move.style.right = "12px"
})
move.addEventListener("mouseup", function() {
  isMove = false
  move.style.border = "0px solid blue"
  move.style.bottom = "15px"
  move.style.right = "15px"
})
move.addEventListener("touchstart", function() {
  isMove = true
  move.style.border = "3px solid blue"
  move.style.bottom = "12px"
  move.style.right = "12px"
})
move.addEventListener("touchend", function() {
  isMove = false
  move.style.border = "0px solid blue"
  move.style.bottom = "15px"
  move.style.right = "15px"
})

// lights...

const light = new THREE.AmbientLight(0xffffff,1)
light.position.set(0, 0, 0)
scene.add(light);

var dLight = new THREE.DirectionalLight(0xffffff, 0.2)
dLight.position.set(0, 25, -5)
dLight.target.position.set(0, 0, 0)
dLight.target.updateMatrixWorld()
dLight.castShadow = true;
dLight.shadow.camera.left = -30
dLight.shadow.camera.right = 30
dLight.shadow.camera.top = 30
dLight.shadow.camera.bottom = -30
scene.add(dLight)

// floor...

var floorGeo = new THREE.PlaneGeometry(25, 25)
var grassMat = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  map: new THREE.TextureLoader().load('/assets/grass.png')
})
var floorMat = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  map: new THREE.TextureLoader().load('/assets/floor.png')
})
var floor = new THREE.Mesh(floorGeo, floorMat)
floor.position.set(-12.5, 0, -12.5)
floor.rotation.x = Math.PI/2
floor.receiveShadow = true
scene.add(floor)
var grassA = new THREE.Mesh(floorGeo, grassMat)
grassA.position.set(-12.5, 0, 12.5)
grassA.rotation.x = Math.PI/2
grassA.receiveShadow = true
scene.add(grassA)
var grassB = new THREE.Mesh(floorGeo, grassMat)
grassB.position.set(12.5, 0, -12.5)
grassB.rotation.x = Math.PI / 2
grassB.receiveShadow = true
scene.add(grassB)
var grassC = new THREE.Mesh(floorGeo, grassMat)
grassC.position.set(12.5, 0, 12.5)
grassC.rotation.x = Math.PI / 2
grassC.receiveShadow = true
scene.add(grassC)

// road...

var roadGeo = new THREE.BoxGeometry(4.5,0.125,24.875)
var roadMat = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  map: new THREE.TextureLoader().load('/assets/road.png')
})
var road = new THREE.Mesh(roadGeo, roadMat)
road.position.set(-12.5, 0.0625, 12.56125)
road.receiveShadow = true
scene.add(road)

var pathGeo = new THREE.BoxGeometry(0.25,0.25,24.875)
var pathMat = new THREE.MeshPhongMaterial({
  color: 0x1BB0AA,
  side: THREE.DoubleSide,
})
var path1 = new THREE.Mesh(pathGeo, pathMat)
path1.position.set(-14.875, 0.125, 12.56125)
path1.receiveShadow = true
scene.add(path1)
var path2 = new THREE.Mesh(pathGeo, pathMat)
path2.position.set(-10.125, 0.125, 12.56125)
path2.receiveShadow = true
scene.add(path2)
var path0Geo = new THREE.BoxGeometry(5,0.5,0.25)
var path0Mat = new THREE.MeshPhongMaterial({
  color: 0x1BB0AA,
  side: THREE.DoubleSide,
})
var path0 = new THREE.Mesh(path0Geo, path0Mat)
path0.position.set(-12.5, 0, 0.0625)
path0.receiveShadow = true
scene.add(path0)

// walls...

var wallGeo = new THREE.BoxGeometry(25.1,5,0.1)
var wallMat = new THREE.MeshPhongMaterial({
  color: 0xB09D1B,
  side: THREE.DoubleSide,
})
var wallA = new THREE.Mesh(wallGeo, wallMat)
wallA.position.set(-25.05, 2.5, -12.5)
wallA.rotation.y = Math.PI/2
wallA.receiveShadow = true
scene.add(wallA)
var wallB = new THREE.Mesh(wallGeo, wallMat)
wallB.position.set(-12.5, 2.5, -25.05)
wallB.receiveShadow = true
scene.add(wallB)
var wallC = new THREE.Mesh(wallGeo, wallMat)
wallC.position.set(0.05, 2.5, -12.5)
wallC.rotation.y = Math.PI / 2
wallC.receiveShadow = true
scene.add(wallC)

var fwallGeo = new THREE.BoxGeometry(10,5,0.1)
var fwallMat = new THREE.MeshPhongMaterial({
  color: 0xB09D1B,
  side: THREE.DoubleSide,
})
var fwallA = new THREE.Mesh(fwallGeo, fwallMat)
fwallA.position.set(-20, 2.5, 0)
fwallA.receiveShadow = true
scene.add(fwallA)
var fwallB = new THREE.Mesh(fwallGeo, fwallMat)
fwallB.position.set(-5, 2.5, 0)
fwallB.receiveShadow = true
scene.add(fwallB)

// door...

function Door(p, l) {
var doorGeo = new THREE.BoxGeometry(l.x,l.y,l.z)
var doorMat = new THREE.MeshPhongMaterial({
  color: "black",
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.6
})
var door = new THREE.Mesh(doorGeo, doorMat)
door.position.set(p.x, p.y, p.z)
scene.add(door)
}
Door({x:-12.5,y:4.51,z:0},{x:4.99,y:1,z:0.1})
Door({x:-14.51,y:2.005,z:0},{x:0.99,y:4,z:0.1})
Door({x:-10.49,y:2.005,z:0},{x:0.99,y:4,z:0.1})

// roof... 

var roofGeo = new THREE.BoxGeometry(25.05,0.1,25.05)
var roofMat = new THREE.MeshPhongMaterial({
  color: 0xB09D1B,
  side: THREE.DoubleSide,
})
var roof0Mat = new THREE.MeshPhongMaterial({
  color: "white",
  side: THREE.DoubleSide,
  map: new THREE.TextureLoader().load('/assets/roof.png')
})
var roof = new THREE.Mesh(roofGeo, [roofMat, roofMat, roofMat, roof0Mat, roofMat, roofMat])
roof.position.set(-12.5, 5.05, -12.5)
scene.add(roof)

// racks...

function Racks(r, p, l) {

let n;
if(r==1 || r==-1) {
  n=1
} else {
  n=0
}

var rack = new THREE.Group()

var rack0Geo = new THREE.BoxGeometry(0.1,3.05,1)
var rack0Mat = new THREE.MeshPhongMaterial({
  color: 0x501A8A,
  side: THREE.DoubleSide,
})
var rack01 = new THREE.Mesh(rack0Geo, rack0Mat)
rack01.position.set(p.x-(n==1?0:l/2), 1.525, p.z-(n==1?l/2:0))
rack01.rotation.y = Math.PI/2*r
rack.add(rack01)
var rack02 = new THREE.Mesh(rack0Geo, rack0Mat)
rack02.position.set(p.x+(n==1?0:l/2), 1.525, p.z+(n==1?l/2:0))
rack02.rotation.y = Math.PI/2*r
rack.add(rack02)

var wrackGeo = new THREE.PlaneGeometry(l, 3.1)
var wrackMat = new THREE.MeshPhongMaterial({
  color: 0x501A8A,
  side: THREE.DoubleSide,
})
var wrack = new THREE.Mesh(wrackGeo, wrackMat)
wrack.position.set(p.x-(r==1?0.4:r==-1?-0.4:0), 1.5, p.z-(n==0?-0.4:0))
wrack.rotation.y = Math.PI/2*r
rack.add(wrack)

var shelfGeo = new THREE.BoxGeometry(l,0.1,0.99)
var shelfMat = new THREE.MeshPhongMaterial({
  color: 0x8DDBFF,
  side: THREE.DoubleSide,
})
for(var i=0; i<4; i++) {
var shelf = new THREE.Mesh(shelfGeo, shelfMat)
shelf.position.set(p.x, (0.5+(i*0.833)),p.z)
shelf.rotation.y = Math.PI/2*r
rack.add(shelf)
}

scene.add(rack)

} 

Racks(2, {x: -5.5, z:-0.5}, 5)
Racks(1, {x: -24.5, z:-11.25}, 7.5)
Racks(-1, {x: -19.5, z:-11.25}, 7.5)
Racks(1, {x: -24.5, z:-21.25}, 7.5)
Racks(-1, {x: -19.5, z:-21.25}, 7.5)
Racks(1, {x: -18.5, z:-11.25}, 7.5)
Racks(-1, {x: -13.5, z:-11.25}, 7.5)
Racks(1, {x: -18.5, z:-21.25}, 7.5)
Racks(-1, {x: -13.5, z:-21.25}, 7.5)
Racks(1, {x: -12.5, z:-11.25}, 7.5)
Racks(-1, {x: -7.5, z:-11.25}, 7.5)
Racks(1, {x: -12.5, z:-21.25}, 7.5)
Racks(-1, {x: -7.5, z:-21.25}, 7.5)
Racks(1, {x: -6.5, z:-11.25}, 7.5)
Racks(-1, {x: -0.5, z:-11.25}, 7.5)
Racks(1, {x: -6.5, z:-21.25}, 7.5)
Racks(-1, {x: -0.5, z:-21.25}, 7.5)

// products...

const products = [
  {
    id: "1",
    index: "1",
    name: "Lorem Ipsum dolar sit",
    cost: "99"
  },
  {
    id: "2",
    index: "1",
    name: "Lorem Ipsum dolar sit",
    cost: "99"
  },
  {
    id: "3",
    index: "1",
    name: "Lorem Ipsum dolar sit",
    cost: "99"
  },
 {
    id: "4",
    index: "2",
    name: "Lorem Ipsum dolar sit",
    cost: "999"
  },
  {
    id: "5",
    index: "2",
    name: "Lorem Ipsum dolar sit",
    cost: "999"
  },
  {
    id: "6",
    index: "2",
    name: "Lorem Ipsum dolar sit",
    cost: "999"
  },
  {
    id: "7",
    index: "3",
    name: "Lorem Ipsum dolar sit",
    cost: "99"
  },
  {
    id: "8",
    index: "3",
    name: "Lorem Ipsum dolar sit",
    cost: "99"
  },
  {
    id: "9",
    index: "3",
    name: "Lorem Ipsum dolar sit",
    cost: "99"
  },
 {
    id: "10",
    index: "4",
    name: "Lorem Ipsum dolar sit",
    cost: "999"
  },
  {
    id: "11",
    index: "4",
    name: "Lorem Ipsum dolar sit",
    cost: "999"
  },
  {
    id: "12",
    index: "4",
    name: "Lorem Ipsum dolar sit",
    cost: "999"
  },
  {
    id: "13",
    index: "5",
    name: "Lorem Ipsum dolar sit",
    cost: "99"
  },
  {
    id: "14",
    index: "5",
    name: "Lorem Ipsum dolar sit",
    cost: "99"
  },
  {
    id: "15",
    index: "5",
    name: "Lorem Ipsum dolar sit",
    cost: "99"
  },
  {
    id: "16",
    index: "6",
    name: "Lorem Ipsum dolar sit",
    cost: "999"
  },
  {
    id: "17",
    index: "6",
    name: "Lorem Ipsum dolar sit",
    cost: "999"
  },
  {
    id: "18",
    index: "6",
    name: "Lorem Ipsum dolar sit",
    cost: "999"
  },
  {
    id: "19",
    index: "7",
    name: "Lorem Ipsum dolar sit",
    cost: "99"
  },
  {
    id: "20",
    index: "7",
    name: "Lorem Ipsum dolar sit",
    cost: "99"
  },
  {
    id: "21",
    index: "7",
    name: "Lorem Ipsum dolar sit",
    cost: "99"
  },
  {
    id: "22",
    index: "8",
    name: "Lorem Ipsum dolar sit",
    cost: "999"
  },
  {
    id: "23",
    index: "8",
    name: "Lorem Ipsum dolar sit",
    cost: "999"
  },
  {
    id: "24",
    index: "8",
    name: "Lorem Ipsum dolar sit",
    cost: "999"
  },
]

function Products(a, i) {

var x, y, z, r
var e = products.findIndex(n=>n.id==products.filter(k=>k.index==i.toString())[a].id)

if(a<=5) {
  x = -((i-4>0?9-i:5-i)*6)-0.35
  z = -(i-4>0?18.25:8.25)-(a*1.2)
  y = 2.47
  r = 1
} else if(a>5 && a<= 11) {
  x = -((i-4>0?9-i:5-i)*6)-0.35
  z = -(i-4>0?18.25:8.25)-((a-6)*1.2)
  y = 1.64
  r = 1
} else if(a>11 && a<= 17) {
  x = -((i-4>0?9-i:5-i)*6)-0.35
  z = -(i-4>0?18.25:8.25)-((a-12)*1.2)
  y = 0.81
  r = 1
} else if(a>17 && a<=23) {
  x = -((i-4>0?9-i:5-i)*6)+4.35
  z = -(i-4>0?18.25:8.25)-((a-18)*1.2)
  y = 2.47
  r = -1
} else if(a>23 && a<= 29) {
  x = -((i-4>0?9-i:5-i)*6)+4.35
  z = -(i-4>0?18.25:8.25)-((a-24)*1.2)
  y = 1.64
  r = -1
} else if(a>29 && a<= 35) {
  x = -((i-4>0?9-i:5-i)*6)+4.35
  z = -(i-4>0?18.25:8.25)-((a-30)*1.2)
  y = 0.81
  r = -1
}

var product = new THREE.Group()

var prodGeo = new THREE.BoxGeometry(0.5, 0.5, 1)
var prodMat = new THREE.MeshPhongMaterial({
  color: "orange",
  side: THREE.DoubleSide,
  map: new THREE.TextureLoader().load('/assets/box.png')
})
var DOMmat = new THREE.MeshPhongMaterial({
  color: "black",
  side: THREE.DoubleSide,
  opacity: 0,
  blending: THREE.NoBlending
});
var prod = new THREE.Mesh(prodGeo, [DOMmat, prodMat, prodMat, prodMat, prodMat, prodMat])
prod.position.set(x, y, z)
prod.rotation.y = (r==-1?Math.PI:0)
product.add(prod)

var dom = document.createElement('div')
dom.id = "product"
dom.innerHTML = "<img src='https://ipfs.io/ipfs/QmWCK9EhMahzXSmFZfh8PBco1EZcqEiNp3UB1VH3ictryP'><div class='text'><p>"+products[e].name+"</p><span>$ "+products[e].cost+"</span></div>"
dom.addEventListener('click', () => {
  alert(1)
})
var obj = new CSS3DObject(dom)
obj.position.set(x+(r==1?0.25:r==-1?-0.25:0), y, z+(r==2?-0.25:0))
obj.scale.set(0.00065, 0.00065, 0.00065)
obj.rotation.y = Math.PI/2 *r
product.add(obj)

scene.add(product)

}

for(var i=1; i<9; i++) {
for(var a=0; a<products.filter(e=>e.index==i.toString()).length; a++) {
  Products(a, i)
}}

// profile...

function Profile(user) {

var profile = new THREE.Group()

var dashGeo = new THREE.PlaneGeometry(3, 1)
var dashMat = new THREE.MeshPhongMaterial({
  color: "black",
  side: THREE.DoubleSide,
  opacity: 0,
  blending: THREE.NoBlending
});
var dash = new THREE.Mesh(dashGeo, dashMat)
dash.position.set(-17, 3, -0.06)
dash.rotation.y = Math.PI
profile.add(dash)

var dom = document.createElement('div')
dom.id = "profile"
dom.innerHTML = "<div><img src='assets/profile.png'/><div class='text'><p>Address : <span>0xb3f5.....gbf6h5</span></p><p>Balance : <span>5.478 <i class='fab fa-ethereum'></i></span></p></div></div>"
var obj = new CSS3DObject(dom)
obj.position.copy(dash.position)
obj.rotation.copy(dash.rotation)
obj.scale.set(0.00195, 0.0013, 0.0013)
profile.add(obj)

scene.add(profile)

} Profile("0xb3c7du3hehd77fuehjejd7dh5")

// home...

loader.load("/assets/table.glb", (glb) => {
  var model = glb.scene
  model.position.set(-2, 1.1, -2.5)
  model.scale.set(0.5, 0.5, 0.5)
  model.traverse(function(e) {
    if (e.isMesh) {
      e.castShadow = true;
      e.receiveShadow = true
    }
  })
  model.rotation.y = Math.PI/2
  scene.add(model)
}, (xhr) => { }, (error) => { }
)

loader.load("/assets/wraith.glb", (glb) => {
  var model = glb.scene
  model.position.set(-1, 0, -2.5)
  model.scale.set(0.035, 0.035, 0.035)
  model.traverse(function(e) {
    if (e.isMesh) {
      e.castShadow = true;
      e.receiveShadow = true
    }
  })
  model.rotation.y = -Math.PI/2
  scene.add(model)
}, (xhr) => { }, (error) => { }
)

loader.load("/assets/cart.glb", (glb) => {
  var model = glb.scene
  model.position.set(-2.3, 0, -4.5)
  model.scale.set(0.015, 0.015, 0.015)
  model.traverse(function(e) {
    if (e.isMesh) {
      e.castShadow = true;
      e.receiveShadow = true
    }
  })
  model.rotation.y = (Math.PI/7)+Math.PI
  scene.add(model)
}, (xhr) => { }, (error) => { }
)

// decors...

loader.load("/assets/plant.glb", (glb) => {
  var model = glb.scene
  model.position.set(-16.3, 0, -0.2)
  model.scale.set(1.5, 1.5, 1.5)
  model.traverse(function(e) {
    if (e.isMesh) {
      e.castShadow = true;
      e.receiveShadow = true
    }
  })
  scene.add(model)
}, (xhr) => { }, (error) => { }
)

loader.load("/assets/plant.glb", (glb) => {
  var model = glb.scene
  model.position.set(-11.2, 0, -0.2)
  model.scale.set(1.5, 1.5, 1.5)
  model.traverse(function(e) {
    if (e.isMesh) {
      e.castShadow = true;
      e.receiveShadow = true
    }
  })
  scene.add(model)
}, (xhr) => { }, (error) => { }
)

loader.load("/assets/plant.glb", (glb) => {
  var model = glb.scene
  model.position.set(-25.7, 0, -15.6)
  model.scale.set(1.5, 1.5, 1.5)
  model.traverse(function(e) {
    if (e.isMesh) {
      e.castShadow = true;
      e.receiveShadow = true
    }
  })
  scene.add(model)
}, (xhr) => { }, (error) => { }
)

loader.load("/assets/plant.glb", (glb) => {
  var model = glb.scene
  model.position.set(-1.6, 0, -15.6)
  model.scale.set(1.5, 1.5, 1.5)
  model.traverse(function(e) {
    if (e.isMesh) {
      e.castShadow = true;
      e.receiveShadow = true
    }
  })
  scene.add(model)
}, (xhr) => { }, (error) => { }
)

// banner ads...

function Ads(img,p,r) {
var adGeo = new THREE.PlaneGeometry(2, 2);
var adMat = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  map: new THREE.TextureLoader().load(img)
}); 
var ad = new THREE.Mesh(adGeo, adMat);
ad.position.set(p.x, (r==0||r==-2?1.5:2), p.z);
ad.rotation.y = Math.PI/2 *r
scene.add(ad);
} 

Ads("/assets/ads.png",{x:-19,z:-7.43}, 0)
Ads("/assets/ads.png",{x:-13,z:-7.43}, 0)
Ads("/assets/ads.png",{x:-7,z:-7.43}, 0)
Ads("/assets/ads.png",{x:-19,z:-17.43}, 0)
Ads("/assets/ads.png",{x:-13,z:-15.07}, -2)
Ads("/assets/ads.png",{x:-7,z:-17.43}, 0)
Ads("/assets/ads.png",{x:-24.9,z:-16.25 }, 1)
Ads("/assets/ads.png",{x:-0.1,z:-16.25 }, -1)

// raycasting...

var wayGeo = new THREE.BufferGeometry()
const wayMat = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  color: "red"
})
let vertices = new Float32Array([
  -23.8, -0.1, -24.8,
  -20.2, -0.1, -24.8,
  -20.2, -0.1, -17.25,
  -17.8, -0.1, -17.25,
  -17.8, -0.1, -24.8,
  -14.2, -0.1, -24.8,
  -14.2, -0.1, -17.25,
  -11.8, -0.1, -17.25,
  -11.8, -0.1, -24.8,
  -8.2, -0.1, -24.8,
  
  -8.2, -0.1, -17.25,
  -5.8, -0.1, -17.25,
  -5.8, -0.1, -24.8,
  -1.2, -0.1, -24.8,
  -1.2, -0.1, -7.3,
  -1.2, -0.1, -1.2,
  -10, -0.1, -1.2,
  -10, -0.1, 0.2,
  0.2, -0.1, 0.2,
  0.2, -0.1, -25,
  25, -0.1, -25,
  
  25, -0.1, 25,
  0.2, -0.1, 25,
  -25, -0.1, 25,
  -25, -0.1, 0.2,
  -15, -0.1, 0.2,
  -15, -0.1, -1.2,
  -23.8, -0.1, -1.2,
  -23.8, -0.1, -7.3,
  -20.2, -0.1, -7.3,
  -20.2, -0.1, -15.25,
  
  -17.8, -0.1, -15.25,
  -17.8, -0.1, -7.3,
  -14.2, -0.1, -7.3,
  -14.2, -0.1, -15.25,
  -11.8, -0.1, -15.25,
  -11.8, -0.1, -7.3,
  -8.2, -0.1, -7.3,
  -8.2, -0.1, -15.25,
  -5.8, -0.1, -15.75,
  -5.8, -0.1, -7.3,
  
])
wayGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
wayGeo.setIndex([
  28, 0, 29,
  0, 29, 1,
  
  32, 4, 33,
  4, 33, 5,
  
  36, 8, 37,
  8, 37, 9,
  
  40, 12, 14,
  12, 14, 13,
  
  30, 2, 39,
  2, 39, 11,
  
  27, 28, 15,
  28, 15, 14,
  
  25, 17, 26,
  17, 26, 16,
  
  24, 22, 23,
  24, 22, 18,
  
  19, 21, 22,
  19, 21, 20,
  
])
const ways = new THREE.Mesh(wayGeo, wayMat)
scene.add(ways)

// controls...

var sRecognition= window.webkitSpeechRecognition
var recognition = new sRecognition()

var synthesis = window.speechSynthesis
var speaker = new SpeechSynthesisUtterance()

recognition.continuous = true

var mic = document.querySelector(".controlMic")
mic.addEventListener("click", function() {
  recognition.start()
})

recognition.onstart = function(event) {
  mic.style.border = "3px solid blue"
  mic.style.bottom = "12px"
  mic.style.left = "12px"
}

recognition.onend = function() { 
  mic.style.border = "0px solid blue"
  mic.style.bottom = "15px"
  mic.style.left = "15px"
}

recognition.onresult = function(event) {
  var current = event.resultIndex
  var text = event.results[current][0].transcript
  alert(text)
  speaker.text = text
  window.speechSynthesis.speak(speaker)
}

recognition.onerror = function(event) { 
  console.log(event)
}

// rendering...

function render() {
  controls.update();
  controls2.update()
  DOMrenderer.render(scene, camera);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
  if(isMove==true) {
    Move()
  }
} render();
