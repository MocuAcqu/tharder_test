// 初始化 Supabase
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://iunfsvxrmneynpnzcjmq.supabase.co'; // 從 Supabase 設定檔取得
//const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmZzdnhybW5leW5wbnpjam1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTMyNzA2MCwiZXhwIjoyMDQ2OTAzMDYwfQ.aM6KVC8kvhkbX2XKMcXp2d06qo6eoSnGbMK4UPQ-rrc'; // 從 Supabase 設定檔取得
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmZzdnhybW5leW5wbnpjam1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMjcwNjAsImV4cCI6MjA0NjkwMzA2MH0.wmJwmGipaJmxs85hag8k5fB2fs6MLOHKj0eXffHVVYI'; // 從 Supabase 設定檔取得

const supabase = createClient(supabaseUrl, supabaseKey);

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // 檢查資料庫是否已存在該帳號
    const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id, name, password')
        .eq('username', username);

    if (checkError) {
        alert('伺服器錯誤，請稍後再試');
        console.error('檢查使用者錯誤：', checkError);
        return;
    }

    if (existingUser.length === 0) {
        // 若帳號不存在，則進行註冊
        const { data: newUser, error: signupError } = await supabase
            .from('users')
            .insert([{ name, username, password }])
            .select();

        if (signupError) {
            alert('註冊失敗，請稍後再試');
            console.error('註冊錯誤：', signupError);
            return;
        }

        alert(`註冊成功！歡迎, ${name}!`);
        // 儲存登入狀態和使用者資訊到 localStorage
        localStorage.setItem('user', JSON.stringify(newUser[0]));
        window.location.href = 'index.html'; // 註冊成功後跳轉
    } else {
        // 若帳號存在，檢查密碼
        if (existingUser[0].password === password) {
            alert(`歡迎回來, ${existingUser[0].name}!`);
            // 儲存登入狀態和使用者資訊到 localStorage
            localStorage.setItem('user', JSON.stringify(existingUser[0]));
            window.location.href = 'index_login.html'; // 登入成功後跳轉
        } else {
            alert('登入失敗：密碼錯誤');
        }
    }
});

// 頁面載入時檢查登入狀態
window.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        alert(`歡迎回來, ${user.name}!`);
        window.location.href = 'index_login.html'; // 若已登入，直接跳轉
    }
});