import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://iunfsvxrmneynpnzcjmq.supabase.co'; // 從 Supabase 設定檔取得
//const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmZzdnhybW5leW5wbnpjam1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTMyNzA2MCwiZXhwIjoyMDQ2OTAzMDYwfQ.aM6KVC8kvhkbX2XKMcXp2d06qo6eoSnGbMK4UPQ-rrc'; // 從 Supabase 設定檔取得
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmZzdnhybW5leW5wbnpjam1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMjcwNjAsImV4cCI6MjA0NjkwMzA2MH0.wmJwmGipaJmxs85hag8k5fB2fs6MLOHKj0eXffHVVYI'; // 從 Supabase 設定檔取得

const supabase = createClient(supabaseUrl, supabaseKey);

// 初始化課程計數
async function initializeCounts(courseId) {
    try {
        const { data, error } = await supabase
            .from('reactions')
            .select('p_reaction_type, count')
            .eq('p_course_id', courseId);

        if (error) throw error;

        // 更新 UI
        data.forEach((reaction) => {
            const elementId = `${reaction.p_reaction_type}-count-${courseId}`;
            document.getElementById(elementId).innerText = `${reaction.count}人`;
        });
    } catch (error) {
        console.error('初始化計數失敗:', error);
    }
}

// 更新反應計數
async function updateReaction(courseId, reactionType) {
    try {
        const { error } = await supabase.rpc('increment_reaction', {
            p_course_id: courseId,
            p_reaction_type: reactionType,
        });

        if (error) throw error;

        // 獲取當前的數值並更新 UI
        const countElement = document.getElementById(`${reactionType}-count-${courseId}`);
        const currentCount = parseInt(countElement.innerText, 10);
        countElement.innerText = `${currentCount + 1}人`;
    } catch (error) {
        console.error('更新反應計數失敗:', error);
    }
}

// 綁定按鈕事件
document.addEventListener('DOMContentLoaded', async () => {
    const reactionButtons = document.querySelectorAll('.reaction-btn');
    reactionButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const courseId = parseInt(button.getAttribute('data-course-id'), 10);
            const action = button.getAttribute('data-action');
            updateReaction(courseId, action);
        });
    });

    // 初始化所有課程的計數
    await initializeCounts(1);
    await initializeCounts(2);
});

const { error } = await supabase.rpc('increment_reaction', {
    p_course_id: courseId,  // 傳入對應的函數參數
    p_reaction_type: reactionType,
});

if (error) {
    console.error('RPC 調用失敗:', error);
} else {
    console.log('RPC 成功');
}


// 測試
testRPC(1, 'cool');
