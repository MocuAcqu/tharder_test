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
/*
// 涼+1
function increaseCool(courseId) {
    courseCounts.cool[courseId] += 1;
    document.getElementById(`cool-count-${courseId}`).innerText = courseCounts.cool[courseId] + '人';
}

// 硬+1
function increaseHard(courseId) {
    courseCounts.hard[courseId] += 1;
    document.getElementById(`hard-count-${courseId}`).innerText = courseCounts.hard[courseId] + '人';
}*/

// 為每個課程初始化
initializeCounts(1);
initializeCounts(2);


import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://iunfsvxrmneynpnzcjmq.supabase.co'; // 從 Supabase 設定檔取得
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmZzdnhybW5leW5wbnpjam1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTMyNzA2MCwiZXhwIjoyMDQ2OTAzMDYwfQ.aM6KVC8kvhkbX2XKMcXp2d06qo6eoSnGbMK4UPQ-rrc'; // 從 Supabase 設定檔取得
//const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmZzdnhybW5leW5wbnpjam1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMjcwNjAsImV4cCI6MjA0NjkwMzA2MH0.wmJwmGipaJmxs85hag8k5fB2fs6MLOHKj0eXffHVVYI'; // 從 Supabase 設定檔取得

const supabase = createClient(supabaseUrl, supabaseKey);

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

/*const { data, error } = await supabase.rpc('increment', { course_id: 1, column_name: 'cool_count' });
if (error) {
    console.error(error);
} else {
    console.log('Updated data:', data);
}*/


async function increaseCool(courseId) {
    // 調用 increment 函數更新 cool_count
    const { data, error } = await supabase.rpc('increment', { course_id: courseId, column: 'cool_count' });
        
    if (error) {
        console.error('Error incrementing cool count:', error);
        return;
    }else {
        console.log('Cool count incremented:', data);
    }

    // 更新畫面上的數據
    if (updatedData) {
        document.getElementById(`cool-count-${courseId}`).innerText = `${updatedData[0].cool_count} 人`;
    }
}

async function increaseHard(courseId) {
    // 調用 increment 函數更新 hard_count
    const { data, error } = await supabase.rpc('increment', { course_id: courseId, column: 'hard_count' });

    if (error) {
        console.error('Error incrementing hard count:', error);
        return;
    }

    // 更新畫面上的數據
    if (updatedData) {
        document.getElementById(`hard-count-${courseId}`).innerText = `${updatedData[0].hard_count} 人`;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reaction-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const action = event.target.dataset.action; // 取得涼或硬的動作
            const courseId = event.target.dataset.courseId; // 取得課程 ID

            if (action === 'cool') {
                increaseCool(courseId);
            } else if (action === 'hard') {
                increaseHard(courseId);
            }
        });
    });
});


