window.onclick = function(e) {
    if (!e.target.matches('.sn')) {
        const navItems = ['menu']
        for (idx in navItems){
            const button = document.getElementById(navItems[idx] + "-bt")
            button.classList.remove("clicked")
            const dropdown = document.getElementById(navItems[idx] + "-sn")
            dropdown.classList.add("hidden")
        }
    }
}

// (Sub-)Navigation Bar --------------------------------------------------

function toggleSubnav(navID){
    const button = document.getElementById(navID + "-bt")
    button.classList.toggle("clicked")
    const dropdown = document.getElementById(navID + "-sn")
    dropdown.classList.toggle("hidden")
}