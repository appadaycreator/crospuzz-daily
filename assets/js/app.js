// CrosPuzz - Daily Crossword Puzzle Application
// Version: 1.0.0
// Author: AppAdayCreator

// パズルデータ
const puzzles = [
  {
    title: "日本のシンボル",
    words: [
      { answer: "さくら", clue: "春に咲く花" },
      { answer: "ふじさん", clue: "日本一高い山" },
      { answer: "すし", clue: "酢飯とネタ" },
      { answer: "まつり", clue: "伝統的なイベント" },
      { answer: "きもの", clue: "和装" },
      { answer: "あめ", clue: "空から降る" },
      { answer: "ゆき", clue: "冬の白い結晶" }
    ]
  },
  {
    title: "日本の食べ物",
    words: [
      { answer: "らーめん", clue: "人気の麺料理" },
      { answer: "すし", clue: "酢飯とネタ" },
      { answer: "てんぷら", clue: "揚げ衣がサクサク" },
      { answer: "おにぎり", clue: "三角や丸で握る" },
      { answer: "うどん", clue: "太めの小麦麺" }
    ]
  },
  {
    title: "動物",
    words: [
      { answer: "ねこ", clue: "気まぐれなペット" },
      { answer: "いぬ", clue: "忠実なペット" },
      { answer: "きつね", clue: "狐" },
      { answer: "たぬき", clue: "ぽんぽこ" },
      { answer: "うさぎ", clue: "耳が長い" }
    ]
  },
  {
    title: "スポーツ",
    words: [
      { answer: "やきゅう", clue: "9人で戦う球技" },
      { answer: "さっかー", clue: "11人で戦う球技" },
      { answer: "すもう", clue: "土俵での格闘技" },
      { answer: "てにす", clue: "ラケットを使う" },
      { answer: "ごるふ", clue: "18ホールを回る" }
    ]
  },
  {
    title: "乗り物",
    words: [
      { answer: "しんかんせん", clue: "日本の高速鉄道" },
      { answer: "じてんしゃ", clue: "ペダルをこぐ" },
      { answer: "くるま", clue: "四輪" },
      { answer: "ひこうき", clue: "空を飛ぶ" },
      { answer: "ふね", clue: "海を進む" }
    ]
  },
  {
    title: "季節",
    words: [
      { answer: "はる", clue: "桜の季節" },
      { answer: "なつ", clue: "海水浴" },
      { answer: "あき", clue: "紅葉" },
      { answer: "ふゆ", clue: "雪" },
      { answer: "つゆ", clue: "梅雨" }
    ]
  },
  {
    title: "都道府県",
    words: [
      { answer: "とうきょう", clue: "日本の首都" },
      { answer: "おおさか", clue: "関西の大都市" },
      { answer: "ほっかいどう", clue: "日本最北の道" },
      { answer: "ふくおか", clue: "博多ラーメン" },
      { answer: "ひろしま", clue: "平和記念公園" }
    ]
  },
  {
    title: "色",
    words: [
      { answer: "あか", clue: "情熱の色" },
      { answer: "あお", clue: "空や海の色" },
      { answer: "きいろ", clue: "ひまわりの色" },
      { answer: "みどり", clue: "草木の色" },
      { answer: "しろ", clue: "雪の色" },
      { answer: "くろ", clue: "夜の色" },
      { answer: "ちゃいろ", clue: "木の色" }
    ]
  },
  {
    title: "家電",
    words: [
      { answer: "でんしれんじ", clue: "チン！" },
      { answer: "そうじき", clue: "吸い取る" },
      { answer: "せんたくき", clue: "衣類を洗う" },
      { answer: "でんき", clue: "明かり" },
      { answer: "てれび", clue: "映像を見る" }
    ]
  },
  {
    title: "IT 用語",
    words: [
      { answer: "くらうど", clue: "雲のサービス" },
      { answer: "さーばー", clue: "サービスを提供" },
      { answer: "ふぁいあうぉーる", clue: "防火壁" },
      { answer: "でーたべーす", clue: "DB" },
      { answer: "ぷろぐらむ", clue: "コード" }
    ]
  }
];

// 動的パズル生成ロジック
function createEmptyGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(""));
}

function canPlace(grid, word, r, c, dir) {
  const size = grid.length;
  
  if (dir === "across") {
    if (c + word.length > size) return false;
    
    // 日本語クロスワード基本ルール: 単語の前後に文字がないかチェック
    if (c > 0 && grid[r][c - 1] !== "" && grid[r][c - 1] !== "#") return false;
    if (c + word.length < size && grid[r][c + word.length] !== "" && grid[r][c + word.length] !== "#") return false;
    
    for (let i = 0; i < word.length; i++) {
      const cell = grid[r][c + i];
      if (cell && cell !== word[i]) return false;
      if (cell === "#") return false;
      
      // 交差点ではヨコ・タテ双方の文字が一致していなければならない
      if (r > 0 && grid[r - 1][c + i] !== "" && grid[r - 1][c + i] !== "#") {
        if (i === 0 || i === word.length - 1) return false; // 端の文字は交差できない
      }
      if (r < size - 1 && grid[r + 1][c + i] !== "" && grid[r + 1][c + i] !== "#") {
        if (i === 0 || i === word.length - 1) return false; // 端の文字は交差できない
      }
    }
    return true;
  }
  
  // down
  if (r + word.length > size) return false;
  
  // 日本語クロスワード基本ルール: 単語の前後に文字がないかチェック
  if (r > 0 && grid[r - 1][c] !== "" && grid[r - 1][c] !== "#") return false;
  if (r + word.length < size && grid[r + word.length][c] !== "" && grid[r + word.length][c] !== "#") return false;
  
  for (let i = 0; i < word.length; i++) {
    const cell = grid[r + i][c];
    if (cell && cell !== word[i]) return false;
    if (cell === "#") return false;
    
    // 交差点ではヨコ・タテ双方の文字が一致していなければならない
    if (c > 0 && grid[r + i][c - 1] !== "" && grid[r + i][c - 1] !== "#") {
      if (i === 0 || i === word.length - 1) return false; // 端の文字は交差できない
    }
    if (c < size - 1 && grid[r + i][c + 1] !== "" && grid[r + i][c + 1] !== "#") {
      if (i === 0 || i === word.length - 1) return false; // 端の文字は交差できない
    }
  }
  return true;
}

function placeWord(grid, word, r, c, dir) {
  if (dir === "across") {
    for (let i = 0; i < word.length; i++) grid[r][c + i] = word[i];
  } else {
    for (let i = 0; i < word.length; i++) grid[r + i][c] = word[i];
  }
}

function generatePuzzle(puzzle) {
  const longest = Math.max(...puzzle.words.map(w => w.answer.length));
  let size = Math.max(9, longest + 4);
  let grid = createEmptyGrid(size);

  const words = [...puzzle.words].sort((a, b) => b.answer.length - a.answer.length);

  // 1語目を中央横配置
  const first = words[0].answer;
  const startCol = Math.floor((size - first.length) / 2);
  const midRow = Math.floor(size / 2);
  placeWord(grid, first, midRow, startCol, "across");
  const placed = [ { ...words[0], row: midRow, col: startCol, dir: "across" } ];

  // 残りを順に試行
  outer: for (let wi = 1; wi < words.length; wi++) {
    const w = words[wi].answer;
    let placedWord = false;
    
    // 既に配置された単語との交差を試行
    for (const placedWord of placed) {
      for (let pi = 0; pi < placedWord.answer.length; pi++) {
        const pChar = placedWord.answer[pi];
        for (let wiChar = 0; wiChar < w.length; wiChar++) {
          if (w[wiChar] !== pChar) continue;
          
          let r, c, dir;
          if (placedWord.dir === "across") {
            dir = "down";
            r = placedWord.row - wiChar;
            c = placedWord.col + pi;
          } else {
            dir = "across";
            r = placedWord.row + pi;
            c = placedWord.col - wiChar;
          }
          
          // 境界チェック
          if (r < 0 || c < 0 || 
              (dir === "across" && c + w.length > size) ||
              (dir === "down" && r + w.length > size)) continue;
          
          // 配置可能かチェック
          if (canPlace(grid, w, r, c, dir)) {
            placeWord(grid, w, r, c, dir);
            placed.push({ ...words[wi], row: r, col: c, dir, answer: w });
            placedWord = true;
            break outer;
          }
        }
        if (placedWord) break;
      }
      if (placedWord) break;
    }
    
    // 交差できなかった場合は独立して配置
    if (!placedWord) {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (canPlace(grid, w, r, c, "across")) {
            placeWord(grid, w, r, c, "across");
            placed.push({ ...words[wi], row: r, col: c, dir: "across", answer: w });
            break outer;
          }
        }
      }
    }
  }

  // 未使用セルを黒マスに
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === "") grid[r][c] = "#";
    }
  }

  // クロスワードビルダー.comのルールに従った番号付与
  let num = 1;
  const numbering = {};
  const across = [], down = [];
  
  // ステップ①：語頭となるマス目すべてに〇印を付ける
  const startPositions = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === "#") continue;
      
      // ヨコの語頭判定：左側が黒マスまたは盤外で、右側に文字がある（2文字以上）
      let acrossWordLength = 0;
      if (c < size - 1 && grid[r][c+1] !== "#") {
        let col = c;
        while (col < size && grid[r][col] !== "#") {
          acrossWordLength++;
          col++;
        }
      }
      const isStartAcross = (c === 0 || grid[r][c-1] === "#") && acrossWordLength >= 2;
      
      // タテの語頭判定：上側が黒マスまたは盤外で、下側に文字がある（2文字以上）
      let downWordLength = 0;
      if (r < size - 1 && grid[r+1][c] !== "#") {
        let row = r;
        while (row < size && grid[row][c] !== "#") {
          downWordLength++;
          row++;
        }
      }
      const isStartDown = (r === 0 || grid[r-1][c] === "#") && downWordLength >= 2;
      
      if (isStartAcross || isStartDown) {
        startPositions.push({ row: r, col: c, across: isStartAcross, down: isStartDown });
      }
    }
  }
  
  // ステップ②：「Z」の順（左上から右下へ）に数字を振り当てる
  startPositions.sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });
  
  startPositions.forEach(pos => {
    numbering[`${pos.row},${pos.col}`] = num++;
  });
  
  // ステップ③：カギ（ヒント文）のリストを作る
  startPositions.forEach(pos => {
    const no = numbering[`${pos.row},${pos.col}`];
    
    // ヨコの単語を検索
    if (pos.across) {
      let word = "";
      let col = pos.col;
      while (col < size && grid[pos.row][col] !== "#") {
        word += grid[pos.row][col];
        col++;
      }
      if (word.length > 1) {
        const placedWord = placed.find(w => w.row === pos.row && w.col === pos.col && w.dir === "across");
        if (placedWord) {
          across.push({ number: no, clue: placedWord.clue, answer: placedWord.answer });
        }
      }
    }
    
    // タテの単語を検索
    if (pos.down) {
      let word = "";
      let row = pos.row;
      while (row < size && grid[row][pos.col] !== "#") {
        word += grid[row][pos.col];
        row++;
      }
      if (word.length > 1) {
        const placedWord = placed.find(w => w.row === pos.row && w.col === pos.col && w.dir === "down");
        if (placedWord) {
          down.push({ number: no, clue: placedWord.clue, answer: placedWord.answer });
        }
      }
    }
  });

  // 日本語クロスワード基本ルールの制約チェック
  const constraints = validateJapaneseCrosswordRules(grid);
  if (!constraints.valid) {
    console.warn('日本語クロスワード基本ルール違反:', constraints.violations);
  }

  return { grid, across, down, constraints, numbering };
}

// クロスワードビルダー.comのルールに従った制約チェック関数
function validateJapaneseCrosswordRules(grid) {
  const size = grid.length;
  const violations = [];
  
  // 1. 黒マスをタテやヨコに連続させない
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === "#") {
        // 横方向の連続チェック
        let horizontalCount = 1;
        for (let i = c + 1; i < size && grid[r][i] === "#"; i++) {
          horizontalCount++;
        }
        if (horizontalCount >= 2) {
          violations.push(`横方向に黒マスが${horizontalCount}マス連続 (${r},${c})`);
        }
        
        // 縦方向の連続チェック
        let verticalCount = 1;
        for (let i = r + 1; i < size && grid[i][c] === "#"; i++) {
          verticalCount++;
        }
        if (verticalCount >= 2) {
          violations.push(`縦方向に黒マスが${verticalCount}マス連続 (${r},${c})`);
        }
      }
    }
  }
  
  // 2. 黒マスでマス目を分断させない
  const connectedRegions = findConnectedRegions(grid);
  if (connectedRegions.length > 1) {
    violations.push(`マス目が${connectedRegions.length}つのブロックに分断されています`);
  }
  
  // 3. 黒マスを四隅に配置しない
  const corners = [
    [0, 0], [0, size-1], [size-1, 0], [size-1, size-1]
  ];
  for (const [r, c] of corners) {
    if (grid[r][c] === "#") {
      violations.push(`四隅に黒マスが配置されています (${r},${c})`);
    }
  }
  
  // 4. 180度回転対称性チェック（ニコリ社ルール）
  let isSymmetric = true;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const oppositeR = size - 1 - r;
      const oppositeC = size - 1 - c;
      if (grid[r][c] !== grid[oppositeR][oppositeC]) {
        isSymmetric = false;
        break;
      }
    }
    if (!isSymmetric) break;
  }
  
  if (!isSymmetric) {
    violations.push('180度回転対称性が満たされていません');
  }
  
  return {
    valid: violations.length === 0,
    violations: violations,
    isSymmetric: isSymmetric,
    connectedRegions: connectedRegions.length
  };
}

// 連結領域を検索する関数
function findConnectedRegions(grid) {
  const size = grid.length;
  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  const regions = [];
  
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] !== "#" && !visited[r][c]) {
        const region = [];
        dfs(grid, r, c, visited, region);
        if (region.length > 0) {
          regions.push(region);
        }
      }
    }
  }
  
  return regions;
}

// 深さ優先探索で連結領域を検索
function dfs(grid, r, c, visited, region) {
  const size = grid.length;
  if (r < 0 || r >= size || c < 0 || c >= size || 
      grid[r][c] === "#" || visited[r][c]) {
    return;
  }
  
  visited[r][c] = true;
  region.push([r, c]);
  
  // 上下左右を探索
  dfs(grid, r-1, c, visited, region);
  dfs(grid, r+1, c, visited, region);
  dfs(grid, r, c-1, visited, region);
  dfs(grid, r, c+1, visited, region);
}

// グローバル変数
let currentPuzzle = null;
let answerMap = {};
let currentPuzzleIndex = 0;

// 翻訳データ
const translations = {
    ja: {
        daily_puzzle: '今日のパズル',
        puzzle_date: '2024年1月15日',
        beginner: '初級',
        elapsed_time: '経過時間',
        progress: '進捗',
        hint: 'ヒント',
        check: '確認',
        reset: 'リセット',
        initialize: '初期化',
        share: 'シェア',
        across: 'ヨコのカギ',
        down: 'タテのカギ',
        congratulations: 'おめでとうございます！',
        puzzle_completed: 'パズルが完成しました！',
        completion_time: '完了時間',
        hints_used: '使用ヒント',
        share_results: '結果をシェア',
        close: '閉じる',
        recommended: 'おすすめ',
        brain_training_books: '脳トレ本特集',
        brain_training_desc: 'クロスワードパズル集',
        dictionary: '国語辞典・辞書',
        dictionary_desc: '語彙力アップに',
        puzzle_select: 'パズル選択'
    },
    en: {
        daily_puzzle: 'Today\'s Puzzle',
        puzzle_date: 'January 15, 2024',
        beginner: 'Beginner',
        elapsed_time: 'Elapsed Time',
        progress: 'Progress',
        hint: 'Hint',
        check: 'Check',
        reset: 'Reset',
        initialize: 'Initialize',
        share: 'Share',
        across: 'Across',
        down: 'Down',
        congratulations: 'Congratulations!',
        puzzle_completed: 'Puzzle completed!',
        completion_time: 'Completion Time',
        hints_used: 'Hints Used',
        share_results: 'Share Results',
        close: 'Close',
        recommended: 'Recommended',
        brain_training_books: 'Brain Training Books',
        brain_training_desc: 'Crossword Puzzle Collection',
        dictionary: 'Dictionary',
        dictionary_desc: 'Improve Vocabulary',
        puzzle_select: 'Puzzle Selection'
    }
};

// 現在の言語設定
let currentLanguage = 'ja';
let currentFontSize = 'base';
let isDarkMode = false;
let gameStartTime = null;
let hintsRemaining = 3;
let currentCell = null;
let currentDirection = 'across';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('CrosPuzz アプリケーション開始');
    loadSettings();
    initializePuzzleSelect();
    initializeGame();
    
    // PWA service worker registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed'));
    }
});

// パズル選択の初期化
function initializePuzzleSelect() {
    const select = document.getElementById('puzzleSelect');
    if (!select) return;
    
    puzzles.forEach((puzzle, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${index + 1}. ${puzzle.title}`;
        select.appendChild(option);
    });
    
    select.addEventListener('change', function(e) {
        const selectedIndex = parseInt(e.target.value);
        selectPuzzle(selectedIndex);
    });
}

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
    renderPuzzle(currentPuzzleIndex);
    loadGameState();
    updateProgress();
    startTimer();
    const hintsRemainingEl = document.getElementById('hintsRemaining');
    if (hintsRemainingEl) hintsRemainingEl.textContent = hintsRemaining;
    if (forceInit) {
        alert(currentLanguage === 'ja' ? '全て初期化しました' : 'All data has been initialized');
    }
}

// パズル描画
function renderPuzzle(index) {
    const target = document.getElementById('crosswordGrid');
    target.innerHTML = '';
    
    const data = generatePuzzle(puzzles[index]);
    currentPuzzle = data;
    answerMap = {};
    currentPuzzleIndex = index;

    const size = data.grid.length;
    const gridEl = document.createElement('div');
    gridEl.className = 'crossword-grid';
    gridEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    const numberMap = {};
    let num = 1;
    
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const ch = data.grid[r][c];
            const cell = document.createElement('div');
            cell.className = 'crossword-cell';
            
            if (ch === '#') {
                cell.classList.add('blocked');
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.className = 'cell-input';
                input.setAttribute('inputmode', 'text');
                input.setAttribute('lang', 'ja');
                input.setAttribute('autocomplete', 'off');
                input.setAttribute('autocorrect', 'off');
                input.setAttribute('autocapitalize', 'off');
                input.setAttribute('spellcheck', 'false');
                input.setAttribute('data-ime-mode', 'active');
                input.addEventListener('input', handleCellInput);
                input.addEventListener('focus', handleCellFocus);
                input.addEventListener('keydown', handleKeydown);
                input.addEventListener('compositionstart', () => {
                    // IME変換開始
                });
                input.addEventListener('compositionend', (e) => {
                    // IME変換完了時の処理
                    if (e.data) {
                        const lastChar = e.data.slice(-1);
                        if (/[あ-んア-ン一-龯A-Za-z]/.test(lastChar)) {
                            let processedValue = lastChar;
                            if (/[ア-ン]/.test(lastChar)) {
                                processedValue = lastChar.replace(/[ア-ン]/g, function(match) {
                                    return String.fromCharCode(match.charCodeAt(0) - 0x60);
                                });
                            }
                            input.value = processedValue;
                            saveGameState();
                            updateProgress();
                            setTimeout(() => {
                                moveToNextCell(input);
                            }, 10);
                        }
                    }
                });
                cell.appendChild(input);
                answerMap[`${r},${c}`] = ch;
            }
            
            // 番号表示（クロスワードビルダー.comのルールに従う）
            const numbering = data.numbering || {};
            const cellNumber = numbering[`${r},${c}`];
            if (cellNumber) {
                const no = document.createElement('span');
                no.className = 'cell-number';
                no.textContent = cellNumber;
                cell.appendChild(no);
            }
            
            gridEl.appendChild(cell);
        }
    }

    target.appendChild(gridEl);

    // ヒント描画
    createClues(data);
    
    console.log('パズル描画完了:', index);
}

// Create clues
function createClues(data) {
    const acrossContainer = document.getElementById('acrossClues');
    const downContainer = document.getElementById('downClues');
    
    // Across clues
    acrossContainer.innerHTML = '';
    data.across.sort((a,b) => a.number - b.number).forEach(item => {
        const clueElement = document.createElement('div');
        clueElement.className = 'flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors clue-item';
        clueElement.onclick = () => highlightWord(item.number, 'across');
        clueElement.innerHTML = `
            <span class="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 rounded-full flex items-center justify-center text-xs font-bold">${item.number}</span>
            <span class="text-gray-700 dark:text-gray-300">${item.clue}</span>
        `;
        acrossContainer.appendChild(clueElement);
    });
    
    // Down clues
    downContainer.innerHTML = '';
    data.down.sort((a,b) => a.number - b.number).forEach(item => {
        const clueElement = document.createElement('div');
        clueElement.className = 'flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors clue-item';
        clueElement.onclick = () => highlightWord(item.number, 'down');
        clueElement.innerHTML = `
            <span class="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 rounded-full flex items-center justify-center text-xs font-bold">${item.number}</span>
            <span class="text-gray-700 dark:text-gray-300">${item.clue}</span>
        `;
        downContainer.appendChild(clueElement);
    });
    
    console.log('手がかり作成完了');
}

// Handle cell input
function handleCellInput(event) {
    const cell = event.target;
    const value = event.target.value;
    
    // IME変換中は処理しない
    if (event.isComposing || event.keyCode === 229) {
        return;
    }
    
    // 空の場合は何もしない
    if (!value) {
        return;
    }
    
    // 最後の文字のみを取得（複数文字入力の場合）
    const lastChar = value.slice(-1);
    
    // 日本語文字（ひらがな、カタカナ、漢字）または英字のみ許可
    if (!/[あ-んア-ン一-龯A-Za-z]/.test(lastChar)) {
        event.target.value = '';
        return;
    }
    
    // 日本語クロスワード基本ルール: かな表記で統一
    let processedValue = normalizeJapaneseChar(lastChar);
    
    // 最後の文字のみを設定
    event.target.value = processedValue;
    saveGameState();
    updateProgress();
    
    // 次のセルに移動
    setTimeout(() => {
        moveToNextCell(cell);
    }, 10);
    
    console.log(`セル入力: ${cell.id} = ${processedValue}`);
}

// クロスワードビルダー.comのルールに従った日本語文字の正規化
function normalizeJapaneseChar(char) {
    // カタカナをひらがなに変換
    if (/[ア-ン]/.test(char)) {
        char = char.replace(/[ア-ン]/g, function(match) {
            return String.fromCharCode(match.charCodeAt(0) - 0x60);
        });
    }
    
    // 小さな「ヤユヨ・ツ・アイウエオ」は大きな文字に統一
    const smallToLarge = {
        'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ', 'っ': 'つ',
        'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お'
    };
    
    if (smallToLarge[char]) {
        return smallToLarge[char];
    }
    
    // 漢字をひらがなに変換（基本的な変換のみ）
    const kanjiToHiragana = {
        '一': 'いち', '二': 'に', '三': 'さん', '四': 'よん', '五': 'ご',
        '六': 'ろく', '七': 'なな', '八': 'はち', '九': 'きゅう', '十': 'じゅう',
        '山': 'やま', '川': 'かわ', '海': 'うみ', '空': 'そら', '花': 'はな',
        '木': 'き', '火': 'ひ', '水': 'みず', '土': 'つち', '金': 'かね',
        '日': 'ひ', '月': 'つき', '年': 'とし', '人': 'ひと', '子': 'こ',
        '大': 'だい', '小': 'しょう', '新': 'しん', '古': 'ふる', '高': 'たか',
        '長': 'なが', '短': 'みじか', '広': 'ひろ', '狭': 'せま', '深': 'ふか',
        '浅': 'あさ', '重': 'おも', '軽': 'かる', '早': 'はや', '遅': 'おそ',
        '美': 'うつく', '醜': 'みにく', '善': 'ぜん', '悪': 'あく', '正': 'ただ',
        '東': 'ひがし', '西': 'にし', '南': 'みなみ', '北': 'きた', '中': 'なか',
        '外': 'そと', '内': 'うち', '上': 'うえ', '下': 'した', '左': 'ひだり',
        '右': 'みぎ', '前': 'まえ', '後': 'うしろ', '近': 'ちか', '遠': 'とお'
    };
    
    if (kanjiToHiragana[char]) {
        return kanjiToHiragana[char];
    }
    
    return char;
}

// クロスワードビルダー.comの言葉ルールチェック
function validateWordRules(word) {
    const violations = [];
    
    // 1. 小さな「ヤユヨ・ツ・アイウエオ」は大きな文字に統一
    const smallChars = /[ゃゅょっぁぃぅぇぉ]/;
    if (smallChars.test(word)) {
        violations.push('小さな文字が含まれています（大きな文字に統一してください）');
    }
    
    // 2. 言葉は名詞のみ使用（動詞・形容詞・副詞をチェック）
    const nonNounPatterns = [
        /(かがやく|さがす|たたかう|はたらく|わらう)/, // 動詞
        /(あかるい|うつくしい|おいしい|つめたい|やさしい)/, // 形容詞
        /(きらきら|ざわざわ|ごろごろ|じめじめ|のびのび)/ // 副詞
    ];
    
    for (const pattern of nonNounPatterns) {
        if (pattern.test(word)) {
            violations.push('名詞以外の品詞が含まれています');
            break;
        }
    }
    
    return {
        valid: violations.length === 0,
        violations: violations
    };
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
    const cells = Array.from(document.querySelectorAll('.cell-input'));
    const currentIndex = cells.indexOf(currentCell);
    const size = Math.sqrt(cells.length);
    const currentRow = Math.floor(currentIndex / size);
    const currentCol = currentIndex % size;
    
    const newRow = currentRow + rowDelta;
    const newCol = currentCol + colDelta;
    
    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
        const newIndex = newRow * size + newCol;
        if (cells[newIndex] && !cells[newIndex].parentElement.classList.contains('blocked')) {
            cells[newIndex].focus();
        }
    }
}

// Move to next cell
function moveToNextCell(cell) {
    const cells = Array.from(document.querySelectorAll('.cell-input'));
    const currentIndex = cells.indexOf(cell);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < cells.length && !cells[nextIndex].parentElement.classList.contains('blocked')) {
        cells[nextIndex].focus();
    }
}

// Move to previous cell
function moveToPreviousCell(cell) {
    const cells = Array.from(document.querySelectorAll('.cell-input'));
    const currentIndex = cells.indexOf(cell);
    const prevIndex = currentIndex - 1;
    
    if (prevIndex >= 0 && !cells[prevIndex].parentElement.classList.contains('blocked')) {
        cells[prevIndex].focus();
        cells[prevIndex].value = '';
    }
}

// Highlight current word
function highlightCurrentWord() {
    if (!currentCell) return;
    
    // Remove previous highlights
    document.querySelectorAll('.crossword-cell').forEach(cell => {
        cell.classList.remove('highlighted');
    });
    
    // Highlight current word
    const cells = Array.from(document.querySelectorAll('.cell-input'));
    const currentIndex = cells.indexOf(currentCell);
    const size = Math.sqrt(cells.length);
    const currentRow = Math.floor(currentIndex / size);
    const currentCol = currentIndex % size;
    
    // Find word boundaries and highlight
    let startCol = currentCol;
    let endCol = currentCol;
    
    // Find start of word
    while (startCol > 0 && !cells[currentRow * size + startCol - 1].parentElement.classList.contains('blocked')) {
        startCol--;
    }
    
    // Find end of word
    while (endCol < size - 1 && !cells[currentRow * size + endCol + 1].parentElement.classList.contains('blocked')) {
        endCol++;
    }
    
    // Highlight word
    for (let col = startCol; col <= endCol; col++) {
        const cellIndex = currentRow * size + col;
        if (cells[cellIndex]) {
            cells[cellIndex].parentElement.classList.add('highlighted');
        }
    }
}

// Highlight word by number and direction
function highlightWord(number, direction) {
    // Implementation for highlighting specific words
    console.log(`Highlighting word ${number} in direction ${direction}`);
}

// Update progress
function updateProgress() {
    const inputs = document.querySelectorAll('.cell-input');
    let filledCells = 0;
    let totalCells = 0;
    
    inputs.forEach(input => {
        if (input.value) {
            filledCells++;
        }
        totalCells++;
    });
    
    const progress = totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0;
    const progressText = document.getElementById('progressText');
    const mobileProgress = document.getElementById('mobileProgress');
    const progressBar = document.getElementById('progressBar');
    
    if (progressText) progressText.textContent = `${progress}%`;
    if (mobileProgress) mobileProgress.textContent = `${progress}%`;
    if (progressBar) progressBar.style.width = `${progress}%`;
    
    // Check if puzzle is complete
    if (progress === 100) {
        showSuccessModal();
    }
}

// Start timer
function startTimer() {
    if (!gameStartTime) {
        gameStartTime = Date.now();
    }
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Update timer
function updateTimer() {
    if (!gameStartTime) return;
    
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
    if (hintsRemaining > 0) {
        const inputs = document.querySelectorAll('.cell-input');
        const emptyCells = Array.from(inputs).filter(input => !input.value);
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const cells = Array.from(document.querySelectorAll('.cell-input'));
            const cellIndex = cells.indexOf(randomCell);
            const size = Math.sqrt(cells.length);
            const row = Math.floor(cellIndex / size);
            const col = cellIndex % size;
            const correctAnswer = answerMap[`${row},${col}`];
            
            if (correctAnswer) {
                randomCell.value = correctAnswer;
                randomCell.style.color = '#10B981';
                hintsRemaining--;
                const hintsRemainingEl = document.getElementById('hintsRemaining');
                if (hintsRemainingEl) hintsRemainingEl.textContent = hintsRemaining;
                saveGameState();
                updateProgress();
            }
        }
    } else {
        alert(currentLanguage === 'ja' ? 'ヒントがありません' : 'No hints remaining');
    }
}

// Check answers
function checkAnswers() {
    const cells = document.querySelectorAll('.cell-input');
    let correctCount = 0;
    let totalCells = 0;
    const wordResults = [];
    
    // 日本語クロスワード基本ルール: 完全一致チェック
    cells.forEach(cell => {
        if (!cell.parentElement.classList.contains('blocked')) {
            totalCells++;
            const userAnswer = cell.value;
            const correctAnswer = answerMap[`${cell.getAttribute('data-row')},${cell.getAttribute('data-col')}`];
            
            // かな表記で統一して比較
            const normalizedUserAnswer = normalizeJapaneseChar(userAnswer);
            const normalizedCorrectAnswer = normalizeJapaneseChar(correctAnswer);
            
            if (normalizedUserAnswer === normalizedCorrectAnswer) {
                correctCount++;
                cell.style.color = '#10B981';
            } else {
                cell.style.color = '#EF4444';
            }
        }
    });
    
    // 単語単位でのチェック
    const acrossClues = document.querySelectorAll('.across-clue');
    const downClues = document.querySelectorAll('.down-clue');
    
    // ヨコの単語チェック
    acrossClues.forEach(clueElement => {
        const wordNumber = clueElement.getAttribute('data-number');
        const userWord = getUserWord(clueElement, 'across');
        const correctWord = clueElement.getAttribute('data-answer');
        
        if (userWord === correctWord) {
            wordResults.push(`ヨコ${wordNumber}: 正解`);
        } else {
            wordResults.push(`ヨコ${wordNumber}: 不正解 (入力: ${userWord}, 正解: ${correctWord})`);
        }
    });
    
    // タテの単語チェック
    downClues.forEach(clueElement => {
        const wordNumber = clueElement.getAttribute('data-number');
        const userWord = getUserWord(clueElement, 'down');
        const correctWord = clueElement.getAttribute('data-answer');
        
        if (userWord === correctWord) {
            wordResults.push(`タテ${wordNumber}: 正解`);
        } else {
            wordResults.push(`タテ${wordNumber}: 不正解 (入力: ${userWord}, 正解: ${correctWord})`);
        }
    });
    
    const accuracy = totalCells > 0 ? (correctCount / totalCells * 100).toFixed(1) : 0;
    
    if (accuracy === 100) {
        showSuccessModal();
    } else {
        const resultMessage = `正解率: ${accuracy}% (${correctCount}/${totalCells})\n\n単語チェック:\n${wordResults.join('\n')}`;
        alert(resultMessage);
    }
}

// ユーザーが入力した単語を取得
function getUserWord(clueElement, direction) {
    const cells = [];
    const startRow = parseInt(clueElement.getAttribute('data-row'));
    const startCol = parseInt(clueElement.getAttribute('data-col'));
    const wordLength = clueElement.getAttribute('data-answer').length;
    
    for (let i = 0; i < wordLength; i++) {
        let row, col;
        if (direction === 'across') {
            row = startRow;
            col = startCol + i;
        } else {
            row = startRow + i;
            col = startCol;
        }
        
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cells.push(cell.value || '');
        }
    }
    
    return cells.join('');
}

// Reset game
function resetGame() {
    document.querySelectorAll('.cell-input').forEach(input => {
        input.value = '';
        input.style.color = 'inherit';
    });
    saveGameState();
    updateProgress();
}

// Share results
function shareResults() {
    const progressText = document.getElementById('progressText');
    const time = document.getElementById('timer');
    const progress = progressText ? progressText.textContent : '0%';
    const timeText = time ? time.textContent : '00:00';
    const shareText = currentLanguage === 'ja' 
        ? `CrosPuzz 完了！進捗: ${progress}, 時間: ${timeText}`
        : `CrosPuzz completed! Progress: ${progress}, Time: ${timeText}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'CrosPuzz',
            text: shareText
        });
    } else {
        navigator.clipboard.writeText(shareText);
        alert(currentLanguage === 'ja' ? '結果をクリップボードにコピーしました' : 'Results copied to clipboard');
    }
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    const finalTime = document.getElementById('timer').textContent;
    const hintsUsed = 3 - hintsRemaining;
    
    document.getElementById('finalTime').textContent = finalTime;
    document.getElementById('hintsUsed').textContent = hintsUsed;
    
    modal.classList.remove('hidden');
}

// Close success modal
function closeSuccessModal() {
    document.getElementById('successModal').classList.add('hidden');
}

// Save game state
function saveGameState() {
    const inputs = document.querySelectorAll('.cell-input');
    const gameState = {};
    
    inputs.forEach((input, index) => {
        if (input.value) {
            gameState[index] = input.value;
        }
    });
    
    localStorage.setItem('crospuzz_game_state', JSON.stringify(gameState));
}

// Load game state
function loadGameState() {
    const savedState = localStorage.getItem('crospuzz_game_state');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        const inputs = document.querySelectorAll('.cell-input');
        
        Object.entries(gameState).forEach(([index, value]) => {
            if (inputs[index]) {
                inputs[index].value = value;
            }
        });
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('translate-x-0');
    sidebar.classList.toggle('-translate-x-full');
}

// Toggle language
function toggleLanguage() {
    currentLanguage = currentLanguage === 'ja' ? 'en' : 'ja';
    updateTranslations();
    saveSettings();
}

// Update translations
function updateTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
}

// Toggle dark mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.documentElement.classList.toggle('dark', isDarkMode);
    saveSettings();
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
}

// パズル選択機能
function selectPuzzle(index) {
    currentPuzzleIndex = index;
    renderPuzzle(index);
    // パズルタイトルを更新
    document.querySelector('[data-i18n="daily_puzzle"]').textContent = puzzles[index].title;
} 