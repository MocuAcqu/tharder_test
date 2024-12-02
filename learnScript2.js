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

// 涼+1
function increaseCool(courseId) {
    courseCounts.cool[courseId] += 1;
    document.getElementById(`cool-count-${courseId}`).innerText = courseCounts.cool[courseId] + '人';
}

// 硬+1
function increaseHard(courseId) {
    courseCounts.hard[courseId] += 1;
    document.getElementById(`hard-count-${courseId}`).innerText = courseCounts.hard[courseId] + '人';
}

// 為每個課程初始化
initializeCounts(1);
initializeCounts(2);


import { createClient } from '@supabase/supabase-js';

// Supabase URL 和 API 密鑰
const SUPABASE_URL = 'https://iunfsvxrmneynpnzcjmq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmZzdnhybW5leW5wbnpjam1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMjcwNjAsImV4cCI6MjA0NjkwMzA2MH0.wmJwmGipaJmxs85hag8k5fB2fs6MLOHKj0eXffHVVYI';

// 初始化 Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchReactions() {
    const { data, error } = await supabase
        .from('reactions')
        .select('*');

    if (error) {
        console.error('Error fetching reactions:', error);
        return;
    }

    // 將每門課程的數據顯示在頁面上
    data.forEach((reaction) => {
        document.getElementById(`cool-count-${reaction.id}`).innerText = `${reaction.cool_count} 人`;
        document.getElementById(`hard-count-${reaction.id}`).innerText = `${reaction.hard_count} 人`;
    });
}

fetchReactions();

async function increaseCool(courseId) {
    // 更新 cool_count 數量
    const { data, error } = await supabase
        .from('reactions')
        .update({ cool_count: supabase.raw('cool_count + 1') }) // 使用 raw 表示數值加 1
        .eq('id', courseId);

    if (error) {
        console.error('Error updating cool count:', error);
        return;
    }

    // 更新畫面上的數據
    document.getElementById(`cool-count-${courseId}`).innerText = `${data[0].cool_count} 人`;
}
