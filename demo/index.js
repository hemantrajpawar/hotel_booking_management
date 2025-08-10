function updateOnlineStatus() {
  const banner = document.getElementById('offline-banner');
  
  if (navigator.onLine) {
    banner.classList.remove("show");
  } else {
    banner.classList.add("show");
  }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Initial check on page load
updateOnlineStatus();
