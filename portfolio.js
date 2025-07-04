// Portfolio filter (uses requestAnimationFrame for smoother UI)
function filterSelection(c) {
  var x = document.getElementsByClassName("portfolio-col");
  window.requestAnimationFrame(function() {
    for (var i = 0; i < x.length; i++) {
      if (c === 'all' || x[i].classList.contains(c)) {
        x[i].classList.add('portfolio-show');
      } else {
        x[i].classList.remove('portfolio-show');
      }
    }
  });
}
filterSelection('all');
// Add active class to the current button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = btnContainer.getElementsByClassName("active");
    if(current.length) current[0].classList.remove("active");
    this.classList.add("active");
  });
}
// IntersectionObserver-based lazy loading for all images in the portfolio
document.addEventListener('DOMContentLoaded', function() {
  var imgs = document.querySelectorAll('.portfolio-content img');
  imgs.forEach(function(img) {
    // Set a placeholder or tiny transparent image as src
    if (!img.hasAttribute('data-src')) {
      img.setAttribute('data-src', img.src);
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    }
  });
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.getAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, { threshold: 0.1 });
    imgs.forEach(function(img) {
      observer.observe(img);
    });
  } else {
    // Fallback: just load all images
    imgs.forEach(function(img) {
      img.src = img.getAttribute('data-src') || img.src;
    });
  }
});
// Defer non-critical scripts (example: defer analytics or widgets)
window.addEventListener('load', function() {
  // Example: dynamically load a non-critical script
  // var script = document.createElement('script');
  // document.body.appendChild(script);
});
// Minimize forced reflow: batch DOM changes
function batchDOMUpdates(updates) {
  window.requestAnimationFrame(function() {
    updates();
  });
}
