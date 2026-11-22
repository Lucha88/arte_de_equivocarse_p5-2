/*
 Artista elegida: Susana Rendón
 Álbum: Margen de Error
 Proyecto: El arte de equivocarse
 Diario interactivo en p5.js + p5.sound.
 Las imágenes son páginas originales de la diagramación suministrada.
*/

const W = 1200, H = 675;
const PAGINAS = [9,8,4,1,2,7,3];
const NOMBRES = ['Portada','Índice','Sobre Susy','Margen de error','Prometiste la luna','Mr. Perfecto','Cada pez'];
const ARCHIVOS_AUDIO = {3:'margen.mp3',4:'luna.mp3',5:'mrperfecto.mp3',6:'pez.mp3'};
let fondos = {}, audios = {}, pagina = 0, audioActual = null;
let amplitud, volumen = 0.65, muteado = false;
let mensaje = '', mostrarMensaje = false, vistaAlterna = false;
let promesas = [false,false,false], peces = [], particulas = [];
let areas = [], desplazamiento = 0;

function preload(){
  for(let n of [...new Set([...PAGINAS,5,6])]){
    fondos[n] = loadImage('assets/pagina-'+n+'.png',()=>{},()=>{fondos[n]=null});
  }
  for(let p of [3,4,5,6]){
    audios[p] = loadSound('assets/'+ARCHIVOS_AUDIO[p],()=>{},()=>{audios[p]=null});
  }
}

function setup(){
  createCanvas(W,H);
  textFont('Georgia');
  amplitud = new p5.Amplitude();
  for(let i=0;i<16;i++){
    peces.push({x:random(650,1130),y:random(170,560),vel:random(.2,.7),fase:random(TWO_PI)});
  }
}

function draw(){
  background('#947579');
  let fondo = PAGINAS[pagina];
  if(pagina===2 && vistaAlterna) fondo=5;
  if(pagina===3 && vistaAlterna) fondo=6;
  if(fondos[fondo]) image(fondos[fondo],0,0,W,H);
  else { fill('#f6eddb');rect(50,60,1100,555,18); }

  let nivel = amplitud ? amplitud.getLevel() : 0;
  areas = [];
  if(pagina===0) portada(nivel);
  if(pagina===1) indice();
  if(pagina===2) sobreSusy(nivel);
  if(pagina===3) margen(nivel);
  if(pagina===4) luna(nivel);
  if(pagina===5) perfecto(nivel);
  if(pagina===6) cadaPez(nivel);
  if(mostrarMensaje) notaEmergente();
  controles();
  navegacion();
}

function zona(x,y,w,h,accion){areas.push({x,y,w,h,accion});}
function dentro(x,y,w,h){return mouseX>=x && mouseX<=x+w && mouseY>=y && mouseY<=y+h;}
function texto(t,x,y,tam=17,color='#682a39',alineacion=LEFT){
  push();fill(color);noStroke();textAlign(alineacion);textSize(tam);text(t,x,y);pop();
}
function pastilla(t,x,y,w=130){
  push();fill(255,248,236,225);stroke('#7b3447');strokeWeight(1);rect(x,y,w,27,13);
  texto(t,x+w/2,y+18,13,'#6e293d',CENTER);pop();
}
function abrirNota(t){mensaje=t;mostrarMensaje=true;}
function cambiar(p){
  if(p<0 || p>=PAGINAS.length)return;
  if(audioActual && audioActual.isPlaying())audioActual.pause();
  pagina=p;vistaAlterna=false;mostrarMensaje=false;
  audioActual=audios[p] || null;
  if(audioActual){audioActual.setVolume(muteado?0:volumen);amplitud.setInput(audioActual);}
}
function portada(nivel){
  // Portada original: etiqueta central sobre rayas rojas.
  let escala=1+min(nivel*2,.1);
  push();translate(600,320);scale(escala);pop();
  zona(435,170,330,340,()=>cambiar(1));
  pastilla('Haz clic para abrir',510,565,185);
}
function indice(){
  // Índice original a la izquierda; las líneas son enlaces.
  const enlaces=[{p:3,y:248},{p:4,y:278},{p:5,y:307},{p:6,y:338}];
  enlaces.forEach((a,i)=>{
    zona(155,a.y-16,290,27,()=>cambiar(a.p));
    if(dentro(155,a.y-16,290,27)){
      noFill();stroke('#9d3c54');rect(155,a.y-16,290,27,5);
    }
  });
  zona(660,200,420,360,()=>abrirNota('El diario reúne canciones sobre las primeras relaciones, las promesas y los recuerdos que no se van.'));
  pastilla('Elige una canción',180,425,180);
}
function sobreSusy(nivel){
  // Cámara, fotografía y nota originales; cambiar a la página con texto.
  zona(150,220,330,230,()=>{vistaAlterna=!vistaAlterna;});
  zona(705,140,355,410,()=>{vistaAlterna=!vistaAlterna;});
  pastilla(vistaAlterna?'Ocultar historia':'Descubrir a Susy',770,535,185);
  zona(190,440,190,100,()=>abrirNota('Susy comenzó a cantar desde pequeña. Su música recoge recuerdos, aprendizajes y experiencias personales.'));
  if(nivel>.02){noFill();stroke(130,45,68,70);circle(300,340,100+nivel*300);}
}
function margen(nivel){
  // Página del PDF 1 sin textos y página 6 con notas reveladas.
  zona(735,170,330,370,()=>{vistaAlterna=!vistaAlterna;});
  zona(120,135,405,415,()=>abrirNota('Margen de error fue la primera canción que Susy lanzó a los 16 años y dio nombre al álbum debut.'));
  pastilla(vistaAlterna?'Ocultar notas':'Descubrir la historia',770,550,195);
  if(nivel>.01){
    noFill();stroke(121,47,72,110);strokeWeight(2);
    circle(300,340,170+nivel*300);
  }
}
function luna(nivel){
  // Tres papeles azules en la página izquierda, clic para tachar promesas.
  const frases=['Por ti voy a cambiar','Te prometo la luna','Siempre voy a quedarme'];
  for(let i=0;i<3;i++){
    let y=340+i*59;
    zona(170,y,275,48,()=>{promesas[i]=!promesas[i];});
    if(promesas[i]){
      push();stroke('#cbb1a4');strokeWeight(4);line(177,y+24,436,y+19);pop();
      texto(frases[i],190,y+31,14,'#ffffff');
    }
  }
  zona(815,260,250,260,()=>abrirNota('Susy escribió Prometiste la luna a los 14 años. La canción reúne promesas y frases cliché que muchas veces no se cumplen.'));
  if(nivel>.015){
    noStroke();fill(248,219,130,100);
    for(let i=0;i<7;i++)circle(790+i*42,180+sin(frameCount*.035+i)*8,3+nivel*80);
  }
  pastilla('Tacha las promesas',175,535,200);
}
function perfecto(nivel){
  // Dibujo original a lápiz sobre la página izquierda.
  zona(170,170,345,400,()=>abrirNota('Para Mr. Perfecto, Susy imaginó un video con un maniquí. Después creó un video frente a un espejo: una forma de hablar de la idealización con sátira y humor.'));
  zona(665,175,410,390,()=>abrirNota('“Yo maquillando tus defectos”. La canción habla de una relación que parecía perfecta, hasta que se reveló la verdad.'));
  pastilla('Toca la ilustración',180,550,180);
  if(nivel>.015){
    push();noFill();stroke(125,50,65,90);strokeWeight(1);
    ellipse(370,360,160+nivel*220,190+nivel*220);pop();
  }
}
function cadaPez(nivel){
  // Peces originales en acuarela de la página derecha.
  // Añadimos burbujas transparentes que siguen la intensidad de la música.
  for(let i=0;i<peces.length;i++){
    let p=peces[i];p.x+=p.vel*(1+nivel*20);
    if(p.x>1120)p.x=675;
    let yy=p.y+sin(frameCount*.025+p.fase)*7;
    noFill();stroke(95,147,177,60+min(nivel*500,100));
    circle(p.x,yy,5+min(nivel*100,16));
  }
  zona(650,140,470,425,()=>abrirNota('“Odio que cada pez traiga una parte de ti y me ancle de vuelta”. Aunque intenta avanzar, los recuerdos regresan como las olas.'));
  pastilla('Toca los peces',830,550,155);
}
function notaEmergente(){
  push();fill(37,18,24,120);noStroke();rect(0,0,W,H);
  fill('#fff8eb');stroke('#783a4c');strokeWeight(3);rect(270,160,660,345,14);
  fill('#7c3449');noStroke();textSize(21);textAlign(LEFT);text('Una nota del diario...',315,220);
  fill('#49333a');textSize(20);textLeading(32);
  text(mensaje,315,260,570,175);
  pastilla('Cerrar  ×',750,445,125);
  zona(750,440,135,42,()=>{mostrarMensaje=false;});
  pop();
}
function controles(){
  push();noStroke();fill(255,250,242,235);rect(390,616,430,45,20);
  fill('#6d3043');textAlign(CENTER);textSize(16);
  let disponible=!!audioActual;
  text(disponible && audioActual.isPlaying()?'❚❚':'▶',420,645);
  text(muteado?'×':'♫',468,645);
  text('−',505,645);text('+',755,645);
  fill('#c7a6ae');rect(530,636,197,6,4);
  fill('#80364d');rect(530,636,197*(muteado?0:volumen),6,4);
  textSize(11);text(Math.round(volumen*100)+'%',787,645);
  pop();
  zona(396,619,47,36,()=>alternarAudio());
  zona(446,619,42,36,()=>{muteado=!muteado;if(audioActual)audioActual.setVolume(muteado?0:volumen);});
  zona(490,619,35,36,()=>ajustarVolumen(-.1));
  zona(530,626,197,24,()=>{volumen=constrain((mouseX-530)/197,0,1);muteado=false;if(audioActual)audioActual.setVolume(volumen);});
  zona(735,619,38,36,()=>ajustarVolumen(.1));
}
function alternarAudio(){
  if(!audioActual){abrirNota('Esta página no tiene una canción asignada. Entra a una de las cuatro canciones desde el índice.');return;}
  userStartAudio();
  if(audioActual.isPlaying())audioActual.pause();
  else {audioActual.setVolume(muteado?0:volumen);audioActual.play();}
}
function ajustarVolumen(delta){volumen=constrain(volumen+delta,0,1);muteado=false;if(audioActual)audioActual.setVolume(volumen);}
function navegacion(){
  pastilla('←',40,615,48);pastilla('Índice',102,615,85);pastilla('→',1110,615,48);
  zona(38,610,54,42,()=>cambiar(pagina-1));
  zona(99,610,92,42,()=>cambiar(1));
  zona(1106,610,56,42,()=>cambiar(pagina+1));
  texto(NOMBRES[pagina],600,38,17,'#fff5e8',CENTER);
  texto((pagina+1)+' / '+PAGINAS.length,1080,38,14,'#fff5e8',CENTER);
}
function mousePressed(){
  for(let i=areas.length-1;i>=0;i--){
    let a=areas[i];if(dentro(a.x,a.y,a.w,a.h)){a.accion();return false;}
  }
}
function keyPressed(){
  if(keyCode===RIGHT_ARROW)cambiar(pagina+1);
  if(keyCode===LEFT_ARROW)cambiar(pagina-1);
  if(key===' '){alternarAudio();return false;}
  if(keyCode===ESCAPE)mostrarMensaje=false;
}
