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
hours=now.getHours();
mins=now.getMinutes();
secs=now.getSeconds();
if (secs < 10) secs= "0" + secs;
if (mins < 10) mins= "0" + mins;
theclock.innerHTML = hours + ":" + mins + ":" + secs;
window.setTimeout("Clock();",250);
}
//End  Clock

// Lightbox Cellula
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
// End Lightbox Cellula