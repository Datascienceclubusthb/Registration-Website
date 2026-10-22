// Original DSC landscape: deterministic voxel geometry, pixel textures, real lighting.
// This is rendered once as a static image; no WebGL runs on the public website.
import * as THREE from '/three/three.module.js';
let seed = 78131;
const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const renderer = new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setSize(2200,1300); renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color('#cbd0c8'); scene.fog = new THREE.Fog('#cbd0c8',45,170);
const camera = new THREE.PerspectiveCamera(48,2200/1300,.1,400);
camera.position.set(-28,19,35); camera.lookAt(5,6,-22);
scene.add(new THREE.HemisphereLight('#dae1df','#626448',2.4));
const sunlight = new THREE.DirectionalLight('#ffe6b5',3.1);
sunlight.position.set(45,65,-32); sunlight.castShadow=true;
sunlight.shadow.mapSize.set(2048,2048); Object.assign(sunlight.shadow.camera,{left:-60,right:60,top:60,bottom:-60,near:1,far:160}); sunlight.shadow.normalBias=.04; scene.add(sunlight);
const cube = new THREE.BoxGeometry(1,1,1);
function texture(base, variation=16, grass=false) {
 const canvas=document.createElement('canvas');canvas.width=canvas.height=16;const context=canvas.getContext('2d');
 for(let y=0;y<16;y++)for(let x=0;x<16;x++){
   const color=new THREE.Color(grass&&y<3?'#708657':base); const offset=(random()-.5)*variation/255;
   color.r=Math.max(0,color.r+offset);color.g=Math.max(0,color.g+offset);color.b=Math.max(0,color.b+offset);
   context.fillStyle=`#${color.getHexString()}`;context.fillRect(x,y,1,1);
 }
 const map=new THREE.CanvasTexture(canvas);map.magFilter=THREE.NearestFilter;map.minFilter=THREE.NearestFilter;map.colorSpace=THREE.SRGBColorSpace;return map;
}
function material(color,noise=12,grass=false){return new THREE.MeshStandardMaterial({map:texture(color,noise,grass),roughness:1})}
const grass=material('#708657',14),dirt=material('#635544',16),stone=material('#929487',15),wood=material('#88714d',19),trunk=material('#514333',14),leaves=material('#365840',14),roof=material('#5c6e61',10);
function mesh(x,y,z,w,h,d,mat){const obj=new THREE.Mesh(cube,mat);obj.position.set(x,y+h/2,z);obj.scale.set(w,h,d);obj.castShadow=true;obj.receiveShadow=true;scene.add(obj);return obj;}
function terrain(x,z){
 const river = 1+Math.sin(z*.06)*5;
 if(Math.abs(x-river)<5)return -1;
 if(x>11&&x<32&&z>-36&&z<-10)return 8;
 let h=3+Math.sin(x*.095)*2+Math.cos(z*.083)*2;
 h+=Math.max(0,-z-40)*.2;
 if(x<-23)h+=Math.min(12,(-x-23)*.2);
 return Math.max(1,Math.floor(h));
}
const cells=[];
for(let x=-80;x<=85;x+=2)for(let z=-145;z<=42;z+=2){const h=terrain(x,z);cells.push({x,z,h});}
const ground=new THREE.InstancedMesh(cube,[dirt,dirt,grass,dirt,dirt,dirt],cells.length);
const matrix=new THREE.Matrix4(),q=new THREE.Quaternion();
cells.forEach(({x,z,h},i)=>{matrix.compose(new THREE.Vector3(x,(h-5)/2,z),q,new THREE.Vector3(2,h+5,2));ground.setMatrixAt(i,matrix)});ground.receiveShadow=true;ground.castShadow=true;scene.add(ground);
const caps=new THREE.InstancedMesh(cube,grass,cells.length);cells.forEach(({x,z,h},i)=>{matrix.compose(new THREE.Vector3(x,h-.06,z),q,new THREE.Vector3(2,.16,2));caps.setMatrixAt(i,matrix)});caps.receiveShadow=true;scene.add(caps);
mesh(0,-.6,-40,172,.4,170,new THREE.MeshStandardMaterial({color:'#7d9b96',roughness:.7,metalness:.15}));
// Flowing strips and river stones stay on the same block grid.
for(let z=-110;z<40;z+=5){const x=1+Math.sin(z*.06)*5;mesh(x,-.17,z,4,.025,.3,new THREE.MeshStandardMaterial({color:'#acc2b7',transparent:true,opacity:.23}));}
function tree(x,z,size=1){const y=terrain(x,z);if(y<1)return;
 mesh(x,y,z,.9*size,4.4*size,.9*size,trunk);
 mesh(x,y+3.1*size,z,4.5*size,1.9*size,4.5*size,leaves);
 mesh(x-.2*size,y+5*size,z,3.3*size,1.5*size,3.3*size,leaves);
 mesh(x,y+6.5*size,z,1.9*size,.8*size,1.9*size,leaves);
}
for(let i=0;i<190;i++){
 const x=-65+random()*145,z=-125+random()*157;
 if(x>8&&x<37&&z>-42&&z<0)continue;
 if(Math.abs(x-(1+Math.sin(z*.06)*5))<8)continue;
 tree(Math.floor(x/2)*2,Math.floor(z/2)*2,.8+random()*.7);
}
// Terraced path from river to the club house.
const pathMaterial=material('#ada084',12);
for(let x=4;x<=21;x+=2){const y=Math.min(8,Math.max(1,(x-4)*.58));mesh(x,y,-6,2,.2,3,pathMaterial);}
// Community house: stone foundation, wooden structure, stepped roof and glass.
const hx=22,hz=-21,hy=8;
mesh(hx,hy,hz,12,.7,10,stone);mesh(hx,hy+.7,hz,11,5.4,9,wood);
for(let x=hx-5;x<=hx+5;x+=5)for(let z of [hz-4.6,hz+4.6])mesh(x,hy+.7,z,.65,5.7,.65,trunk);
for(let n=0;n<5;n++)mesh(hx,hy+6+n*.7,hz,14-n*1.6,.7,12-n*1.6,roof);
const glass=new THREE.MeshStandardMaterial({color:'#789e9c',roughness:.25,metalness:.15});
for(let x of [hx-3.2,hx+3.2]){mesh(x,hy+2,hz+4.54,2.2,2.6,.12,glass);mesh(x,hy+2,hz+4.63,.12,2.6,.14,trunk);mesh(x,hy+3.2,hz+4.63,2.2,.14,.14,trunk)}
mesh(hx,hy+.7,hz+4.6,1.9,3.2,.15,trunk);
// West windows visible from the camera.
for(let z of [hz-2.4,hz+2.4]){mesh(hx-5.54,hy+2,z,.12,2.6,2.1,glass);mesh(hx-5.63,hy+3.2,z,.14,.14,2.1,trunk)}
// A square watchtower belongs to the same building.
mesh(hx+7,hy,hz-3,3.8,12,3.8,stone);mesh(hx+7,hy+12,hz-3,5,.6,5,roof);
mesh(hx+7,hy+10,hz-.99,1.5,1.4,.15,trunk);
const flag=new THREE.MeshStandardMaterial({color:'#6daaa3',side:THREE.DoubleSide,roughness:1});
mesh(hx+7,hy+12.6,hz-3,.15,3,.15,trunk);mesh(hx+8.2,hy+14.1,hz-3,2.3,1.3,.09,flag);
// The official DSC artwork is mounted as a small white sign on the house.
const logo=await new THREE.TextureLoader().loadAsync('/logo.svg');logo.colorSpace=THREE.SRGBColorSpace;
const sign=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.8),new THREE.MeshBasicMaterial({map:logo,transparent:true}));sign.position.set(hx,hy+4.4,hz+5.02);scene.add(sign);
// Small cottages in the distance, rather than decorative floating islands.
for(const [x,z] of [[-18,-50],[18,-62],[-26,-77]]){const y=terrain(x,z);mesh(x,y,z,5,3.5,5,wood);for(let n=0;n<3;n++)mesh(x,y+3.5+n*.6,z,6-n*1.4,.6,6-n*1.4,roof)}
// Simple square clouds, pushed far into the sky so the architecture stays dominant.
const cloud=new THREE.MeshStandardMaterial({color:'#e2e3d7',roughness:1});
for(const [x,z,y,w] of [[-45,-70,31,20],[23,-90,36,24],[68,-125,35,30]])mesh(x,y,z,w,1.5,7,cloud);
renderer.render(scene,camera);
window.renderReady=true;
