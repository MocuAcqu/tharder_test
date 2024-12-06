// 初始化 Supabase
// 引入 Supabase 套件
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase 初始化
const SUPABASE_URL = 'https://iunfsvxrmneynpnzcjmq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmZzdnhybW5leW5wbnpjam1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMjcwNjAsImV4cCI6MjA0NjkwMzA2MH0.wmJwmGipaJmxs85hag8k5fB2fs6MLOHKj0eXffHVVYI';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 初始化數據
async function fetchData() {
    const { data, error } = await supabase.from('course_feedback').select('*');
    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    data.forEach(record => {
        document.getElementById(`cool-count-${record.id}`).textContent = `${record.cool_count}人`;
        document.getElementById(`hard-count-${record.id}`).textContent = `${record.hard_count}人`;
    });
}

// 更新數據
async function updateReaction(id, type) {
    const column = type === 'cool' ? 'cool_count' : 'hard_count';
    const { data, error } = await supabase.rpc('increment_reaction', { row_id: id, column_name: column });

    if (error) {
        console.error('Error updating reaction:', error);
        return;
    }

    // 更新前端數據
    if (type === 'cool') {
        document.getElementById(`cool-count-${id}`).textContent = `${data[0].cool_count}人`;
    } else {
        document.getElementById(`hard-count-${id}`).textContent = `${data[0].hard_count}人`;
    }
}

// 涼+1 按鈕的處理函數
window.increaseCool = async function (id) {
    await updateReaction(id, 'cool');
};

// 硬+1 按鈕的處理函數
window.increaseHard = async function (id) {
    await updateReaction(id, 'hard');
};

// 頁面加載時初始化
document.addEventListener('DOMContentLoaded', fetchData);
