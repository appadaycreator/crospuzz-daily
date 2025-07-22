// CrosPuzz - Daily Crossword Puzzle Application
// Version: 1.0.0
// Author: AppAdayCreator

// Global variables
let currentLanguage = 'ja';
let currentFontSize = 'base';
let isDarkMode = false;
let gameStartTime = null;
let timerInterval = null;
let hintsRemaining = 3;
let currentCell = null;
let currentDirection = 'across';
let gameState = {
    grid: [],
    userAnswers: {},
    completed: false
};

// Translations
const translations = {
    ja: {
        nav_game: 'ゲーム',
        nav_howto: '使い方',
        nav_privacy: 'プライバシー',
        nav_contact: 'お問い合わせ',
        menu: 'メニュー',
        font_xs: '極小',
        font_sm: '小',
        font_base: '標準',
        font_lg: '大',
        font_xl: '特大',
        game_status: 'ゲーム状況',
        elapsed_time: '経過時間',
        progress: '進捗',
        cells_filled: 'マス入力済み',
        hint: 'ヒント',
        check_answers: '答え合わせ',
        check: '確認',
        reset: 'リセット',
        initialize: '初期化',
        share: 'シェア',
        recommended: 'おすすめ',
        brain_training_books: '脳トレ本特集',
        brain_training_desc: 'クロスワードパズル集',
        dictionary: '国語辞典・辞書',
        dictionary_desc: '語彙力アップに',
        daily_puzzle: '今日のパズル',
        puzzle_date: '2024年1月15日',
        beginner: '初級',
        across: 'ヨコのカギ',
        down: 'タテのカギ',
        congratulations: 'おめでとうございます！',
        puzzle_completed: 'パズルが完成しました！',
        completion_time: '完了時間',
        hints_used: '使用ヒント',
        share_results: '結果をシェア',
        close: '閉じる'
    },
    en: {
        nav_game: 'Game',
        nav_howto: 'How to',
        nav_privacy: 'Privacy',
        nav_contact: 'Contact',
        menu: 'Menu',
        font_xs: 'XS',
        font_sm: 'Small',
        font_base: 'Normal',
        font_lg: 'Large',
        font_xl: 'XL',
        game_status: 'Game Status',
        elapsed_time: 'Elapsed Time',
        progress: 'Progress',
        cells_filled: 'Cells Filled',
        hint: 'Hint',
        check_answers: 'Check Answers',
        check: 'Check',
        reset: 'Reset',
        initialize: 'Initialize',
        share: 'Share',
        recommended: 'Recommended',
        brain_training_books: 'Brain Training Books',
        brain_training_desc: 'Crossword Collections',
        dictionary: 'Dictionary',
        dictionary_desc: 'Improve Vocabulary',
        daily_puzzle: "Today's Puzzle",
        puzzle_date: 'January 15, 2024',
        beginner: 'Beginner',
        across: 'Across',
        down: 'Down',
        congratulations: 'Congratulations!',
        puzzle_completed: 'Puzzle completed!',
        completion_time: 'Completion Time',
        hints_used: 'Hints Used',
        share_results: 'Share Results',
        close: 'Close'
    }
};

// Sample puzzle data
const puzzleData = {
    grid: [
        [1, 2, 3, 4, 5, 6, 7],
        [8, 0, 9, 0, 10, 0, 11],
        [12, 0, 13, 0, 14, 0, 15],
        [16, 0, 17, 0, 18, 0, 19],
        [20, 0, 21, 0, 22, 0, 23],
        [24, 0, 25, 0, 26, 0, 27],
        [28, 29, 30, 31, 32, 33, 34]
    ],
    blocked: [
        [false, false, false, false, false, false, false],
        [false, true, false, true, false, true, false],
        [false, true, false, true, false, true, false],
        [false, true, false, true, false, true, false],
        [false, true, false, true, false, true, false],
        [false, true, false, true, false, true, false],
        [false, false, false, false, false, false, false]
    ],
    answers: {
        1: 'さくら',
        2: 'うめ',
        3: 'もも',
        4: 'すみれ',
        5: 'あじさい',
        6: 'きく',
        7: 'ばら',
        8: 'すいか',
        9: 'いちご',
        10: 'なし',
        11: 'ぶどう',
        12: 'たけ',
        13: 'まつ',
        14: 'かえで',
        15: 'もみじ',
        16: 'ゆり',
        17: 'ひまわり',
        18: 'チューリップ',
        19: 'ひなぎく',
        20: 'あさがお',
        21: 'かすみそう',
        22: 'なでしこ',
        23: 'さくらそう',
        24: 'つつじ',
        25: 'あじさい',
        26: 'きく',
        27: 'ばら',
        28: 'さくら',
        29: 'うめ',
        30: 'もも',
        31: 'すみれ',
        32: 'あじさい',
        33: 'きく',
        34: 'ばら'
    },
    clues: {
        across: {
            1: '春に咲く日本の代表的な花',
            2: '早春に咲く花、白やピンク',
            3: '桃の節句の花',
            4: '紫色の小さな花',
            5: '梅雨時に咲く花',
            6: '秋の花、重陽の節句',
            7: 'トゲのある花、バラ',
            8: '夏の果物、赤くて甘い',
            9: '赤い小さな果物、ショートケーキにのる',
            10: '梨のこと',
            11: '紫色の房になる果物',
            12: '竹のこと',
            13: '松の木',
            14: '秋に紅葉する木',
            15: '秋の紅葉の代表格',
            16: '白や黄色の花、ユリ',
            17: '大きな黄色い花、夏の花',
            18: '春の花、球根植物',
            19: '春の花、デイジー',
            20: '朝顔の花',
            21: '春の花、カスミソウ',
            22: 'ピンクの花、ナデシコ',
            23: '桜草の花',
            24: '春の花、ツツジ',
            25: '梅雨の花、アジサイ',
            26: '秋の花、菊',
            27: 'バラの花',
            28: '日本の春の象徴的な花',
            29: '早春の花、梅',
            30: '桃の花',
            31: '春の花、スミレ',
            32: '梅雨の花',
            33: '秋の花、菊',
            34: 'バラの花'
        },
        down: {
            1: '日本の春の象徴的な花',
            2: '早春の花、梅',
            3: '桃の花',
            4: '春の花、スミレ',
            5: '梅雨の花',
            6: '秋の花、菊',
            7: 'バラの花',
            8: '夏の果物、スイカ',
            9: '赤い果物、イチゴ',
            10: '梨の果物',
            11: '紫色の果物、ブドウ',
            12: '竹の植物',
            13: '松の木',
            14: '紅葉する木、カエデ',
            15: '紅葉の木、モミジ',
            16: 'ユリの花',
            17: 'ヒマワリの花',
            18: 'チューリップの花',
            19: 'ヒナギクの花',
            20: 'アサガオの花',
            21: 'カスミソウの花',
            22: 'ナデシコの花',
            23: 'サクラソウの花',
            24: 'ツツジの花',
            25: 'アジサイの花',
            26: 'キクの花',
            27: 'バラの花',
            28: '春の桜',
            29: '春の梅',
            30: '春の桃',
            31: '春のスミレ',
            32: '梅雨のアジサイ',
            33: '秋のキク',
            34: '春のバラ'
        }
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('CrosPuzz アプリケーション開始');
    loadSettings();
    initializeGame();
    
    // PWA service worker registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed'));
    }
});

// Load saved settings
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('crospuzz_settings') || '{}');
    
    if (settings.language) {
        currentLanguage = settings.language;
    }
    
    if (settings.fontSize) {
        currentFontSize = settings.fontSize;
        setFontSize(currentFontSize);
    }
    
    if (settings.darkMode) {
        isDarkMode = settings.darkMode;
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        }
    }
    
    updateTranslations();
    console.log('設定を読み込み:', settings);
}

// Save settings
function saveSettings() {
    const settings = {
        language: currentLanguage,
        fontSize: currentFontSize,
        darkMode: isDarkMode
    };
    localStorage.setItem('crospuzz_settings', JSON.stringify(settings));
    console.log('設定を保存:', settings);
}

// Initialize game
function initializeGame(forceInit = false) {
    if (forceInit) {
        // 完全初期化: ローカルストレージと状態をクリア
        localStorage.removeItem('crospuzz_game_state');
        localStorage.removeItem('crospuzz_settings');
        gameStartTime = null;
        hintsRemaining = 3;
        currentCell = null;
        currentDirection = 'across';
        // 設定もデフォルトに
        currentLanguage = 'ja';
        currentFontSize = 'base';
        isDarkMode = false;
        document.documentElement.classList.remove('dark');
        document.body.className = document.body.className.replace(/font-size-\w+/, '');
        document.body.classList.add('font-size-base');
        updateTranslations();
    }
    createGrid();
    createClues();
    loadGameState();
    updateProgress();
    startTimer();
    document.getElementById('hintsRemaining').textContent = hintsRemaining;
    if (forceInit) {
        alert(currentLanguage === 'ja' ? '全て初期化しました' : 'All data has been initialized');
    }
}

// Create crossword grid
function createGrid() {
    const grid = document.getElementById('crosswordGrid');
    grid.innerHTML = '';
    
    for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 7; col++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.className = 'crossword-cell';
            cell.id = `cell-${row}-${col}`;
            cell.setAttribute('inputmode', 'text');
            cell.setAttribute('lang', 'ja');
            cell.setAttribute('autocomplete', 'off');
            cell.setAttribute('autocorrect', 'off');
            cell.setAttribute('autocapitalize', 'off');
            cell.setAttribute('spellcheck', 'false');
            
            if (puzzleData.blocked[row][col]) {
                cell.className += ' blocked';
                cell.disabled = true;
            } else {
                cell.addEventListener('input', handleCellInput);
                cell.addEventListener('focus', handleCellFocus);
                cell.addEventListener('keydown', handleKeydown);
            }
            
            // Add number if it's a numbered cell
            const number = puzzleData.grid[row][col];
            if (number > 0) {
                const numberSpan = document.createElement('span');
                numberSpan.className = 'cell-number';
                numberSpan.textContent = number;
                
                // Create wrapper for numbered cell
                const wrapper = document.createElement('div');
                wrapper.style.position = 'relative';
                wrapper.appendChild(cell);
                wrapper.appendChild(numberSpan);
                grid.appendChild(wrapper);
            } else {
                grid.appendChild(cell);
            }
        }
    }
    console.log('グリッド作成完了');
}

// Create clues
function createClues() {
    const acrossContainer = document.getElementById('acrossClues');
    const downContainer = document.getElementById('downClues');
    
    // Across clues
    acrossContainer.innerHTML = '';
    Object.entries(puzzleData.clues.across).forEach(([number, clue]) => {
        const clueElement = document.createElement('div');
        clueElement.className = 'flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors clue-item';
        clueElement.onclick = () => highlightWord(parseInt(number), 'across');
        clueElement.innerHTML = `
            <span class="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 rounded-full flex items-center justify-center text-xs font-bold">${number}</span>
            <span class="text-gray-700 dark:text-gray-300">${clue}</span>
        `;
        acrossContainer.appendChild(clueElement);
    });
    
    // Down clues
    downContainer.innerHTML = '';
    Object.entries(puzzleData.clues.down).forEach(([number, clue]) => {
        const clueElement = document.createElement('div');
        clueElement.className = 'flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors clue-item';
        clueElement.onclick = () => highlightWord(parseInt(number), 'down');
        clueElement.innerHTML = `
            <span class="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 rounded-full flex items-center justify-center text-xs font-bold">${number}</span>
            <span class="text-gray-700 dark:text-gray-300">${clue}</span>
        `;
        downContainer.appendChild(clueElement);
    });
    
    console.log('手がかり作成完了');
}

// Handle cell input
function handleCellInput(event) {
    const cell = event.target;
    const value = event.target.value;
    
    // Only allow Japanese characters or letters
    if (value && !/[あ-んア-ンA-Za-z\u3040-\u309F\u30A0-\u30FF]/.test(value)) {
        event.target.value = '';
        return;
    }
    
    // Convert to hiragana if it's katakana
    let processedValue = value;
    if (value && /[ア-ン]/.test(value)) {
        processedValue = value.replace(/[ア-ン]/g, function(match) {
            return String.fromCharCode(match.charCodeAt(0) - 0x60);
        });
    }
    
    event.target.value = processedValue;
    saveGameState();
    updateProgress();
    
    // Move to next cell
    if (processedValue) {
        moveToNextCell(cell);
    }
    
    console.log(`セル入力: ${cell.id} = ${processedValue}`);
}

// Handle cell focus
function handleCellFocus(event) {
    currentCell = event.target;
    highlightCurrentWord();
}

// Handle keydown events
function handleKeydown(event) {
    const cell = event.target;
    
    switch(event.key) {
        case 'ArrowUp':
            event.preventDefault();
            moveFocus(cell, -1, 0);
            break;
        case 'ArrowDown':
            event.preventDefault();
            moveFocus(cell, 1, 0);
            break;
        case 'ArrowLeft':
            event.preventDefault();
            moveFocus(cell, 0, -1);
            break;
        case 'ArrowRight':
            event.preventDefault();
            moveFocus(cell, 0, 1);
            break;
        case 'Backspace':
            if (!cell.value) {
                event.preventDefault();
                moveToPreviousCell(cell);
            }
            break;
        case 'Tab':
            event.preventDefault();
            currentDirection = currentDirection === 'across' ? 'down' : 'across';
            highlightCurrentWord();
            break;
    }
}

// Move focus to adjacent cell
function moveFocus(currentCell, rowDelta, colDelta) {
    const [currentRow, currentCol] = currentCell.id.split('-').slice(1).map(Number);
    const newRow = currentRow + rowDelta;
    const newCol = currentCol + colDelta;
    
    if (newRow >= 0 && newRow < 7 && newCol >= 0 && newCol < 7) {
        const newCell = document.getElementById(`cell-${newRow}-${newCol}`);
        if (newCell && !newCell.disabled) {
            newCell.focus();
        }
    }
}

// Move to next cell in current direction
function moveToNextCell(cell) {
    const [row, col] = cell.id.split('-').slice(1).map(Number);
    
    if (currentDirection === 'across') {
        moveFocus(cell, 0, 1);
    } else {
        moveFocus(cell, 1, 0);
    }
}

// Move to previous cell
function moveToPreviousCell(cell) {
    const [row, col] = cell.id.split('-').slice(1).map(Number);
    
    if (currentDirection === 'across') {
        moveFocus(cell, 0, -1);
    } else {
        moveFocus(cell, -1, 0);
    }
}

// Highlight current word
function highlightCurrentWord() {
    // Remove existing highlights
    document.querySelectorAll('.crossword-cell').forEach(cell => {
        cell.classList.remove('highlighted', 'active');
    });
    
    if (currentCell) {
        currentCell.classList.add('active');
        // Add highlighting logic for current word
    }
}

// Highlight word by number and direction
function highlightWord(number, direction) {
    document.querySelectorAll('.crossword-cell').forEach(cell => {
        cell.classList.remove('highlighted', 'active');
    });
    
    currentDirection = direction;
    console.log(`単語ハイライト: ${number} (${direction})`);
}

// Update progress
function updateProgress() {
    const cells = document.querySelectorAll('.crossword-cell:not(.blocked)');
    const filledCells = Array.from(cells).filter(cell => cell.value.trim() !== '').length;
    const totalCells = cells.length;
    const progress = Math.round((filledCells / totalCells) * 100);
    
    // Update progress bar
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const mobileProgress = document.getElementById('mobileProgress');
    const filledCellsSpan = document.getElementById('filledCells');
    const totalCellsSpan = document.getElementById('totalCells');
    
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${progress}%`;
    if (mobileProgress) mobileProgress.textContent = `${progress}%`;
    if (filledCellsSpan) filledCellsSpan.textContent = filledCells;
    if (totalCellsSpan) totalCellsSpan.textContent = totalCells;
    
    console.log(`進捗更新: ${filledCells}/${totalCells} (${progress}%)`);
}

// Start timer
function startTimer() {
    if (gameStartTime === null) {
        gameStartTime = Date.now();
    }
    
    timerInterval = setInterval(updateTimer, 1000);
    console.log('タイマー開始');
}

// Update timer display
function updateTimer() {
    if (gameStartTime === null) return;
    
    const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const timer = document.getElementById('timer');
    const mobileTimer = document.getElementById('mobileTimer');
    
    if (timer) timer.textContent = timeString;
    if (mobileTimer) mobileTimer.textContent = timeString;
}

// Show hint
function showHint() {
    if (hintsRemaining <= 0) {
        alert(currentLanguage === 'ja' ? 'ヒントがありません' : 'No hints remaining');
        return;
    }
    
    hintsRemaining--;
    document.getElementById('hintsRemaining').textContent = hintsRemaining;
    
    // Show a random hint (simplified)
    const hints = [
        currentLanguage === 'ja' ? '最初の文字を確認してみてください' : 'Check the first letter',
        currentLanguage === 'ja' ? '短い言葉から始めてみてください' : 'Try starting with short words',
        currentLanguage === 'ja' ? '交差する文字を手がかりにしてください' : 'Use intersecting letters as clues'
    ];
    
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    alert(randomHint);
    
    console.log(`ヒント使用: ${3 - hintsRemaining}/3`);
}

// Check answers
function checkAnswers() {
    console.log('答え合わせ開始');
    let correctCount = 0;
    let totalAnswers = 0;
    
    // Simple validation (in real app, would check against puzzle data)
    const cells = document.querySelectorAll('.crossword-cell:not(.blocked)');
    cells.forEach(cell => {
        if (cell.value.trim() !== '') {
            totalAnswers++;
            // Simulate correctness check
            if (Math.random() > 0.3) { // 70% correct rate for demo
                correctCount++;
                cell.classList.add('pulse-success');
                setTimeout(() => cell.classList.remove('pulse-success'), 600);
            }
        }
    });
    
    if (correctCount === totalAnswers && totalAnswers > 20) {
        setTimeout(() => showSuccessModal(), 1000);
    }
    
    console.log(`答え合わせ結果: ${correctCount}/${totalAnswers}`);
}

// Reset game
function resetGame() {
    if (confirm(currentLanguage === 'ja' ? 'ゲームをリセットしますか？' : 'Reset game?')) {
        document.querySelectorAll('.crossword-cell:not(.blocked)').forEach(cell => {
            cell.value = '';
            cell.classList.remove('highlighted', 'active', 'pulse-success');
        });
        
        gameStartTime = Date.now();
        hintsRemaining = 3;
        document.getElementById('hintsRemaining').textContent = hintsRemaining;
        updateProgress();
        saveGameState();
        
        console.log('ゲームリセット');
    }
}

// Share results
function shareResults() {
    const elapsed = gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0;
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const hintsUsed = 3 - hintsRemaining;
    
    const shareText = currentLanguage === 'ja' 
        ? `CrosPuzzで今日のクロスワードパズルに挑戦！\n時間: ${timeString}\nヒント使用: ${hintsUsed}回\n\n#CrosPuzz #クロスワード #脳トレ\nhttps://appadaycreator.github.io/crospuzz-daily/`
        : `Just played CrosPuzz daily crossword!\nTime: ${timeString}\nHints used: ${hintsUsed}\n\n#CrosPuzz #Crossword #BrainTraining\nhttps://appadaycreator.github.io/crospuzz-daily/`;
    
    if (navigator.share) {
        navigator.share({
            title: 'CrosPuzz',
            text: shareText
        });
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            alert(currentLanguage === 'ja' ? 'クリップボードにコピーしました' : 'Copied to clipboard');
        });
    }
    
    console.log('結果シェア');
}

// Show success modal
function showSuccessModal() {
    const elapsed = gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0;
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const hintsUsed = 3 - hintsRemaining;
    
    document.getElementById('finalTime').textContent = timeString;
    document.getElementById('hintsUsed').textContent = hintsUsed;
    document.getElementById('successModal').classList.remove('hidden');
    
    // Stop timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    console.log('成功モーダル表示');
}

// Close success modal
function closeSuccessModal() {
    document.getElementById('successModal').classList.add('hidden');
}

// Save game state
function saveGameState() {
    const state = {
        userAnswers: {},
        startTime: gameStartTime,
        hintsRemaining: hintsRemaining
    };
    
    document.querySelectorAll('.crossword-cell:not(.blocked)').forEach(cell => {
        if (cell.value.trim() !== '') {
            state.userAnswers[cell.id] = cell.value;
        }
    });
    
    localStorage.setItem('crospuzz_game_state', JSON.stringify(state));
}

// Load game state
function loadGameState() {
    const savedState = localStorage.getItem('crospuzz_game_state');
    if (savedState) {
        const state = JSON.parse(savedState);
        gameStartTime = state.startTime || Date.now();
        hintsRemaining = state.hintsRemaining || 3;
        
        Object.entries(state.userAnswers || {}).forEach(([cellId, value]) => {
            const cell = document.getElementById(cellId);
            if (cell) {
                cell.value = value;
            }
        });
        
        document.getElementById('hintsRemaining').textContent = hintsRemaining;
        console.log('ゲーム状態復元');
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const sidebar = document.getElementById('mobileSidebar');
    
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        setTimeout(() => {
            sidebar.classList.remove('translate-x-full');
        }, 10);
    } else {
        sidebar.classList.add('translate-x-full');
        setTimeout(() => {
            menu.classList.add('hidden');
        }, 300);
    }
}

// Toggle language
function toggleLanguage() {
    currentLanguage = currentLanguage === 'ja' ? 'en' : 'ja';
    document.documentElement.lang = currentLanguage;
    updateTranslations();
    saveSettings();
    console.log(`言語切替: ${currentLanguage}`);
}

// Update translations
function updateTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
}

// Toggle dark mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    saveSettings();
    console.log(`ダークモード: ${isDarkMode ? 'ON' : 'OFF'}`);
}

// Toggle font size menu
function toggleFontSizeMenu() {
    const menu = document.getElementById('fontSizeMenu');
    menu.classList.toggle('hidden');
}

// Set font size
function setFontSize(size) {
    document.body.className = document.body.className.replace(/font-size-\w+/, '');
    document.body.classList.add(`font-size-${size}`);
    currentFontSize = size;
    saveSettings();
    
    // Hide menu
    document.getElementById('fontSizeMenu').classList.add('hidden');
    
    console.log(`フォントサイズ変更: ${size}`);
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('#fontSizeMenu') && !event.target.closest('[onclick*="toggleFontSizeMenu"]')) {
        document.getElementById('fontSizeMenu').classList.add('hidden');
    }
});

// PWA install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('PWAインストール可能');
});

// Console logging for debugging
console.log('🧩 CrosPuzz - Daily Crossword Puzzle');
console.log('📱 PWA Ready');
console.log('🌐 Multi-language Support');
console.log('🎨 Responsive Design');
console.log('♿ Accessibility Features');
console.log('📊 Progress Tracking');
console.log('💾 Local Storage');
console.log('🔄 Service Worker Ready'); 