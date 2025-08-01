//Fade effect (dissolvenza)
function fadeEffect() { 
  let text = document.getElementById("fadingText");
  let visible = true;
  setInterval(() => {
      visible = !visible;
      text.style.opacity = visible ? "1" : "0";
  }, 2000);
}
window.addEventListener("load", fadeEffect);
// End fade effect (dissolvenza)

// drop-down menu
var inmenu=false;
var lastmenu=0;
function Menu (current) {
   if (!document.getElementById) return;
   inmenu=true;
   oldmenu=lastmenu;
   lastmenu=current;
   if (oldmenu) Erase (oldmenu);
   m=document.getElementById("menu-" + current);
   box=document.getElementById(current);
   box.style.left= m.offsetLeft;
   box.style.top= m.offsetTop + m.offsetHeight;
   box.style.visibility="visible";
   m.style.backgroundColor="rgba(209, 206, 206, 0.57)";
   box.style.backgroundColor="rgba(209, 206, 206, 0.57)";
   box.style.width="553px";
}
function Erase(current) {
   if (!document.getElementById) return;
   if (inmenu && lastmenu==current) return;
   m=document.getElementById("menu-" + current);
   box=document.getElementById(current);
   box.style.visibility="hidden";
   m.style.backgroundColor="Silver";
}
function Timeout(current) {
   inmenu=false;
   window.setTimeout("Erase('" + current + "');",500);
}
function Highlight (menu, item) {
   if (!document.getElementById) return;
   inmenu=true;
   lastmenu=menu;
   obj=document.getElementById(item);
   obj.style.backgroundColor="Silver";
}
function UnHighlight(menu,item) {
   if (!document.getElementById) return;
   Timeout(menu);
   obj=document.getElementById(item);
   obj.style.backgroundColor="rgba(209, 206, 206, 0.57)";
}
//End drop-down menu

// Clock
function Clock() {
if (!document.getElementById) return;
theclock=document.getElementById("clock");
now = new Date();
gg =now.getDate() + "";
mm =now.getMonth() + 1 + "";
aaaa =now.getFullYear();
hours=now.getHours();
mins=now.getMinutes();
secs=now.getSeconds();
ms =now.getMilliseconds(); 
if (ms < 10) ms= "0" + ms; 
if (secs < 10) secs= "0" + secs;
if (mins < 10) mins= "0" + mins;
theclock.innerHTML = " " + gg + "/" + mm + "/" + aaaa + " - " +  hours + ":" + mins + ":" + secs + "&nbsp;" + ms;
window.setTimeout("Clock();",250);
}
//End  Clock

// Lightbox Cellula - Cuore - Apparato respiratorio - Sistema linfatico....
function openModal() {
  document.getElementById("myModal").style.display = "block";
}
function closeModal() {
  document.getElementById("myModal").style.display = "none";
}
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}
function currentSlide(n) {
  showSlides(slideIndex = n);
}
function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}
// End Lightbox Cellula - Cuore - Apparato respiratorio - Sistema linfatico....


// Get the modal image 1
var modal = document.getElementById("myModal");
// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("myImg");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
img.onclick = function(){
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
}
// Get the modal image 2
var modal = document.getElementById("myModal");
// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("myImg2");
var modalImg = document.getElementById("img02");
var captionText = document.getElementById("caption");
img.onclick = function(){
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
}
// Get the modal image 3
var modal = document.getElementById("myModal");
// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("myImg3");
var modalImg = document.getElementById("img03");
var captionText = document.getElementById("caption");
img.onclick = function(){
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
}
// Get the modal image 4
var modal = document.getElementById("myModal");
// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("myImg4");
var modalImg = document.getElementById("img04");
var captionText = document.getElementById("caption");
img.onclick = function(){
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
}
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
  modal.style.display = "none";
}

// --- Performance Helpers ---

// Throttle: limit how often a function can run
function throttle(fn, limit) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}
// Debounce: run a function only after a pause
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
// Example usage: define your own handlers as needed
// window.addEventListener('scroll', throttle(() => {
//   // handle scroll event
// }, 100));
// window.addEventListener('resize', debounce(() => {
//   // handle resize event
// }, 200));

// Lazy loading images with IntersectionObserver
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('img[data-src]').forEach(img => {
    observer.observe(img);
  });
}

// When the user mouseover on div, open the info popup
function infoFunction() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}

// Set last modified date in footer
function setLastModified() {
  const el = document.getElementById('lastModified');
  if (el) {
    const d = new Date(document.lastModified);
    el.textContent = `Ultima modifica: ${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  }
}

document.addEventListener('DOMContentLoaded', setLastModified);
// End last modified date

// Light effect around the bulb image
function turnOnLight() {
  const img = document.getElementById('myImage');
  img.src = 'Biotech-file/images/pic_bulbon.gif';
  img.classList.add('bulb-glow');
}
function turnOffLight() {
  const img = document.getElementById('myImage');
  img.src = 'Biotech-file/images/pic_bulboff.gif';
  img.classList.remove('bulb-glow');
}
// End effect around the bulb image

// Popup
function PopupCentrata()
{
var w = 760;
var h = 370;
var l = Math.floor((screen.width-w)/2);
var t = Math.floor((screen.height-h)/2);

window.open("https://gitechnolo.github.io/biotechproject/O.S_support.html","","width=" + w + ",height=" + h + ",top=" + t + ",left=" + l);
}
function ChatGPTpopupCenterAI()
{
var w = 825;
var h = 672;
var l = Math.floor((screen.width-w)/2);
var t = Math.floor((screen.height-h)/2);

window.open("https://gitechnolo.github.io/biotechproject/Table.html","","width=" + w + ",height=" + h + ",top=" + t + ",left=" + l);
}
// End popup