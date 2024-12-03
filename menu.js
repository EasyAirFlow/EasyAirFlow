
const menuButton = document.getElementById('menuButton');
const sideMenu = document.getElementById('sideMenu');
const closeMenuButton = document.getElementById('closeMenuButton');

menuButton.addEventListener('click', () => {
    if (getComputedStyle(sideMenu).left === '-300px') {
        sideMenu.style.left = '0';
    } else {
        sideMenu.style.left = '-300px';
    }
});

closeMenuButton.addEventListener('click', () => {
    sideMenu.style.left = '-300px';
});

document.addEventListener('click', (event) => {
    if (!menuButton.contains(event.target) && !sideMenu.contains(event.target) && sideMenu.style.left === '0px') {
        sideMenu.style.left = '-300px';
    }
});
