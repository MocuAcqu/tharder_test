// 使用物件來存儲每個課程的涼和硬計數
let courseCounts = {
    cool: {},
    hard: {}
};

// 初始化計數值
function initializeCounts(courseId) {
    courseCounts.cool[courseId] = 0;
    courseCounts.hard[courseId] = 0;
}


// 為每個課程初始化
initializeCounts(1);
initializeCounts(2);


import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

// Supabase URL 和 API 密鑰
const SUPABASE_URL = 'https://iunfsvxrmneynpnzcjmq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmZzdnhybW5leW5wbnpjam1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMjcwNjAsImV4cCI6MjA0NjkwMzA2MH0.wmJwmGipaJmxs85hag8k5fB2fs6MLOHKj0eXffHVVYI';

// 初始化 Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let userReactions = {}; // 用於追蹤用戶是否按過按鈕

async function fetchReactions() {
    const { data, error } = await supabase.from('reactions').select('*');
    if (error) {
        console.error('Error fetching reactions:', error);
        return;
    }

    data.forEach((reaction) => {
        const coolCountElement = document.getElementById(`cool-count-${reaction.id}`);
        const hardCountElement = document.getElementById(`hard-count-${reaction.id}`);
        if (coolCountElement) coolCountElement.innerText = `${reaction.cool_count}人`;
        if (hardCountElement) hardCountElement.innerText = `${reaction.hard_count}人`;
        userReactions[reaction.id] = { cool: false, hard: false };
    });
}

async function toggleReaction(courseId, type) {
    if (!userReactions[courseId]) userReactions[courseId] = { cool: false, hard: false };

    const isReacted = userReactions[courseId][type];
    const reactionKey = `${type}_count`;
    const reactionCountElement = document.getElementById(`${type}-count-${courseId}`);

    const { data, error } = await supabase
        .from('reactions')
        .select(reactionKey)
        .eq('id', courseId)
        .single();

    if (error || !data) {
        console.error('Error fetching reaction count:', error);
        return;
    }

    const currentCount = data[reactionKey];
    const newCount = isReacted ? currentCount - 1 : currentCount + 1;

    // 更新數據庫
    const { error: updateError } = await supabase
        .from('reactions')
        .update({ [reactionKey]: newCount })
        .eq('id', courseId);

    if (updateError) {
        console.error('Error updating reaction:', updateError);
        return;
    }

    // 更新頁面和按鈕狀態
    reactionCountElement.innerText = `${newCount}人`;
    userReactions[courseId][type] = !isReacted;

    const button = document.querySelector(`button[data-id="${courseId}"][data-type="${type}"]`);
    button.classList.toggle('reacted', !isReacted); // 切換按鈕樣式
}

// 初始化
fetchReactions();