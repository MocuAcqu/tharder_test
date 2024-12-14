// 初始化 Supabase
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://iunfsvxrmneynpnzcjmq.supabase.co'; // 從 Supabase 設定檔取得
//const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmZzdnhybW5leW5wbnpjam1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTMyNzA2MCwiZXhwIjoyMDQ2OTAzMDYwfQ.aM6KVC8kvhkbX2XKMcXp2d06qo6eoSnGbMK4UPQ-rrc'; // 從 Supabase 設定檔取得
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmZzdnhybW5leW5wbnpjam1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMjcwNjAsImV4cCI6MjA0NjkwMzA2MH0.wmJwmGipaJmxs85hag8k5fB2fs6MLOHKj0eXffHVVYI'; // 從 Supabase 設定檔取得

const supabase = createClient(supabaseUrl, supabaseKey);
// 登入邏輯
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password);

    if (error || data.length === 0) {
        alert('登入失敗：帳號或密碼錯誤');
    } else {
        alert(`歡迎回來, ${data[0].name}!`);
        // 儲存使用者資訊於 sessionStorage
        sessionStorage.setItem('user', JSON.stringify(data[0]));
        window.location.href = 'comments.html'; // 登入成功後跳轉至留言頁面
    }
});

// 註冊邏輯
document.getElementById('signup-btn').addEventListener('click', async () => {
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!name || !username || !password) {
        alert('請完整填寫姓名、帳號與密碼');
        return;
    }

    const { data, error } = await supabase
        .from('users')
        .insert([{ name, username, password }]);

    if (error) {
        alert('註冊失敗，可能帳號已被使用');
    } else {
        alert('註冊成功，請重新登入');
    }
});