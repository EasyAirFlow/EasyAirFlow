function toggleMenu() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if (menu.style.width === '250px') {
        menu.style.width = '0';
        overlay.style.display = 'none';
    } else {
        menu.style.width = '250px';
        overlay.style.display = 'block';
    }
}
