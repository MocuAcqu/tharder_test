// 引入 Supabase SDK
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

// Supabase 連線設定
const SUPABASE_URL = 'https://iunfsvxrmneynpnzcjmq.supabase.co'; // 替換成你的 Supabase URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmZzdnhybW5leW5wbnpjam1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMjcwNjAsImV4cCI6MjA0NjkwMzA2MH0.wmJwmGipaJmxs85hag8k5fB2fs6MLOHKj0eXffHVVYI'; // 替換成你的 API 金鑰
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY); // 初始化 Supabase 客戶端

// 用來追蹤用戶的按鈕狀態（例如是否已按過 Cool 或 Hard）
let userReactions = {};

// 等待 DOM 加載完成後執行初始化
document.addEventListener('DOMContentLoaded', () => {
    // 從資料庫加載反應數據
    fetchReactions();

    // 為所有按鈕新增點擊事件
    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (e) => {
            // 根據按鈕的屬性獲取課程 ID 和反應類型
            const courseId = button.getAttribute('data-id');
            const type = button.getAttribute('data-type');
            toggleReaction(courseId, type); // 切換反應狀態
        });
    });
});

// 從資料庫獲取所有課程的反應數據
async function fetchReactions() {
    // 向 Supabase 資料庫請求 `reactions` 表的所有數據
    const { data, error } = await supabase.from('reactions').select('*');

    // 錯誤處理：如果請求失敗，顯示錯誤並結束
    if (error) {
        console.error('Error fetching reactions:', error);
        alert('無法加載資料，請稍後再試');
        return;
    }

    // 資料表為空時的處理：打印警告並結束
    if (!data || data.length === 0) {
        console.warn('No reactions found.');
        return;
    }

    // 遍歷每條記錄並更新對應的頁面元素和狀態
    data.forEach((reaction) => {
        // 獲取對應課程的 Cool 和 Hard 計數的 DOM 元素
        const coolCountElement = document.getElementById(`cool-count-${reaction.id}`);
        const hardCountElement = document.getElementById(`hard-count-${reaction.id}`);

        // 更新計數顯示
        if (coolCountElement) coolCountElement.innerText = `${reaction.cool_count}人`;
        if (hardCountElement) hardCountElement.innerText = `${reaction.hard_count}人`;

        // 初始化用戶對該課程的反應狀態
        userReactions[reaction.id] = { cool: false, hard: false };
    });
}

// 切換某課程的反應狀態（Cool 或 Hard）
async function toggleReaction(courseId, type) {
    // 如果課程 ID 尚未初始化，初始化反應狀態
    if (!userReactions[courseId]) userReactions[courseId] = { cool: false, hard: false };

    // 獲取當前按鈕是否已按過（狀態值）
    const isReacted = userReactions[courseId][type];

    // 構造反應計數的鍵名（例如 `cool_count` 或 `hard_count`）
    const reactionKey = `${type}_count`;

    // 獲取頁面中對應的計數元素
    const reactionCountElement = document.getElementById(`${type}-count-${courseId}`);

    // 從資料庫獲取當前的反應計數
    const { data, error } = await supabase
        .from('reactions')
        .select(reactionKey) // 選擇需要的欄位
        .eq('id', courseId)  // 篩選對應的課程 ID
        .single();           // 確保只有一條記錄返回

    // 錯誤處理：無法獲取數據時提示用戶
    if (error || !data) {
        console.error('Error fetching reaction count:', error);
        alert('無法更新資料，請稍後再試');
        return;
    }

    // 根據當前狀態計算新的反應計數
    const currentCount = data[reactionKey];
    const newCount = isReacted ? currentCount - 1 : currentCount + 1;

    // 更新資料庫中的反應計數
    const { error: updateError } = await supabase
        .from('reactions')
        .update({ [reactionKey]: newCount }) // 動態構造要更新的欄位
        .eq('id', courseId);                // 選擇對應課程

    // 錯誤處理：更新失敗時提示用戶
    if (updateError) {
        console.error('Error updating reaction:', updateError);
        alert('無法更新資料，請稍後再試');
        return;
    }

    // 更新頁面上的計數顯示
    reactionCountElement.innerText = `${newCount}人`;

    // 切換用戶的反應狀態
    userReactions[courseId][type] = !isReacted;

    // 更新按鈕的樣式（加上或移除 "reacted" 樣式）
    const button = document.querySelector(`button[data-id="${courseId}"][data-type="${type}"]`);
    button.classList.toggle('reacted', !isReacted);
}


// 範例課程資料
const courses = [
    { id: 1, name: '作業系統', teacher: 'XXX老師', time: '週一 10:00-12:00', cool: 0, hard: 0 },
    { id: 2, name: '資料結構', teacher: 'YYY老師', time: '週三 14:00-16:00', cool: 0, hard: 0 }
];

// 初始化課程留言版
document.addEventListener('DOMContentLoaded', () => {
    const messageBoard = document.querySelector('.message-board');
    courses.forEach(course => addCourseMessage(messageBoard, course));
});

// 新增課程訊息
function addCourseMessage(container, course) {
    const template = document.getElementById('message-template').content.cloneNode(true);

    // 填充模板資料
    template.querySelector('.course-name').innerText = course.name;
    template.querySelector('.teacher-name').innerText = course.teacher;
    template.querySelector('.course-time').innerText = course.time;

    // 綁定按鈕功能
    template.querySelectorAll('.reaction-btn').forEach(button => {
        button.setAttribute('data-id', course.id);
        button.addEventListener('click', () => {
            toggleReaction(course.id, button.getAttribute('data-type'));
        });
    });

    container.appendChild(template);
}

// 處理反應邏輯
function toggleReaction(courseId, type) {
    const course = courses.find(c => c.id === parseInt(courseId));
    const countElement = document.querySelector(`.reaction-count[data-type="${type}"][data-id="${courseId}"]`);

    if (type === 'cool') {
        course.cool++;
    } else if (type === 'hard') {
        course.hard++;
    }

    // 更新畫面
    countElement.innerText = `${type === 'cool' ? course.cool : course.hard}人`;
}
