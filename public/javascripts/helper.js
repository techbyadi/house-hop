
function removeNotification(){
  const notification = document.getElementById('notification');
    if(notification)
      document.getElementById('notification').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", function() {
  setTimeout(removeNotification, 6000);
});