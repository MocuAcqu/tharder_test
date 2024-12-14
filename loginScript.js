import bcrypt from 'https://cdn.skypack.dev/bcryptjs'; // 引入 bcrypt 用於密碼加密
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

    // 密碼加密
    const hashedPassword = bcrypt.hashSync(password, 10);

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
            .insert([{ name, username, password: hashedPassword }])
            .select();

        if (signupError) {
            alert('註冊失敗，請稍後再試');
            console.error('註冊錯誤：', signupError);
            return;
        }

        alert(`註冊成功！歡迎, ${name}!`);
        sessionStorage.setItem('user', JSON.stringify(newUser[0]));
        window.location.href = 'comments.html'; // 註冊成功後跳轉
    } else {
        // 若帳號存在，檢查密碼
        const isValidPassword = bcrypt.compareSync(password, existingUser[0].password);
        if (isValidPassword) {
            alert(`歡迎回來, ${existingUser[0].name}!`);
            sessionStorage.setItem('user', JSON.stringify(existingUser[0]));
            window.location.href = 'comments.html'; // 登入成功後跳轉
        } else {
            alert('登入失敗：密碼錯誤');
        }
    }
});