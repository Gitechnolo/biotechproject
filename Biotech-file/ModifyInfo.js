// Display last modified date
document.addEventListener('DOMContentLoaded', function () {
    const el = document.getElementById('lastModified');
    if (el) {
      const d = new Date(document.lastModified);
      el.textContent = `Last edit: ${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
    }
  });
  // End display last modified date