//select myMeu id
function myFunction() {
    document.getElementById("myMenu").classList.toggle("display");
}

// Close the menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.menubutton')) {

        var menus = document.getElementsByClassName("menu-content");
        var i;
        for (i = 0; i < menus.length; i++) {
            var openmenu = menus[i];
            if (openmenu.classList.contains('display')) {
                openmenu.classList.remove('display');
            }
        }
    }
}



