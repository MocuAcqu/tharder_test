// Menu 按鈕點擊動畫效果
function menuAnimation() {
    const items = document.querySelectorAll(".menu-item");
    items.forEach(item => {
        item.classList.toggle("clicked");
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // 從 localStorage 讀取使用者資訊
    const user = JSON.parse(localStorage.getItem('user'));

    // 更新「歡迎使用者」文字
    const welcomeUser = document.getElementById('welcome-user');
    if (user && user.name) {
        welcomeUser.textContent = `歡迎 ${user.name}`;
    } else {
        welcomeUser.textContent = '歡迎使用者';
    }

    // 登出按鈕邏輯
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        const confirmLogout = confirm('是否確認登出？');
        if (confirmLogout) {
            // 清除 localStorage 中的登入資訊
            localStorage.removeItem('user');
            // 跳轉回登入頁面
            window.location.href = 'index.html';
        }
    });
});
