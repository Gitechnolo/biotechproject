// Biotech modal popup script for Progetti.html
// Works for any number of images with id starting with 'myImg'
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("myModal");
  const modalImg = document.getElementById("img01");
  const captionText = document.getElementById("caption");
  const closeBtn = modal.querySelector(".close");

  // Attach click event to all images with id starting with 'myImg'
  ["myImg", "myImg2", "myImg3", "myImg4"].forEach(function (imgId) {
    const img = document.getElementById(imgId);
    if (img) {
      img.addEventListener("click", function () {
        modal.style.display = "block";
        modalImg.src = this.src;
        captionText.textContent = this.alt;
      });
    }
  });

  // Close modal on X click
  closeBtn.onclick = function () {
    modal.style.display = "none";
    modalImg.src = "";
    captionText.textContent = "";
  };

  // Optional: close modal when clicking outside the image
  modal.onclick = function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      modalImg.src = "";
      captionText.textContent = "";
    }
  };
});
