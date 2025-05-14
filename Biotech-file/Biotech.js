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
   m.style.backgroundColor="CadetBlue";
   box.style.backgroundColor="CadetBlue";
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
   obj.style.backgroundColor="CadetBlue";
}
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
