/* globals THREE */
/* 1KnownElla Studio v5 | Windows · Walk Mode · Complex Plans */

// ── Constants ──────────────────────────────────────────────────────────────────
const WALL_H = 2.8, WALL_T = 0.13;
const FLOOR_HEIGHT = WALL_H + 0.28; // 3.08m between floor levels
const DOOR_W = 0.9, DOOR_H = 2.1;
const WIN_SIZES = {
  small:  { w: 0.7,  h: 0.75, sill: 1.0 },
  medium: { w: 1.05, h: 1.0,  sill: 0.9 },
  large:  { w: 1.5,  h: 1.2,  sill: 0.7 },
};

const CATEGORIES = [
  { id:'living',   label:'Living'  },
  { id:'dining',   label:'Dining'  },
  { id:'bedroom',  label:'Bedroom' },
  { id:'kitchen',  label:'Kitchen' },
  { id:'bathroom', label:'Bath'    },
  { id:'decor',    label:'Decor'   },
  { id:'office',   label:'Office'  },
  { id:'outdoor',  label:'Outdoor' },
  { id:'garden',   label:'Garden'  },
  { id:'stairs',   label:'Stairs'  },
  { id:'animals',  label:'Animals' },
  { id:'kids',     label:'Kids'    },
];

// Mood terrains: flat colour (dark/atmospheric)
const TERRAINS = [
  { id:'dark',     label:'Dark',     hex:'#0c0914', ground:0x0c0914, grid1:0x1c0820, grid2:0x120618, fog:0x0c0914 },
  { id:'wood',     label:'Wood',     hex:'#2a1a0a', ground:0x18120a, grid1:0x2c1e10, grid2:0x20160a, fog:0x100c06 },
  { id:'stone',    label:'Stone',    hex:'#181820', ground:0x141418, grid1:0x20202a, grid2:0x181822, fog:0x10101a },
  { id:'garden',   label:'Garden',   hex:'#0a1a08', ground:0x0a1408, grid1:0x142018, grid2:0x0c180a, fog:0x081008 },
  { id:'sand',     label:'Sand',     hex:'#1e1a0a', ground:0x1a1808, grid1:0x2a2618, grid2:0x1e1a0c, fog:0x120e06 },
  { id:'night',    label:'Night',    hex:'#060410', ground:0x060410, grid1:0x100820, grid2:0x0c061a, fog:0x04030e },
];
// Natural terrains: textured canvas ground
const NATURAL_TERRAINS = [
  { id:'nat_grass',  label:'Grass',  hex:'#3a7a30', ground:0x2e6824, fog:0x7ab8e8,
    light:{ sky:0xfff8e8, amb:0.55, sun:0xfff4d0, sunInt:1.1 },
    texture:(ctx,S)=>{ ctx.fillStyle='#4a7a38';ctx.fillRect(0,0,S,S);for(let i=0;i<3200;i++){ctx.fillStyle=`hsl(${108+Math.random()*28},${32+Math.random()*20}%,${26+Math.random()*16}%)`;ctx.fillRect(Math.random()*S,Math.random()*S,2+Math.random()*3,1);} } },
  { id:'nat_dirt',   label:'Dirt',   hex:'#6b4a28', ground:0x5a3a1a, fog:0xc8b898,
    light:{ sky:0xffeedd, amb:0.45, sun:0xffddb0, sunInt:0.95 },
    texture:(ctx,S)=>{ ctx.fillStyle='#5a3a1a';ctx.fillRect(0,0,S,S);for(let i=0;i<2200;i++){ctx.fillStyle=`hsl(${26+Math.random()*18},${38+Math.random()*22}%,${18+Math.random()*18}%)`;const r=2+Math.random()*5;ctx.beginPath();ctx.ellipse(Math.random()*S,Math.random()*S,r,r*.5,Math.random()*Math.PI,0,Math.PI*2);ctx.fill();} } },
  { id:'nat_stone',  label:'Paving', hex:'#8a8888', ground:0x787878, fog:0xc0c8d0,
    light:{ sky:0xf0f4f8, amb:0.50, sun:0xfff8f4, sunInt:0.9 },
    texture:(ctx,S)=>{ ctx.fillStyle='#787878';ctx.fillRect(0,0,S,S);const ts=64;for(let r=0;r<S/ts+1;r++)for(let c=0;c<S/ts+1;c++){const off=(r%2)*.5;const x=(c+off)*ts,y=r*ts;ctx.strokeStyle='#555';ctx.lineWidth=2;ctx.fillStyle=`hsl(0,0%,${42+Math.random()*12}%)`;ctx.fillRect(x+1,y+1,ts-2,ts-2);ctx.strokeRect(x+1,y+1,ts-2,ts-2);} } },
  { id:'nat_sand',   label:'Sand',   hex:'#d4b870', ground:0xc0a050, fog:0xf0d898,
    light:{ sky:0xfff0c0, amb:0.6, sun:0xffe880, sunInt:1.3 },
    texture:(ctx,S)=>{ ctx.fillStyle='#c0a050';ctx.fillRect(0,0,S,S);for(let i=0;i<4000;i++){ctx.fillStyle=`hsl(${38+Math.random()*18},${52+Math.random()*18}%,${52+Math.random()*16}%)`;ctx.beginPath();ctx.arc(Math.random()*S,Math.random()*S,Math.random()*1.6,0,Math.PI*2);ctx.fill();} } },
  { id:'nat_snow',   label:'Snow',   hex:'#dce8f4', ground:0xd8e8f8, fog:0xd8eeff,
    light:{ sky:0xe8f4ff, amb:0.65, sun:0xf0f8ff, sunInt:0.85 },
    texture:(ctx,S)=>{ ctx.fillStyle='#d8e8f8';ctx.fillRect(0,0,S,S);for(let i=0;i<1800;i++){ctx.fillStyle=`rgba(255,255,255,${.25+Math.random()*.55})`;ctx.beginPath();ctx.arc(Math.random()*S,Math.random()*S,Math.random()*2.5,0,Math.PI*2);ctx.fill();} } },
  { id:'nat_autumn', label:'Autumn', hex:'#7a4818', ground:0x5a3010, fog:0xd0946040,
    fogHex:0xc08840,
    light:{ sky:0xffe8a0, amb:0.48, sun:0xffcc60, sunInt:1.0 },
    texture:(ctx,S)=>{ ctx.fillStyle='#5a3010';ctx.fillRect(0,0,S,S);const fc=['#c84820','#d06010','#e09020','#b84018','#983010'];for(let i=0;i<2800;i++){ctx.fillStyle=fc[Math.floor(Math.random()*fc.length)];const r=3+Math.random()*8;ctx.beginPath();ctx.ellipse(Math.random()*S,Math.random()*S,r,r*.6,Math.random()*Math.PI,0,Math.PI*2);ctx.fill();} } },
];

const SWATCHES = [
  '#f4a0c0','#e8649a','#c07ab8','#9b6b8a',
  '#c4a882','#8b6f47','#d4c4b0','#a0522d',
  '#f5f0e8','#4a4a6a','#6c63ff','#ef4444',
  '#22c55e','#f59e0b','#2a2a38','#f0f0f0',
];


// ── Polygon Shape Generator ──────────────────────────────────────────────────
function makeShape(type, cx, cz, w, d) {
  if (type === 'l-shape') {
    return [{x:cx,z:cz},{x:cx+w,z:cz},{x:cx+w,z:cz+d/2},{x:cx+w/2,z:cz+d/2},{x:cx+w/2,z:cz+d},{x:cx,z:cz+d}];
  } else if (type === 't-shape') {
    return [{x:cx,z:cz},{x:cx+w,z:cz},{x:cx+w,z:cz+d/2},{x:cx+w*.75,z:cz+d/2},{x:cx+w*.75,z:cz+d},{x:cx+w*.25,z:cz+d},{x:cx+w*.25,z:cz+d/2},{x:cx,z:cz+d/2}];
  } else if (type === 'u-shape') {
    return [{x:cx,z:cz},{x:cx+w,z:cz},{x:cx+w,z:cz+d},{x:cx+w*.75,z:cz+d},{x:cx+w*.75,z:cz+d/2},{x:cx+w*.25,z:cz+d/2},{x:cx+w*.25,z:cz+d},{x:cx,z:cz+d}];
  } else if (type === 'cross') {
    const t=w/3,u=d/3;
    return [{x:cx+t,z:cz},{x:cx+2*t,z:cz},{x:cx+2*t,z:cz+u},{x:cx+w,z:cz+u},{x:cx+w,z:cz+2*u},{x:cx+2*t,z:cz+2*u},{x:cx+2*t,z:cz+d},{x:cx+t,z:cz+d},{x:cx+t,z:cz+2*u},{x:cx,z:cz+2*u},{x:cx,z:cz+u},{x:cx+t,z:cz+u}];
  } else if (type === 'diagonal') {
    return [{x:cx,z:cz},{x:cx+w*.72,z:cz},{x:cx+w,z:cz+d*.28},{x:cx+w,z:cz+d},{x:cx,z:cz+d}];
  } else if (type === 'hex') {
    const r=Math.min(w,d)/2,pts=[];
    for(let i=0;i<6;i++){const a=i*Math.PI/3-Math.PI/6;pts.push({x:cx+w/2+r*Math.cos(a),z:cz+d/2+r*Math.sin(a)});}
    return pts;
  } else if (type === 'angled') {
    return [{x:cx,z:cz+d*.35},{x:cx+w*.35,z:cz},{x:cx+w,z:cz},{x:cx+w,z:cz+d*.65},{x:cx+w*.65,z:cz+d},{x:cx,z:cz+d}];
  }
  return [{x:cx,z:cz},{x:cx+w,z:cz},{x:cx+w,z:cz+d},{x:cx,z:cz+d}];
}

// ── Presets ────────────────────────────────────────────────────────────────────
const HOUSE_PRESETS = [
  { id:'studio', name:'Studio', icon:'🏠', rooms:[{ id:1, name:'Open Studio', points: makeShape('rect', 0, 0, 9, 6), wallColor:'#f0e8ec', floorColor:'#c0a8b0' }] },
  { id:'modern', name:'Modern Apt', icon:'🏢', rooms:[
      { id:1, name:'Master Bedroom', points: makeShape('rect', -5, -5.5, 5, 5.5), wallColor:'#1e1220', floorColor:'#6a4858' },
      { id:2, name:'Bathroom',       points: makeShape('rect', -5, 0, 3, 3),   wallColor:'#f2f0ee', floorColor:'#d0c8ca' },
      { id:3, name:'WC',             points: makeShape('rect', -2, 0, 2, 3),   wallColor:'#f0eeee', floorColor:'#ccc8c8' },
      { id:4, name:'Bedroom 2',      points: makeShape('rect', -5, 3, 5, 3),   wallColor:'#22182e', floorColor:'#6a5068' },
      { id:5, name:'Living Room',    points: makeShape('rect', 0, -5.5, 6, 5.5), wallColor:'#2a1e34', floorColor:'#7a6878' },
      { id:6, name:'Kitchen',        points: makeShape('rect', 0, 0, 4, 3.5), wallColor:'#ede8e0', floorColor:'#b8956a' },
      { id:7, name:'Dining Area',    points: makeShape('rect', 4, 0, 2, 3.5), wallColor:'#ece4dc', floorColor:'#a89070' },
  ]},
  { id:'onebr', name:'1 Bedroom', icon:'🏡', rooms:[
      { id:1, name:'Living Room', points: makeShape('rect', 0, 0, 5.5, 5),   wallColor:'#f2ece8', floorColor:'#9ba8a0' },
      { id:2, name:'Kitchen',     points: makeShape('rect', 5.5, 0, 3.5, 5),   wallColor:'#ede8e0', floorColor:'#b8956a' },
      { id:3, name:'Bedroom',     points: makeShape('rect', 0, 5, 5.5, 4.5), wallColor:'#2e2030', floorColor:'#7a6070' },
      { id:4, name:'Bathroom',    points: makeShape('rect', 5.5, 5, 2, 2.5), wallColor:'#f2f0ee', floorColor:'#d0c8c8' },
      { id:5, name:'WC',          points: makeShape('rect', 7.5, 5, 1.5, 2.5), wallColor:'#f0eeee', floorColor:'#ccc8c8' },
      { id:6, name:'Hallway',     points: makeShape('rect', 5.5, 7.5, 3.5, 2),   wallColor:'#e0dcd8', floorColor:'#b0a8a4' },
  ]},
  { id:'family', name:'Family Home', icon:'🏘️', rooms:[
      { id:1,  name:'Living Room',  points: makeShape('rect', 0, 0, 7, 6),   wallColor:'#f0ece8', floorColor:'#909a90' },
      { id:2,  name:'Kitchen',      points: makeShape('rect', 7, 0, 5, 4),   wallColor:'#ede8e0', floorColor:'#b8956a' },
      { id:3,  name:'Dining Room',  points: makeShape('rect', 7, 4, 5, 2.5), wallColor:'#ece4dc', floorColor:'#a89880' },
      { id:4,  name:'Master Bed',   points: makeShape('rect', 0, 6, 5, 5),   wallColor:'#1e1028', floorColor:'#604858' },
      { id:5,  name:'Bedroom 2',    points: makeShape('rect', 5, 6, 4, 5),   wallColor:'#201830', floorColor:'#685070' },
      { id:6,  name:'Bedroom 3',    points: makeShape('rect', 9, 6.5, 3, 4.5), wallColor:'#221830', floorColor:'#6a5068' },
      { id:7,  name:'Bathroom 1',   points: makeShape('rect', 0, 11, 3.5, 3),   wallColor:'#f2f0ee', floorColor:'#d0c8c8' },
      { id:8,  name:'Bathroom 2',   points: makeShape('rect', 3.5, 11, 2.5, 3),   wallColor:'#f0eeee', floorColor:'#ccc8c8' },
      { id:9,  name:'Hallway',      points: makeShape('rect', 6, 11, 6, 2),   wallColor:'#e0dcd8', floorColor:'#b0a8a4' },
      { id:10, name:'Garage',       points: makeShape('rect', 12, 0, 4, 6),   wallColor:'#d8d4d0', floorColor:'#989490' },
  ]},
  { id:'loft', name:'Loft', icon:'🏙️', rooms:[
      { id:1, name:'Living / Dining', points:makeShape('rect', 0, 0, 8, 6),   wallColor:'#f4f0ec', floorColor:'#8a7a68' },
      { id:2, name:'Kitchen',         points:makeShape('rect', 8, 0, 3.5, 6), wallColor:'#ede8e0', floorColor:'#a89070' },
      { id:3, name:'Bedroom',         points:makeShape('rect', 0, 6, 6, 4.5), wallColor:'#201828', floorColor:'#604858' },
      { id:4, name:'Bathroom',        points:makeShape('rect', 6, 6, 2.5, 2.5), wallColor:'#f2f0ee', floorColor:'#d0c8c8' },
      { id:5, name:'Walk-in Closet',  points:makeShape('rect', 6, 8.5, 2.5, 2), wallColor:'#c0b8b0', floorColor:'#a89880' },
      { id:6, name:'Study',           points:makeShape('rect', 8.5, 6, 3, 4.5), wallColor:'#d8d0cc', floorColor:'#989080' },
  ]},
  { id:'office', name:'Office', icon:'💼', rooms:[
      { id:1, name:'Open Office',    points:makeShape('rect', 0, 0, 9, 7),   wallColor:'#f4f0ec', floorColor:'#9a9898' },
      { id:2, name:'Meeting Room',   points:makeShape('rect', 9, 0, 4.5, 4.5), wallColor:'#f4f0ec', floorColor:'#8898a0' },
      { id:3, name:'Private Office', points:makeShape('rect', 9, 4.5, 4.5, 2.5), wallColor:'#f2eeec', floorColor:'#908880' },
      { id:4, name:'Break Room',     points:makeShape('rect', 0, 7, 4.5, 3.5), wallColor:'#ede8e0', floorColor:'#a0a090' },
      { id:5, name:'Reception',      points:makeShape('rect', 4.5, 7, 4.5, 3.5), wallColor:'#f0ece8', floorColor:'#b0a890' },
      { id:6, name:'Server Room',    points:makeShape('rect', 9, 7, 4.5, 3.5), wallColor:'#e0dcd8', floorColor:'#808888' },
  ]},
  { id:'cabin', name:'Cabin', icon:'🏕️', rooms:[
      { id:1, name:'Living Room',     points:makeShape('rect', 0, 0, 6, 5.5), wallColor:'#c8b890', floorColor:'#8a6040' },
      { id:2, name:'Kitchen',         points:makeShape('rect', 6, 0, 3.5, 5.5), wallColor:'#c4b08a', floorColor:'#7a5030' },
      { id:3, name:'Master Bedroom',  points:makeShape('rect', 0, 5.5, 4.5, 4.5), wallColor:'#c0a878', floorColor:'#7a5838' },
      { id:4, name:'Bedroom 2',       points:makeShape('rect', 4.5, 5.5, 5, 4.5), wallColor:'#c4ac7c', floorColor:'#806040' },
      { id:5, name:'Bathroom',        points:makeShape('rect', 0, 10, 2.5, 2.5), wallColor:'#d0c0a0', floorColor:'#a08860' },
      { id:6, name:'Porch',           points:makeShape('rect', 2.5, 10, 7, 2.5), wallColor:'#b0a080', floorColor:'#6a4828' },
  ]},
  { id:'villa', name:'Villa', icon:'🏰', rooms:[
      { id:1, name:'Grand Lounge',  points: makeShape('rect', 0, 0, 8, 6.5), wallColor:'#f0ece8', floorColor:'#8a9890' },
      { id:2, name:'Kitchen',       points: makeShape('rect', 8, 0, 5, 4),   wallColor:'#ede8e0', floorColor:'#b8926a' },
      { id:3, name:'Pantry',        points: makeShape('rect', 8, 4, 2.5, 2.5), wallColor:'#e4e0d8', floorColor:'#a09080' },
      { id:4, name:'Dining Room',   points: makeShape('rect', 10.5, 0, 4, 6.5), wallColor:'#ece4dc', floorColor:'#a89880' },
      { id:5, name:'Study',         points: makeShape('rect', 0, 6.5, 3.5, 4),   wallColor:'#d8d0cc', floorColor:'#988878' },
      { id:6, name:'WC',            points: makeShape('rect', 3.5, 6.5, 2, 2),   wallColor:'#f0eeee', floorColor:'#ccc8c8' },
      { id:7, name:'Hallway',       points: makeShape('rect', 3.5, 8.5, 5, 2),   wallColor:'#e0dcd8', floorColor:'#b0a8a4' },
      { id:8, name:'Master Bed',    points: makeShape('rect', 8.5, 6.5, 6, 6),   wallColor:'#200a28', floorColor:'#6a446a' },
      { id:9, name:'Master Bath',   points: makeShape('rect', 10.5, 12.5, 4, 3),   wallColor:'#f2f0ee', floorColor:'#d0c8c8' },
      { id:10,name:'Bedroom 2',     points: makeShape('rect', 0, 10.5, 4.5, 4),   wallColor:'#2a1030', floorColor:'#6a4868' },
      { id:11,name:'Bedroom 3',     points: makeShape('rect', 4.5, 10.5, 4, 4),   wallColor:'#300e2c', floorColor:'#6a4870' },
      { id:12,name:'Bathroom',      points: makeShape('rect', 8.5, 12.5, 2, 3),   wallColor:'#f2f0ee', floorColor:'#d0c8c8' },
  ]},
  { id:'garden_home', name:'Garden Home', icon:'🌳', rooms:[
      { id:1, name:'Living Room',  points: makeShape('rect', 0, 0, 6, 5),   wallColor:'#f0ece8', floorColor:'#909a90' },
      { id:2, name:'Kitchen',      points: makeShape('rect', 6, 0, 4, 5),   wallColor:'#ede8e0', floorColor:'#b8956a' },
      { id:3, name:'Bedroom',      points: makeShape('rect', 0, 5, 5, 4.5), wallColor:'#1e1028', floorColor:'#604858' },
      { id:4, name:'Bathroom',     points: makeShape('rect', 5, 5, 3, 2.5), wallColor:'#f2f0ee', floorColor:'#d0c8c8' },
      { id:5, name:'Patio',        points: makeShape('rect', -4, 0, 4, 5),  wallColor:'#d4ccc0', floorColor:'#b0a890' },
      { id:6, name:'Garden',       points: makeShape('rect', -8, -4, 12, 4),wallColor:'#2a5020', floorColor:'#3a7028' },
      { id:7, name:'Side Garden',  points: makeShape('rect', -8, 0, 4, 9.5),wallColor:'#285020', floorColor:'#2e6820' },
      { id:8, name:'Garage',       points: makeShape('rect', 10, 0, 4, 5),  wallColor:'#d8d4d0', floorColor:'#989490' },
  ]},
];

// ── Geometry helpers ───────────────────────────────────────────────────────────
function mat(color, rough=0.8, metal=0) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
}
function mkBox(w, h, d, color, rough, metal) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, rough||0.8, metal||0));
  m.castShadow = true; m.receiveShadow = true; return m;
}
function mkCyl(rt, rb, h, seg, color, rough, metal) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg||16), mat(color, rough||0.8, metal||0));
  m.castShadow = true; m.receiveShadow = true; return m;
}

// ── Furniture Builders ─────────────────────────────────────────────────────────

function buildSofa(){const g=new THREE.Group();const c='#8b6f47';const seat=mkBox(2,.28,.9,c);seat.position.y=.39;g.add(seat);const back=mkBox(2,.65,.18,c);back.position.set(0,.84,-.36);g.add(back);[-.9,.9].forEach(x=>{const a=mkBox(.18,.45,.9,c);a.position.set(x,.57,0);g.add(a);});[[-.8,-.3],[-.8,.3],[.8,-.3],[.8,.3]].forEach(([x,z])=>{const l=mkBox(.08,.22,.08,'#4a3728');l.position.set(x,.11,z);g.add(l);});[-.58,0,.58].forEach(x=>{const cu=mkBox(.54,.13,.74,'#a08060');cu.position.set(x,.56,0);g.add(cu);});return g;}
function buildSectionalSofa(){const g=new THREE.Group();const c='#7a6050';const seat=mkBox(2.6,.28,1.0,c);seat.position.y=.39;g.add(seat);const back=mkBox(2.6,.7,.18,c);back.position.set(0,.88,-.41);g.add(back);const arm1=mkBox(.2,.48,1.0,c);arm1.position.set(-1.2,.57,0);g.add(arm1);const arm2=mkBox(.2,.48,1.0,c);arm2.position.set(1.2,.57,0);g.add(arm2);const corner=mkBox(1.0,.28,1.0,c);corner.position.set(-1.5,.39,-1.0);g.add(corner);const cback=mkBox(.18,.7,1.0,c);cback.position.set(-1.6,.88,-1.0);g.add(cback);[[-.95,-.33],[-.95,.33],[.95,-.33],[.95,.33],[-1.8,-.33],[-1.8,-1.38]].forEach(([x,z])=>{const l=mkBox(.07,.2,.07,'#3a2018');l.position.set(x,.1,z);g.add(l);});return g;}
function buildLoveseat(){const g=new THREE.Group(),c='#6c5a3c';const seat=mkBox(1.4,.26,.85,c);seat.position.y=.38;g.add(seat);const back=mkBox(1.4,.6,.16,c);back.position.set(0,.78,-.34);g.add(back);[-.6,.6].forEach(x=>{const a=mkBox(.16,.4,.85,c);a.position.set(x,.54,0);g.add(a);});[[-.58,-.28],[-.58,.28],[.58,-.28],[.58,.28]].forEach(([x,z])=>{const l=mkBox(.07,.2,.07,'#3a2a18');l.position.set(x,.1,z);g.add(l);});[-.35,.35].forEach(x=>{const cu=mkBox(.52,.12,.7,'#8a7050');cu.position.set(x,.54,0);g.add(cu);});return g;}
function buildArmchair(){const g=new THREE.Group(),c='#7c6340';const seat=mkBox(.88,.24,.82,c);seat.position.y=.38;g.add(seat);const back=mkBox(.88,.62,.16,c);back.position.set(0,.74,-.33);g.add(back);[-.34,.34].forEach(x=>{const a=mkBox(.16,.32,.82,c);a.position.set(x,.52,0);g.add(a);});[[-.34,-.28],[-.34,.28],[.34,-.28],[.34,.28]].forEach(([x,z])=>{const l=mkBox(.07,.28,.07,'#3a2418');l.position.set(x,.14,z);g.add(l);});return g;}
function buildOttoman(){const g=new THREE.Group();const body=mkBox(0.8,.36,0.8,'#a07a90');body.position.y=.23;g.add(body);const top=mkBox(0.84,.08,0.84,'#c090a8');top.position.y=.44;g.add(top);[[-.34,-.34],[-.34,.34],[.34,-.34],[.34,.34]].forEach(([x,z])=>{const l=mkBox(.06,.23,.06,'#5a3040');l.position.set(x,.115,z);g.add(l);});return g;}
function buildBench(){const g=new THREE.Group();const seat=mkBox(1.4,.1,.48,'#c8a870',.6);seat.position.y=.46;g.add(seat);[[-.6,-.18],[-.6,.18],[.6,-.18],[.6,.18]].forEach(([x,z])=>{const l=mkBox(.05,.46,.05,'#8a6030');l.position.set(x,.23,z);g.add(l);});return g;}
function buildCoffeeTable(){const g=new THREE.Group();const top=mkBox(1.2,.05,.62,'#c8a87a',.6);top.position.y=.43;g.add(top);[[-.52,-.24],[-.52,.24],[.52,-.24],[.52,.24]].forEach(([x,z])=>{const l=mkBox(.05,.43,.05,'#7a5c30');l.position.set(x,.215,z);g.add(l);});return g;}
function buildSideTable(){const g=new THREE.Group();const top=mkBox(.7,.04,.7,'#c8a880',.6);top.position.y=.55;g.add(top);const shaft=mkCyl(.04,.04,.55,8,'#a08060');shaft.position.y=.275;g.add(shaft);const base=mkCyl(.28,.28,.04,16,'#8a6840');base.position.y=.02;g.add(base);return g;}
function buildConsoleTable(){const g=new THREE.Group();const top=mkBox(1.4,.05,.42,'#c0a878',.65);top.position.y=.82;g.add(top);[[-.62,-.16],[-.62,.16],[.62,-.16],[.62,.16]].forEach(([x,z])=>{const l=mkBox(.05,.82,.05,'#8a6838');l.position.set(x,.41,z);g.add(l);});const sh=mkBox(1.3,.03,.36,'#b09860');sh.position.set(0,.46,0);g.add(sh);return g;}
function buildDiningTable(){const g=new THREE.Group();const top=mkBox(2,.07,1,'#c8a87a',.65);top.position.y=.78;g.add(top);[[-.88,-.42],[-.88,.42],[.88,-.42],[.88,.42]].forEach(([x,z])=>{const l=mkBox(.06,.78,.06,'#7a5c30');l.position.set(x,.39,z);g.add(l);});return g;}
function buildRoundTable(){const g=new THREE.Group();const top=mkCyl(.65,.65,.06,24,'#c8a878',.6);top.position.y=.76;g.add(top);const shaft=mkCyl(.06,.08,.75,12,'#8a6838');shaft.position.y=.375;g.add(shaft);const base=mkCyl(.38,.38,.04,24,'#7a5828');base.position.y=.02;g.add(base);return g;}
function buildDiningChair(){const g=new THREE.Group(),c='#8b7050';const seat=mkBox(.46,.05,.46,c);seat.position.y=.46;g.add(seat);const back=mkBox(.46,.5,.05,c);back.position.set(0,.71,-.2);g.add(back);[[-.18,-.18],[-.18,.18],[.18,-.18],[.18,.18]].forEach(([x,z])=>{const l=mkBox(.04,.46,.04,'#6a5030');l.position.set(x,.23,z);g.add(l);});return g;}
function buildBarStool(){const g=new THREE.Group();const seat=mkCyl(.2,.2,.05,16,'#a07840');seat.position.y=.78;g.add(seat);const stem=mkCyl(.03,.04,.78,8,'#888888');stem.position.y=.39;g.add(stem);const base=mkCyl(.22,.22,.04,16,'#666666');base.position.y=.02;g.add(base);return g;}
function buildSideboard(){const g=new THREE.Group();const body=mkBox(1.8,.55,.5,'#c0a070',.75);body.position.y=.35;g.add(body);[.6,0,-.6].forEach(x=>{const d=mkBox(.55,.48,.04,'#b09060');d.position.set(x,.35,.27);g.add(d);});[[-.86,-.22],[-.86,.22],[.86,-.22],[.86,.22]].forEach(([x,z])=>{const l=mkBox(.06,.12,.06,'#8a6030');l.position.set(x,.06,z);g.add(l);});return g;}
function buildWineRack(){const g=new THREE.Group();const body=mkBox(.8,1.2,.42,'#8a6030',.8);body.position.y=.6;g.add(body);for(let row=0;row<4;row++){for(let col=0;col<2;col++){const hole=mkCyl(.08,.08,.44,12,'#6a4020');hole.rotation.x=Math.PI/2;hole.position.set(col*.34-.17,row*.26+.15,0);g.add(hole);}}return g;}
function buildBed(){const g=new THREE.Group();const frame=mkBox(1.8,.24,2.2,'#8b7355');frame.position.y=.12;g.add(frame);const matt=mkBox(1.7,.2,2,'#f0ece4');matt.position.y=.34;g.add(matt);const head=mkBox(1.8,.68,.1,'#7a5a35');head.position.set(0,.52,-1.06);g.add(head);[-.4,.4].forEach(x=>{const p=mkBox(.54,.11,.38,'#fff8f0');p.position.set(x,.5,-.7);g.add(p);});const bl=mkBox(1.65,.1,1.2,'#7090b0');bl.position.set(0,.51,.35);g.add(bl);[[-.82,-1.02],[-.82,1.02],[.82,-1.02],[.82,1.02]].forEach(([x,z])=>{const l=mkBox(.07,.14,.07,'#5a3a18');l.position.set(x,-.07,z);g.add(l);});return g;}
function buildKingBed(){const g=new THREE.Group();const frame=mkBox(2.2,.26,2.3,'#7a6040');frame.position.y=.13;g.add(frame);const matt=mkBox(2.1,.22,2.18,'#f4f0ec');matt.position.y=.36;g.add(matt);const head=mkBox(2.2,.92,.12,'#6a5030');head.position.set(0,.7,-1.1);g.add(head);[-.55,.55].forEach(x=>{const p=mkBox(.7,.13,.44,'#fffbf5');p.position.set(x,.54,-.74);g.add(p);});const bl=mkBox(2.05,.12,1.5,'#6080a0');bl.position.set(0,.54,.28);g.add(bl);[[-.98,-1.04],[-.98,1.04],[.98,-1.04],[.98,1.04]].forEach(([x,z])=>{const l=mkBox(.09,.18,.09,'#4a3018');l.position.set(x,-.08,z);g.add(l);});return g;}
function buildSingleBed(){const g=new THREE.Group();const frame=mkBox(1,.22,2,'#9b8365');frame.position.y=.11;g.add(frame);const matt=mkBox(.92,.18,1.88,'#f4f0e8');matt.position.y=.31;g.add(matt);const head=mkBox(1,.6,.1,'#8a6a45');head.position.set(0,.5,-.96);g.add(head);const p=mkBox(.72,.1,.36,'#fff8f0');p.position.set(0,.45,-.66);g.add(p);return g;}
function buildBunkBed(){const g=new THREE.Group();const frame1=mkBox(1.05,.2,2.1,'#7a6040');frame1.position.y=.1;g.add(frame1);const matt1=mkBox(.96,.14,2,'#f0ece4');matt1.position.y=.27;g.add(matt1);const frame2=mkBox(1.05,.2,2.1,'#7a6040');frame2.position.y=1.62;g.add(frame2);const matt2=mkBox(.96,.14,2,'#e8e4e0');matt2.position.y=1.79;g.add(matt2);[[-.48,-.96],[-.48,.96],[.48,-.96],[.48,.96]].forEach(([x,z])=>{const p=mkBox(.07,1.96,.07,'#5a4020');p.position.set(x,.98,z);g.add(p);});[.5,.86,1.22].forEach(y=>{const r=mkBox(.06,.06,.28,'#8a6030');r.position.set(.52,y,-.5);g.add(r);});return g;}
function buildWardrobe(){const g=new THREE.Group();const body=mkBox(1.6,2.2,.58,'#c8b090');body.position.y=1.1;g.add(body);[-.4,.4].forEach(x=>{const d=mkBox(.76,2,.02,'#b09070');d.position.set(x,1.1,.31);g.add(d);});[-.12,.12].forEach(x=>{const h=mkCyl(.022,.022,.08,8,'#888');h.rotation.z=Math.PI/2;h.position.set(x,1.1,.33);g.add(h);});return g;}
function buildNightstand(){const g=new THREE.Group();const body=mkBox(.5,.55,.42,'#b09070');body.position.y=.275;g.add(body);const top=mkBox(.52,.03,.44,'#c0a080');top.position.y=.565;g.add(top);const h=mkCyl(.018,.018,.08,8,'#888');h.rotation.z=Math.PI/2;h.position.set(0,.3,.22);g.add(h);return g;}
function buildDresser(){const g=new THREE.Group();const body=mkBox(1,1.1,.5,'#c8b090');body.position.y=.55;g.add(body);[0,1,2,3].forEach(i=>{const d=mkBox(.92,.24,.04,'#b8a080');d.position.set(0,.18+i*.26,.26);g.add(d);const h=mkCyl(.016,.016,.07,8,'#888');h.rotation.z=Math.PI/2;h.position.set(0,.18+i*.26,.28);g.add(h);});return g;}
function buildDesk(){const g=new THREE.Group();const top=mkBox(1.6,.05,.75,'#c8b090',.7);top.position.y=.76;g.add(top);[[-.74,-.32],[.74,-.32]].forEach(([x,z])=>{const l=mkBox(.05,.76,.05,'#8b6a40');l.position.set(x,.38,z);g.add(l);});const cb=mkBox(1.5,.05,.05,'#8b6a40');cb.position.set(0,.4,-.32);g.add(cb);const dr=mkBox(.56,.15,.62,'#b09070');dr.position.set(-.5,.58,0);g.add(dr);return g;}
function buildBookshelf(){const g=new THREE.Group();[-.5,.5].forEach(x=>{const s=mkBox(.04,1.8,.38,'#a88a60');s.position.set(x,.9,0);g.add(s);});const bk=mkBox(1,1.8,.04,'#9a7a55');bk.position.set(0,.9,-.18);g.add(bk);[0,1,2,3].forEach(i=>{const sh=mkBox(1,.04,.38,'#a88a60');sh.position.set(0,i*.42+.04,0);g.add(sh);});const bc=['#e8649a','#6c63ff','#22c55e','#f59e0b','#a78bfa','#f97316'];let bx=-.42;[.08,.07,.1,.09,.08,.11].forEach((w,i)=>{const b=mkBox(w,.32,.24,bc[i]);b.position.set(bx+w/2,.58,0);g.add(b);bx+=w+.01;});return g;}
function buildTVUnit(){const g=new THREE.Group();const cab=mkBox(2.4,.44,.46,'#1e1e2a',.6);cab.position.y=.22;g.add(cab);[[-.96,-.18],[-.96,.18],[.96,-.18],[.96,.18]].forEach(([x,z])=>{const l=mkBox(.04,.08,.04,'#111');l.position.set(x,-.04,z);g.add(l);});[-.82,0,.82].forEach(x=>{const d=mkBox(.74,.38,.03,'#2a2a38');d.position.set(x,.22,.24);g.add(d);});const tvMat=new THREE.MeshStandardMaterial({color:0x050810,roughness:.05,metalness:.8,emissive:0x08101e,emissiveIntensity:.8});const tv=new THREE.Mesh(new THREE.BoxGeometry(2.1,1.22,.05),tvMat);tv.position.set(0,1.17,-.02);tv.castShadow=true;g.add(tv);const tvFrame=mkBox(2.16,1.28,.06,'#111',.4,.5);tvFrame.position.set(0,1.17,-.04);g.add(tvFrame);return g;}
function buildRug(){const g=new THREE.Group();const border=new THREE.Mesh(new THREE.PlaneGeometry(2.7,1.8),mat('#9a5080',.95));border.rotation.x=-Math.PI/2;border.position.y=.001;g.add(border);const rug=new THREE.Mesh(new THREE.PlaneGeometry(2.5,1.6),mat('#c07898',.95));rug.rotation.x=-Math.PI/2;rug.position.y=.003;g.add(rug);return g;}
function buildRoundRug(){const g=new THREE.Group();const outer=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,.02,32),mat('#8a5070',.95));outer.position.y=.001;g.add(outer);const inner=new THREE.Mesh(new THREE.CylinderGeometry(1.0,1.0,.02,32),mat('#c090b0',.95));inner.position.y=.003;g.add(inner);return g;}
function buildCounter(){const g=new THREE.Group();const body=mkBox(1.8,.88,.6,'#d4cfc8',.8);body.position.y=.44;g.add(body);const top=mkBox(1.84,.04,.64,'#b0b4b8',.3,.4);top.position.y=.9;g.add(top);return g;}
function buildIsland(){const g=new THREE.Group();const body=mkBox(1.4,.9,.9,'#e8e4e0',.7);body.position.y=.45;g.add(body);const top=mkBox(1.46,.05,.96,'#c0b8b0',.3,.3);top.position.y=.925;g.add(top);return g;}
function buildFridge(){const g=new THREE.Group();const body=mkBox(.7,1.9,.68,'#d8d8d8',.5,.2);body.position.y=.95;g.add(body);const handle=mkCyl(.018,.018,.5,8,'#999',.2);handle.rotation.z=Math.PI/2;handle.position.set(0,1.4,.36);g.add(handle);const line=mkBox(.72,.02,.7,'#c0c0c0');line.position.set(0,.65,0);g.add(line);return g;}
function buildStove(){const g=new THREE.Group();const body=mkBox(.6,.88,.62,'#3a3a3a',.6);body.position.y=.44;g.add(body);const top=mkBox(.62,.04,.64,'#222',.4,.5);top.position.y=.9;g.add(top);[[-.14,-.14],[-.14,.14],[.14,-.14],[.14,.14]].forEach(([x,z])=>{const b=mkCyl(.09,.09,.01,16,'#111',.3);b.position.set(x,.93,z);g.add(b);});return g;}
function buildKitchenSink(){const g=new THREE.Group();const body=mkBox(.9,.88,.6,'#d4cfc8',.8);body.position.y=.44;g.add(body);const top=mkBox(.92,.03,.62,'#b0b4b8',.3,.4);top.position.y=.9;g.add(top);const sink=mkBox(.52,.12,.38,'#a0a4a8',.2,.5);sink.position.set(0,.88,0);g.add(sink);const tap=mkCyl(.015,.015,.2,8,'#aaa',.3);tap.position.set(0,1.02,-.1);g.add(tap);return g;}
function buildBathtub(){const g=new THREE.Group();const outer=mkBox(1.7,.55,.78,'#f0eeec',.5);outer.position.y=.275;g.add(outer);const inner=mkBox(1.46,.36,.54,'#e0dedc',.4);inner.position.set(0,.38,0);g.add(inner);const tap=mkCyl(.02,.02,.18,8,'#c0c0c0',.2);tap.position.set(.7,.62,0);g.add(tap);return g;}
function buildToilet(){const g=new THREE.Group();const base=mkBox(.42,.38,.66,'#f0eeec',.5);base.position.y=.19;g.add(base);const tank=mkBox(.4,.3,.2,'#f0eeec',.5);tank.position.set(0,.48,-.23);g.add(tank);const seat=mkBox(.42,.04,.5,'#e8e6e4',.4);seat.position.set(0,.39,.06);g.add(seat);return g;}
function buildBathSink(){const g=new THREE.Group();const ped=mkCyl(.12,.14,.64,12,'#f0eeec',.5);ped.position.y=.32;g.add(ped);const basin=mkBox(.54,.15,.42,'#f0eeec',.4);basin.position.y=.68;g.add(basin);const tap=mkCyl(.016,.016,.14,8,'#c0c0c0',.2);tap.position.set(0,.82,-.06);g.add(tap);return g;}
function buildShower(){const g=new THREE.Group();const floor=new THREE.Mesh(new THREE.PlaneGeometry(1,1),mat('#e8e8e8',.4));floor.rotation.x=-Math.PI/2;floor.position.y=.02;g.add(floor);const gm=new THREE.MeshStandardMaterial({color:0xd0e8ff,transparent:true,opacity:.22,roughness:.05,metalness:.1});[[.5,.8,0,0],[0,.8,-.5,Math.PI/2]].forEach(([x,y,z,ry])=>{const w=new THREE.Mesh(new THREE.BoxGeometry(.02,1.6,1),gm.clone());w.position.set(x,y,z);w.rotation.y=ry||0;w.castShadow=true;g.add(w);});const head=mkCyl(.04,.04,.02,8,'#aaa',.2);head.position.set(-.3,1.7,-.3);g.add(head);return g;}
function buildLamp(){const g=new THREE.Group();const base=mkCyl(.18,.22,.07,16,'#888888');base.position.y=.035;g.add(base);const pole=mkCyl(.022,.022,1.6,8,'#aaaaaa');pole.position.y=.835;g.add(pole);const shade=mkCyl(.28,.1,.38,16,'#f8f0e0');shade.position.y=1.72;g.add(shade);const bulbMat=new THREE.MeshStandardMaterial({color:0xfff8d0,emissive:0xfff0a0,emissiveIntensity:1.5});const bulb=new THREE.Mesh(new THREE.SphereGeometry(.055,8,8),bulbMat);bulb.position.y=1.63;g.add(bulb);const pl=new THREE.PointLight(0xfff8d0,.7,4);pl.position.y=1.63;g.add(pl);return g;}
function buildPendantLight(){const g=new THREE.Group();const cord=mkCyl(.01,.01,0.8,6,'#222');cord.position.y=2.2;g.add(cord);const shade=mkCyl(.25,.12,.28,16,'#e8d8a0',.6);shade.position.y=1.72;g.add(shade);const bulbMat=new THREE.MeshStandardMaterial({color:0xfff4c0,emissive:0xffe890,emissiveIntensity:1.8});const bulb=new THREE.Mesh(new THREE.SphereGeometry(.065,8,8),bulbMat);bulb.position.y=1.72;g.add(bulb);const pl=new THREE.PointLight(0xfff8e0,1.0,5);pl.position.y=1.72;g.add(pl);return g;}
function buildTableLamp(){const g=new THREE.Group();const base=mkCyl(.12,.15,.08,16,'#e8c0b0');base.position.y=.04;g.add(base);const body=mkCyl(.07,.1,.32,12,'#e0b0a0');body.position.y=.24;g.add(body);const shade=mkCyl(.22,.09,.26,16,'#f8ece0');shade.position.y=.52;g.add(shade);const bulbMat=new THREE.MeshStandardMaterial({color:0xfff8d0,emissive:0xfff0a0,emissiveIntensity:1.2});const bulb=new THREE.Mesh(new THREE.SphereGeometry(.045,8,8),bulbMat);bulb.position.y=.46;g.add(bulb);const pl=new THREE.PointLight(0xfff8d0,.5,3);pl.position.y=.5;g.add(pl);return g;}
function buildPlant(){const g=new THREE.Group();const pot=mkCyl(.17,.13,.28,16,'#b07050');pot.position.y=.14;g.add(pot);const soil=mkCyl(.16,.16,.03,16,'#3a2a1a');soil.position.y=.305;g.add(soil);const stem=mkCyl(.022,.022,.48,8,'#4a7a30');stem.position.y=.63;g.add(stem);const lm=mat('#3a8a28',.9);[[0,.92,0],[.17,.78,.1],[-.17,.78,-.1],[.1,.82,-.17],[-.1,.82,.17]].forEach(([x,y,z])=>{const lf=new THREE.Mesh(new THREE.SphereGeometry(.21,8,6),lm.clone());lf.scale.set(1,.48,1);lf.position.set(x,y,z);lf.castShadow=true;g.add(lf);});return g;}
function buildTallPlant(){const g=new THREE.Group();const pot=mkCyl(.22,.18,.36,16,'#c09060');pot.position.y=.18;g.add(pot);const stem=mkCyl(.03,.03,1.2,8,'#5a8030');stem.position.y=.94;g.add(stem);const lm=mat('#2a7820',.9);[[0,1.7,0],[.3,1.4,.15],[-.3,1.4,-.15],[.15,1.55,-.3],[-.15,1.55,.3],[.28,1.2,0],[-.28,1.2,0]].forEach(([x,y,z])=>{const lf=new THREE.Mesh(new THREE.SphereGeometry(.28,8,6),lm.clone());lf.scale.set(1,.45,1);lf.position.set(x,y,z);lf.castShadow=true;g.add(lf);});return g;}
function buildCactus(){const g=new THREE.Group();const pot=mkCyl(.12,.1,.2,8,'#c08040');pot.position.y=.1;g.add(pot);const body=mkCyl(.09,.07,.52,10,'#4a8028');body.position.y=.46;g.add(body);const arm1=mkCyl(.055,.05,.28,10,'#4a8028');arm1.rotation.z=Math.PI/2;arm1.position.set(.2,.6,0);g.add(arm1);const arm2=mkCyl(.055,.05,.2,10,'#4a8028');arm2.rotation.z=-Math.PI/2;arm2.position.set(-.18,.68,0);g.add(arm2);return g;}
function buildMirror(){const g=new THREE.Group();const frame=mkBox(.8,1.1,.06,'#8b7a60');frame.position.y=.8;g.add(frame);const glassMat=new THREE.MeshStandardMaterial({color:0xc8d8e8,roughness:.05,metalness:.6,transparent:true,opacity:.7});const glass=new THREE.Mesh(new THREE.BoxGeometry(.68,.96,.03),glassMat);glass.position.y=.8;glass.position.z=.01;glass.castShadow=true;g.add(glass);return g;}
function buildWallArt(){const g=new THREE.Group();const frame=mkBox(.9,.68,.06,'#a08060');frame.position.y=1.4;g.add(frame);const colors=['#e8649a','#f4a0c0','#c07ab8','#7c6ff7','#3a8a28'];const c=colors[Math.floor(Math.random()*colors.length)];const canvasMat=new THREE.MeshStandardMaterial({color:c,roughness:.9,emissive:new THREE.Color(c),emissiveIntensity:.05});const canvas2=new THREE.Mesh(new THREE.BoxGeometry(.8,.58,.03),canvasMat);canvas2.position.set(0,1.4,.02);g.add(canvas2);return g;}
function buildCurtains(){const g=new THREE.Group();const mat2=mat('#e8a0c0',.95);const l=new THREE.Mesh(new THREE.BoxGeometry(.04,2.4,.7),mat2.clone());l.position.set(-.52,1.2,0);l.castShadow=true;g.add(l);const r=new THREE.Mesh(new THREE.BoxGeometry(.04,2.4,.7),mat2.clone());r.position.set(.52,1.2,0);r.castShadow=true;g.add(r);const rod=mkCyl(.018,.018,1.2,8,'#888',.3,.5);rod.rotation.z=Math.PI/2;rod.position.y=2.45;g.add(rod);return g;}
function buildShelf(){const g=new THREE.Group();const shelf=mkBox(1.0,.04,.28,'#c0a870',.6);shelf.position.y=1.2;g.add(shelf);const bracketL=mkBox(.03,.22,.26,'#888',.5,.5);bracketL.position.set(-.44,1.09,0);g.add(bracketL);const bracketR=mkBox(.03,.22,.26,'#888',.5,.5);bracketR.position.set(.44,1.09,0);g.add(bracketR);const bk=mkBox(.07,.2,.22,'#e8649a');bk.position.set(.32,1.32,0);g.add(bk);const pot=mkCyl(.06,.05,.14,8,'#c07050');pot.position.set(-.2,1.29,0);g.add(pot);return g;}
function buildRadiator(){const g=new THREE.Group();const body=mkBox(1.2,.62,.1,'#e8e8e8',.7);body.position.y=.41;g.add(body);for(let i=0;i<8;i++){const fin=mkBox(.06,.58,.08,'#ddd',.7);fin.position.set(-.49+i*.14,.41,0);g.add(fin);}return g;}
function buildFireplace(){const g=new THREE.Group();const body=mkBox(1.6,1.1,.36,'#8a7868',.85);body.position.y=.55;g.add(body);const mantle=mkBox(1.8,.1,.46,'#a09080',.7);mantle.position.y=1.15;g.add(mantle);const opening=mkBox(.88,.74,.1,'#1a1212',.95);opening.position.set(0,.45,.2);g.add(opening);const flameMat=new THREE.MeshStandardMaterial({color:0xff8030,emissive:0xff6010,emissiveIntensity:2.0,transparent:true,opacity:.85});[-.2,.05,.24].forEach((x,i)=>{const cone=new THREE.Mesh(new THREE.ConeGeometry(.1+i*.02,.4+i*.05,8),flameMat.clone());cone.position.set(x,.42+i*.02,.2);g.add(cone);});const fl=new THREE.PointLight(0xff8030,.8,3);fl.position.set(0,.6,.3);g.add(fl);return g;}
function buildOfficeChair(){const g=new THREE.Group();const seat=mkCyl(.28,.3,.1,16,'#2a2a3a');seat.position.y=.54;g.add(seat);const back=mkBox(.54,.62,.08,'#2a2a3a');back.position.set(0,.94,-.2);g.add(back);const stem=mkCyl(.04,.04,.54,8,'#888',.3);stem.position.y=.27;g.add(stem);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const leg=mkBox(.28,.03,.04,'#555');leg.rotation.y=a;leg.position.set(Math.cos(a)*.14,.04,Math.sin(a)*.14);g.add(leg);const wheel=mkCyl(.04,.04,.04,8,'#444');wheel.rotation.z=Math.PI/2;wheel.position.set(Math.cos(a)*.28,.04,Math.sin(a)*.28);g.add(wheel);}return g;}
function buildMonitor(){const g=new THREE.Group();const scrMat=new THREE.MeshStandardMaterial({color:0x060a14,roughness:.05,metalness:.8,emissive:0x0a1828,emissiveIntensity:.7});const scr=new THREE.Mesh(new THREE.BoxGeometry(1.12,.66,.04),scrMat);scr.position.set(0,.98,0);scr.castShadow=true;g.add(scr);const frame=mkBox(1.18,.72,.05,'#1a1a22',.5,.5);frame.position.y=.98;g.add(frame);const neck=mkBox(.06,.3,.06,'#1a1a22');neck.position.set(0,.61,0);g.add(neck);const base=mkBox(.44,.03,.28,'#1a1a22');base.position.set(0,.46,.1);g.add(base);return g;}
function buildBookcase(){const g=new THREE.Group();[-.6,.6].forEach(x=>{const s=mkBox(.04,2.4,.38,'#9a7848');s.position.set(x,1.2,0);g.add(s);});const bk=mkBox(1.24,2.4,.04,'#8a6838');bk.position.set(0,1.2,-.18);g.add(bk);const top=mkBox(1.28,.04,.4,'#a08850');top.position.set(0,2.42,0);g.add(top);[0,1,2,3,4].forEach(i=>{const sh=mkBox(1.24,.04,.38,'#9a7848');sh.position.set(0,i*.46+.04,0);g.add(sh);});const bc=['#e8649a','#7c6ff7','#22c55e','#f59e0b','#ef4444','#06b6d4','#a78bfa','#f97316'];[0,1,2,3].forEach(row=>{let bx=-.56;[.08,.07,.1,.09,.08,.1].forEach((w,i)=>{if(bx+w>.56)return;const b=mkBox(w,.32,.24,bc[(row*6+i)%bc.length]);b.position.set(bx+w/2,row*.46+.24,0);g.add(b);bx+=w+.01;});});return g;}

// ── Additional Furniture ──────────────────────────────────────────────────────
function buildDishwasher(){const g=new THREE.Group();const body=mkBox(.6,.88,.6,'#d0ccca',.5,.2);body.position.y=.44;g.add(body);const top=mkBox(.62,.04,.62,'#b8b4b0',.3,.4);top.position.y=.9;g.add(top);const panel=mkBox(.54,.18,.03,'#222',.8);panel.position.set(0,.82,.31);g.add(panel);const handle=mkBox(.42,.03,.04,'#888',.3);handle.position.set(0,.72,.31);g.add(handle);return g;}
function buildMicrowave(){const g=new THREE.Group();const body=mkBox(.72,.46,.48,'#222',.7);body.position.y=.66;g.add(body);const door=mkBox(.5,.38,.04,'#111',.9);door.position.set(-.08,.66,.26);g.add(door);const glassMat=new THREE.MeshStandardMaterial({color:0x0d1820,roughness:.05,metalness:.3,transparent:true,opacity:.85});const glass=new THREE.Mesh(new THREE.BoxGeometry(.44,.32,.02),glassMat);glass.position.set(-.08,.66,.28);g.add(glass);return g;}
function buildFilingCabinet(){const g=new THREE.Group();const body=mkBox(.46,1.3,.62,'#7a7a8a',.8);body.position.y=.65;g.add(body);[0,1,2].forEach(i=>{const d=mkBox(.42,.38,.04,'#6a6a7a',.9);d.position.set(0,.2+i*.42,.32);g.add(d);const h=mkBox(.28,.04,.04,'#555');h.position.set(0,.36+i*.42,.34);g.add(h);});return g;}
function buildConferenceTable(){const g=new THREE.Group();const top=mkBox(3.2,.08,1.2,'#c8a87a',.65);top.position.y=.78;g.add(top);const pedL=mkBox(.12,.78,.9,'#7a5c30');pedL.position.set(-1.3,.39,0);g.add(pedL);const pedR=pedL.clone();pedR.position.set(1.3,.39,0);g.add(pedR);return g;}
function buildWhiteboard(){const g=new THREE.Group();const board=mkBox(1.8,.03,1.1,'#f8f8f8',.9);board.rotation.x=Math.PI/2;board.position.set(0,1.25,0);g.add(board);const frame=mkBox(1.86,.04,1.16,'#c0b090',.6);frame.rotation.x=Math.PI/2;frame.position.set(0,1.25,-.01);g.add(frame);const stand=mkCyl(.03,.03,.8,8,'#aaa',.3);stand.position.set(0,.4,0);g.add(stand);return g;}
function buildTVStand(){const g=new THREE.Group();const body=mkBox(1.8,.56,.5,'#2a2a32',.85);body.position.y=.28;g.add(body);const top=mkBox(1.84,.04,.52,'#1a1a22',.9);top.position.y=.58;g.add(top);[-.7,0,.7].forEach(x=>{const d=mkBox(.52,.5,.04,'#1e1e28',.8);d.position.set(x,.28,.27);g.add(d);});return g;}
function buildFloorVase(){const g=new THREE.Group();const vase=mkCyl(.12,.18,.7,16,'#c87050');vase.position.y=.35;g.add(vase);const neck=mkCyl(.09,.12,.16,16,'#c87050');neck.position.y=.78;g.add(neck);const lm=mat('#2a8828',.9);[0,1.1,2.2].forEach(a=>{const lf=new THREE.Mesh(new THREE.SphereGeometry(.2,8,6),lm.clone());lf.scale.set(1,.4,1);lf.position.set(Math.cos(a)*.22,1.28,Math.sin(a)*.22);g.add(lf);});return g;}
function buildBathMat(){const g=new THREE.Group();const m=new THREE.Mesh(new THREE.BoxGeometry(.9,.02,.58),mat('#e8a0c0',.9));m.position.y=.001;g.add(m);return g;}
function buildTowelRack(){const g=new THREE.Group();const rod=mkCyl(.016,.016,.82,8,'#c0c0c0',.2);rod.rotation.z=Math.PI/2;rod.position.set(0,.9,0);g.add(rod);[-.34,.34].forEach(x=>{const br=mkCyl(.014,.014,.24,8,'#b0b0b0',.3);br.position.set(x,.78,0);g.add(br);});const tw=mkBox(.72,.04,.44,'#f4e8e8',.8);tw.position.set(0,.95,.22);g.add(tw);return g;}
function buildVanityDesk(){const g=new THREE.Group();const top=mkBox(1.2,.04,.48,'#e8d0b8',.7);top.position.y=.76;g.add(top);[-.56,.56].forEach(x=>{const l=mkBox(.05,.76,.05,'#c0a878');l.position.set(x,.38,0);g.add(l);});const glassMat=new THREE.MeshStandardMaterial({color:0xc8d8e8,roughness:.04,metalness:.5,transparent:true,opacity:.6});const mirror=new THREE.Mesh(new THREE.BoxGeometry(1.0,1.1,.03),glassMat);mirror.position.set(0,1.38,-.2);g.add(mirror);const mframe=mkBox(1.06,1.16,.05,'#c0a878');mframe.position.set(0,1.38,-.22);g.add(mframe);const stool=mkCyl(.24,.24,.1,16,'#e0b0a0');stool.position.set(0,.42,.52);g.add(stool);return g;}
function buildShowerCabin(){const g=new THREE.Group();const base=mkBox(1.1,.08,1.1,'#d8d0cc',.6);base.position.y=.04;g.add(base);const walls=['#e8f4ff','#e8f4ff'];const glassMat=new THREE.MeshStandardMaterial({color:0xe0eeff,transparent:true,opacity:.22,roughness:.04,metalness:.1,side:THREE.DoubleSide});[{x:-.54,w:.08,h:WALL_H*.7,d:1.1,rx:0},{x:.54,w:.08,h:WALL_H*.7,d:1.1,rx:0},{x:0,w:1.1,h:WALL_H*.7,d:.08,rz:0,back:true}].forEach(s=>{if(s.back){const wall=new THREE.Mesh(new THREE.BoxGeometry(1.1,WALL_H*.7,.08),new THREE.MeshStandardMaterial({color:0xe8e0dc,roughness:.4}));wall.position.set(0,WALL_H*.35,-.54);g.add(wall);}else{const gl=new THREE.Mesh(new THREE.BoxGeometry(.08,WALL_H*.7,1.1),glassMat.clone());gl.position.set(s.x,WALL_H*.35,0);g.add(gl);}});const door=new THREE.Mesh(new THREE.BoxGeometry(.08,WALL_H*.68,0.52),glassMat.clone());door.position.set(.54,WALL_H*.34,.28);g.add(door);const head=mkCyl(.08,.08,.06,12,'#c0c0c0',.2);head.rotation.z=Math.PI/2;head.position.set(0,WALL_H*.62,-.4);g.add(head);return g;}
// ── Staircases (all sized for FLOOR_HEIGHT = 3.08 m) ─────────────────────────
function buildStaircase(){
  // Straight staircase: 17 steps reaches ~3.06m
  const g=new THREE.Group(),N=17,sh=FLOOR_HEIGHT/N,sd=0.28;
  for(let i=0;i<N;i++){const s=mkBox(1.2,sh,sd,'#d4c8b0',.7);s.position.set(0,sh*(i+.5),sd*(-(i+.5)));g.add(s);}
  const totalH=N*sh,totalD=N*sd;
  [-.56,.56].forEach(x=>{
    const post=mkCyl(.03,.03,totalH+.3,8,'#9a7050');post.position.set(x,totalH/2+.15,-totalD/2);g.add(post);
    const rail=mkCyl(.022,.022,Math.hypot(totalD,totalH),6,'#c0a870');
    rail.rotation.z=Math.atan2(totalH,totalD);rail.position.set(x,totalH/2,-totalD/2);g.add(rail);
    for(let i=0;i<N;i+=3){const bal=mkCyl(.015,.015,sh*3,6,'#b09060');bal.position.set(x,sh*(i+1.5),sd*-(i+1.5));g.add(bal);}
  });
  return g;
}
function buildSpiralStaircase(){
  // Helical spiral, 16 wedge steps, full 360° turn
  const g=new THREE.Group(),N=16,totalH=FLOOR_HEIGHT;
  const pole=mkCyl(.12,.12,totalH+.1,12,'#9a7050',.7);pole.position.y=totalH/2;g.add(pole);
  for(let i=0;i<N;i++){
    const a=i*(Math.PI*2/N);
    const step=mkBox(.72,.06,.36,'#d4c8b0',.7);
    const yPos=i*(totalH/N)+.03;
    step.position.set(Math.cos(a)*.42,yPos,Math.sin(a)*.42);
    step.rotation.y=-a;g.add(step);
    const bal=mkCyl(.018,.018,totalH/N*.85,6,'#b09060');
    bal.position.set(Math.cos(a)*.75,yPos+totalH/N*.42,Math.sin(a)*.75);g.add(bal);
  }
  // Helical handrail approximated with angled segments
  for(let i=0;i<N;i++){
    const a1=i*(Math.PI*2/N),a2=(i+1)*(Math.PI*2/N);
    const y1=i*(totalH/N),y2=(i+1)*(totalH/N);
    const seg=mkCyl(.014,.014,Math.hypot(0.75*Math.abs(a2-a1),totalH/N)*1.05,5,'#c0a870');
    seg.position.set((Math.cos(a1)+Math.cos(a2))*.375,y1+(y2-y1)/2,(Math.sin(a1)+Math.sin(a2))*.375);
    seg.rotation.y=-(a1+a2)/2;
    seg.rotation.z=Math.atan2(totalH/N,0.75*(a2-a1));g.add(seg);
  }
  const topPlat=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,.04,20),mat('#c8b898',.7));topPlat.position.y=totalH+.02;g.add(topPlat);
  return g;
}
function buildFloatingStaircase(){
  // Modern open-rise floating steps, steel side plate
  const g=new THREE.Group(),N=14,sh=FLOOR_HEIGHT/N,sd=0.32;
  const plate=mkBox(.04,FLOOR_HEIGHT,N*sd,'#888',.3,.7);plate.position.set(-.62,FLOOR_HEIGHT/2,-N*sd/2);g.add(plate);
  const plate2=plate.clone();plate2.position.x=.62;g.add(plate2);
  for(let i=0;i<N;i++){
    const s=new THREE.Mesh(new THREE.BoxGeometry(1.18,.07,sd*.85),mat('#f4f0ec',.5,.2));
    s.position.set(0,sh*(i+.5),sd*(-(i+.5)));s.castShadow=true;g.add(s);
    // thin support rod under each step
    const rod=mkCyl(.016,.016,sh*.7,6,'#aaa',.3,.6);rod.position.set(0,sh*(i+.5)-sh*.35+.04,sd*-(i+.5));g.add(rod);
  }
  // glass-panel rail
  const glassMat=new THREE.MeshStandardMaterial({color:0xb8d8f0,transparent:true,opacity:.25,roughness:.04,metalness:.1});
  [-.58,.58].forEach(x=>{const gl=new THREE.Mesh(new THREE.BoxGeometry(.03,FLOOR_HEIGHT*.85,N*sd*.88),glassMat.clone());gl.position.set(x,FLOOR_HEIGHT*.42,-N*sd/2);g.add(gl);});
  const topRail=mkCyl(.018,.018,1.28,6,'#ccc',.3,.6);topRail.rotation.z=Math.PI/2;topRail.position.set(0,FLOOR_HEIGHT*.86,-N*sd/2);g.add(topRail);
  return g;
}
function buildGrandStaircase(){
  // Classic bifurcated staircase: straight centre run up to landing, then two wings diverge left/right
  const g=new THREE.Group();
  const N1=8, sh=FLOOR_HEIGHT/2/(N1), sd=0.32; // centre run
  // Centre run (going toward +Z)
  for(let i=0;i<N1;i++){
    const s=mkBox(2.0,sh,sd,'#e8e0d4',.65);s.position.set(0,sh*(i+.5),sd*(i+.5));g.add(s);
  }
  const landY=N1*sh, landZ=N1*sd;
  const land=mkBox(3.8,.09,1.6,'#e8e0d4',.6);land.position.set(0,landY+sh*.5,landZ+.8);g.add(land);
  // Two side wings diverging left and right from the landing, going back down (-Z direction from landing)
  [-1.7,1.7].forEach(xOff=>{
    const N2=8;
    for(let i=0;i<N2;i++){
      const s=mkBox(1.5,sh,sd,'#e8e0d4',.65);
      s.position.set(xOff,landY-sh*i+sh*.5,landZ+1.6+sd*i);g.add(s);
    }
    const railH=N2*sh;
    [-.66,.66].forEach(dz=>{
      const post=mkCyl(.032,.032,railH+.32,8,'#a08858');post.position.set(xOff,landY-railH/2+.16,landZ+1.6+N2*sd/2);g.add(post);
      const rail=mkCyl(.022,.022,Math.hypot(N2*sd,railH)+.1,6,'#c8a870');
      rail.rotation.z=-Math.atan2(railH,N2*sd);rail.position.set(xOff,landY-railH/2,landZ+1.6+N2*sd/2);g.add(rail);
    });
    // newel post at bottom of each wing
    const np=mkCyl(.05,.05,.78,10,'#a08858');np.position.set(xOff,.39,landZ+1.6+N2*sd);g.add(np);
    const cap=mkBox(.14,.09,.14,'#b89868');cap.position.set(xOff,.82,landZ+1.6+N2*sd);g.add(cap);
  });
  // Centre run railings
  [-.94,.94].forEach(x=>{
    const post=mkCyl(.032,.032,N1*sh+.28,8,'#a08858');post.position.set(x,N1*sh/2+.14,N1*sd/2);g.add(post);
    const rail=mkCyl(.022,.022,Math.hypot(N1*sd,N1*sh)+.1,6,'#c8a870');
    rail.rotation.z=Math.atan2(N1*sh,N1*sd);rail.position.set(x,N1*sh/2,N1*sd/2);g.add(rail);
  });
  // Landing balustrade (back edge)
  for(let xi=-1.8;xi<=1.8;xi+=.26){const b=mkCyl(.018,.018,.56,6,'#b89868');b.position.set(xi,landY+sh*.5+.28,landZ+.04);g.add(b);}
  const topRail=mkBox(3.8,.04,.05,'#c8a870');topRail.position.set(0,landY+sh*.5+.58,landZ+.04);g.add(topRail);
  return g;
}

// ── Outdoor & Kids Furniture ──────────────────────────────────────────────────
function buildBBQGrill(){const g=new THREE.Group();const base=mkBox(.62,.88,.5,'#2a2a2a',.8);base.position.y=.44;g.add(base);const bowl=mkCyl(.3,.28,.2,16,'#1a1a1a',.9);bowl.position.y=.78;g.add(bowl);const lid=mkBox(.64,.26,.52,'#2a2a2a',.7);lid.position.set(0,1.04,0);lid.rotation.x=-.25;g.add(lid);[-.28,.28].forEach(x=>{[-.2,.2].forEach(z=>{const l=mkBox(.04,.88,.04,'#333',.7);l.position.set(x,0,z);g.add(l);});});const shelf=mkBox(.58,.04,.42,'#333',.7);shelf.position.y=.3;g.add(shelf);const fm=new THREE.MeshStandardMaterial({color:0xff5000,emissive:0xff3000,emissiveIntensity:1.4,transparent:true,opacity:.55});[-.08,.08].forEach(x=>{const fl=new THREE.Mesh(new THREE.ConeGeometry(.04,.16,6),fm.clone());fl.position.set(x,.85,0);g.add(fl);});return g;}
function buildSunLounger(){const g=new THREE.Group(),c='#e0c890';const seat=mkBox(1.92,.07,.72,c,.75);seat.position.y=.26;g.add(seat);const head=mkBox(1.92,.07,.72,c,.75);head.position.set(0,.36,-.5);head.rotation.x=.42;g.add(head);[[-.88,-.3],[-.88,.3],[.88,-.3],[.88,.3]].forEach(([x,z])=>{const l=mkBox(.05,.26,.05,'#8a6830',.8);l.position.set(x,.13,z);g.add(l);});const pad=mkBox(1.84,.06,.68,'#c89858',.9);pad.position.y=.32;g.add(pad);return g;}
function buildHotTub(){const g=new THREE.Group();const outer=mkBox(1.8,.68,1.8,'#c8c0b8',.6);outer.position.y=.34;g.add(outer);const inner=mkBox(1.52,.48,1.52,'#b0a8a0',.5);inner.position.y=.44;g.add(inner);const water=new THREE.Mesh(new THREE.BoxGeometry(1.44,.1,1.44),new THREE.MeshStandardMaterial({color:0x2090c8,transparent:true,opacity:.68,roughness:.04}));water.position.y=.68;g.add(water);const rim=mkBox(1.84,.07,1.84,'#a09890',.5);rim.position.y=.7;g.add(rim);const step=mkBox(.5,.32,.42,'#d0c8c0',.7);step.position.set(.9,.16,0);g.add(step);return g;}
function buildGardenPlanter(){const g=new THREE.Group();const box=mkBox(.7,.44,.38,'#8a6840',.85);box.position.y=.22;g.add(box);const soil=mkBox(.62,.06,.3,'#281a0a',.95);soil.position.y=.46;g.add(soil);const lm=mat('#267020',.9);[-2,-1,0,1,2].forEach(i=>{const lf=new THREE.Mesh(new THREE.SphereGeometry(.09,8,6),lm.clone());lf.scale.set(1,.48,1);lf.position.set(i*.13,.58,0);g.add(lf);});return g;}
function buildPoolArea(){const g=new THREE.Group();const surr=mkBox(4,.06,2.5,'#c8d0c0',.7);surr.position.y=-.01;g.add(surr);const edge=mkBox(3.44,.1,1.94,'#d8e0d0',.6);edge.position.y=.02;g.add(edge);const water=new THREE.Mesh(new THREE.BoxGeometry(3.3,1.8,.1),new THREE.MeshStandardMaterial({color:0x1868a8,transparent:true,opacity:.75,roughness:.03}));water.rotation.x=-Math.PI/2;water.position.y=.07;g.add(water);const shine=new THREE.Mesh(new THREE.PlaneGeometry(3.24,1.74),new THREE.MeshStandardMaterial({color:0x40aad8,transparent:true,opacity:.35,roughness:.01}));shine.rotation.x=-Math.PI/2;shine.position.y=.09;g.add(shine);return g;}
function buildGardenTable(){const g=new THREE.Group();const top=mkCyl(.7,.7,.06,24,'#e8e0d8',.65);top.position.y=.76;g.add(top);const shaft=mkCyl(.04,.04,.74,10,'#c0b8b0',.5);shaft.position.y=.37;g.add(shaft);const base=mkCyl(.4,.4,.04,24,'#b0a8a0',.6);base.position.y=.02;g.add(base);return g;}
function buildUmbrella(){const g=new THREE.Group();const pole=mkCyl(.025,.025,2.4,8,'#888',.3);pole.position.y=1.2;g.add(pole);const canopy=new THREE.Mesh(new THREE.ConeGeometry(1.2,.6,24),mat('#e8649a',.85));canopy.position.y=2.4;g.add(canopy);const base=mkCyl(.22,.22,.08,16,'#666',.7);base.position.y=.04;g.add(base);return g;}
// Kids
function buildCrib(){const g=new THREE.Group();const fr=mkBox(1.3,.15,.72,'#f0e8d8',.7);fr.position.y=.48;g.add(fr);const matt=mkBox(1.2,.12,.62,'#fff8f0',.85);matt.position.y=.64;g.add(matt);[-.62,.62].forEach(x=>{const p=mkBox(.05,.68,.74,'#ede4d4',.7);p.position.set(x,.82,0);g.add(p);});[-.32,.32].forEach(z=>{const p=mkBox(1.3,.68,.05,'#ede4d4',.7);p.position.set(0,.82,z);g.add(p);});[[-.58,-.3],[-.58,.3],[.58,-.3],[.58,.3]].forEach(([x,z])=>{const l=mkBox(.05,.48,.05,'#c8b89a',.8);l.position.set(x,.24,z);g.add(l);});return g;}
function buildToyBox(){const g=new THREE.Group();const body=mkBox(1.1,.58,.58,'#e87030',.85);body.position.y=.29;g.add(body);const lid=mkBox(1.12,.09,.6,'#f08040',.8);lid.position.set(0,.62,0);lid.rotation.x=-.3;g.add(lid);['#e8649a','#6c63ff','#22c55e','#f59e0b'].forEach((c,i)=>{const s=mkBox(.1,.1,.04,c);s.position.set(-.24+i*.18,.36,.3);g.add(s);});return g;}
function buildKidsBed(){const g=new THREE.Group();const frame=mkBox(1.05,.22,2.1,'#f8a0b0',.75);frame.position.y=.11;g.add(frame);const matt=mkBox(.96,.18,2,'#fff0f4',.85);matt.position.y=.31;g.add(matt);const head=mkBox(1.05,.72,.08,'#f8a0b0',.75);head.position.set(0,.58,-1.0);g.add(head);const p=mkBox(.76,.1,.38,'#fff0f0',.85);p.position.set(0,.46,-.74);g.add(p);[[-.44,-1.0],[.44,-1.0],[-.44,1.0],[.44,1.0]].forEach(([x,z])=>{const l=mkBox(.06,.14,.06,'#e87090');l.position.set(x,-.07,z);g.add(l);});return g;}
function buildKidsDesk(){const g=new THREE.Group();const top=mkBox(1.2,.05,.6,'#f8d080',.7);top.position.y=.66;g.add(top);[[-.54,-.25],[.54,-.25]].forEach(([x,z])=>{const l=mkBox(.05,.66,.05,'#f0c060');l.position.set(x,.33,z);g.add(l);});const bk=mkBox(1.1,.05,.05,'#f0c060');bk.position.set(0,.36,-.25);g.add(bk);const chr=mkBox(.44,.06,.44,'#80d0f0');chr.position.set(0,.4,.52);g.add(chr);[[-.18,.32],[.18,.32],[-.18,.72],[.18,.72]].forEach(([x,z])=>{const l=mkBox(.04,.4,.04,'#60b0d8');l.position.set(x,.2,z);g.add(l);});return g;}
function buildKidsChair(){const g=new THREE.Group();const seat=mkBox(.48,.07,.46,'#ff9050',.8);seat.position.y=.42;g.add(seat);const back=mkBox(.48,.52,.06,'#ff9050',.8);back.position.set(0,.7,-.2);g.add(back);[[-.2,-.18],[-.2,.18],[.2,-.18],[.2,.18]].forEach(([x,z])=>{const l=mkBox(.05,.42,.05,'#e07040');l.position.set(x,.21,z);g.add(l);});return g;}

// ── More Furniture ────────────────────────────────────────────────────────────
function buildPiano(){const g=new THREE.Group();const body=mkBox(1.5,1.1,.6,'#111',.85);body.position.y=.55;g.add(body);const keys=mkBox(1.3,.07,.18,'#f5f5f5',.9);keys.position.set(0,.96,.2);g.add(keys);[-.48,-.32,-.08,.08,.32].forEach(x=>{const bk=mkBox(.07,.1,.11,'#1a1a1a',.8);bk.position.set(x,.99,.17);g.add(bk);});const lid=mkBox(1.52,.04,.64,'#0a0a0a',.7);lid.position.set(0,1.12,0);lid.rotation.x=-.18;g.add(lid);[[-.66,-.22],[-.66,.22],[.66,-.22],[.66,.22]].forEach(([x,z])=>{const l=mkBox(.06,.1,.06,'#222',.9);l.position.set(x,.05,z);g.add(l);});return g;}
function buildCoatRack(){const g=new THREE.Group();const pole=mkCyl(.03,.03,1.72,8,'#7a5030');pole.position.y=.86;g.add(pole);for(let i=0;i<6;i++){const a=i*Math.PI*2/6;const hook=mkBox(.22,.04,.04,'#6a4020');hook.position.set(Math.cos(a)*.22,1.52,Math.sin(a)*.22);hook.rotation.y=a;g.add(hook);}const base=mkCyl(.3,.3,.06,16,'#6a4020');base.position.y=.03;g.add(base);return g;}
function buildAquarium(){const g=new THREE.Group();const stand=mkBox(1.1,.65,.52,'#2a2030',.85);stand.position.y=.325;g.add(stand);const glassMat=new THREE.MeshStandardMaterial({color:0x88c0d8,transparent:true,opacity:.3,roughness:.04,metalness:.1,side:THREE.DoubleSide});const tank=new THREE.Mesh(new THREE.BoxGeometry(1.0,.52,.42),glassMat);tank.position.y=.91;g.add(tank);const water=new THREE.Mesh(new THREE.BoxGeometry(.96,.46,.38),new THREE.MeshStandardMaterial({color:0x1a5a78,transparent:true,opacity:.55,roughness:.02}));water.position.y=.91;g.add(water);const frame=mkBox(1.04,.56,.46,'#1e1828',.6,.4);frame.position.y=.91;g.add(frame);const lid=mkBox(1.04,.04,.46,'#1e1828',.6);lid.position.y=1.19;g.add(lid);return g;}
function buildBeanBag(){const g=new THREE.Group();const bag=new THREE.Mesh(new THREE.SphereGeometry(.54,12,10),mat('#c07898',.95));bag.scale.set(1,.65,1);bag.position.y=.35;g.add(bag);return g;}
function buildTreadmill(){const g=new THREE.Group();const base=mkBox(1.8,.18,.72,'#2a2a2a',.7);base.position.y=.09;g.add(base);const belt=mkBox(1.58,.04,.58,'#111',.9);belt.position.y=.2;g.add(belt);[-.82,.82].forEach(x=>{const fr=mkBox(.06,1.0,.06,'#444',.6);fr.position.set(x,.7,-.3);g.add(fr);});const bar=mkBox(1.64,.04,.05,'#555',.6);bar.position.set(0,1.22,-.3);g.add(bar);const scr=mkBox(.32,.2,.04,'#111',.8);scr.position.set(0,1.32,-.3);g.add(scr);return g;}
function buildBarCabinet(){const g=new THREE.Group();const body=mkBox(1.2,1.1,.52,'#291a0c',.85);body.position.y=.55;g.add(body);const top=mkBox(1.24,.06,.56,'#8b6c42',.45,.25);top.position.y=1.13;g.add(top);[-.36,.36].forEach(x=>{const d=mkBox(.54,.88,.04,'#3a2010',.9);d.position.set(x,.55,.27);g.add(d);const h=mkCyl(.016,.016,.1,8,'#c0a060');h.rotation.z=Math.PI/2;h.position.set(x,.7,.28);g.add(h);});const shelf=mkBox(1.18,.03,.5,'#6a5030');shelf.position.set(0,1.19,0);g.add(shelf);['#c04040','#c0b040','#3050a0'].forEach((c,i)=>{const bt=mkCyl(.04,.035,.26,8,c,.5);bt.position.set(-.28+i*.28,1.35,0);g.add(bt);const cap=mkCyl(.04,.04,.04,8,'#888');cap.position.set(-.28+i*.28,1.51,0);g.add(cap);});return g;}
function buildDogBed(){const g=new THREE.Group();const base=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.08,24),mat('#c8a080',.9));base.position.y=.04;g.add(base);const rim=new THREE.Mesh(new THREE.TorusGeometry(.44,.1,8,24),mat('#b89070',.85));rim.rotation.x=Math.PI/2;rim.position.y=.14;g.add(rim);const pad=new THREE.Mesh(new THREE.CylinderGeometry(.36,.36,.06,24),mat('#e8d0b0',.95));pad.position.y=.1;g.add(pad);return g;}
function buildAccentChair(){const g=new THREE.Group();const bowl=new THREE.Mesh(new THREE.SphereGeometry(.46,12,8,0,Math.PI*2,0,Math.PI*.55),mat('#c89060',.9));bowl.position.y=.64;g.add(bowl);const rim=new THREE.Mesh(new THREE.TorusGeometry(.46,.04,6,24),mat('#b07840',.85));rim.rotation.x=Math.PI/2;rim.position.y=.64;g.add(rim);const stem=mkCyl(.04,.05,.64,8,'#8a6030');stem.position.y=.32;g.add(stem);const base=mkCyl(.36,.36,.05,16,'#6a4820');base.position.y=.025;g.add(base);return g;}
function buildCoffeeMaker(){const g=new THREE.Group();const body=mkBox(.28,.42,.24,'#1c1c1c',.7);body.position.y=.45;g.add(body);const res=mkBox(.22,.3,.2,'#2a2a2a',.7);res.position.set(.04,.52,0);g.add(res);const base=mkBox(.3,.08,.26,'#111',.8);base.position.y=.04;g.add(base);const cup=mkCyl(.07,.06,.1,12,'#d0c8c0');cup.position.set(-.06,.09,0);g.add(cup);const plate=mkCyl(.12,.12,.02,12,'#222',.6);plate.position.set(-.06,.05,0);g.add(plate);return g;}
function buildPlantStand(){const g=new THREE.Group();const pole=mkCyl(.02,.02,1.06,8,'#8a6838');pole.position.y=.53;g.add(pole);[{y:.08,r:.22},{y:.52,r:.17},{y:.96,r:.12}].forEach(({y,r},i)=>{const shelf=new THREE.Mesh(new THREE.CylinderGeometry(r,r,.04,16),mat('#c0a878',.7));shelf.position.y=y;g.add(shelf);const pot=mkCyl(r*.52,r*.42,.14,8,'#c07850');pot.position.y=y+.1;g.add(pot);const lm=mat('#2a8828',.9);const lf=new THREE.Mesh(new THREE.SphereGeometry(r*.8,8,6),lm.clone());lf.scale.y=.5;lf.position.y=y+.25;g.add(lf);});return g;}
function buildStorageUnit(){const g=new THREE.Group();[[-.5,-.5],[-.5,.5],[.5,-.5],[.5,.5]].forEach(([x,z])=>{const box=mkBox(.94,.84,.44,'#22202a',.85);box.position.set(x,.42,z);g.add(box);const door=mkBox(.88,.78,.03,'#1c1a24',.9);door.position.set(x,.42,z+.23);g.add(door);const h=mkCyl(.015,.015,.1,8,'#888');h.rotation.z=Math.PI/2;h.position.set(x,.46,z+.24);g.add(h);});const top=mkBox(2.0,.04,1.0,'#181620',.8);top.position.y=.86;g.add(top);return g;}
function buildOutdoorChair(){const g=new THREE.Group(),c='#6a8050';const seat=mkBox(1.0,.08,.9,c);seat.position.y=.46;g.add(seat);const back=mkBox(1.0,.72,.06,c);back.position.set(0,.86,-.42);back.rotation.x=.12;g.add(back);const arm1=mkBox(.08,.28,1.0,'#8a6040');arm1.position.set(-.46,.58,0);g.add(arm1);const arm2=arm1.clone();arm2.position.set(.46,.58,0);g.add(arm2);[[-.44,-.38],[-.44,.38],[.44,-.38],[.44,.38]].forEach(([x,z])=>{const l=mkBox(.07,.46,.07,'#4a5030');l.position.set(x,.23,z);g.add(l);});return g;}
function buildKeyboard(){const g=new THREE.Group();const kb=mkBox(.46,.03,.16,'#222',.9);kb.position.y=.02;g.add(kb);[0,1,2,3,4].forEach(row=>{for(let col=0;col<10-row;col++){const key=mkBox(.04,.03,.04,'#333',.8);key.position.set(-.2+col*.044+row*.02,.04,-.05+row*.03);g.add(key);}});const mouse=mkBox(.07,.04,.11,'#2a2a2a',.8);mouse.position.set(.32,.02,0);g.add(mouse);return g;}

// ── Garden & Exterior ─────────────────────────────────────────────────────────
function buildTree(){
  const g=new THREE.Group();
  const trunk=mkCyl(.1,.14,1.4,10,'#5a3818',.9);trunk.position.y=.7;g.add(trunk);
  const lm=mat('#1e6e14',.9);
  [[0,2.4,0,.72],[.38,1.9,.22,.6],[-.34,1.8,-.26,.58],[.22,1.6,.36,.5],[-.28,1.55,-.18,.48],[.1,2.1,-.3,.54]].forEach(([x,y,z,r])=>{
    const cl=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),lm.clone());cl.position.set(x,y,z);cl.castShadow=true;g.add(cl);
  });
  return g;
}
function buildPineTree(){
  const g=new THREE.Group();
  const trunk=mkCyl(.07,.1,.9,8,'#4a2e14',.9);trunk.position.y=.45;g.add(trunk);
  [[.0,.9,.52],[0,1.4,.42],[0,1.82,.32],[0,2.16,.22]].forEach(([x,y,r])=>{
    const tier=new THREE.Mesh(new THREE.ConeGeometry(r,.52,10),mat('#1a6010',.9));tier.position.y=y;g.add(tier);
  });
  return g;
}
function buildBush(){
  const g=new THREE.Group();
  const lm=mat('#2a7820',.9);
  [[0,.28,0,.38],[.24,.22,.16,.28],[-.22,.2,-.14,.26],[.14,.2,-.22,.25],[-.1,.24,.24,.24]].forEach(([x,y,z,r])=>{
    const b=new THREE.Mesh(new THREE.SphereGeometry(r,9,7),lm.clone());b.position.set(x,y,z);b.castShadow=true;g.add(b);
  });
  return g;
}
function buildFloweringBush(){
  const g=new THREE.Group();
  const lm=mat('#267020',.9);
  [[0,.26,0,.36],[.22,.2,.14,.26],[-.2,.2,-.12,.24]].forEach(([x,y,z,r])=>{
    const b=new THREE.Mesh(new THREE.SphereGeometry(r,9,7),lm.clone());b.position.set(x,y,z);b.castShadow=true;g.add(b);
  });
  const fc=['#e8649a','#f4c040','#c070e8','#e87040','#40c8e8'];
  for(let i=0;i<18;i++){
    const a=i*1.1,r=.1+Math.random()*.22,h=.12+Math.random()*.26;
    const fl=new THREE.Mesh(new THREE.SphereGeometry(.06,6,5),mat(fc[i%fc.length],.8));
    fl.position.set(Math.cos(a)*r,h,Math.sin(a)*r);g.add(fl);
  }
  return g;
}
function buildHedge(){
  const g=new THREE.Group();
  const body=mkBox(1.6,.9,.4,'#2a7020',.9);body.position.y=.45;g.add(body);
  const top=mkBox(1.62,.08,.42,'#22601a',.85);top.position.y=.94;g.add(top);
  return g;
}
function buildFlowerBed(){
  const g=new THREE.Group();
  const soil=new THREE.Mesh(new THREE.BoxGeometry(1.8,.1,1.0),mat('#2a1a0a',.95));soil.position.y=.05;g.add(soil);
  const border=mkBox(1.84,.14,1.04,'#8a6030',.85);border.position.set(0,.04,0);g.add(border);
  const fc=['#e8649a','#f4c040','#ef4444','#c070e8','#f97316','#fff','#e8649a','#22c55e'];
  for(let row=0;row<3;row++)for(let col=0;col<6;col++){
    const stem=mkCyl(.012,.012,.28,5,'#3a7a20');stem.position.set(-0.7+col*.28,.24,-0.32+row*.3);g.add(stem);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.065,7,6),mat(fc[(row*6+col)%fc.length],.85));
    head.position.set(-0.7+col*.28,.42,-0.32+row*.3);g.add(head);
  }
  return g;
}
function buildGardenPath(){
  const g=new THREE.Group();
  const base=new THREE.Mesh(new THREE.BoxGeometry(1.2,.05,2.4),mat('#b8b0a8',.9));base.position.y=.025;g.add(base);
  const sm=mat('#a8a098',.85);
  [[-.3,.04,-.8],[.3,.04,-.4],[-.2,.04,0],[.28,.04,.4],[-.32,.04,.82]].forEach(([x,y,z])=>{
    const stone=new THREE.Mesh(new THREE.BoxGeometry(.44+Math.random()*.1,.04,.38+Math.random()*.08),sm.clone());
    stone.position.set(x,y,z);stone.rotation.y=Math.random()*.3-.15;g.add(stone);
  });
  return g;
}
function buildWoodFence(){
  const g=new THREE.Group();
  const post1=mkBox(.08,.88,.08,'#8a6030',.85);post1.position.set(-.72,.44,0);g.add(post1);
  const post2=post1.clone();post2.position.x=.72;g.add(post2);
  [.24,.62].forEach(y=>{const rail=mkBox(1.52,.06,.04,'#a07840',.8);rail.position.set(0,y,0);g.add(rail);});
  [-.54,-.28,0,.28,.54].forEach(x=>{const plank=mkBox(.07,.72,.04,'#9a7038',.85);plank.position.set(x,.46,0);g.add(plank);});
  return g;
}
function buildStonWall(){
  const g=new THREE.Group();
  const base=mkBox(1.8,.72,.3,'#787878',.9);base.position.y=.36;g.add(base);
  const sm=mat('#888',.9);
  [0,1,2].forEach(row=>[-.6,-.2,.2,.6].forEach((x,ci)=>{
    const s=mkBox(.36+((ci+row)%2)*.06,.2+((ci*row)%2)*.04,.32,sm.color?.getHexString?'#888':'#888',.9);
    s.position.set(x+(row%2)*.18,.1+row*.22,0);g.add(s);
  }));
  return g;
}
function buildPergola(){
  const g=new THREE.Group();
  [[-.9,0,-.9],[.9,0,-.9],[-.9,0,.9],[.9,0,.9]].forEach(([x,y,z])=>{const post=mkBox(.1,2.4,.1,'#c8b080',.75);post.position.set(x,1.2,z);g.add(post);});
  for(let i=-0.7;i<=0.7;i+=.28){const beam=mkBox(.06,.06,1.88,'#d0b888',.7);beam.position.set(i,2.38,0);g.add(beam);}
  [-.88,.88].forEach(z=>{const purlin=mkBox(1.88,.07,.07,'#d4bc8a',.7);purlin.position.set(0,2.36,z);g.add(purlin);});
  // climbing vines
  const vm=mat('#2a7820',.9);
  [[-.9,1.2,-.9],[.9,1.4,.9],[-.9,1.6,.9]].forEach(([x,y,z])=>{
    const lf=new THREE.Mesh(new THREE.SphereGeometry(.24,8,6),vm.clone());lf.scale.set(1,.4,1);lf.position.set(x,y,z);g.add(lf);
  });
  return g;
}
function buildGardenArch(){
  const g=new THREE.Group();
  // Two upright posts
  [-.56,.56].forEach(x=>{
    const post=mkBox(.12,2.4,.12,'#c8b080',.75);post.position.set(x,1.2,0);g.add(post);
  });
  // Arch: series of segments following a semicircle over the top
  const R=0.6,segs=10;
  for(let i=0;i<=segs;i++){
    const a=i*Math.PI/segs;
    const x=Math.cos(Math.PI-a)*R, y=2.4+Math.sin(Math.PI-a)*R;
    const seg=mkBox(.14,.28,.12,'#d0b888',.7);
    seg.position.set(x,y,0);
    seg.rotation.z=-a+Math.PI/2;
    g.add(seg);
  }
  // Cross beam at top of posts
  const beam=mkBox(1.26,.1,.12,'#c8b080',.75);beam.position.set(0,2.43,0);g.add(beam);
  // Climbing vines on posts and arch
  const vm=mat('#2a7820',.9);
  [[-0.56,0.8],[0.56,1.4],[-0.56,1.8],[0.1,2.56],[-.3,2.8]].forEach(([x,y])=>{
    const lf=new THREE.Mesh(new THREE.SphereGeometry(.2,8,6),vm.clone());
    lf.scale.set(1,.5,1);lf.position.set(x,y,.04);g.add(lf);
  });
  // A few pink flowers
  const fm=mat('#e8649a',.8);
  [[-.5,1.1],[.5,1.6],[.0,2.7]].forEach(([x,y])=>{
    const fl=new THREE.Mesh(new THREE.SphereGeometry(.09,6,5),fm.clone());fl.position.set(x,y,.08);g.add(fl);
  });
  return g;
}
function buildGardenBench(){
  const g=new THREE.Group();
  const seat=mkBox(1.5,.08,.52,'#c8a870',.7);seat.position.y=.46;g.add(seat);
  const back=mkBox(1.5,.58,.07,'#c0a068',.75);back.position.set(0,.8,-.22);g.add(back);
  [[-.64,-.18],[-.64,.18],[.64,-.18],[.64,.18]].forEach(([x,z])=>{const l=mkBox(.07,.46,.07,'#9a7030',.8);l.position.set(x,.23,z);g.add(l);});
  [[-.6,0,.25],[.6,0,.25]].forEach(([x,y,z])=>{const br=mkBox(.07,.6,.04,'#9a7030',.8);br.position.set(x,.7,z-.44);br.rotation.x=.12;g.add(br);});
  return g;
}
function buildBirdBath(){
  const g=new THREE.Group();
  const ped=mkCyl(.08,.1,.88,12,'#b8b0a8',.7);ped.position.y=.44;g.add(ped);
  const basin=new THREE.Mesh(new THREE.CylinderGeometry(.38,.24,.14,18),mat('#c8c0b8',.6));basin.position.y=.96;g.add(basin);
  const water=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.04,18),new THREE.MeshStandardMaterial({color:0x3090c0,transparent:true,opacity:.6,roughness:.02}));water.position.y=1.04;g.add(water);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.07,16),mat('#a8a098',.75));base.position.y=.035;g.add(base);
  return g;
}
function buildGardenLantern(){
  const g=new THREE.Group();
  const post=mkCyl(.025,.025,1.5,8,'#4a4848',.5,.4);post.position.y=.75;g.add(post);
  const body=mkBox(.22,.28,.22,'#3a3838',.5,.5);body.position.y=1.64;g.add(body);
  const glassMat=new THREE.MeshStandardMaterial({color:0xfff0c0,transparent:true,opacity:.55,emissive:0xffd060,emissiveIntensity:.5});
  [[.12,1.64,0],[-.12,1.64,0],[0,1.64,.12],[0,1.64,-.12]].forEach(([x,y,z])=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.02,.24,.18),glassMat.clone());p.position.set(x,y,z);p.rotation.y=x!==0?Math.PI/2:0;g.add(p);});
  const cap=new THREE.Mesh(new THREE.ConeGeometry(.16,.14,8),mat('#2a2828',.5,.5));cap.position.y=1.82;g.add(cap);
  const pl=new THREE.PointLight(0xffd060,.6,3.5);pl.position.y=1.6;g.add(pl);
  return g;
}
function buildGardenStatue(){
  const g=new THREE.Group();
  const base=mkBox(.42,.12,.42,'#b0b0b8',.7);base.position.y=.06;g.add(base);
  const pedestal=mkBox(.3,.5,.3,'#b8b8c0',.65);pedestal.position.y=.37;g.add(pedestal);
  const torso=mkBox(.24,.44,.18,'#c0c0c8',.6);torso.position.y=.84;g.add(torso);
  const head=mkBox(.18,.2,.16,'#c0c0c8',.6);head.position.y=1.16;g.add(head);
  [-.14,.14].forEach(x=>{const arm=mkBox(.08,.36,.12,'#b8b8c0',.65);arm.position.set(x,.86,0);arm.rotation.z=x<0?.3:-.3;g.add(arm);});
  return g;
}
function buildGrassPatch(){
  const g=new THREE.Group();
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(2.4,2.4),mat('#1e6010',.95));ground.rotation.x=-Math.PI/2;ground.position.y=.003;g.add(ground);
  for(let i=0;i<30;i++){
    const a=Math.random()*Math.PI*2,r=Math.random()*1.1;
    const blade=mkBox(.03,.18+Math.random()*.1,.02,'#267020',.9);
    blade.position.set(Math.cos(a)*r,.09+blade.geometry.parameters.height/2,Math.sin(a)*r);
    blade.rotation.y=Math.random()*Math.PI;blade.rotation.z=(Math.random()-.5)*.3;
    g.add(blade);
  }
  return g;
}
function buildGardenShed(){
  const g=new THREE.Group();
  const W=2.2,D=1.8,H=2.0;
  // Walls
  [[0,H/2,D/2,.06,H,W],[0,H/2,-D/2,.06,H,W],[W/2,H/2,0,D,H,.06],[- W/2,H/2,0,D,H,.06]].forEach(([x,y,z,dx,dy,dz])=>{
    const wall=mkBox(dz||dx,dy,dx||dz,'#c8a870',.85);wall.position.set(x,y,z);g.add(wall);
  });
  const roof=new THREE.Mesh(new THREE.BoxGeometry(W+.2,.1,D+.2),mat('#784030',.9));roof.position.y=H+.05;g.add(roof);
  const ridge=new THREE.Mesh(new THREE.BoxGeometry(.1,.3,D+.3),mat('#603020',.9));ridge.position.y=H+.22;g.add(ridge);
  const door=mkBox(.7,1.6,.07,'#9a6830',.85);door.position.set(0,.8,D/2+.02);g.add(door);
  return g;
}
function buildSunflower(){
  const g=new THREE.Group();
  const stem=mkCyl(.02,.02,.9,6,'#3a7820');stem.position.y=.45;g.add(stem);
  const center=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.04,14),mat('#3a2010',.9));center.position.y=.92;g.add(center);
  for(let i=0;i<12;i++){const a=i*Math.PI/6;const petal=new THREE.Mesh(new THREE.BoxGeometry(.06,.22,.04),mat('#f4c020',.85));petal.position.set(Math.cos(a)*.18,.92,Math.sin(a)*.18);petal.rotation.y=-a;g.add(petal);}
  const leaf=new THREE.Mesh(new THREE.BoxGeometry(.04,.2,.14),mat('#2a7820',.9));leaf.position.set(.1,.4,0);leaf.rotation.z=.5;g.add(leaf);
  return g;
}
function buildGardenWell(){
  const g=new THREE.Group();
  const base=new THREE.Mesh(new THREE.CylinderGeometry(.44,.48,.48,16),mat('#909090',.85));base.position.y=.24;g.add(base);
  const inner=new THREE.Mesh(new THREE.CylinderGeometry(.32,.34,.5,16),mat('#606060',.9));inner.position.y=.25;g.add(inner);
  const rim=new THREE.Mesh(new THREE.TorusGeometry(.44,.05,8,20),mat('#808080',.8));rim.rotation.x=Math.PI/2;rim.position.y=.52;g.add(rim);
  [-.36,.36].forEach(x=>{const post=mkBox(.07,.72,.07,'#8a6030',.8);post.position.set(x,.72,.0);g.add(post);});
  const crossbar=mkBox(.78,.06,.06,'#9a7038',.8);crossbar.position.y=1.1;g.add(crossbar);
  const rope=mkCyl(.015,.015,.44,6,'#c0a860');rope.position.set(0,.84,0);g.add(rope);
  const bucket=new THREE.Mesh(new THREE.CylinderGeometry(.1,.08,.2,12),mat('#a08030',.8));bucket.position.set(0,.44,0);g.add(bucket);
  return g;
}

// ── Extra Furniture ───────────────────────────────────────────────────────────
function buildMediaConsole(){const g=new THREE.Group();const body=mkBox(2.2,.52,.48,'#1a1820',.85);body.position.y=.26;g.add(body);const top=mkBox(2.24,.04,.52,'#141218',.7);top.position.y=.54;g.add(top);[-.74,0,.74].forEach(x=>{const d=mkBox(.68,.46,.04,'#201e28',.9);d.position.set(x,.26,.25);g.add(d);const h=mkCyl(.014,.014,.08,8,'#666');h.rotation.z=Math.PI/2;h.position.set(x,.26,.27);g.add(h);});[[-.98,-.2],[-.98,.2],[.98,-.2],[.98,.2]].forEach(([x,z])=>{const l=mkBox(.04,.06,.04,'#111');l.position.set(x,-.03,z);g.add(l);});return g;}
function buildPouffe(){const g=new THREE.Group();const body=new THREE.Mesh(new THREE.CylinderGeometry(.38,.36,.34,20),mat('#b88060',.9));body.position.y=.17;g.add(body);const top=new THREE.Mesh(new THREE.CylinderGeometry(.39,.39,.04,20),mat('#c89070',.85));top.position.y=.36;g.add(top);[[-.32,0],[.32,0],[0,-.32],[0,.32]].forEach(([x,z])=>{const l=mkBox(.05,.17,.05,'#8a5830');l.position.set(x,-.085,z);g.add(l);});return g;}
function buildReclineerChair(){const g=new THREE.Group(),c='#6a4a30';const base=mkBox(.92,.2,.92,c);base.position.y=.1;g.add(base);const seat=mkBox(.88,.2,.78,c);seat.position.set(0,.3,.04);g.add(seat);const back=mkBox(.88,.7,.16,c);back.position.set(0,.65,-.32);g.add(back);const leg=mkBox(.88,.2,.46,'#5a3820');leg.position.set(0,.3,.46);leg.rotation.x=.38;g.add(leg);[[-.38,-.34],[-.38,.34],[.38,-.34],[.38,.34]].forEach(([x,z])=>{const l=mkBox(.06,.1,.06,'#4a2818');l.position.set(x,.0,z);g.add(l);});return g;}
function buildWritingDesk(){const g=new THREE.Group();const top=mkBox(1.1,.04,.56,'#d4b888',.7);top.position.y=.78;g.add(top);[[-.5,-.23],[.5,-.23]].forEach(([x,z])=>{const l=mkBox(.04,.78,.04,'#a08048');l.position.set(x,.39,z);g.add(l);});const cb=mkBox(1.0,.04,.04,'#a08048');cb.position.set(0,.42,-.23);g.add(cb);const drw=mkBox(.48,.2,.52,'#c0a070');drw.position.set(.28,.62,0);g.add(drw);const h=mkCyl(.015,.015,.09,8,'#888');h.rotation.z=Math.PI/2;h.position.set(.28,.66,.27);g.add(h);return g;}
function buildGrandPiano(){const g=new THREE.Group();const body=mkBox(2.2,.96,.9,'#0a0a0a',.9);body.position.y=.48;g.add(body);const tail=mkBox(1.2,.96,.6,'#0a0a0a',.9);tail.position.set(.5,.48,.72);g.add(tail);const keys=mkBox(1.9,.08,.22,'#f5f5f5',.9);keys.position.set(0,.88,.38);g.add(keys);for(let i=0;i<6;i++){const bk=mkBox(.08,.12,.13,'#1a1a1a',.8);bk.position.set(-1.0+i*.32+.16,.93,.36);g.add(bk);}[[-.96,-.36],[-.96,.36],[.96,-.36]].forEach(([x,z])=>{const l=mkCyl(.04,.04,.44,8,'#111',.9);l.position.set(x,.22,z);g.add(l);});return g;}
function buildCabinetUnit(){const g=new THREE.Group();for(let i=0;i<3;i++){const box=mkBox(.62,1.9,.44,'#c8b898',.8);box.position.set(i*.66,0.95,0);g.add(box);const door=mkBox(.58,1.84,.04,'#b8a888',.85);door.position.set(i*.66,.95,.23);g.add(door);const h=mkCyl(.016,.016,.1,8,'#8a7848');h.rotation.z=Math.PI/2;h.position.set(i*.66,.98,.26);g.add(h);}const crown=mkBox(2.06,.08,.5,'#d0c0a0',.7);crown.position.set(0,1.95,0);g.add(crown);return g;}
function buildTrundleBed(){const g=new THREE.Group();const frame=mkBox(1.6,.28,2.2,'#a08060',.8);frame.position.y=.14;g.add(frame);const matt=mkBox(1.52,.18,2.12,'#f4efe8',.85);matt.position.y=.37;g.add(matt);const head=mkBox(1.6,.66,.1,'#907050',.75);head.position.set(0,.47,-1.06);g.add(head);const trundle=mkBox(1.5,.22,2.0,'#b09070',.8);trundle.position.set(0,-.11,.5);g.add(trundle);return g;}
function buildWorkbench(){const g=new THREE.Group();const top=mkBox(1.8,.07,.72,'#c0a878',.7);top.position.y=.9;g.add(top);[[-.82,-.3],[-.82,.3],[.82,-.3],[.82,.3]].forEach(([x,z])=>{const l=mkBox(.06,.9,.06,'#8a6838');l.position.set(x,.45,z);g.add(l);});const sh=mkBox(1.68,.07,.68,'#b09868');sh.position.set(0,.46,0);g.add(sh);const vise=mkBox(.28,.2,.22,'#8a8a8a',.5,.4);vise.position.set(-.7,.98,.38);g.add(vise);return g;}
function buildPingPongTable(){const g=new THREE.Group();const top=mkBox(2.74,.04,1.52,0x2060a8,.6);top.position.y=.76;g.add(top);const net=mkBox(2.76,.18,.02,'#f0f0f0',.9);net.position.set(0,.85,0);g.add(net);[[-.9,-.6],[-0.9,.6],[.9,-.6],[.9,.6]].forEach(([x,z])=>{const l=mkBox(.06,.76,.06,'#888');l.position.set(x,.38,z);g.add(l);});return g;}
function buildKitchenCart(){const g=new THREE.Group();const top=mkBox(.84,.05,.54,'#c8b080',.6);top.position.y=.9;g.add(top);const body=mkBox(.8,.82,.5,'#e0d8c8',.8);body.position.y=.46;g.add(body);const shelf=mkBox(.78,.05,.48,'#d0c8b0');shelf.position.y=.16;g.add(shelf);[[-.36,-.2],[-.36,.2],[.36,-.2],[.36,.2]].forEach(([x,z])=>{const w=mkCyl(.03,.03,.06,8,'#888');w.position.set(x,-.03,z);g.add(w);});return g;}
function buildShoeRack(){const g=new THREE.Group();const body=mkBox(.96,.82,.32,'#b8a080',.85);body.position.y=.41;g.add(body);[0,1,2].forEach(i=>{const sh=mkBox(.9,.04,.28,'#c0a888');sh.position.set(0,.18+i*.26,0);sh.rotation.x=-.08;g.add(sh);});return g;}
function buildHammock(){
  const g=new THREE.Group();
  // Two horizontal support ropes (side ropes)
  const rope1=mkCyl(.018,.018,2.2,8,'#c8a860');rope1.rotation.z=Math.PI/2;rope1.position.set(0,.92,-.42);g.add(rope1);
  const rope2=rope1.clone();rope2.position.set(0,.92,.42);g.add(rope2);
  // End gathering ropes
  [-.96,.96].forEach(x=>{
    const r=mkCyl(.014,.014,.32,6,'#c8a860');r.rotation.x=Math.PI/2;r.position.set(x,.82,0);g.add(r);
  });
  // Fabric made of several horizontal strips to create a hammock body (sag in middle)
  const STRIPS=7;
  for(let i=0;i<STRIPS;i++){
    const t=i/(STRIPS-1);
    const sag=Math.sin(t*Math.PI)*0.24; // sag deepest in middle
    const y=0.92-sag;
    const strip=new THREE.Mesh(new THREE.BoxGeometry(1.88,.04,.12),mat('#c8a058',.85));
    strip.position.set(0,y,-0.38+t*0.76);
    strip.castShadow=true;
    g.add(strip);
  }
  // Fringe at ends
  [-.98,.98].forEach(x=>{
    for(let k=-2;k<=2;k++){
      const fr=mkCyl(.008,.008,.14,4,'#b89040');fr.position.set(x,.72+k*.06,k*.08);g.add(fr);
    }
  });
  return g;
}
function buildLaundryBasket(){const g=new THREE.Group();const body=new THREE.Mesh(new THREE.CylinderGeometry(.28,.24,.52,16),mat('#e0d8d0',.9));body.position.y=.26;g.add(body);const lid=new THREE.Mesh(new THREE.CylinderGeometry(.3,.28,.07,16),mat('#d0c8c0',.85));lid.position.y=.555;g.add(lid);return g;}
function buildFoldingTable(){const g=new THREE.Group();const top=mkBox(1.5,.05,.76,'#d4ccc8',.7);top.position.y=.76;g.add(top);[[-.68,-.3],[-.68,.3],[.68,-.3],[.68,.3]].forEach(([x,z])=>{const l=mkBox(.05,.76,.05,'#b0a8a0');l.position.set(x,.38,z);g.add(l);});return g;}
function buildSwingChair(){
  const g=new THREE.Group();
  // Ceiling mount bracket
  const bracket=mkBox(.56,.06,.06,'#888',.4,.6);bracket.position.y=2.48;g.add(bracket);
  // Four ropes hanging from bracket to chair ring
  [[-.22,-.18],[-.22,.18],[.22,-.18],[.22,.18]].forEach(([x,z])=>{
    const rope=mkCyl(.012,.012,1.72,6,'#c8a860');rope.position.set(x,1.6,z);g.add(rope);
  });
  // Wicker-style bowl seat (open hemisphere)
  const seat=new THREE.Mesh(new THREE.SphereGeometry(.46,14,10,0,Math.PI*2,0,Math.PI*.58),mat('#c8a870',.9));
  seat.scale.y=.7;seat.position.y=.46;g.add(seat);
  // Rim ring
  const rim=new THREE.Mesh(new THREE.TorusGeometry(.46,.04,8,24),mat('#b89858',.85));
  rim.rotation.x=Math.PI/2;rim.position.y=.46;g.add(rim);
  // Cushion inside
  const cushion=new THREE.Mesh(new THREE.SphereGeometry(.36,12,8,0,Math.PI*2,0,Math.PI*.4),mat('#e8a0c0',.9));
  cushion.scale.y=.5;cushion.position.set(0,.56,0);g.add(cushion);
  // Pillow
  const pillow=mkBox(.28,.1,.24,'#f4c0d0',.85);pillow.position.set(0,.76,-.12);g.add(pillow);
  return g;
}
function buildPottingBench(){const g=new THREE.Group();const top=mkBox(1.4,.06,.52,'#a08050',.85);top.position.y=.9;g.add(top);const shelf=mkBox(1.38,.06,.52,'#9a7848');shelf.position.y=.46;g.add(shelf);[[-.64,-.2],[-.64,.2],[.64,-.2],[.64,.2]].forEach(([x,z])=>{const l=mkBox(.05,.9,.05,'#7a5830');l.position.set(x,.45,z);g.add(l);});const back=mkBox(1.4,.98,.04,'#8a6038');back.position.set(0,.98,-.26);g.add(back);return g;}
function buildLoungeChair(){const g=new THREE.Group(),c='#4a6070';const base=mkBox(1.7,.2,.7,c);base.position.y=.1;g.add(base);const seat=mkBox(1.7,.16,.66,c);seat.position.set(0,.26,.02);g.add(seat);const back=mkBox(1.7,.62,.18,c);back.position.set(0,.56,-.28);back.rotation.x=.18;g.add(back);const legRest=mkBox(1.7,.16,.46,c);legRest.position.set(0,.26,.52);legRest.rotation.x=-.18;g.add(legRest);[[-.8,-.28],[-.8,.28],[.8,-.28],[.8,.28]].forEach(([x,z])=>{const l=mkBox(.05,.1,.05,'#333');l.position.set(x,-.05,z);g.add(l);});return g;}
function buildSofaBed(){const g=new THREE.Group(),c='#7a6070';const frame=mkBox(1.9,.36,1.5,c);frame.position.y=.18;g.add(frame);const matt=mkBox(1.82,.15,1.44,'#f0ece8');matt.position.y=.435;g.add(matt);const back=mkBox(1.9,.6,.18,c);back.position.set(0,.66,-.64);g.add(back);[-.86,.86].forEach(x=>{const a=mkBox(.18,.38,1.5,c);a.position.set(x,.46,0);g.add(a);});return g;}
function buildCradleStand(){
  const g=new THREE.Group();
  const base=mkBox(1.0,.06,.52,'#e8d8c0',.8);base.position.y=.03;g.add(base);
  // Two A-frame legs
  [-.42,.42].forEach(x=>{
    const post=mkBox(.06,.96,.06,'#d0c0a0',.7);post.position.set(x,.48,0);g.add(post);
  });
  // Single cross-bar connecting both posts at top
  const crossbar=mkCyl(.022,.022,.9,8,'#d0c0a0');crossbar.rotation.z=Math.PI/2;crossbar.position.set(0,.98,0);g.add(crossbar);
  // Hanging ropes
  [-.28,.28].forEach(x=>{
    const r=mkCyl(.012,.012,.22,6,'#c8b898');r.position.set(x,.84,0);g.add(r);
  });
  // Cradle body (gently curved sides)
  const cradle=mkBox(.84,.32,.48,'#f0e8d8',.85);cradle.position.set(0,.72,0);g.add(cradle);
  // Cradle hood
  const hood=new THREE.Mesh(new THREE.SphereGeometry(.44,12,8,0,Math.PI*2,0,Math.PI*.5),mat('#f4eee4',.8));
  hood.scale.set(1,.7,1);hood.position.set(0,.86,-.18);g.add(hood);
  // Mattress
  const matt=mkBox(.76,.08,.44,'#fff8f0',.9);matt.position.set(0,.78,0);g.add(matt);
  return g;
}
function buildPlaypen(){const g=new THREE.Group();[[0,-.56],[0,.56],[-.56,0],[.56,0]].forEach(([x,z])=>{const side=mkBox(x===0?1.16:.16,0.52,z===0?1.16:.16,'#f4d0e0',.75);side.position.set(x,.26,z);g.add(side);});const floor=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.1),mat('#fff4f8',.85));floor.rotation.x=-Math.PI/2;floor.position.y=.01;g.add(floor);return g;}
function buildSwingSet(){
  const g=new THREE.Group();
  // A-frame legs (two pairs)
  [-.9,.9].forEach(x=>{
    [-.7,.7].forEach(z=>{
      const post=mkBox(.07,2.4,.07,'#a07050',.7);post.position.set(x,1.2,z);g.add(post);
    });
    const brace=mkBox(.07,.07,1.44,'#c09060',.7);brace.position.set(x,2.36,0);g.add(brace);
  });
  // Main horizontal top bar
  const bar=mkBox(1.88,.08,.08,'#b08050',.7);bar.position.set(0,2.36,0);g.add(bar);
  // Swing seat 1 (centre)
  const seat=mkBox(.48,.07,.38,'#d0a070',.8);seat.position.set(0,.62,0);g.add(seat);
  // Chains hang from bar to seat corners
  [[-.18,-.16],[-.18,.16],[.18,-.16],[.18,.16]].forEach(([x,z])=>{
    const ch=mkCyl(.014,.014,1.72,5,'#aaa',.4,.5);ch.position.set(x,1.48,z);g.add(ch);
  });
  // Swing seat 2 (offset)
  const seat2=mkBox(.44,.07,.36,'#e8c080',.8);seat2.position.set(0,.62,.7);g.add(seat2);
  [[-.16,-.16+.7],[-.16,.16+.7],[.16,-.16+.7],[.16,.16+.7]].forEach(([x,z])=>{
    const ch=mkCyl(.014,.014,1.72,5,'#bbb',.4,.5);ch.position.set(x,1.48,z);g.add(ch);
  });
  return g;
}
function buildGardenFountain(){const g=new THREE.Group();const base=new THREE.Mesh(new THREE.CylinderGeometry(.52,.6,.24,20),mat('#b0b8c0',.7));base.position.y=.12;g.add(base);const shaft=mkCyl(.07,.07,.7,12,'#b0b8c0',.7);shaft.position.y=.58;g.add(shaft);const bowl=new THREE.Mesh(new THREE.CylinderGeometry(.38,.22,.18,20),mat('#c0c8d0',.6));bowl.position.y=.93;g.add(bowl);const water=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.06,20),new THREE.MeshStandardMaterial({color:0x2088c0,transparent:true,opacity:.65,roughness:.02}));water.position.y=1.01;g.add(water);return g;}
function buildFirePit(){const g=new THREE.Group();const base=new THREE.Mesh(new THREE.CylinderGeometry(.5,.54,.22,20),mat('#606878',.8));base.position.y=.11;g.add(base);const bowl=new THREE.Mesh(new THREE.CylinderGeometry(.42,.46,.18,20),mat('#484e58',.85));bowl.position.y=.3;g.add(bowl);const fm=new THREE.MeshStandardMaterial({color:0xff6010,emissive:0xff4000,emissiveIntensity:2.0,transparent:true,opacity:.75});[-.1,.1,0,.12,-.12].forEach((x,i)=>{const fl=new THREE.Mesh(new THREE.ConeGeometry(.06+i*.01,.3+i*.04,6),fm.clone());fl.position.set(x,.48+i*.01,(.08-i*.04));g.add(fl);});return g;}
function buildGarageShelf(){const g=new THREE.Group();[-.56,.56].forEach(x=>{const side=mkBox(.04,1.88,.48,'#9a8868',.85);side.position.set(x,.94,0);g.add(side);});[0,1,2,3].forEach(i=>{const sh=mkBox(1.16,.04,.48,'#b0a070');sh.position.set(0,i*.44+.06,0);g.add(sh);});return g;}
function buildDeskLamp(){const g=new THREE.Group();const base=mkBox(.18,.04,.18,'#2a2a2a',.5,.6);base.position.y=.02;g.add(base);const arm1=mkBox(.04,.32,.04,'#333',.5,.4);arm1.position.set(0,.2,0);arm1.rotation.z=.2;g.add(arm1);const arm2=mkBox(.04,.28,.04,'#333',.5,.4);arm2.position.set(.08,.46,0);arm2.rotation.z=-.3;g.add(arm2);const shade=mkCyl(.12,.05,.2,12,'#d4d0c0',.7);shade.position.set(.12,.64,0);shade.rotation.z=-.5;g.add(shade);const bulbMat=new THREE.MeshStandardMaterial({color:0xfff8d0,emissive:0xfff0a0,emissiveIntensity:1.4});const bulb=new THREE.Mesh(new THREE.SphereGeometry(.04,8,8),bulbMat);bulb.position.set(.12,.64,0);g.add(bulb);const pl=new THREE.PointLight(0xfff8d0,.6,2.5);pl.position.set(.12,.64,0);g.add(pl);return g;}
function buildSkylight(){const g=new THREE.Group();const frame=mkBox(1.2,.08,1.2,'#8a8a9a',.4,.5);frame.position.y=2.78;g.add(frame);const glassMat=new THREE.MeshStandardMaterial({color:0xb8d8f8,transparent:true,opacity:.28,roughness:.04,metalness:.2});const glass=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.1),glassMat);glass.rotation.x=-Math.PI/2;glass.position.y=2.82;g.add(glass);return g;}
function buildFloorLamp(){const g=new THREE.Group();const base=mkCyl(.22,.26,.06,16,'#555');base.position.y=.03;g.add(base);const pole=mkCyl(.022,.022,1.65,8,'#aaa');pole.position.y=.86;g.add(pole);const arm=mkBox(.04,.04,.52,'#bbb');arm.position.set(.26,1.72,0);g.add(arm);const shade=new THREE.Mesh(new THREE.ConeGeometry(.3,.42,16,1,true),mat('#f4e8d0',.7));shade.position.set(.52,1.78,0);g.add(shade);const bulbMat=new THREE.MeshStandardMaterial({color:0xfff8d0,emissive:0xfff0a0,emissiveIntensity:1.4});const bulb=new THREE.Mesh(new THREE.SphereGeometry(.055,8,8),bulbMat);bulb.position.set(.52,1.67,0);g.add(bulb);const pl=new THREE.PointLight(0xfff8e0,.8,4.5);pl.position.set(.52,1.67,0);g.add(pl);return g;}
function buildGrandLamp(){const g=new THREE.Group();const base=new THREE.Mesh(new THREE.CylinderGeometry(.2,.28,.12,20),mat('#8a7040',.4,.6));base.position.y=.06;g.add(base);const pole=mkCyl(.025,.025,1.58,12,'#c0a050');pole.position.y=.91;g.add(pole);const mid=new THREE.Mesh(new THREE.SphereGeometry(.055,8,8),mat('#b09040',.3,.7));mid.position.y=.98;g.add(mid);const shade=mkCyl(.32,.12,.44,18,'#f0e4c8',.8);shade.position.y=1.76;g.add(shade);const bulbMat=new THREE.MeshStandardMaterial({color:0xfff8d0,emissive:0xfff0a0,emissiveIntensity:1.6});const bulb=new THREE.Mesh(new THREE.SphereGeometry(.06,8,8),bulbMat);bulb.position.y=1.68;g.add(bulb);const pl=new THREE.PointLight(0xfff8d0,.9,5);pl.position.y=1.7;g.add(pl);return g;}

// ── Animals ───────────────────────────────────────────────────────────────────
function buildDogStanding(){
  const g=new THREE.Group(),bc='#c89060',dc='#a07040';
  // body
  const body=mkBox(.54,.32,.88,bc);body.position.y=.44;g.add(body);
  // head
  const head=mkBox(.38,.34,.36,bc);head.position.set(0,.66,.52);g.add(head);
  // snout
  const snout=mkBox(.22,.18,.24,dc);snout.position.set(0,.58,.74);g.add(snout);
  const nose=new THREE.Mesh(new THREE.SphereGeometry(.04,8,6),mat('#1a1010',.8));nose.position.set(0,.64,.87);g.add(nose);
  // ears (floppy)
  [-.18,.18].forEach(x=>{const ear=mkBox(.12,.22,.18,dc);ear.position.set(x,.82,.46);ear.rotation.z=x<0?.3:-.3;g.add(ear);});
  // eyes
  [-.12,.12].forEach(x=>{const eye=new THREE.Mesh(new THREE.SphereGeometry(.035,8,6),mat('#201010',.7));eye.position.set(x,.72,.7);g.add(eye);});
  // legs (4 standing)
  [[-0.18,-0.28],[-0.18,0.24],[0.18,-0.28],[0.18,0.24]].forEach(([x,z])=>{
    const leg=mkBox(.12,.34,.12,dc);leg.position.set(x,.17,z);g.add(leg);
    const paw=mkBox(.14,.08,.16,'#8a6030',.9);paw.position.set(x,.04,z);g.add(paw);
  });
  // tail
  const tail=mkBox(.08,.36,.08,bc);tail.position.set(0,.6,-.42);tail.rotation.x=-.5;g.add(tail);
  return g;
}
function buildDogSitting(){
  const g=new THREE.Group(),bc='#c89060',dc='#a07040';
  // haunches/back
  const haunch=mkBox(.52,.42,.52,bc);haunch.position.y=.24;g.add(haunch);
  // body tilted up
  const body=mkBox(.48,.48,.56,bc);body.position.set(0,.6,.16);body.rotation.x=-.32;g.add(body);
  // head
  const head=mkBox(.36,.34,.34,bc);head.position.set(0,.96,.38);g.add(head);
  const snout=mkBox(.2,.16,.22,dc);snout.position.set(0,.88,.56);g.add(snout);
  const nose=new THREE.Mesh(new THREE.SphereGeometry(.035,8,6),mat('#1a1010',.8));nose.position.set(0,.94,.68);g.add(nose);
  [-.11,.11].forEach(x=>{const eye=new THREE.Mesh(new THREE.SphereGeometry(.032,8,6),mat('#201010',.7));eye.position.set(x,.99,.52);g.add(eye);});
  [-.16,.16].forEach(x=>{const ear=mkBox(.11,.2,.16,dc);ear.position.set(x,1.1,.4);ear.rotation.z=x<0?.28:-.28;g.add(ear);});
  // front legs straight down from chest
  [-.16,.16].forEach(x=>{const leg=mkBox(.11,.34,.11,dc);leg.position.set(x,.36,.42);g.add(leg);const paw=mkBox(.13,.07,.15,'#8a6030',.9);paw.position.set(x,.16,.42);g.add(paw);});
  // tail on ground
  const tail=mkBox(.08,.08,.38,bc);tail.position.set(.2,.1,-.18);tail.rotation.y=.5;g.add(tail);
  return g;
}
function buildCatStanding(){
  const g=new THREE.Group(),bc='#b0b0b0',dc='#888';
  const body=mkBox(.3,.28,.62,bc);body.position.y=.38;g.add(body);
  const head=mkBox(.3,.3,.28,bc);head.position.set(0,.58,.34);g.add(head);
  const snout=mkBox(.14,.12,.12,dc);snout.position.set(0,.52,.48);g.add(snout);
  const nose=new THREE.Mesh(new THREE.SphereGeometry(.025,6,5),mat('#e89090',.7));nose.position.set(0,.57,.55);g.add(nose);
  // Pointed ears
  [-.1,.1].forEach(x=>{const ear=new THREE.Mesh(new THREE.ConeGeometry(.07,.12,4),mat(bc,.8));ear.position.set(x,.78,.3);g.add(ear);});
  [-.09,.09].forEach(x=>{const eye=new THREE.Mesh(new THREE.SphereGeometry(.03,8,6),mat('#1a2808',.5));eye.position.set(x,.62,.47);g.add(eye);});
  [[-0.1,-0.24],[-0.1,0.18],[0.1,-0.24],[0.1,0.18]].forEach(([x,z])=>{const leg=mkBox(.08,.26,.08,dc);leg.position.set(x,.13,z);g.add(leg);});
  // Tail curled up
  const tail=mkBox(.06,.44,.06,dc);tail.position.set(.18,.44,-.3);tail.rotation.z=.4;tail.rotation.x=-.3;g.add(tail);
  const tailTip=mkBox(.06,.2,.06,'#888');tailTip.position.set(.28,.68,-.26);tailTip.rotation.z=-.6;g.add(tailTip);
  return g;
}
function buildCatSitting(){
  const g=new THREE.Group(),bc='#b0b0b0',dc='#888';
  // Haunches
  const haunches=mkBox(.3,.28,.34,bc);haunches.position.y=.16;g.add(haunches);
  // Upright body
  const body=mkBox(.28,.38,.26,bc);body.position.set(0,.48,.08);g.add(body);
  // Head
  const head=mkBox(.28,.28,.26,bc);head.position.set(0,.76,.1);g.add(head);
  const snout=mkBox(.12,.1,.12,dc);snout.position.set(0,.7,.24);g.add(snout);
  const nose=new THREE.Mesh(new THREE.SphereGeometry(.022,6,5),mat('#e89090',.7));nose.position.set(0,.74,.31);g.add(nose);
  [-.09,.09].forEach(x=>{const ear=new THREE.Mesh(new THREE.ConeGeometry(.065,.11,4),mat(bc,.8));ear.position.set(x,.96,.1);g.add(ear);});
  [-.08,.08].forEach(x=>{const eye=new THREE.Mesh(new THREE.SphereGeometry(.028,8,6),mat('#1a2808',.5));eye.position.set(x,.78,.24);g.add(eye);});
  // Front paws tucked in front
  [-.1,.1].forEach(x=>{const paw=mkBox(.1,.1,.18,dc);paw.position.set(x,.08,.22);g.add(paw);});
  // Tail wrapping around
  const tail=mkBox(.06,.08,.42,dc);tail.position.set(-.18,.1,0);tail.rotation.y=.7;g.add(tail);
  return g;
}
function buildCatSleeping(){
  const g=new THREE.Group(),bc='#b0b0b0',dc='#888';
  // Curled body on ground
  const body=mkBox(.28,.2,.54,bc);body.rotation.y=.4;body.position.set(0,.1,0);g.add(body);
  // Head resting
  const head=mkBox(.26,.22,.24,bc);head.position.set(.14,.15,.22);head.rotation.z=.5;g.add(head);
  [-.08,.08].forEach(x=>{const ear=new THREE.Mesh(new THREE.ConeGeometry(.055,.09,4),mat(bc,.8));ear.position.set(x+.1,.28,.22);g.add(ear);});
  // Closed eyes
  [-.06,.06].forEach(x=>{const eye=mkBox(.05,.02,.02,'#888');eye.position.set(x+.12,.24,.34);g.add(eye);});
  // Tail curled
  const tail=mkBox(.05,.06,.36,dc);tail.position.set(-.14,.07,-.14);tail.rotation.y=1.0;g.add(tail);
  return g;
}
function buildHorseStanding(){
  const g=new THREE.Group(),bc='#8a5828',dc='#6a3a18';
  // Body
  const body=mkBox(.44,.52,1.1,bc);body.position.y=.82;g.add(body);
  // Neck
  const neck=mkBox(.28,.52,.22,bc);neck.position.set(0,1.08,.52);neck.rotation.x=-.35;g.add(neck);
  // Head
  const head=mkBox(.24,.28,.42,bc);head.position.set(0,1.28,.72);g.add(head);
  // Snout
  const snout=mkBox(.2,.2,.26,dc);snout.position.set(0,1.18,.9);g.add(snout);
  const nose=new THREE.Mesh(new THREE.SphereGeometry(.06,8,6),mat('#4a2010',.8));nose.position.set(0,1.14,1.04);g.add(nose);
  // Ears
  [-.1,.1].forEach(x=>{const ear=mkBox(.07,.14,.06,dc);ear.position.set(x,1.44,.62);g.add(ear);});
  // Eyes
  [-.12,.12].forEach(x=>{const eye=new THREE.Mesh(new THREE.SphereGeometry(.04,8,6),mat('#100808',.6));eye.position.set(x,1.32,.82);g.add(eye);});
  // Mane
  const mane=mkBox(.08,.46,.68,'#3a2010',.85);mane.position.set(0,1.18,.52);g.add(mane);
  // Tail
  const tail=mkBox(.12,.5,.08,'#3a2010',.85);tail.position.set(0,.98,-.56);tail.rotation.x=.4;g.add(tail);
  // Legs
  [[-0.16,-0.38],[-0.16,0.32],[0.16,-0.38],[0.16,0.32]].forEach(([x,z],i)=>{
    const upper=mkBox(.14,.36,.14,bc);upper.position.set(x,.44,z);g.add(upper);
    const lower=mkBox(.1,.32,.1,dc);lower.position.set(x,.14,z);g.add(lower);
    const hoof=mkBox(.12,.08,.14,'#2a1808',.9);hoof.position.set(x,.04,z);g.add(hoof);
  });
  return g;
}
function buildRabbitSitting(){
  const g=new THREE.Group(),bc='#e8e0d8',dc='#c8b8b0';
  // Haunches
  const haunch=mkBox(.3,.34,.34,bc);haunch.position.y=.2;g.add(haunch);
  // Body
  const body=mkBox(.28,.32,.24,bc);body.position.set(0,.46,.04);g.add(body);
  // Head
  const head=new THREE.Mesh(new THREE.SphereGeometry(.18,10,8),mat(bc,.85));head.position.set(0,.68,.1);g.add(head);
  // Nose
  const nose=new THREE.Mesh(new THREE.SphereGeometry(.025,6,5),mat('#e89090',.7));nose.position.set(0,.66,.28);g.add(nose);
  // Tall ears
  [-.1,.1].forEach(x=>{
    const ear=mkBox(.1,.42,.07,bc);ear.position.set(x,.96,.08);g.add(ear);
    const inner=mkBox(.06,.34,.04,'#e8a0b0',.9);inner.position.set(x,.96,.1);g.add(inner);
  });
  // Eyes
  [-.1,.1].forEach(x=>{const eye=new THREE.Mesh(new THREE.SphereGeometry(.038,8,6),mat('#201020',.6));eye.position.set(x,.7,.26);g.add(eye);});
  // Front paws
  [-.1,.1].forEach(x=>{const paw=mkBox(.1,.12,.14,dc);paw.position.set(x,.1,.22);g.add(paw);});
  // Fluffy tail
  const tail=new THREE.Mesh(new THREE.SphereGeometry(.1,8,7),mat('#f4f0ec',.9));tail.position.set(0,.28,-.22);g.add(tail);
  return g;
}
function buildRabbitStanding(){
  const g=new THREE.Group(),bc='#e8e0d8',dc='#c8b8b0';
  const body=mkBox(.3,.42,.26,bc);body.position.y=.38;g.add(body);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.17,10,8),mat(bc,.85));head.position.set(0,.7,.04);g.add(head);
  const nose=new THREE.Mesh(new THREE.SphereGeometry(.022,6,5),mat('#e89090',.7));nose.position.set(0,.68,.21);g.add(nose);
  [-.1,.1].forEach(x=>{const ear=mkBox(.09,.46,.06,bc);ear.position.set(x,.98,.02);g.add(ear);const inner=mkBox(.05,.38,.04,'#e8a0b0',.9);inner.position.set(x,.98,.04);g.add(inner);});
  [-.09,.09].forEach(x=>{const eye=new THREE.Mesh(new THREE.SphereGeometry(.035,8,6),mat('#201020',.6));eye.position.set(x,.72,.19);g.add(eye);});
  [[-0.1,-.1],[0.1,-.1]].forEach(([x,z])=>{const leg=mkBox(.1,.28,.1,dc);leg.position.set(x,.14,z);g.add(leg);});
  // Arms out front
  [-.14,.14].forEach(x=>{const arm=mkBox(.09,.22,.09,dc);arm.position.set(x,.52,.16);g.add(arm);});
  const tail=new THREE.Mesh(new THREE.SphereGeometry(.09,8,7),mat('#f4f0ec',.9));tail.position.set(0,.38,-.18);g.add(tail);
  return g;
}
function buildBirdPerched(){
  const g=new THREE.Group();
  const perch=mkCyl(.02,.02,.52,8,'#8a6030');perch.rotation.z=Math.PI/2;perch.position.set(0,.38,0);g.add(perch);
  // Body
  const body=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),mat('#4870c8',.75));body.scale.set(1,1.1,.9);body.position.y=.52;g.add(body);
  // Head
  const head=new THREE.Mesh(new THREE.SphereGeometry(.09,10,8),mat('#4870c8',.75));head.position.set(0,.68,.08);g.add(head);
  // Beak
  const beak=new THREE.Mesh(new THREE.ConeGeometry(.025,.1,5),mat('#f0b020',.7));beak.rotation.x=Math.PI/2;beak.position.set(0,.66,.18);g.add(beak);
  // Eyes
  [-.06,.06].forEach(x=>{const eye=new THREE.Mesh(new THREE.SphereGeometry(.025,6,5),mat('#101010',.5));eye.position.set(x,.7,.15);g.add(eye);});
  // Wings (folded)
  [-.12,.12].forEach(x=>{const wing=mkBox(.04,.18,.22,'#2858b8',.8);wing.position.set(x,.52,0);wing.rotation.z=x<0?.2:-.2;g.add(wing);});
  // Feet on perch
  [-.1,.1].forEach(x=>{const ft=mkBox(.06,.04,.12,'#c0a020',.8);ft.position.set(x,.38,0);g.add(ft);});
  // Tail feathers
  const tail=mkBox(.08,.04,.2,'#3860b8',.8);tail.position.set(0,.48,-.16);tail.rotation.x=.3;g.add(tail);
  return g;
}
function buildDeerStanding(){
  const g=new THREE.Group(),bc='#c89050',dc='#a07030';
  const body=mkBox(.36,.44,.84,bc);body.position.y=.72;g.add(body);
  const neck=mkBox(.2,.36,.18,bc);neck.position.set(0,.98,.42);neck.rotation.x=-.28;g.add(neck);
  const head=mkBox(.2,.24,.32,bc);head.position.set(0,1.12,.56);g.add(head);
  const snout=mkBox(.16,.16,.2,dc);snout.position.set(0,1.04,.7);g.add(snout);
  [-.09,.09].forEach(x=>{const eye=new THREE.Mesh(new THREE.SphereGeometry(.032,8,6),mat('#100808',.6));eye.position.set(x,1.14,.65);g.add(eye);});
  // Antlers
  [-.14,.14].forEach(x=>{
    const main=mkBox(.04,.3,.04,'#7a5020');main.position.set(x,1.32,.48);main.rotation.z=x<0?.2:-.2;g.add(main);
    const branch=mkBox(.04,.18,.04,'#7a5020');branch.position.set(x+(x<0?-.1:.1),1.48,.46);branch.rotation.z=x<0?1.0:-1.0;g.add(branch);
  });
  // White belly
  const belly=mkBox(.3,.2,.72,'#f4ece0',.85);belly.position.set(0,.68,.04);g.add(belly);
  // White tail
  const tail=new THREE.Mesh(new THREE.SphereGeometry(.1,8,7),mat('#f4f0ec',.9));tail.position.set(0,.82,-.44);g.add(tail);
  [[-0.14,-0.3],[-0.14,0.26],[0.14,-0.3],[0.14,0.26]].forEach(([x,z])=>{
    const leg=mkBox(.1,.38,.1,bc);leg.position.set(x,.36,z);g.add(leg);
    const hoof=mkBox(.1,.06,.12,'#2a1808',.9);hoof.position.set(x,.06,z);g.add(hoof);
  });
  return g;
}

// ── Person Avatar ─────────────────────────────────────────────────────────────
function buildPersonAvatar() {
  const g = new THREE.Group();
  g.userData.isPerson = true;
  // Legs
  [-0.09, 0.09].forEach(x => {
    const leg = mkBox(0.13, 0.54, 0.13, '#3a1a60');
    leg.position.set(x, 0.27, 0); g.add(leg);
  });
  // Torso
  const torso = mkBox(0.36, 0.5, 0.18, '#e8649a');
  torso.position.y = 0.82; g.add(torso);
  // Arms
  [-0.28, 0.28].forEach(x => {
    const arm = mkBox(0.11, 0.46, 0.12, '#d85090');
    arm.position.set(x, 0.8, 0); g.add(arm);
  });
  // Neck
  const neck = mkCyl(0.065, 0.065, 0.1, 8, '#f4c0a0');
  neck.position.y = 1.13; g.add(neck);
  // Head
  const head = mkBox(0.26, 0.28, 0.24, '#f4c0a0');
  head.position.y = 1.32; g.add(head);
  // Hair
  const hair = mkBox(0.28, 0.14, 0.26, '#2a1020');
  hair.position.y = 1.48; g.add(hair);
  // Shadow circle on floor
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.22, 16),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  g.add(shadow);
  return g;
}

// ── Catalog ────────────────────────────────────────────────────────────────────
const CATALOG = [
  // Living
  {id:'sofa',         cat:'living',  label:'Sofa',          icon:'🛋️', build:buildSofa},
  {id:'sectional',    cat:'living',  label:'Sectional',     icon:'🛋️', build:buildSectionalSofa},
  {id:'loveseat',     cat:'living',  label:'Loveseat',      icon:'🛋️', build:buildLoveseat},
  {id:'armchair',     cat:'living',  label:'Armchair',      icon:'🪑', build:buildArmchair},
  {id:'ottoman',      cat:'living',  label:'Ottoman',       icon:'🟫', build:buildOttoman},
  {id:'bench',        cat:'living',  label:'Bench',         icon:'🪵', build:buildBench},
  {id:'coffeetbl',    cat:'living',  label:'Coffee Tbl',    icon:'🪵', build:buildCoffeeTable},
  {id:'sidetable',    cat:'living',  label:'Side Table',    icon:'🪑', build:buildSideTable},
  {id:'consoletbl',   cat:'living',  label:'Console Tbl',   icon:'🪵', build:buildConsoleTable},
  {id:'tvunit',       cat:'living',  label:'TV Unit',       icon:'📺', build:buildTVUnit},
  {id:'bookshelf',    cat:'living',  label:'Bookshelf',     icon:'📚', build:buildBookshelf},
  {id:'rug',          cat:'living',  label:'Rug',           icon:'🟫', build:buildRug},
  {id:'roundrug',     cat:'living',  label:'Round Rug',     icon:'⭕', build:buildRoundRug},
  {id:'fireplace',    cat:'living',  label:'Fireplace',     icon:'🔥', build:buildFireplace},
  // Dining
  {id:'diningtbl',    cat:'dining',  label:'Dining Tbl',    icon:'🍽️', build:buildDiningTable},
  {id:'roundtbl',     cat:'dining',  label:'Round Tbl',     icon:'⭕', build:buildRoundTable},
  {id:'diningchr',    cat:'dining',  label:'Chair',         icon:'🪑', build:buildDiningChair},
  {id:'barstool',     cat:'dining',  label:'Bar Stool',     icon:'🍺', build:buildBarStool},
  {id:'sideboard',    cat:'dining',  label:'Sideboard',     icon:'🪵', build:buildSideboard},
  {id:'winerack',     cat:'dining',  label:'Wine Rack',     icon:'🍷', build:buildWineRack},
  // Bedroom
  {id:'kingbed',      cat:'bedroom', label:'King Bed',      icon:'🛏️', build:buildKingBed},
  {id:'bed',          cat:'bedroom', label:'Double Bed',    icon:'🛏️', build:buildBed},
  {id:'singlebed',    cat:'bedroom', label:'Single Bed',    icon:'🛏️', build:buildSingleBed},
  {id:'bunkbed',      cat:'bedroom', label:'Bunk Bed',      icon:'🛏️', build:buildBunkBed},
  {id:'wardrobe',     cat:'bedroom', label:'Wardrobe',      icon:'🚪', build:buildWardrobe},
  {id:'nightstand',   cat:'bedroom', label:'Nightstand',    icon:'🪵', build:buildNightstand},
  {id:'dresser',      cat:'bedroom', label:'Dresser',       icon:'🗄️', build:buildDresser},
  {id:'desk',         cat:'bedroom', label:'Desk',          icon:'🖥️', build:buildDesk},
  // Kitchen
  {id:'counter',      cat:'kitchen', label:'Counter',       icon:'🍳', build:buildCounter},
  {id:'island',       cat:'kitchen', label:'Island',        icon:'🏝️', build:buildIsland},
  {id:'fridge',       cat:'kitchen', label:'Fridge',        icon:'🧊', build:buildFridge},
  {id:'stove',        cat:'kitchen', label:'Stove',         icon:'🔥', build:buildStove},
  {id:'kitchsnk',     cat:'kitchen', label:'Sink',          icon:'🚰', build:buildKitchenSink},
  {id:'dishwasher',   cat:'kitchen', label:'Dishwasher',    icon:'🍽️', build:buildDishwasher},
  {id:'microwave',    cat:'kitchen', label:'Microwave',     icon:'📡', build:buildMicrowave},
  // Bathroom
  {id:'bathtub',      cat:'bathroom',label:'Bathtub',       icon:'🛁', build:buildBathtub},
  {id:'toilet',       cat:'bathroom',label:'Toilet',        icon:'🚽', build:buildToilet},
  {id:'bathsink',     cat:'bathroom',label:'Vanity',        icon:'🪥', build:buildBathSink},
  {id:'shower',       cat:'bathroom',label:'Shower',        icon:'🚿', build:buildShower},
  {id:'showercabin',  cat:'bathroom',label:'Shower Cabin',  icon:'🚿', build:buildShowerCabin},
  {id:'towelrack',    cat:'bathroom',label:'Towel Rack',    icon:'🧺', build:buildTowelRack},
  {id:'bathmat',      cat:'bathroom',label:'Bath Mat',      icon:'🟫', build:buildBathMat},
  // Decor
  {id:'floorlamp',    cat:'decor',   label:'Floor Lamp',    icon:'💡', build:buildLamp},
  {id:'pendantlamp',  cat:'decor',   label:'Pendant Lamp',  icon:'💡', build:buildPendantLight},
  {id:'tablelamp',    cat:'decor',   label:'Table Lamp',    icon:'🕯️', build:buildTableLamp},
  {id:'plant',        cat:'decor',   label:'Plant',         icon:'🪴', build:buildPlant},
  {id:'tallplant',    cat:'decor',   label:'Tall Plant',    icon:'🌿', build:buildTallPlant},
  {id:'cactus',       cat:'decor',   label:'Cactus',        icon:'🌵', build:buildCactus},
  {id:'floorvase',    cat:'decor',   label:'Floor Vase',    icon:'🏺', build:buildFloorVase},
  {id:'mirror',       cat:'decor',   label:'Mirror',        icon:'🪞', build:buildMirror},
  {id:'wallart',      cat:'decor',   label:'Wall Art',      icon:'🖼️', build:buildWallArt},
  {id:'curtains',     cat:'decor',   label:'Curtains',      icon:'🪟', build:buildCurtains},
  {id:'shelf',        cat:'decor',   label:'Wall Shelf',    icon:'📦', build:buildShelf},
  {id:'radiator',     cat:'decor',   label:'Radiator',      icon:'🌡️', build:buildRadiator},
  {id:'staircase',    cat:'decor',   label:'Staircase',     icon:'🪜', build:buildStaircase},
  // Office
  {id:'officechr',    cat:'office',  label:'Office Chair',  icon:'🪑', build:buildOfficeChair},
  {id:'monitor',      cat:'office',  label:'Monitor',       icon:'🖥️', build:buildMonitor},
  {id:'bookcase',     cat:'office',  label:'Bookcase',      icon:'📚', build:buildBookcase},
  {id:'filingcab',    cat:'office',  label:'Filing Cab.',   icon:'🗄️', build:buildFilingCabinet},
  {id:'confertbl',    cat:'office',  label:'Conf. Table',   icon:'🏢', build:buildConferenceTable},
  {id:'whiteboard',   cat:'office',  label:'Whiteboard',    icon:'📋', build:buildWhiteboard},
  {id:'tvstand',      cat:'office',  label:'TV Stand',      icon:'📺', build:buildTVStand},
  // Bedroom extras
  {id:'vanitydesk',   cat:'bedroom', label:'Vanity Desk',   icon:'💄', build:buildVanityDesk},
  {id:'accentchr',    cat:'bedroom', label:'Accent Chair',  icon:'🪑', build:buildAccentChair},
  // Kitchen extras
  {id:'coffeemaker',  cat:'kitchen', label:'Coffee Maker',  icon:'☕', build:buildCoffeeMaker},
  // Decor extras
  {id:'plantstand',   cat:'decor',   label:'Plant Stand',   icon:'🪴', build:buildPlantStand},
  {id:'coatrack',     cat:'decor',   label:'Coat Rack',     icon:'🧥', build:buildCoatRack},
  {id:'aquarium',     cat:'decor',   label:'Aquarium',      icon:'🐠', build:buildAquarium},
  // Living extras
  {id:'beanbagg',     cat:'living',  label:'Bean Bag',      icon:'🟤', build:buildBeanBag},
  {id:'outdoorchr',   cat:'living',  label:'Outdoor Chair', icon:'🪑', build:buildOutdoorChair},
  {id:'piano',        cat:'living',  label:'Piano',         icon:'🎹', build:buildPiano},
  {id:'dogbed',       cat:'living',  label:'Dog Bed',       icon:'🐾', build:buildDogBed},
  // Office extras
  {id:'keyboard',     cat:'office',  label:'Keyboard',      icon:'⌨️', build:buildKeyboard},
  {id:'storunit',     cat:'office',  label:'Storage Unit',  icon:'🗄️', build:buildStorageUnit},
  // Dining extras
  {id:'barcabinet',   cat:'dining',  label:'Bar Cabinet',   icon:'🍾', build:buildBarCabinet},
  // Bedroom extras
  {id:'treadmill',    cat:'bedroom', label:'Treadmill',     icon:'🏃', build:buildTreadmill},
  // Outdoor
  {id:'bbqgrill',     cat:'outdoor', label:'BBQ Grill',     icon:'🍖', build:buildBBQGrill},
  {id:'sunlounger',   cat:'outdoor', label:'Sun Lounger',   icon:'🪑', build:buildSunLounger},
  {id:'hottub',       cat:'outdoor', label:'Hot Tub',       icon:'♨️', build:buildHotTub},
  {id:'poolarea',     cat:'outdoor', label:'Pool',          icon:'🏊', build:buildPoolArea},
  {id:'gardentable',  cat:'outdoor', label:'Garden Table',  icon:'🪑', build:buildGardenTable},
  {id:'umbrella',     cat:'outdoor', label:'Umbrella',      icon:'☂️', build:buildUmbrella},
  {id:'gardenplant',  cat:'outdoor', label:'Planter',       icon:'🌱', build:buildGardenPlanter},
  {id:'outdoorchr2',  cat:'outdoor', label:'Deck Chair',    icon:'🪑', build:buildOutdoorChair},
  // Kids
  {id:'crib',         cat:'kids',    label:'Crib',          icon:'🛏️', build:buildCrib},
  {id:'toybox',       cat:'kids',    label:'Toy Box',       icon:'🧸', build:buildToyBox},
  {id:'kidsbed',      cat:'kids',    label:"Kid's Bed",     icon:'🛏️', build:buildKidsBed},
  {id:'kidsdesk',     cat:'kids',    label:"Study Desk",    icon:'📐', build:buildKidsDesk},
  {id:'kidschr',      cat:'kids',    label:"Kid's Chair",   icon:'🪑', build:buildKidsChair},
  {id:'beanbagg2',    cat:'kids',    label:'Bean Bag',      icon:'🟤', build:buildBeanBag},
  {id:'playpen',      cat:'kids',    label:'Playpen',       icon:'🧸', build:buildPlaypen},
  {id:'cradlestand',  cat:'kids',    label:'Cradle',        icon:'🛏️', build:buildCradleStand},
  {id:'swingset',     cat:'kids',    label:'Swing Set',     icon:'🎠', build:buildSwingSet},
  // Living extras
  {id:'mediaconsole', cat:'living',  label:'Media Console', icon:'📺', build:buildMediaConsole},
  {id:'pouffe',       cat:'living',  label:'Pouffe',        icon:'🟤', build:buildPouffe},
  {id:'recliner',     cat:'living',  label:'Recliner',      icon:'🪑', build:buildReclineerChair},
  {id:'swingchair',   cat:'living',  label:'Swing Chair',   icon:'🪑', build:buildSwingChair},
  {id:'loungechair',  cat:'living',  label:'Lounge Chair',  icon:'🪑', build:buildLoungeChair},
  {id:'sofabed',      cat:'living',  label:'Sofa Bed',      icon:'🛋️', build:buildSofaBed},
  {id:'floorlamp',    cat:'living',  label:'Floor Lamp',    icon:'💡', build:buildFloorLamp},
  {id:'grandlamp',    cat:'living',  label:'Grand Lamp',    icon:'💡', build:buildGrandLamp},
  // Office extras
  {id:'writingdesk',  cat:'office',  label:'Writing Desk',  icon:'📝', build:buildWritingDesk},
  {id:'cabinetunit',  cat:'office',  label:'Cabinet Unit',  icon:'🗄️', build:buildCabinetUnit},
  {id:'workbench',    cat:'office',  label:'Workbench',     icon:'🔧', build:buildWorkbench},
  {id:'desklamp',     cat:'office',  label:'Desk Lamp',     icon:'💡', build:buildDeskLamp},
  // Bedroom extras
  {id:'trundlebed',   cat:'bedroom', label:'Trundle Bed',   icon:'🛏️', build:buildTrundleBed},
  {id:'grandpiano',   cat:'bedroom', label:'Grand Piano',   icon:'🎹', build:buildGrandPiano},
  {id:'shoerrack',    cat:'bedroom', label:'Shoe Rack',     icon:'👟', build:buildShoeRack},
  {id:'laundrybskt',  cat:'bedroom', label:'Laundry Bskt',  icon:'🧺', build:buildLaundryBasket},
  // Dining extras
  {id:'kitchencart',  cat:'dining',  label:'Kitchen Cart',  icon:'🛒', build:buildKitchenCart},
  {id:'foldingtable', cat:'dining',  label:'Folding Table', icon:'🪑', build:buildFoldingTable},
  {id:'pingpong',     cat:'dining',  label:'Ping Pong',     icon:'🏓', build:buildPingPongTable},
  // Outdoor extras
  {id:'hammock',      cat:'outdoor', label:'Hammock',       icon:'🌴', build:buildHammock},
  {id:'pottingbench', cat:'outdoor', label:'Potting Bench', icon:'🌱', build:buildPottingBench},
  {id:'fountain',     cat:'outdoor', label:'Fountain',      icon:'⛲', build:buildGardenFountain},
  {id:'firepit',      cat:'outdoor', label:'Fire Pit',      icon:'🔥', build:buildFirePit},
  {id:'garageshlf',   cat:'outdoor', label:'Garage Shelf',  icon:'📦', build:buildGarageShelf},
  // Stairs
  {id:'stair_straight', cat:'stairs', label:'Straight',    icon:'🪜', build:buildStaircase},
  {id:'stair_spiral',   cat:'stairs', label:'Spiral',      icon:'🌀', build:buildSpiralStaircase},
  {id:'stair_float',    cat:'stairs', label:'Floating',    icon:'🪜', build:buildFloatingStaircase},
  {id:'stair_grand',    cat:'stairs', label:'Grand',       icon:'🏛️', build:buildGrandStaircase},
  // Garden
  {id:'tree',         cat:'garden',  label:'Tree',          icon:'🌳', build:buildTree},
  {id:'pinetree',     cat:'garden',  label:'Pine Tree',     icon:'🌲', build:buildPineTree},
  {id:'bush',         cat:'garden',  label:'Bush',          icon:'🌿', build:buildBush},
  {id:'flwrbush',     cat:'garden',  label:'Flower Bush',   icon:'🌸', build:buildFloweringBush},
  {id:'hedge',        cat:'garden',  label:'Hedge',         icon:'🌿', build:buildHedge},
  {id:'flowerbed',    cat:'garden',  label:'Flower Bed',    icon:'🌺', build:buildFlowerBed},
  {id:'gardenpath',   cat:'garden',  label:'Garden Path',   icon:'🪨', build:buildGardenPath},
  {id:'woodfence',    cat:'garden',  label:'Wood Fence',    icon:'🪵', build:buildWoodFence},
  {id:'stonewall',    cat:'garden',  label:'Stone Wall',    icon:'🪨', build:buildStonWall},
  {id:'pergola',      cat:'garden',  label:'Pergola',       icon:'🏛️', build:buildPergola},
  {id:'gardenarch',   cat:'garden',  label:'Garden Arch',   icon:'🌸', build:buildGardenArch},
  {id:'gardenbench',  cat:'garden',  label:'Garden Bench',  icon:'🪑', build:buildGardenBench},
  {id:'birdbath',     cat:'garden',  label:'Bird Bath',     icon:'🐦', build:buildBirdBath},
  {id:'gardenlantern',cat:'garden',  label:'Lantern',       icon:'🏮', build:buildGardenLantern},
  {id:'gardenstatue', cat:'garden',  label:'Statue',        icon:'🗿', build:buildGardenStatue},
  {id:'grasspatch',   cat:'garden',  label:'Grass Patch',   icon:'🌱', build:buildGrassPatch},
  {id:'gardenshed',   cat:'garden',  label:'Garden Shed',   icon:'🏚️', build:buildGardenShed},
  {id:'sunflower',    cat:'garden',  label:'Sunflower',     icon:'🌻', build:buildSunflower},
  {id:'gardenwell',   cat:'garden',  label:'Garden Well',   icon:'🪣', build:buildGardenWell},
  // Decor extras
  {id:'skylight',     cat:'decor',   label:'Skylight',      icon:'🪟', build:buildSkylight},
  // Animals
  {id:'dog_stand',  cat:'animals', label:'Dog (Stand)',    icon:'🐕', build:buildDogStanding},
  {id:'dog_sit',    cat:'animals', label:'Dog (Sit)',      icon:'🐕', build:buildDogSitting},
  {id:'cat_stand',  cat:'animals', label:'Cat (Stand)',    icon:'🐈', build:buildCatStanding},
  {id:'cat_sit',    cat:'animals', label:'Cat (Sit)',      icon:'🐈', build:buildCatSitting},
  {id:'cat_sleep',  cat:'animals', label:'Cat (Sleep)',    icon:'🐈', build:buildCatSleeping},
  {id:'horse',      cat:'animals', label:'Horse',          icon:'🐎', build:buildHorseStanding},
  {id:'rabbit_sit', cat:'animals', label:'Rabbit (Sit)',   icon:'🐇', build:buildRabbitSitting},
  {id:'rabbit_std', cat:'animals', label:'Rabbit (Stand)', icon:'🐇', build:buildRabbitStanding},
  {id:'bird',       cat:'animals', label:'Bird (Perch)',   icon:'🐦', build:buildBirdPerched},
  {id:'deer',       cat:'animals', label:'Deer',           icon:'🦌', build:buildDeerStanding},
];

// ── State ──────────────────────────────────────────────────────────────────────
let scene, camera, renderer, controls, raycaster, mouse;
let roomGroup;
let rooms = [], doors = [], windows2 = [], objects = [];
let selected = null, selectedRoomId = null;
let transformMode = 'translate';
let isDragging = false, snapGrid = false;
let doorPlacementMode = false, windowPlacementMode = false;
let addRoomMode = false, personPlacementMode = false;
let dragPlane = new THREE.Plane(), dragOffset = new THREE.Vector3();
let history = [], redoStack = [];
let idCounter = 0, currentCat = 'living', currentPresetId = 'modern';
let ghostRoom = null, newRoomSide = 'E';
let viewMode = '3d'; // '3d' | 'plan' | 'walk'
let windowSize = 'medium';
let personMesh = null;
let groundMesh = null, gridHelper = null, currentTerrain = 'nat_stone';
let ambientLight = null, sunLight = null, hemiLight = null;
const ALL_FLOORS_ID = -1;
let floors = [{ id: 0, label: 'Ground' }];
let currentFloor = 0;

// FPS state
let fpsModeActive = false, fpsPointerLocked = false;
let fpsYaw = 0, fpsPitch = 0;
const fpsPos = new THREE.Vector3();
const fpsKeys = {};

let lastTime = 0;

// ── Loading ────────────────────────────────────────────────────────────────────
function setLoadingProgress(pct, msg) {
  const bar = document.getElementById('loading-bar');
  const status = document.getElementById('loading-status');
  if (bar) bar.style.width = pct + '%';
  if (status && msg) status.textContent = msg;
}
function hideLoadingScreen() {
  const ls = document.getElementById('loading-screen');
  if (ls) { ls.classList.add('hidden'); setTimeout(() => { ls.style.display = 'none'; }, 900); }
}

const SMALL_SCREEN_MIN_WIDTH = 1475;
const SMALL_SCREEN_MIN_HEIGHT = 640;
function isSmallScreen() {
  return window.innerWidth < SMALL_SCREEN_MIN_WIDTH || window.innerHeight < SMALL_SCREEN_MIN_HEIGHT;
}
function showSmallScreenWarning() {
  const el = document.getElementById('small-screen-screen');
  if (!el) return;
  el.classList.remove('hidden');
}
function hideSmallScreenWarning() {
  const el = document.getElementById('small-screen-screen');
  if (!el) return;
  el.classList.add('hidden');
}
function checkSmallScreen() {
  if (isSmallScreen()) {
    hideLoadingScreen();
    showSmallScreenWarning();
  } else {
    hideSmallScreenWarning();
  }
}
function handleResize() {
  if (renderer) resize();
  checkSmallScreen();
}

// ── Init ───────────────────────────────────────────────────────────────────────
function init() {
  setLoadingProgress(10, 'Setting up renderer…');
  const canvas = document.getElementById('canvas3d');
  const vp = document.getElementById('viewport');
  const vpW = Math.max(vp.clientWidth || 800, 1);
  const vpH = Math.max(vp.clientHeight || 600, 1);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, logarithmicDepthBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x0d0810);
  renderer.setSize(vpW, vpH, false);

  setLoadingProgress(25, 'Building scene…');
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0d0810, 28, 75);

  camera = new THREE.PerspectiveCamera(48, vpW / vpH, 0.05, 150);
  camera.position.set(14, 18, 14);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.07;
  controls.minDistance = 2; controls.maxDistance = 40;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  setLoadingProgress(40, 'Setting up lighting…');
  ambientLight = new THREE.AmbientLight(0xfff0f8, 0.45); scene.add(ambientLight);
  hemiLight = new THREE.HemisphereLight(0xfff0f8, 0x180a20, 0.3); scene.add(hemiLight);
  sunLight = new THREE.DirectionalLight(0xfff4f8, 1.05);
  sunLight.position.set(8, 16, 10); sunLight.castShadow = true;
  sunLight.shadow.camera.near = 0.5; sunLight.shadow.camera.far = 70;
  sunLight.shadow.camera.left = -28; sunLight.shadow.camera.right = 28;
  sunLight.shadow.camera.top = 28; sunLight.shadow.camera.bottom = -28;
  sunLight.shadow.mapSize.set(2048, 2048); sunLight.shadow.bias = -0.0002;
  scene.add(sunLight);
  const fill = new THREE.DirectionalLight(0xf0b0d8, 0.25);
  fill.position.set(-8, 6, -8); scene.add(fill);

  setLoadingProgress(55, 'Building ground…');
  groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(160, 160),
    new THREE.MeshBasicMaterial({ color: 0x0c0914 }));
  groundMesh.rotation.x = -Math.PI / 2; groundMesh.position.y = -0.08; groundMesh.renderOrder = -10;
  scene.add(groundMesh);
  gridHelper = new THREE.GridHelper(160, 160, 0x1c0820, 0x120618);
  gridHelper.position.y = -0.07; scene.add(gridHelper);

  roomGroup = new THREE.Group(); scene.add(roomGroup);

  setLoadingProgress(70, 'Registering events…');
  window.addEventListener('resize', handleResize);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', e => { fpsKeys[e.code] = false; });

  // FPS pointer lock events
  document.addEventListener('pointerlockchange', onPointerLockChange);
  document.addEventListener('mousemove', onFPSMouseMove);

  setLoadingProgress(80, 'Building UI…');
  buildPresetsUI();
  buildCatalogUI();
  buildPropsUI();
  buildViewModeUI();
  buildSceneUI();
  buildFloorUI();

  setTerrain(currentTerrain);

  setLoadingProgress(92, 'Loading floor plan…');
  loadPreset('modern');

  setLoadingProgress(100, 'Ready! ✨');
  checkSmallScreen();
  setTimeout(() => { animate(0); hideLoadingScreen(); }, 1400);
}

// ── Wall & Window Building ─────────────────────────────────────────────────────


function buildRoomMesh(room) {
  const g = new THREE.Group();
  g.userData.roomId = room.id;
  g.position.y = (room.floor || 0) * FLOOR_HEIGHT;

  // Floor
  const shape = new THREE.Shape();
  shape.moveTo(room.points[0].x, room.points[0].z);
  for (let i = 1; i < room.points.length; i++) {
    shape.lineTo(room.points[i].x, room.points[i].z);
  }
  shape.lineTo(room.points[0].x, room.points[0].z); // Close

  const floorGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: false });
  floorGeo.rotateX(Math.PI / 2); // Original extrude +Z becomes -Y. Top is at Y=0.
  const floor = new THREE.Mesh(floorGeo, mat(room.floorColor, 0.88, 0.03));
  floor.receiveShadow = true;
  floor.userData = { isFloor: true, roomId: room.id };
  g.add(floor);

  // Walls
  const len = room.points.length;
  for (let i = 0; i < len; i++) {
    const p1 = room.points[i];
    const p2 = room.points[(i + 1) % len];

    const wallDoors = doors.filter(d => d.roomId === room.id && d.wallIndex === i)
      .map(d => ({ ...d, type: 'door', w: DOOR_W, h: DOOR_H, sill: 0 }));
    const wallWins = windows2.filter(w => w.roomId === room.id && w.wallIndex === i)
      .map(w => ({ ...w, type: 'window' }));

    // Skip walls shared with an adjacent room that has a lower ID (it owns/renders the wall)
    if (!wallDoors.length && !wallWins.length && isWallOwnedByAdjacentRoom(room.id, p1, p2)) continue;

    buildWallSide(g, room.id, i, p1, p2, [...wallDoors, ...wallWins], room.wallColor);
  }

  return g;
}

function distPtSeg(pt, a, b) {
  const dx = b.x - a.x, dz = b.z - a.z;
  const lenSq = dx * dx + dz * dz;
  if (lenSq < 1e-9) return Math.hypot(pt.x - a.x, pt.z - a.z);
  const t = Math.max(0, Math.min(1, ((pt.x - a.x) * dx + (pt.z - a.z) * dz) / lenSq));
  return Math.hypot(pt.x - a.x - t * dx, pt.z - a.z - t * dz);
}

function isWallOwnedByAdjacentRoom(currentId, p1, p2) {
  const mid = { x: (p1.x + p2.x) * 0.5, z: (p1.z + p2.z) * 0.5 };
  const eps = WALL_T * 2.2;
  for (const other of rooms) {
    if (other.id >= currentId) continue; // only defer to rooms with smaller id
    const pts = other.points;
    for (let j = 0; j < pts.length; j++) {
      if (distPtSeg(mid, pts[j], pts[(j + 1) % pts.length]) < eps) return true;
    }
  }
  return false;
}

function buildWallSide(group, roomId, wallIndex, p1, p2, allOpenings, color) {
  const H = WALL_H, T = WALL_T;
  const dx = p2.x - p1.x;
  const dz = p2.z - p1.z;
  const len = Math.hypot(dx, dz);
  const angle = Math.atan2(dz, dx);
  
  // Z-fighting fix: inward normal inset
  const nx = -dz / len;
  const nz = dx / len;
  const inset = 0.002;

  const sorted = [...allOpenings].sort((a, b) => a.pos - b.pos);
  
  function addSeg(startDist, segLen, yPos, height, depth) {
    if (segLen <= 0.02) return;
    const m = new THREE.Mesh(new THREE.BoxGeometry(segLen, height, depth), mat(color, 0.9));
    const cx = p1.x + (dx / len) * (startDist + segLen / 2) + nx * inset;
    const cz = p1.z + (dz / len) * (startDist + segLen / 2) + nz * inset;
    m.position.set(cx, yPos, cz);
    m.rotation.y = -angle;
    m.castShadow = true; m.receiveShadow = true;
    m.userData = { isWall: true, roomId, wallIndex };
    group.add(m);
  }

  let cur = 0;
  sorted.forEach(op => {
    const ow = op.w, oh = op.h, os = op.sill || 0;
    const dc = op.pos * len;
    const dl = dc - ow / 2, dr = dc + ow / 2;
    
    addSeg(cur, dl - cur, H / 2, H, T);
    if (os > 0) addSeg(dl, ow, os / 2, os, T);
    
    const lintelH = H - (os + oh);
    if (lintelH > 0.02) addSeg(dl, ow, os + oh + lintelH / 2, lintelH, T);
    
    const cx = p1.x + (dx / len) * dc + nx * inset;
    const cz = p1.z + (dz / len) * dc + nz * inset;
    if (op.type === 'door') addDoorFrame(group, cx, cz, angle, ow, oh, T);
    else addWindowFrame(group, cx, cz, angle, ow, oh, os, T);
    
    cur = dr;
  });
  
  addSeg(cur, len - cur, H / 2, H, T);
}

function addDoorFrame(group, cx, cz, angle, DW, DH, T) {
  const g = new THREE.Group();
  g.position.set(cx, 0, cz);
  g.rotation.y = -angle;

  const fm = mat('#c8b890', 0.6);
  const FT = 0.05, FD = T + 0.07;

  const lj = new THREE.Mesh(new THREE.BoxGeometry(FT, DH, FD), fm.clone());
  lj.position.set(-DW/2 - FT/2, DH/2, 0); lj.castShadow = true; g.add(lj);
  const rj = lj.clone(); rj.position.set(DW/2 + FT/2, DH/2, 0); g.add(rj);
  
  const top = new THREE.Mesh(new THREE.BoxGeometry(DW + FT*2, FT, FD), fm.clone());
  top.position.set(0, DH + FT/2, 0); g.add(top);

  const dp = new THREE.Mesh(new THREE.BoxGeometry(DW - 0.04, DH - 0.06, 0.04), mat('#d4c8a8', 0.65));
  dp.position.set(0, DH/2, 0);
  dp.castShadow = true; g.add(dp);
  
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), mat('#aaa', 0.2, 0.8));
  knob.position.set(DW/2 - 0.1, DH * 0.45, 0.04); g.add(knob);
  
  group.add(g);
}

function addWindowFrame(group, cx, cz, angle, WW, WH, WS, T) {
  const g = new THREE.Group();
  g.position.set(cx, 0, cz);
  g.rotation.y = -angle;

  const fm = mat('#f4f2ee', 0.45);
  const FT = 0.055, FD = T + 0.09;
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xb8d8f8, transparent: true, opacity: 0.38,
    roughness: 0.04, metalness: 0.12, side: THREE.DoubleSide
  });

  const lj = new THREE.Mesh(new THREE.BoxGeometry(FT, WH + FT*2, FD), fm.clone());
  lj.position.set(-WW/2 - FT/2, WS + WH/2, 0); lj.castShadow = true; g.add(lj);
  const rj = lj.clone(); rj.position.set(WW/2 + FT/2, WS + WH/2, 0); g.add(rj);
  
  const top = new THREE.Mesh(new THREE.BoxGeometry(WW + FT*2, FT, FD), fm.clone());
  top.position.set(0, WS + WH + FT/2, 0); g.add(top);
  const bot = new THREE.Mesh(new THREE.BoxGeometry(WW + FT*2, FT, FD + 0.04), fm.clone());
  bot.position.set(0, WS - FT/2, 0); g.add(bot);
  
  const div = new THREE.Mesh(new THREE.BoxGeometry(FT * 0.8, WH, FD), fm.clone());
  div.position.set(0, WS + WH/2, 0); g.add(div);
  
  [-1, 1].forEach(s => {
    const glass = new THREE.Mesh(new THREE.BoxGeometry(WW/2 - FT, WH - FT, 0.03), glassMat.clone());
    glass.position.set(s * WW/4, WS + WH/2, 0); g.add(glass);
  });

  const glowMat = new THREE.MeshStandardMaterial({ color: 0xfff8f0, emissive: 0xffe8c0, emissiveIntensity: 0.08, transparent: true, opacity: 0.15 });
  const glow = new THREE.Mesh(new THREE.BoxGeometry(WW - FT, WH - FT, 0.02), glowMat);
  glow.position.set(0, WS + WH/2, T * 0.4); g.add(glow);

  group.add(g);
}

function loadPreset(presetId) {
  const preset = HOUSE_PRESETS.find(p => p.id === presetId); if (!preset) return;
  currentPresetId = presetId;
  if (doorPlacementMode) exitDoorMode();
  if (windowPlacementMode) exitWindowMode();
  if (addRoomMode) closeAddRoomPanel();
  removeGhostRoom();
  if (personMesh) { scene.remove(personMesh); personMesh = null; }
  objects.forEach(o => scene.remove(o.mesh));
  objects = []; doors = []; windows2 = [];
  floors = [{ id: 0, label: 'Ground' }]; currentFloor = 0;
  selected = null; selectedRoomId = null;
  history = []; redoStack = [];
  rooms = preset.rooms.map(r => ({ ...r }));
  idCounter = rooms.reduce((m, r) => Math.max(m, r.id), 0);
  centerRooms();
  buildAllRooms();
  refreshRoomList(); refreshObjectList(); refreshFloorUI();
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.toggle('active', b.dataset.id === presetId));
  setRightPanel('none'); deselectAll();
  fitCameraToHouse();
  showToast(`Loaded: ${preset.icon} ${preset.name}`);
  updateUndoRedoBtns();
}

function getHouseBounds() {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  rooms.forEach(r => r.points.forEach(p => {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
  }));
  return { minX, maxX, minZ, maxZ };
}

function centerRooms() {
  const b = getHouseBounds();
  if (b.minX === Infinity) return;
  const cx = (b.minX + b.maxX) / 2, cz = (b.minZ + b.maxZ) / 2;
  rooms.forEach(r => r.points.forEach(p => { p.x -= cx; p.z -= cz; }));
}

function buildAllRooms() {
  while (roomGroup.children.length) roomGroup.remove(roomGroup.children[0]);
  rooms.forEach(room => roomGroup.add(buildRoomMesh(room)));
  updateFloorVisibility();
}

function rebuildRoom(roomId) {
  for (let i = roomGroup.children.length - 1; i >= 0; i--) {
    if (roomGroup.children[i].userData.roomId === roomId) {
      roomGroup.remove(roomGroup.children[i]);
    }
  }
  const room = rooms.find(r => r.id === roomId);
  if (room) roomGroup.add(buildRoomMesh(room));
  updateFloorVisibility();
}

function getHouseCenter() {
  const b = getHouseBounds();
  return { x: (b.minX + b.maxX) / 2, z: (b.minZ + b.maxZ) / 2 };
}

function fitCameraToHouse() {
    const b = getHouseBounds();
    const w = b.maxX - b.minX, d = b.maxZ - b.minZ, size = Math.max(w, d);
    const cx = (b.minX + b.maxX) / 2, cz = (b.minZ + b.maxZ) / 2;
    const dist = size * 1.3;
    camera.position.set(cx + dist * 0.7, dist * 0.85, cz + dist * 0.7);
    controls.target.set(cx, 0, cz); controls.update();
  }

// ── Door system ────────────────────────────────────────────────────────────────

function getPosOnWall(hitPoint, room, wallIndex) {
  const p1 = room.points[wallIndex];
  const p2 = room.points[(wallIndex+1) % room.points.length];
  const dx = p2.x - p1.x, dz = p2.z - p1.z;
  const len = Math.hypot(dx, dz);
  if (len === 0) return 0;
  const hx = hitPoint.x - p1.x, hz = hitPoint.z - p1.z;
  const dot = (hx * dx + hz * dz) / len;
  return Math.max(0.05, Math.min(0.95, dot / len));
}

function findAdjacentRoom(room, wallIndex, pos) {
  const p1 = room.points[wallIndex];
  const p2 = room.points[(wallIndex+1) % room.points.length];
  const dx = p2.x - p1.x;
  const dz = p2.z - p1.z;
  const doorX = p1.x + dx * pos;
  const doorZ = p1.z + dz * pos;
  
  for (const r of rooms) {
    if (r.id === room.id) continue;
    for (let i = 0; i < r.points.length; i++) {
      const rp1 = r.points[i];
      const rp2 = r.points[(i+1) % r.points.length];
      const distToDoor = Math.hypot(doorX - rp1.x, doorZ - rp1.z);
      const distFromDoor = Math.hypot(rp2.x - doorX, rp2.z - doorZ);
      const segLen = Math.hypot(rp2.x - rp1.x, rp2.z - rp1.z);
      
      if (Math.abs((distToDoor + distFromDoor) - segLen) < 0.05) {
        return { roomId: r.id, wallIndex: i, pos: distToDoor / segLen };
      }
    }
  }
  return null;
}

function enterDoorMode() {
  doorPlacementMode = true; if (windowPlacementMode) exitWindowMode();
  deselectAll();
  document.getElementById('door-banner').style.display = 'flex';
  document.getElementById('viewport-hint').style.display = 'none';
  document.getElementById('btn-enter-door-mode').classList.add('active');
  controls.enabled = false;
  showToast('Click walls to add / remove doors');
}
function exitDoorMode() {
  doorPlacementMode = false;
  document.getElementById('door-banner').style.display = 'none';
  document.getElementById('viewport-hint').style.display = 'flex';
  document.getElementById('btn-enter-door-mode').classList.remove('active');
  controls.enabled = true;
}
function placeDoor(room, wallIndex, hitPoint) {
  let pos = getPosOnWall(hitPoint, room, wallIndex);
  const existing = doors.find(d => d.roomId === room.id && d.wallIndex === wallIndex && Math.abs(d.pos - pos) < 0.12);
  if (existing) {
    saveHistory();
    const mid = existing.mirrorId;
    doors = doors.filter(d => d.id !== existing.id && d.id !== mid);
    rebuildRoom(room.id);
    if (mid) rooms.forEach(r => { if (r.id !== room.id) rebuildRoom(r.id); });
    refreshRoomList(); showToast('Door removed'); return;
  }
  saveHistory();
  const doorId = ++idCounter;
  const newDoor = { id: doorId, roomId: room.id, wallIndex, pos };
  const adj = findAdjacentRoom(room, wallIndex, pos);
  if (adj) {
    const mid = ++idCounter;
    newDoor.mirrorId = mid;
    doors.push(newDoor);
    doors.push({ id: mid, roomId: adj.roomId, wallIndex: adj.wallIndex, pos: adj.pos, mirrorId: doorId });
    rebuildRoom(room.id); rebuildRoom(adj.roomId);
    showToast('Door added between rooms');
  } else {
    doors.push(newDoor); rebuildRoom(room.id); showToast('Door added');
  }
  refreshRoomList();
}

// ── Window system ──────────────────────────────────────────────────────────────
function enterWindowMode() {
  windowPlacementMode = true; if (doorPlacementMode) exitDoorMode();
  deselectAll();
  document.getElementById('window-banner').style.display = 'flex';
  document.getElementById('viewport-hint').style.display = 'none';
  document.getElementById('btn-enter-window-mode').classList.add('active');
  controls.enabled = false;
  showToast('Click walls to add / remove windows');
}
function exitWindowMode() {
  windowPlacementMode = false;
  document.getElementById('window-banner').style.display = 'none';
  document.getElementById('viewport-hint').style.display = 'flex';
  document.getElementById('btn-enter-window-mode').classList.remove('active');
  controls.enabled = true;
}
function placeWindow(room, wallIndex, hitPoint) {
  let pos = getPosOnWall(hitPoint, room, wallIndex);
  const sz = WIN_SIZES[windowSize];
  const existing = windows2.find(w => w.roomId === room.id && w.wallIndex === wallIndex && Math.abs(w.pos - pos) < 0.12);
  if (existing) {
    saveHistory();
    windows2 = windows2.filter(w => w.id !== existing.id);
    rebuildRoom(room.id); showToast('Window removed'); return;
  }
  saveHistory();
  windows2.push({ id: ++idCounter, roomId: room.id, wallIndex, pos, ...sz });
  rebuildRoom(room.id); showToast('Window added');
}

// ── Add Room system ────────────────────────────────────────────────────────────
function openAddRoomPanel() {
  addRoomMode = true; setRightPanel('add-room');
  const sel = document.getElementById('attach-room-select');
  sel.innerHTML = '';
  rooms.forEach(r => { const opt = document.createElement('option'); opt.value = r.id; opt.textContent = r.name; sel.appendChild(opt); });
  newRoomSide = 'E';
  document.querySelectorAll('.side-btn').forEach(b => b.classList.toggle('active', b.dataset.side === newRoomSide));
  document.getElementById('add-room-banner').style.display = 'flex';
  updateGhostRoom();
}
function closeAddRoomPanel() {
  addRoomMode = false; setRightPanel('none'); removeGhostRoom();
  document.getElementById('add-room-banner').style.display = 'none';
}
function getNewRoomConfig() {
  return {
    name: document.getElementById('new-room-name').value || 'New Room',
    shape: document.getElementById('new-room-shape').value || 'rect',
    w: parseFloat(document.getElementById('new-room-w').value),
    d: parseFloat(document.getElementById('new-room-d').value),
    wallColor: document.getElementById('new-room-wall').value,
    floorColor: document.getElementById('new-room-floor').value,
    attachId: parseInt(document.getElementById('attach-room-select').value),
    side: newRoomSide,
  };
}
function calcNewRoomPos(attachId, side, nw, nd) {
  const r = rooms.find(r => r.id === attachId); if (!r) return { x: 0, z: 0 };
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  r.points.forEach(p => {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
  });
  return { N: { x: minX, z: minZ - nd }, S: { x: minX, z: maxZ }, W: { x: minX - nw, z: minZ }, E: { x: maxX, z: minZ } }[side] || { x: maxX, z: minZ };
}
function updateGhostRoom() {
  removeGhostRoom();
  const cfg = getNewRoomConfig();
  const pos = calcNewRoomPos(cfg.attachId, cfg.side, cfg.w, cfg.d);
  ghostRoom = buildRoomMesh({ id: -1, points: makeShape(cfg.shape, pos.x, pos.z, cfg.w, cfg.d), ...cfg });
  ghostRoom.traverse(m => { if (m.isMesh) { m.material = m.material.clone(); m.material.transparent = true; m.material.opacity = 0.42; m.material.emissive = new THREE.Color(0x441020); m.material.emissiveIntensity = 0.18; } });
  scene.add(ghostRoom);
}
function removeGhostRoom() { if (ghostRoom) { scene.remove(ghostRoom); ghostRoom = null; } }
function confirmAddRoom() {
  const cfg = getNewRoomConfig();
  const pos = calcNewRoomPos(cfg.attachId, cfg.side, cfg.w, cfg.d);
  saveHistory();
  const nr = { id: ++idCounter, name: cfg.name, points: makeShape(cfg.shape, pos.x, pos.z, cfg.w, cfg.d), wallColor: cfg.wallColor, floorColor: cfg.floorColor, floor: currentFloor };
  rooms.push(nr); closeAddRoomPanel(); buildAllRooms(); refreshRoomList(); selectRoom(nr.id);
  showToast(`${nr.name} added`);
}
function deleteRoom(roomId) {
  if (rooms.length <= 1) { showToast('Cannot delete the last room'); return; }
  saveHistory();
  doors = doors.filter(d => d.roomId !== roomId);
  windows2 = windows2.filter(w => w.roomId !== roomId);
  rooms = rooms.filter(r => r.id !== roomId);
  buildAllRooms();
  if (selectedRoomId === roomId) { selectedRoomId = null; setRightPanel('none'); }
  refreshRoomList(); showToast('Room deleted');
}

// ── Furniture ──────────────────────────────────────────────────────────────────
function addFurniture(item) {
  saveHistory();
  const mesh = item.build();
  let cx = 0, cz = 0;
  if (rooms.length) {
    const b = getHouseCenter(); cx = b.x; cz = b.z;
  }
  mesh.position.set(cx + (Math.random() - 0.5) * 2.5, currentFloor * FLOOR_HEIGHT, cz + (Math.random() - 0.5) * 2.5);
  const label = item.label + ' ' + (objects.filter(o => o.catalogId === item.id).length + 1);
  mesh.userData = { catalogId: item.id, label, icon: item.icon };
  const obj = { id: ++idCounter, mesh, label, icon: item.icon, catalogId: item.id, visible: true };
  objects.push(obj); scene.add(mesh); select(obj); refreshObjectList();
  showToast(`Added ${item.label}`);
}

// ── Person / FPS ───────────────────────────────────────────────────────────────
function enterPersonPlacementMode() {
  personPlacementMode = true;
  if (doorPlacementMode) exitDoorMode();
  if (windowPlacementMode) exitWindowMode();
  deselectAll();
  controls.enabled = false;
  document.getElementById('person-banner').style.display = 'flex';
  document.getElementById('viewport-hint').style.display = 'none';
  showToast('👤 Click on any floor to place the person');
}
function exitPersonPlacementMode() {
  personPlacementMode = false;
  controls.enabled = true;
  document.getElementById('person-banner').style.display = 'none';
  document.getElementById('viewport-hint').style.display = 'flex';
}
function placePersonAt(point) {
  if (personMesh) scene.remove(personMesh);
  personMesh = buildPersonAvatar();
  personMesh.position.set(point.x, 0, point.z);
  scene.add(personMesh);
  updatePlacePersonButton();
  exitPersonPlacementMode();
  showToast('Person placed. Click Walk in the toolbar to explore');
}

function removePerson() {
  if (!personMesh) {
    showToast('No person placed yet');
    return;
  }
  if (fpsModeActive) exitFPSMode();
  scene.remove(personMesh);
  personMesh = null;
  showToast('Person removed');
  updatePlacePersonButton();
}

function updatePlacePersonButton() {
  const btn = document.getElementById('btn-place-person');
  if (!btn) return;
  if (personMesh) {
    btn.textContent = '🗑️ Remove Person';
    btn.title = 'Remove placed person';
    btn.classList.add('danger');
  } else {
    btn.textContent = '👤 Place Person on Floor';
    btn.title = 'Place person on the floor';
    btn.classList.remove('danger');
  }
}

function enterFPSMode() {
  // If no person, place at house center
  if (!personMesh) {
    const c = getHouseCenter();
    personMesh = buildPersonAvatar();
    personMesh.position.set(c.x, 0, c.z);
    scene.add(personMesh);
    updatePlacePersonButton();
  }
  fpsModeActive = true;
  fpsPos.set(personMesh.position.x, personMesh.position.y + 1.72, personMesh.position.z);
  fpsYaw = personMesh.rotation.y; fpsPitch = 0;
  controls.enabled = false;
  personMesh.visible = false;
  renderer.domElement.requestPointerLock();
  document.getElementById('fps-overlay')?.classList.add('active');
  const hint = document.getElementById('viewport-hint');
  if (hint) {
    if (!hint.dataset.saved) hint.dataset.saved = hint.innerHTML;
    hint.innerHTML = '<span>WASD to move</span><span>Mouse to look</span><span>ESC to exit</span>';
    hint.style.display = 'flex';
  }
  viewMode = 'walk';
  document.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === 'walk'));
  showToast('Walk mode. WASD to move, mouse to look, ESC to exit');
}
function apply3DViewMode() {
  controls.enabled = true;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.minPolarAngle = 0;
  document.getElementById('plan-label').style.display = 'none';
  fitCameraToHouse();
}
function takeWalkScreenshot() {
  renderer.render(scene, camera);
  const a = document.createElement('a');
  a.href = renderer.domElement.toDataURL('image/png');
  a.download = 'walk-' + Date.now() + '.png';
  a.click();
  showToast('📸 Screenshot saved');
}
function exitFPSMode() {
  fpsModeActive = false; fpsPointerLocked = false;
  if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
  controls.enabled = true;
  if (personMesh) {
    personMesh.visible = true;
    personMesh.position.set(fpsPos.x, 0, fpsPos.z);
  }
  document.getElementById('fps-overlay')?.classList.remove('active');
  const hint = document.getElementById('viewport-hint');
  if (hint) {
    if (hint.dataset.saved) {
      hint.innerHTML = hint.dataset.saved;
      delete hint.dataset.saved;
    } else {
      hint.innerHTML = '<span>🖱 Rotate</span><span>⚙ Zoom</span><span>⌥ Pan</span><span>Click to select</span><span class="hint-sep">·</span><span>F fit · G snap · H hide · Ctrl+D copy</span>';
    }
  }
  viewMode = '3d';
  document.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === '3d'));
  apply3DViewMode();
}
function onPointerLockChange() {
  fpsPointerLocked = (document.pointerLockElement === renderer.domElement);
  if (!fpsPointerLocked && fpsModeActive) exitFPSMode();
}
function onFPSMouseMove(e) {
  if (!fpsPointerLocked || !fpsModeActive) return;
  fpsYaw -= e.movementX * 0.0022;
  fpsPitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, fpsPitch - e.movementY * 0.0022));
}
function updateFPS(dt) {
  if (!fpsModeActive) return;
  const speed = 4.5 * dt;
  const s = Math.sin(fpsYaw), c = Math.cos(fpsYaw);
  if (fpsKeys['KeyW'] || fpsKeys['ArrowUp'])    { fpsPos.x -= s * speed; fpsPos.z -= c * speed; }
  if (fpsKeys['KeyS'] || fpsKeys['ArrowDown'])   { fpsPos.x += s * speed; fpsPos.z += c * speed; }
  if (fpsKeys['KeyA'] || fpsKeys['ArrowLeft'])   { fpsPos.x -= c * speed; fpsPos.z += s * speed; }
  if (fpsKeys['KeyD'] || fpsKeys['ArrowRight'])  { fpsPos.x += c * speed; fpsPos.z -= s * speed; }
  fpsPos.y = 1.72;
  camera.position.copy(fpsPos);
  camera.rotation.order = 'YXZ';
  camera.rotation.y = fpsYaw;
  camera.rotation.x = fpsPitch;
  camera.rotation.z = 0;
}

// ── View Modes ─────────────────────────────────────────────────────────────────
function setViewMode(mode) {
  if (fpsModeActive && mode !== 'walk') exitFPSMode();
  if (mode === viewMode && mode !== 'walk') return;
  viewMode = mode;
  document.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === mode));

  if (mode === '3d') {
    apply3DViewMode();

  } else if (mode === 'plan') {
    controls.enabled = true;
    controls.maxPolarAngle = 0.001;
    controls.minPolarAngle = 0;
    const c = getHouseCenter();
    camera.position.set(c.x, 28, c.z + 0.01);
    controls.target.set(c.x, 0, c.z);
    controls.update();
    document.getElementById('plan-label').style.display = 'block';
    showToast('📐 Floor plan: scroll to zoom, drag to pan');

  } else if (mode === 'walk') {
    document.getElementById('plan-label').style.display = 'none';
    if (!personMesh) {
      showToast('👤 Place a person first, or walk starting from the center…');
    }
    enterFPSMode();
  }
}

function buildViewModeUI() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => setViewMode(btn.dataset.view));
  });
  document.getElementById('fps-exit-btn')?.addEventListener('click', exitFPSMode);
  const btnPlace = document.getElementById('btn-place-person');
  if (btnPlace) btnPlace.addEventListener('click', () => { if (personMesh) removePerson(); else enterPersonPlacementMode(); });
  updatePlacePersonButton();
  document.getElementById('exit-person-mode')?.addEventListener('click', exitPersonPlacementMode);
}

// ── Terrain ────────────────────────────────────────────────────────────────────
function makeNaturalGroundTexture(fn) {
  const S = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext('2d');
  fn(ctx, S);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(20, 20);
  return tex;
}

function setTerrain(id) {
  const allTerrains = [...TERRAINS, ...NATURAL_TERRAINS];
  const t = allTerrains.find(x => x.id === id);
  if (!t) return;
  currentTerrain = id;
  if (gridHelper) { scene.remove(gridHelper); gridHelper = null; }

  if (t.texture) {
    // Natural terrain: canvas texture + sky-blue fog + bright lighting
    const tex = makeNaturalGroundTexture(t.texture);
    if (groundMesh) {
      groundMesh.material = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95, metalness: 0 });
    }
    const fogCol = t.fogHex || t.fog;
    renderer.setClearColor(fogCol);
    if (scene.fog) { scene.fog.color.setHex(fogCol); scene.fog.near = 35; scene.fog.far = 90; }
    if (t.light) {
      if (ambientLight) { ambientLight.color.setHex(t.light.sky); ambientLight.intensity = t.light.amb; }
      if (hemiLight)    { hemiLight.color.setHex(t.light.sky); hemiLight.intensity = 0.4; }
      if (sunLight)     { sunLight.color.setHex(t.light.sun); sunLight.intensity = t.light.sunInt; }
    }
  } else {
    // Mood terrain: flat colour + grid + dim lighting
    if (groundMesh) {
      groundMesh.material = new THREE.MeshBasicMaterial({ color: t.ground });
    }
    gridHelper = new THREE.GridHelper(160, 160, t.grid1, t.grid2);
    gridHelper.position.y = -0.07;
    scene.add(gridHelper);
    renderer.setClearColor(t.fog);
    if (scene.fog) { scene.fog.color.setHex(t.fog); scene.fog.near = 28; scene.fog.far = 75; }
    if (ambientLight) { ambientLight.color.setHex(0xfff0f8); ambientLight.intensity = 0.45; }
    if (hemiLight)    { hemiLight.color.setHex(0xfff0f8); hemiLight.intensity = 0.3; }
    if (sunLight)     { sunLight.color.setHex(0xfff4f8); sunLight.intensity = 1.05; }
  }
  document.querySelectorAll('.terrain-btn').forEach(b => b.classList.toggle('active', b.dataset.terrain === id));
}

// ── Import / Export ─────────────────────────────────────────────────────────────
function importProject() {
  const input = document.getElementById('import-file-input');
  if (input) input.click();
}
function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!data.rooms || !Array.isArray(data.rooms)) { showToast('⚠ Invalid project file'); return; }
      saveHistory();
      restoreState({
        rooms: data.rooms,
        doors: data.doors || [],
        windows: data.windows || [],
        objects: data.objects || [],
      });
      fitCameraToHouse();
      showToast('Project imported');
    } catch { showToast('Could not read file'); }
  };
  reader.readAsText(file);
  e.target.value = '';
}

// ── Multi-Floor System ─────────────────────────────────────────────────────────
function updateFloorVisibility() {
  roomGroup.children.forEach(rg => {
    const room = rooms.find(r => r.id === rg.userData.roomId);
    const floorIdx = room ? (room.floor || 0) : 0;
    const isActive = (currentFloor === ALL_FLOORS_ID) || (floorIdx === currentFloor);
    rg.traverse(m => {
      if (!m.isMesh) return;
      m.material.transparent = !isActive;
      m.material.opacity = isActive ? 1.0 : 0.18;
    });
  });
}

function refreshFloorUI() {
  const container = document.getElementById('floor-switcher');
  if (!container) return;
  container.innerHTML = '';
  // Show All button
  const allBtn = document.createElement('button');
  allBtn.className = 'floor-btn floor-all-btn' + (currentFloor === ALL_FLOORS_ID ? ' active' : '');
  allBtn.textContent = 'View';
  allBtn.title = 'View all floors';
  allBtn.addEventListener('click', () => setCurrentFloor(ALL_FLOORS_ID));
  allBtn.classList.add('no-remove');
  container.appendChild(allBtn);
  floors.forEach(f => {
    const btn = document.createElement('button');
    btn.className = 'floor-btn' + (f.id === currentFloor ? ' active' : '');
    btn.innerHTML = `${f.label} <span class="floor-remove">×</span>`;
    btn.dataset.floorId = f.id;
    btn.addEventListener('click', () => setCurrentFloor(f.id));
    // wire remove span
    const remSpan = btn.querySelector('.floor-remove');
    if (remSpan) {
      // hide remove for ground floor (id 0) or when only one floor remains
      if (floors.length <= 1 || f.id === 0) {
        remSpan.style.display = 'none';
        btn.classList.add('no-remove');
      }
      remSpan.addEventListener('click', (e) => { e.stopPropagation(); removeFloor(f.id); });
    }
    container.appendChild(btn);
  });
  const addBtn = document.createElement('button');
  addBtn.className = 'floor-btn floor-add-btn';
  addBtn.title = 'Add Floor';
  addBtn.textContent = '+';
  addBtn.addEventListener('click', addNewFloor);
  container.appendChild(addBtn);
}

function setCurrentFloor(id) {
  currentFloor = id;
  refreshFloorUI();
  updateFloorVisibility();
}

function addNewFloor() {
  const nextId = floors.length;
  const labels = ['Ground','2nd Floor','3rd Floor','4th Floor','5th Floor','6th Floor'];
  floors.push({ id: nextId, label: labels[nextId] || `Floor ${nextId + 1}` });
  setCurrentFloor(nextId);
}

function removeFloor(id) {
  if (id === 0) { showToast('Cannot remove the ground floor'); return; }
  if (floors.length <= 1) { showToast('Cannot remove the last floor'); return; }
  const idx = floors.findIndex(f => f.id === id);
  if (idx === -1) return;
  // remove floor entry
  floors.splice(idx, 1);
  // reindex floor ids to sequential indices
  floors.forEach((f, i) => { f.id = i; });
  // update rooms floor assignments
  rooms.forEach(r => {
    if (r.floor === id) r.floor = Math.max(0, id - 1);
    else if (r.floor > id) r.floor = r.floor - 1;
  });
  // adjust currentFloor
  if (currentFloor === id) currentFloor = 0;
  else if (currentFloor > id) currentFloor = currentFloor - 1;
  refreshFloorUI();
  updateFloorVisibility();
  showToast('Floor removed');
}

function buildFloorUI() {
  const sidebar = document.querySelector('.rooms-section');
  if (!sidebar) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'panel-section';
  wrapper.id = 'floor-section';
  wrapper.innerHTML = '<h3>Floors</h3><div class="floor-switcher" id="floor-switcher"></div>';
  sidebar.parentElement.insertBefore(wrapper, sidebar);
  refreshFloorUI();
}

// ── Scene UI (terrain picker) ───────────────────────────────────────────────────
function buildSceneUI() {
  const container = document.getElementById('scene-terrain');
  if (!container) return;

  // Mood terrains row
  const moodLabel = document.createElement('span');
  moodLabel.className = 'terrain-group-label';
  moodLabel.textContent = 'Mood';
  container.appendChild(moodLabel);
  const moodRow = document.createElement('div');
  moodRow.className = 'terrain-row';
  TERRAINS.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'terrain-btn' + (t.id === currentTerrain ? ' active' : '');
    btn.dataset.terrain = t.id;
    btn.title = t.label;
    btn.style.background = t.hex;
    btn.addEventListener('click', () => setTerrain(t.id));
    moodRow.appendChild(btn);
  });
  container.appendChild(moodRow);

  // Natural terrains row
  const natLabel = document.createElement('span');
  natLabel.className = 'terrain-group-label';
  natLabel.textContent = 'Natural';
  container.appendChild(natLabel);
  const natRow = document.createElement('div');
  natRow.className = 'terrain-row';
  NATURAL_TERRAINS.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'terrain-btn' + (t.id === currentTerrain ? ' active' : '');
    btn.dataset.terrain = t.id;
    btn.title = t.label;
    btn.style.background = t.hex;
    btn.addEventListener('click', () => setTerrain(t.id));
    natRow.appendChild(btn);
  });
  container.appendChild(natRow);

  document.getElementById('import-file-input')?.addEventListener('change', handleImportFile);
  document.getElementById('btn-import')?.addEventListener('click', importProject);
}

// ── Selection ──────────────────────────────────────────────────────────────────
function applyHighlight(obj, on) {
  obj.mesh.traverse(m => {
    if (m.isMesh) {
      if (!m.userData._origMat) m.userData._origMat = m.material;
      m.material = m.userData._origMat.clone();
      m.material.emissive = new THREE.Color(on ? 0x441122 : 0x000000);
      m.material.emissiveIntensity = on ? 0.20 : 0;
    }
  });
}
function select(obj) {
  if (selected && selected.id !== obj.id) applyHighlight(selected, false);
  selected = obj; selectedRoomId = null;
  applyHighlight(obj, true);
  document.getElementById('transform-bar').style.display = 'flex';
  setRightPanel('object'); updatePropsPanel();
  refreshObjectList(); refreshRoomList();
}
function selectRoom(roomId) {
  if (selected) applyHighlight(selected, false);
  selected = null; selectedRoomId = roomId;
  const room = rooms.find(r => r.id === roomId); if (!room) return;
  document.getElementById('transform-bar').style.display = 'none';
  setRightPanel('room'); updateRoomPanel(room);
  refreshRoomList(); refreshObjectList();
}
function deselectAll() {
  if (selected) applyHighlight(selected, false);
  selected = null; selectedRoomId = null;
  document.getElementById('transform-bar').style.display = 'none';
  if (!addRoomMode) setRightPanel('none');
  refreshObjectList(); refreshRoomList();
}
function toggleSnapGrid() {
  snapGrid = !snapGrid;
  showToast(snapGrid ? '⊞ Snap ON  (G)' : '⊟ Snap OFF  (G)');
  document.getElementById('btn-snap')?.classList.toggle('active', snapGrid);
}
function deleteSelected() {
  if (!selected) return;
  saveHistory(); scene.remove(selected.mesh);
  objects = objects.filter(o => o.id !== selected.id);
  selected = null; deselectAll(); refreshObjectList(); showToast('Deleted');
}
function duplicateSelected() {
  if (!selected) return;
  const item = CATALOG.find(c => c.id === selected.catalogId); if (!item) return;
  saveHistory();
  const mesh = item.build();
  mesh.position.copy(selected.mesh.position).add(new THREE.Vector3(0.5, 0, 0.5));
  mesh.rotation.copy(selected.mesh.rotation);
  mesh.scale.copy(selected.mesh.scale);
  mesh.visible = selected.visible;
  mesh.userData = { catalogId: selected.catalogId, label: selected.label, icon: selected.icon };
  const label = selected.label.replace(/ \d+$/, '') + ' ' + (objects.filter(o => o.catalogId === selected.catalogId).length + 1);
  const obj = { id: ++idCounter, mesh, label, icon: selected.icon, catalogId: selected.catalogId, visible: selected.visible };
  objects.push(obj); scene.add(mesh); select(obj); refreshObjectList();
  showToast('Duplicated (Ctrl+D)');
}
function toggleSelectedVisibility() {
  if (!selected) return;
  selected.visible = !selected.visible;
  selected.mesh.visible = selected.visible;
  refreshObjectList(); updatePropsPanel();
  showToast(selected.visible ? 'Visible' : 'Hidden');
}
function setRightPanel(state) {
  ['none','object','room','add-room'].forEach(s => {
    const el = document.getElementById('state-' + s);
    if (el) el.style.display = s === state ? '' : 'none';
  });
  const wh = document.getElementById('walk-helper');
  if (wh) wh.style.display = state === 'none' ? '' : 'none';
}

// ── Pointer events ─────────────────────────────────────────────────────────────
function getNDC(e) {
  const vp = document.getElementById('viewport');
  const rect = vp.getBoundingClientRect();
  return { x: ((e.clientX - rect.left) / rect.width) * 2 - 1, y: -((e.clientY - rect.top) / rect.height) * 2 + 1 };
}
function onPointerDown(e) {
  if (e.button !== 0 || fpsModeActive) return;
  const { x, y } = getNDC(e);
  mouse.set(x, y);
  raycaster.setFromCamera(mouse, camera);

  // Person placement mode
  if (personPlacementMode) {
    const floors = [];
    roomGroup.traverse(m => { if (m.isMesh && m.userData.isFloor) floors.push(m); });
    const hits = raycaster.intersectObjects(floors);
    if (hits.length) placePersonAt(hits[0].point);
    return;
  }

  // Door mode
  if (doorPlacementMode) {
    const walls = [];
    roomGroup.traverse(m => { if (m.isMesh && m.userData.isWall) walls.push(m); });
    const hits = raycaster.intersectObjects(walls);
    if (hits.length) {
      const { roomId, wallIndex } = hits[0].object.userData;
      const room = rooms.find(r => r.id === roomId);
      if (room && wallIndex !== undefined) placeDoor(room, wallIndex, hits[0].point);
    }
    return;
  }

  // Window mode
  if (windowPlacementMode) {
    const walls = [];
    roomGroup.traverse(m => { if (m.isMesh && m.userData.isWall) walls.push(m); });
    const hits = raycaster.intersectObjects(walls);
    if (hits.length) {
      const { roomId, wallIndex } = hits[0].object.userData;
      const room = rooms.find(r => r.id === roomId);
      if (room && wallIndex !== undefined) placeWindow(room, wallIndex, hits[0].point);
    }
    return;
  }

  // Normal pick: furniture
  const flat = [];
  objects.forEach(o => o.mesh.traverse(c => { if (c.isMesh) flat.push(c); }));
  const hits = raycaster.intersectObjects(flat);
  if (hits.length) {
    let hit = hits[0].object;
    while (hit.parent && hit.parent !== scene) hit = hit.parent;
    const obj = objects.find(o => o.mesh === hit);
    if (obj) {
      if (selected?.id !== obj.id) select(obj);
      if (transformMode === 'translate') {
        controls.enabled = false; isDragging = true; saveHistory();
        dragPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), obj.mesh.position);
        const pt = new THREE.Vector3();
        raycaster.ray.intersectPlane(dragPlane, pt);
        dragOffset.subVectors(obj.mesh.position, pt);
      }
      return;
    }
  }

  // Pick room floor
  const floors = [];
  roomGroup.traverse(m => { if (m.isMesh && m.userData.isFloor) floors.push(m); });
  const fhits = raycaster.intersectObjects(floors);
  if (fhits.length) { selectRoom(fhits[0].object.userData.roomId); return; }
  deselectAll();
}
function onPointerMove(e) {
  if (!isDragging || !selected) return;
  const { x, y } = getNDC(e);
  mouse.set(x, y);
  raycaster.setFromCamera(mouse, camera);
  const pt = new THREE.Vector3();
  if (raycaster.ray.intersectPlane(dragPlane, pt)) {
    pt.add(dragOffset);
    if (snapGrid) { pt.x = Math.round(pt.x * 2) / 2; pt.z = Math.round(pt.z * 2) / 2; }
    selected.mesh.position.set(pt.x, selected.mesh.position.y, pt.z);
    updatePropsPanel();
  }
}
function onPointerUp() { if (isDragging) { isDragging = false; controls.enabled = true; } }

// ── Keyboard ───────────────────────────────────────────────────────────────────
function onKeyDown(e) {
  fpsKeys[e.code] = true;
  if (fpsModeActive) {
    if (e.key === 'Escape') { e.preventDefault(); exitFPSMode(); return; }
    if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); return; }
    if (e.key === 'f' || e.key === 'F') takeWalkScreenshot();
    return;
  }
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
  if ((e.key === 'Delete' || e.key === 'Backspace') && !doorPlacementMode && !windowPlacementMode) deleteSelected();
  if (e.key === 'w' || e.key === 'W') setTransformMode('translate');
  if (e.key === 'e' || e.key === 'E') setTransformMode('rotate');
  if (e.key === 'r' || e.key === 'R') setTransformMode('scale');
  if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
  if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
  if (e.ctrlKey && (e.key === 'd' || e.key === 'D')) { e.preventDefault(); duplicateSelected(); }
  if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey) fitCameraToHouse();
  if ((e.key === 'h' || e.key === 'H') && selected) toggleSelectedVisibility();
  if ((e.key === 'g' || e.key === 'G') && !e.ctrlKey) toggleSnapGrid();
  if (e.key === 'Escape') {
    if (doorPlacementMode) exitDoorMode();
    else if (windowPlacementMode) exitWindowMode();
    else if (personPlacementMode) exitPersonPlacementMode();
    else if (addRoomMode) closeAddRoomPanel();
    else deselectAll();
  }
  if (selected && !doorPlacementMode && !windowPlacementMode) {
    const step = e.shiftKey ? 0.5 : 0.1;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); selected.mesh.position.x -= step; updatePropsPanel(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); selected.mesh.position.x += step; updatePropsPanel(); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); selected.mesh.position.z -= step; updatePropsPanel(); }
    if (e.key === 'ArrowDown')  { e.preventDefault(); selected.mesh.position.z += step; updatePropsPanel(); }
  }
}
function setTransformMode(mode) {
  transformMode = mode;
  document.querySelectorAll('.tb-btn[data-mode]').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
}

// ── Properties Panel ───────────────────────────────────────────────────────────
function updatePropsPanel() {
  if (!selected) return;
  const m = selected.mesh, r2d = v => Math.round(v * 180 / Math.PI);
  document.getElementById('props-name').textContent = selected.icon + ' ' + selected.label;
  document.getElementById('prop-x').value = m.position.x.toFixed(2);
  document.getElementById('prop-y').value = m.position.y.toFixed(2);
  document.getElementById('prop-z').value = m.position.z.toFixed(2);
  document.getElementById('prop-rx').value = r2d(m.rotation.x);
  document.getElementById('prop-ry').value = r2d(m.rotation.y);
  document.getElementById('prop-rz').value = r2d(m.rotation.z);
  document.getElementById('prop-sx').value = m.scale.x.toFixed(2);
  document.getElementById('prop-sy').value = m.scale.y.toFixed(2);
  document.getElementById('prop-sz').value = m.scale.z.toFixed(2);
  document.getElementById('prop-label').value = selected.label;
  // Sync rotation slider
  const rySlider = document.getElementById('prop-ry-slider');
  if (rySlider) rySlider.value = r2d(m.rotation.y);
}

function getRoomBounds(r) {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  r.points.forEach(p => {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
  });
  return { w: maxX - minX, d: maxZ - minZ, cx: (minX+maxX)/2, cz: (minZ+maxZ)/2 };
}
function updateRoomPanel(room) {
  document.getElementById('room-title').textContent = '🏠 ' + room.name;
  document.getElementById('room-name-input').value = room.name;
  document.getElementById('room-wall-color').value = room.wallColor;
  document.getElementById('room-floor-color').value = room.floorColor;
  const b = getRoomBounds(room);
  const ws = document.getElementById('room-w-slider');
  ws.value = b.w; document.getElementById('room-w-val').textContent = b.w.toFixed(1) + 'm';
  const ds = document.getElementById('room-d-slider');
  ds.value = b.d; document.getElementById('room-d-val').textContent = b.d.toFixed(1) + 'm';
}


// ── Props UI Setup ─────────────────────────────────────────────────────────────
function buildPropsUI() {
  const sc = document.getElementById('color-swatches');
  SWATCHES.forEach(hex => {
    const s = document.createElement('div');
    s.className = 'swatch'; s.style.background = hex; s.title = hex;
    s.addEventListener('click', () => {
      if (!selected) return;
      selected.mesh.traverse(m => {
        if (m.isMesh && m.geometry) {
          const nm = m.material.clone();
          nm.color.set(hex); nm.emissive = new THREE.Color(0x441122); nm.emissiveIntensity = 0.20;
          m.material = nm; m.userData._origMat = null;
        }
      });
      document.getElementById('prop-color').value = hex;
    });
    sc.appendChild(s);
  });

  const lnk = (id, fn) => document.getElementById(id)?.addEventListener('change', fn);
  lnk('prop-x', () => { if (selected) selected.mesh.position.x = +document.getElementById('prop-x').value; });
  lnk('prop-y', () => { if (selected) selected.mesh.position.y = +document.getElementById('prop-y').value; });
  lnk('prop-z', () => { if (selected) selected.mesh.position.z = +document.getElementById('prop-z').value; });
  lnk('prop-rx', () => { if (selected) selected.mesh.rotation.x = +document.getElementById('prop-rx').value * Math.PI / 180; });
  lnk('prop-ry', () => {
    if (selected) {
      const deg = +document.getElementById('prop-ry').value;
      selected.mesh.rotation.y = deg * Math.PI / 180;
      document.getElementById('prop-ry-slider').value = deg;
    }
  });
  lnk('prop-rz', () => { if (selected) selected.mesh.rotation.z = +document.getElementById('prop-rz').value * Math.PI / 180; });
  lnk('prop-sx', () => { if (selected) { const v = +document.getElementById('prop-sx').value; if (v >= 0.05) selected.mesh.scale.x = v; } });
  lnk('prop-sy', () => { if (selected) { const v = +document.getElementById('prop-sy').value; if (v >= 0.05) selected.mesh.scale.y = v; } });
  lnk('prop-sz', () => { if (selected) { const v = +document.getElementById('prop-sz').value; if (v >= 0.05) selected.mesh.scale.z = v; } });
  lnk('prop-label', () => { if (selected) { selected.label = document.getElementById('prop-label').value; selected.mesh.userData.label = selected.label; refreshObjectList(); } });

  document.getElementById('prop-ry-slider').addEventListener('input', e => {
    if (selected) { const deg = +e.target.value; selected.mesh.rotation.y = deg * Math.PI / 180; document.getElementById('prop-ry').value = deg; }
  });
  document.getElementById('prop-color').addEventListener('input', e => {
    if (!selected) return;
    selected.mesh.traverse(m => {
      if (m.isMesh && m.geometry) {
        const nm = m.material.clone(); nm.color.set(e.target.value);
        nm.emissive = new THREE.Color(0x441122); nm.emissiveIntensity = 0.20;
        m.material = nm; m.userData._origMat = null;
      }
    });
  });

  // Room props
  lnk('room-name-input', (e) => {
    const r = rooms.find(r => r.id === selectedRoomId); if (!r) return;
    r.name = e.target.value;
    document.getElementById('room-title').textContent = '🏠 ' + r.name; refreshRoomList();
  });
  document.getElementById('room-wall-color').addEventListener('input', e => {
    const r = rooms.find(r => r.id === selectedRoomId); if (!r) return;
    r.wallColor = e.target.value; rebuildRoom(selectedRoomId);
  });
  document.getElementById('room-floor-color').addEventListener('input', e => {
    const r = rooms.find(r => r.id === selectedRoomId); if (!r) return;
    r.floorColor = e.target.value; rebuildRoom(selectedRoomId);
  });
  document.getElementById('room-w-slider').addEventListener('input', e => {
    const r = rooms.find(r => r.id === selectedRoomId); if (!r) return;
    const b = getRoomBounds(r);
    const factor = +e.target.value / b.w;
    r.points.forEach(p => p.x = b.cx + (p.x - b.cx) * factor);
    document.getElementById('room-w-val').textContent = (+e.target.value).toFixed(1) + 'm'; rebuildRoom(selectedRoomId);
  });
  document.getElementById('room-d-slider').addEventListener('input', e => {
    const r = rooms.find(r => r.id === selectedRoomId); if (!r) return;
    const b = getRoomBounds(r);
    const factor = +e.target.value / b.d;
    r.points.forEach(p => p.z = b.cz + (p.z - b.cz) * factor);
    document.getElementById('room-d-val').textContent = (+e.target.value).toFixed(1) + 'm'; rebuildRoom(selectedRoomId);
  });

  // Door / Window modes
  document.getElementById('btn-enter-door-mode').addEventListener('click', () => doorPlacementMode ? exitDoorMode() : enterDoorMode());
  document.getElementById('btn-enter-window-mode').addEventListener('click', () => windowPlacementMode ? exitWindowMode() : enterWindowMode());
  document.getElementById('exit-door-mode').addEventListener('click', exitDoorMode);
  document.getElementById('exit-window-mode').addEventListener('click', exitWindowMode);

  // Window size picker
  document.querySelectorAll('.win-sz').forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      windowSize = btn.dataset.sz;
      document.querySelectorAll('.win-sz').forEach(b => b.classList.toggle('active', b.dataset.sz === windowSize));
    });
  });

  document.getElementById('btn-delete-room').addEventListener('click', () => { if (selectedRoomId) deleteRoom(selectedRoomId); });
  document.getElementById('btn-delete').addEventListener('click', deleteSelected);
  document.getElementById('btn-duplicate')?.addEventListener('click', duplicateSelected);
  document.getElementById('btn-snap')?.addEventListener('click', toggleSnapGrid);
  document.getElementById('btn-delete2').addEventListener('click', deleteSelected);
  document.getElementById('btn-undo').addEventListener('click', undo);
  document.getElementById('btn-redo').addEventListener('click', redo);
  document.getElementById('btn-add-room').addEventListener('click', openAddRoomPanel);
  document.getElementById('cancel-add-room').addEventListener('click', closeAddRoomPanel);
  document.getElementById('confirm-add-room').addEventListener('click', confirmAddRoom);

  // Transform bar
  document.querySelectorAll('.tb-btn[data-mode]').forEach(b => b.addEventListener('click', () => setTransformMode(b.dataset.mode)));

  // Add Room live update
  ['new-room-name','new-room-w','new-room-d','new-room-wall','new-room-floor','attach-room-select'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => { if (addRoomMode) updateGhostRoom(); });
    document.getElementById(id)?.addEventListener('change', () => { if (addRoomMode) updateGhostRoom(); });
  });
  document.getElementById('new-room-shape')?.addEventListener('change', () => { if (addRoomMode) updateGhostRoom(); });
  document.getElementById('new-room-w').addEventListener('input', e => { document.getElementById('new-room-w-val').textContent = e.target.value + 'm'; });
  document.getElementById('new-room-d').addEventListener('input', e => { document.getElementById('new-room-d-val').textContent = e.target.value + 'm'; });

  // Side picker
  document.querySelectorAll('.side-btn').forEach(b => {
    b.addEventListener('click', () => {
      newRoomSide = b.dataset.side;
      document.querySelectorAll('.side-btn').forEach(x => x.classList.toggle('active', x.dataset.side === newRoomSide));
      if (addRoomMode) updateGhostRoom();
    });
  });

  // Scroll = rotate/scale when object selected
  document.getElementById('viewport').addEventListener('wheel', e => {
    if (!selected || fpsModeActive) return;
    if (transformMode === 'rotate') { e.preventDefault(); selected.mesh.rotation.y += e.deltaY * 0.005; updatePropsPanel(); }
    if (transformMode === 'scale') { e.preventDefault(); const s = Math.max(0.05, Math.min(5, 1 - e.deltaY * 0.002)); selected.mesh.scale.multiplyScalar(s); updatePropsPanel(); }
  }, { passive: false });

  document.getElementById('btn-screenshot').addEventListener('click', () => {
    renderer.render(scene, camera);
    const a = document.createElement('a'); a.href = renderer.domElement.toDataURL('image/png'); a.download = '1KnownEllaStudio.png'; a.click();
    showToast('📸 Screenshot saved');
  });
  document.getElementById('btn-export').addEventListener('click', () => {
    const data = { rooms, doors, windows: windows2, objects: serializeState().objects };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    a.download = '1KnownEllaStudio.json'; a.click(); showToast('💾 Exported!');
  });
}

// ── Catalog + Presets UI ───────────────────────────────────────────────────────
let catalogSearch = '';
function buildCatalogUI() {
  const tabs = document.getElementById('cat-tabs');
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-tab' + (cat.id === currentCat ? ' active' : '');
    btn.textContent = cat.label; btn.dataset.catId = cat.id;
    btn.addEventListener('click', () => {
      currentCat = cat.id; catalogSearch = '';
      const si = document.getElementById('catalog-search'); if (si) si.value = '';
      document.querySelectorAll('.cat-tab').forEach(b => b.classList.toggle('active', b.dataset.catId === cat.id));
      renderCatalog();
    });
    tabs.appendChild(btn);
  });
  // Search input
  const searchWrap = document.createElement('div');
  searchWrap.className = 'catalog-search-wrap';
  searchWrap.innerHTML = '<input id="catalog-search" class="catalog-search" placeholder="Search…" autocomplete="off"/><button class="catalog-search-clear" id="catalog-search-clear" title="Clear">✕</button>';
  const panel = document.querySelector('.panel-furniture');
  panel.insertBefore(searchWrap, document.getElementById('furniture-catalog'));
  document.getElementById('catalog-search').addEventListener('input', e => {
    catalogSearch = e.target.value.toLowerCase();
    document.getElementById('catalog-search-clear').style.opacity = catalogSearch ? '1' : '0';
    renderCatalog();
  });
  document.getElementById('catalog-search-clear').addEventListener('click', () => {
    catalogSearch = ''; document.getElementById('catalog-search').value = '';
    document.getElementById('catalog-search-clear').style.opacity = '0';
    renderCatalog();
  });
  renderCatalog();
}
function renderCatalog() {
  const grid = document.getElementById('furniture-catalog'); grid.innerHTML = '';
  let items = catalogSearch
    ? CATALOG.filter(i => i.label.toLowerCase().includes(catalogSearch) || i.cat.includes(catalogSearch))
    : CATALOG.filter(i => i.cat === currentCat);
  items.forEach(item => {
    const el = document.createElement('div'); el.className = 'furniture-item';
    el.innerHTML = `<span class="fi-icon">${item.icon}</span><span class="fi-name">${item.label}</span>`;
    el.title = 'Click to add · Double-click to add multiple';
    el.addEventListener('click', () => addFurniture(item));
    grid.appendChild(el);
  });
  if (!items.length) {
    grid.innerHTML = '<div class="catalog-empty">No results</div>';
  }
}
function buildPresetsUI() {
  const bar = document.getElementById('topbar-presets');
  HOUSE_PRESETS.forEach(p => {
    const btn = document.createElement('button'); btn.className = 'preset-btn'; btn.dataset.id = p.id;
    btn.innerHTML = p.icon + ' ' + p.name;
    btn.addEventListener('click', () => loadPreset(p.id)); bar.appendChild(btn);
  });
}

// ── Room / Object lists ────────────────────────────────────────────────────────
function refreshRoomList() {
  const ul = document.getElementById('room-list'); ul.innerHTML = '';
  rooms.forEach(room => {
    const doorCt = doors.filter(d => d.roomId === room.id).length;
    const winCt = windows2.filter(w => w.roomId === room.id).length;
    const li = document.createElement('div');
    li.className = 'room-item' + (selectedRoomId === room.id ? ' active' : '');
    li.innerHTML = `<div class="room-color-dot" style="background:${room.floorColor}"></div>
      <span class="room-item-name">${room.name}</span>
      <span class="room-item-size">${getRoomBounds(room).w.toFixed(1)}×${getRoomBounds(room).d.toFixed(1)}m${doorCt ? ' 🚪' : ''}${winCt ? ' 🪟' + winCt : ''}</span>`;
    li.addEventListener('click', () => selectRoom(room.id)); ul.appendChild(li);
  });
}
function refreshObjectList() {
  const ul = document.getElementById('object-list');
  const cnt = document.getElementById('obj-count');
  ul.innerHTML = '';
  cnt.textContent = objects.length ? `(${objects.length})` : '';
  [...objects].reverse().forEach(obj => {
    const li = document.createElement('li');
    li.className = selected?.id === obj.id ? 'selected' : '';
    li.innerHTML = `<span>${obj.icon}</span><span>${obj.label}</span><button class="ol-eye">${obj.visible ? '👁' : '🚫'}</button>`;
    li.querySelector('.ol-eye').addEventListener('click', e => { e.stopPropagation(); obj.visible = !obj.visible; obj.mesh.visible = obj.visible; refreshObjectList(); });
    li.addEventListener('click', () => select(obj)); ul.appendChild(li);
  });
}

// ── Undo / Redo ────────────────────────────────────────────────────────────────
function serializeState() {
  return {
    floors: floors.map(f => ({ ...f })),
    currentFloor,
    rooms: rooms.map(r => ({ ...r })),
    doors: doors.map(d => ({ ...d })),
    windows: windows2.map(w => ({ ...w })),
    objects: objects.map(o => ({
      id: o.id, label: o.label, icon: o.icon, catalogId: o.catalogId, visible: o.visible,
      px: o.mesh.position.x, py: o.mesh.position.y, pz: o.mesh.position.z,
      rx: o.mesh.rotation.x, ry: o.mesh.rotation.y, rz: o.mesh.rotation.z,
      sx: o.mesh.scale.x, sy: o.mesh.scale.y, sz: o.mesh.scale.z,
    }))
  };
}
function saveHistory() { history.push(serializeState()); if (history.length > 50) history.shift(); redoStack = []; updateUndoRedoBtns(); }
function updateUndoRedoBtns() {
  const u = document.getElementById('btn-undo'), r = document.getElementById('btn-redo');
  if (u) u.style.opacity = history.length ? '1' : '0.4';
  if (r) r.style.opacity = redoStack.length ? '1' : '0.4';
}
function undo() { if (!history.length) return showToast('Nothing to undo'); redoStack.push(serializeState()); restoreState(history.pop()); updateUndoRedoBtns(); showToast('↩ Undo'); }
function redo() { if (!redoStack.length) return showToast('Nothing to redo'); history.push(serializeState()); restoreState(redoStack.pop()); updateUndoRedoBtns(); showToast('↪ Redo'); }
function restoreState(state) {
  objects.forEach(o => scene.remove(o.mesh)); objects = []; selected = null; deselectAll();
  if (state.floors) { floors = state.floors.map(f => ({ ...f })); currentFloor = state.currentFloor || 0; }
  rooms = state.rooms.map(r => ({ ...r }));
  doors = (state.doors || []).map(d => ({ ...d }));
  windows2 = (state.windows || []).map(w => ({ ...w }));
  idCounter = Math.max(
    rooms.reduce((m, r) => Math.max(m, r.id), 0),
    state.objects.reduce((m, o) => Math.max(m, o.id), 0),
    doors.reduce((m, d) => Math.max(m, d.id), 0),
    windows2.reduce((m, w) => Math.max(m, w.id), 0)
  );
  buildAllRooms();
  state.objects.forEach(s => {
    const item = CATALOG.find(c => c.id === s.catalogId); if (!item) return;
    const mesh = item.build();
    mesh.position.set(s.px, s.py, s.pz); mesh.rotation.set(s.rx, s.ry, s.rz); mesh.scale.set(s.sx, s.sy, s.sz);
    mesh.visible = s.visible;
    mesh.userData = { catalogId: s.catalogId, label: s.label, icon: s.icon };
    const obj = { id: s.id, mesh, label: s.label, icon: s.icon, catalogId: s.catalogId, visible: s.visible };
    objects.push(obj); scene.add(mesh);
  });
  refreshRoomList(); refreshObjectList(); refreshFloorUI();
}

// ── Utils ──────────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}
function resize() {
  if (!renderer) return;
  const vp = document.getElementById('viewport');
  const w = vp.clientWidth, h = vp.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  if (camera) { camera.aspect = w / h; camera.updateProjectionMatrix(); }
}
// ── Room Labels Overlay ────────────────────────────────────────────────────────
let roomLabelEls = [];
function syncRoomLabels() {
  if (viewMode !== '3d' || fpsModeActive) { roomLabelEls.forEach(e => e.style.display = 'none'); return; }
  const vp = document.getElementById('viewport');
  const W = vp.clientWidth, H = vp.clientHeight;
  const existingIds = new Set();
  rooms.forEach(room => {
    existingIds.add(room.id);
    let el = document.getElementById('rl-' + room.id);
    if (!el) {
      el = document.createElement('div');
      el.id = 'rl-' + room.id;
      el.className = 'room-label-3d';
      vp.appendChild(el);
      roomLabelEls.push(el);
    }
    const b = getRoomBounds(room);
    const cx = b.cx, cz = b.cz;
    const floorY = (room.floor || 0) * FLOOR_HEIGHT;
    const worldPos = new THREE.Vector3(cx, floorY + 0.12, cz);
    const floorIdx = room.floor || 0;
    const isActive = floorIdx === currentFloor;
    // Project to screen
    const proj = worldPos.clone().project(camera);
    const sx = (proj.x * 0.5 + 0.5) * W;
    const sy = (-proj.y * 0.5 + 0.5) * H;
    if (proj.z > 1 || !isActive) { el.style.display = 'none'; return; }
    el.style.display = '';
    el.style.left = sx + 'px'; el.style.top = sy + 'px';
    el.textContent = room.name;
    el.classList.toggle('selected', selectedRoomId === room.id);
  });
  // Remove stale labels
  roomLabelEls = roomLabelEls.filter(e => {
    const id = parseInt(e.id.replace('rl-', ''));
    if (!existingIds.has(id)) { e.remove(); return false; }
    return true;
  });
}

function animate(time) {
  requestAnimationFrame(animate);
  const dt = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;
  if (fpsModeActive) updateFPS(dt);
  else controls.update();
  renderer.render(scene, camera);
  syncRoomLabels();
}

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', handleResize);

