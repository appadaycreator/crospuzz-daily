// CrosPuzz - Daily Crossword Puzzle Application
// Version: 1.0.0
// Author: AppAdayCreator

// グローバル変数
let retryCount = 0;

// パズルデータ（難易度別）
console.log('パズルデータ読み込み開始');
let puzzles = {};

// JSONファイルからパズルデータを読み込む
async function loadPuzzleData() {
  try {
    const response = await fetch('/static/puzzles/puzzles.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    puzzles = await response.json();
    console.log('パズルデータ読み込み完了:', Object.keys(puzzles).map(d => `${d}: ${puzzles[d].length}個`));
    
    // パズルデータ読み込み後に初期化を実行
    initializePuzzleSelect();
    
    // デフォルトで初級の最初のパズルを選択
    selectPuzzle('beginner', 0);
    initializeGame();
  } catch (error) {
    console.error('パズルデータの読み込みに失敗しました:', error);
    // フォールバック用のデフォルトデータ
    puzzles = {
      beginner: [
        {
          title: "動物の名前",
          words: [
            { answer: "ねこ", clue: "気まぐれなペット" },
            { answer: "いぬ", clue: "忠実なペット" },
            { answer: "うさぎ", clue: "耳が長い動物" },
            { answer: "とり", clue: "空を飛ぶ動物" },
            { answer: "さかな", clue: "海に住む動物" },
            { answer: "くま", clue: "冬眠する動物" },
            { answer: "きつね", clue: "きつね" },
            { answer: "たぬき", clue: "たぬき" }
          ]
        }
      ],
      intermediate: [],
      advanced: []
    };
    console.log('フォールバックデータを使用');
    initializePuzzleSelect();
    
    // デフォルトで初級の最初のパズルを選択
    selectPuzzle('beginner', 0);
    initializeGame();
  }
}

// グローバル変数（リトライカウント）
let generateRetryCount = 0;

// 動的パズル生成ロジック
function createEmptyGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(""));
}

function canPlace(grid, word, r, c, dir) {
  const size = grid.length;

  if (dir === "across") {
    if (c + word.length > size) {
      console.log(`  ❌ 境界外: c=${c}, word.length=${word.length}, size=${size}`);
      return false;
    }

    // クロスワードルール: 単語の前後に文字がないかチェック
    if (c > 0 && grid[r][c - 1] !== "" && grid[r][c - 1] !== "#") {
      console.log(`  ❌ 前の文字が存在: grid[${r}][${c-1}] = "${grid[r][c - 1]}"`);
      return false;
    }
    if (c + word.length < size && grid[r][c + word.length] !== "" && grid[r][c + word.length] !== "#") {
      console.log(`  ❌ 後の文字が存在: grid[${r}][${c + word.length}] = "${grid[r][c + word.length]}"`);
      return false;
    }

    for (let i = 0; i < word.length; i++) {
      const cell = grid[r][c + i];
      if (cell === "#") {
        console.log(`  ❌ 黒マス: grid[${r}][${c+i}] = "#"`);
        return false;
      }
      
      // 既存の文字がある場合は一致する必要がある
      if (cell && cell !== word[i]) {
        console.log(`  ❌ 文字不一致: grid[${r}][${c+i}] = "${cell}", word[${i}] = "${word[i]}"`);
        return false;
      }

      // 交差点のチェック（より柔軟に）
      if (r > 0 && grid[r - 1][c + i] !== "" && grid[r - 1][c + i] !== "#") {
        // 上側に文字がある場合、交差として許可
        console.log(`  ℹ️ 上側交差: grid[${r-1}][${c+i}] = "${grid[r - 1][c + i]}"`);
      }
      if (r < size - 1 && grid[r + 1][c + i] !== "" && grid[r + 1][c + i] !== "#") {
        // 下側に文字がある場合、交差として許可
        console.log(`  ℹ️ 下側交差: grid[${r+1}][${c+i}] = "${grid[r + 1][c + i]}"`);
      }
    }
    console.log(`  ✅ across配置可能: "${word}" at (${r},${c})`);
    return true;
  }

  // down
  if (r + word.length > size) {
    console.log(`  ❌ 境界外: r=${r}, word.length=${word.length}, size=${size}`);
    return false;
  }

  // クロスワードルール: 単語の前後に文字がないかチェック
  if (r > 0 && grid[r - 1][c] !== "" && grid[r - 1][c] !== "#") {
    console.log(`  ❌ 前の文字が存在: grid[${r-1}][${c}] = "${grid[r - 1][c]}"`);
    return false;
  }
  if (r + word.length < size && grid[r + word.length][c] !== "" && grid[r + word.length][c] !== "#") {
    console.log(`  ❌ 後の文字が存在: grid[${r + word.length}][${c}] = "${grid[r + word.length][c]}"`);
    return false;
  }

  for (let i = 0; i < word.length; i++) {
    const cell = grid[r + i][c];
    if (cell === "#") {
      console.log(`  ❌ 黒マス: grid[${r+i}][${c}] = "#"`);
      return false;
    }
    
    // 既存の文字がある場合は一致する必要がある
    if (cell && cell !== word[i]) {
      console.log(`  ❌ 文字不一致: grid[${r+i}][${c}] = "${cell}", word[${i}] = "${word[i]}"`);
      return false;
    }

    // 交差点のチェック（より柔軟に）
    if (c > 0 && grid[r + i][c - 1] !== "" && grid[r + i][c - 1] !== "#") {
      // 左側に文字がある場合、交差として許可
      console.log(`  ℹ️ 左側交差: grid[${r+i}][${c-1}] = "${grid[r + i][c - 1]}"`);
    }
    if (c < size - 1 && grid[r + i][c + 1] !== "" && grid[r + i][c + 1] !== "#") {
      // 右側に文字がある場合、交差として許可
      console.log(`  ℹ️ 右側交差: grid[${r+i}][${c+1}] = "${grid[r + i][c + 1]}"`);
    }
  }
  console.log(`  ✅ down配置可能: "${word}" at (${r},${c})`);
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
  console.log('generatePuzzle開始:', puzzle);
  
  // リトライカウントをリセット
  generateRetryCount = 0;
  
  // 単語数を制限（最大8個まで）
  let wordsToUse = puzzle.words.slice(0, 8);
  console.log(`使用する単語数: ${wordsToUse.length}個（元の単語数: ${puzzle.words.length}個）`);
  
  const longest = Math.max(...wordsToUse.map(w => w.answer.length));
  let size = Math.max(9, longest + 2); // グリッドサイズを小さく調整
  
  // 単語数に応じてグリッドサイズを調整
  const wordCount = wordsToUse.length;
  if (wordCount > 5) {
    size = Math.max(size, 11);
  }
  
  console.log(`グリッドサイズ: ${size}x${size}, 単語数: ${wordCount}`);
  let grid = createEmptyGrid(size);

  // 単語を長さでソート（長い単語から配置）
  const words = [...wordsToUse].sort((a, b) => b.answer.length - a.answer.length);
  console.log('ソートされた単語（長い順）:', words);
  
  // 交差可能性の高い単語を優先
  const optimizedWords = optimizeWordOrder(words);
  console.log('最適化された単語順序:', optimizedWords.map(w => w.answer));

  // 完全なクロスワード生成
  const placed = [];
  
  // 1語目を中央横配置
  const first = optimizedWords[0].answer;
  const startCol = Math.floor((size - first.length) / 2);
  const midRow = Math.floor(size / 2);
  console.log(`1語目配置: "${first}" at (${midRow},${startCol}) across`);
  placeWord(grid, first, midRow, startCol, "across");
  placed.push({ ...optimizedWords[0], row: midRow, col: startCol, dir: "across" });

  // 2語目を確実に縦配置（1語目と交差するように）
  if (optimizedWords.length > 1) {
    const second = optimizedWords[1].answer;
    
    // 1語目と2語目で共通する文字を探す
    let foundIntersection = false;
    for (let i = 0; i < first.length; i++) {
      for (let j = 0; j < second.length; j++) {
        if (first[i] === second[j]) {
          // 交差位置を計算
          const secondRow = midRow - j;
          const secondCol = startCol + i;
          
          // 境界チェック
          if (secondRow >= 0 && secondRow + second.length <= size) {
            console.log(`2語目配置: "${second}" の "${second[j]}" と "${first}" の "${first[i]}" で交差 at (${secondRow},${secondCol}) down`);
            placeWord(grid, second, secondRow, secondCol, "down");
            placed.push({ ...optimizedWords[1], row: secondRow, col: secondCol, dir: "down" });
            foundIntersection = true;
            break;
          }
        }
      }
      if (foundIntersection) break;
    }
    
    // 交差が見つからない場合は、独立して配置
    if (!foundIntersection) {
      const secondRow = Math.floor((size - second.length) / 2);
      const secondCol = Math.floor(size / 2);
      console.log(`2語目独立配置: "${second}" at (${secondRow},${secondCol}) down`);
      placeWord(grid, second, secondRow, secondCol, "down");
      placed.push({ ...optimizedWords[1], row: secondRow, col: secondCol, dir: "down" });
    }
  }
  
  // 残りの単語を交差のみで配置（最大試行時間を設定）
  const maxTime = Date.now() + 5000; // 5秒でタイムアウト
  
  for (let wi = 2; wi < optimizedWords.length; wi++) {
    // タイムアウトチェック
    if (Date.now() > maxTime) {
      console.log('⏰ パズル生成タイムアウト - 配置済み単語で完了');
      break;
    }
    
    const w = optimizedWords[wi].answer;
    console.log(`\n=== 単語 "${w}" の交差配置を試行中... ===`);
    console.log(`現在配置済み: ${placed.length}個`);
    placed.forEach((p, i) => console.log(`  ${i+1}: "${p.answer}" at (${p.row},${p.col}) ${p.dir}`));
    
    let placedWord = false;

    // 既に配置された単語との交差を試行
    for (const existingWord of placed) {
      console.log(`\n--- "${existingWord.answer}" との交差を試行 ---`);
      for (let pi = 0; pi < existingWord.answer.length; pi++) {
        const pChar = existingWord.answer[pi];
        for (let wiChar = 0; wiChar < w.length; wiChar++) {
          if (w[wiChar] !== pChar) continue;

          // 交差方向を決定
          let r, c, dir;
          if (existingWord.dir === "across") {
            dir = "down";
            r = existingWord.row - wiChar;
            c = existingWord.col + pi;
          } else {
            dir = "across";
            r = existingWord.row + pi;
            c = existingWord.col - wiChar;
          }

          console.log(`交差試行: "${w}" の "${w[wiChar]}" と "${existingWord.answer}" の "${pChar}" at (${r},${c}) ${dir}`);

          // 境界チェック
          if (r < 0 || c < 0 ||
              (dir === "across" && c + w.length > size) ||
              (dir === "down" && r + w.length > size)) {
            console.log(`境界外: (${r},${c}) - スキップ`);
            continue;
          }

          // 配置可能かチェック
          console.log(`canPlace チェック: "${w}" at (${r},${c}) ${dir}`);
          if (canPlace(grid, w, r, c, dir)) {
            console.log(`✅ 配置成功: "${w}" at (${r},${c}) ${dir}`);
            placeWord(grid, w, r, c, dir);
            placed.push({ ...optimizedWords[wi], row: r, col: c, dir, answer: w });
            placedWord = true;
            break;
          } else {
            console.log(`❌ 配置失敗: "${w}" at (${r},${c}) ${dir}`);
          }
        }
        if (placedWord) break;
      }
      if (placedWord) break;
    }

    // 交差できなかった場合は失敗
    if (!placedWord) {
      console.log(`交差配置失敗: "${w}" - 配置できた単語のみで続行`);
      // 配置できた単語のみで続行（再試行しない）
      console.log(`配置できた単語のみで続行: ${placed.length}個`);
      break;
    }
  }

  // 未使用セルを黒マスに
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === "") grid[r][c] = "#";
    }
  }

  // 改良された番号付けロジック：実際に配置された単語のみに番号を付与
  let num = 1;
  const numbering = {};
  const across = [], down = [];
  
  console.log('番号付けロジック開始');
  console.log('配置された単語:', placed.map(w => `"${w.answer}" at (${w.row},${w.col}) ${w.dir}`));
  
  // 配置された単語の開始位置を収集してソート
  const wordStartPositions = placed.map(word => ({
    r: word.row,
    c: word.col,
    word: word.answer,
    dir: word.dir,
    clue: word.clue
  }));
  
  // Z順（左上から右下へ）でソート
  wordStartPositions.sort((a, b) => {
    if (a.r !== b.r) return a.r - b.r;
    return a.c - b.c;
  });
  
  console.log('ソート後の単語位置:', wordStartPositions);
  
  // 実際に配置された単語の位置のみに番号を付与
  for (const wordPos of wordStartPositions) {
    numbering[`${wordPos.r},${wordPos.c}`] = num;
    console.log(`番号付与: "${wordPos.word}" at (${wordPos.r},${wordPos.c}) -> 番号${num}`);
    num++;
  }

  // ステップ③：ヨコとタテのカギを作成
  console.log('ヨコとタテのカギを作成開始');
  console.log('配置された単語:', placed.map(w => `${w.answer}(${w.dir})`));
  
  for (const word of placed) {
    const number = numbering[`${word.row},${word.col}`];
    console.log(`単語 "${word.answer}" の番号: ${number}, 方向: ${word.dir}`);
    
    if (!number) {
      console.warn(`警告: 単語 "${word.answer}" at (${word.row},${word.col}) に番号が付与されていません`);
      continue;
    }
    
    const clueData = {
      number,
      clue: word.clue,
      answer: word.answer,
      row: word.row,
      col: word.col,
      length: word.answer.length
    };

    if (word.dir === "across") {
      across.push(clueData);
      console.log(`ヨコのカギに追加: ${number}. ${word.clue}`);
    } else if (word.dir === "down") {
      down.push(clueData);
      console.log(`タテのカギに追加: ${number}. ${word.clue}`);
    } else {
      console.error(`不明な方向: ${word.dir}`);
    }
  }

  // 番号順にソート
  across.sort((a, b) => a.number - b.number);
  down.sort((a, b) => a.number - b.number);

  console.log('最終結果:');
  console.log(`配置された単語数: ${placed.length}/${words.length}`);
  const acrossCount = placed.filter(p => p.dir === "across").length;
  const downCount = placed.filter(p => p.dir === "down").length;
  console.log(`縦横の内訳: ヨコ${acrossCount}個, タテ${downCount}個`);
  console.log('配置された単語詳細:');
  placed.forEach((p, i) => {
    console.log(`  ${i+1}: "${p.answer}" at (${p.row},${p.col}) ${p.dir} - ${p.clue}`);
  });
  console.log('ヨコのカギ:', across);
  console.log('タテのカギ:', down);
  console.log('グリッド:');
  grid.forEach((row, i) => {
    console.log(`  ${i}: ${row.join(' ')}`);
  });

  // 縦の単語が0個の場合は警告
  if (downCount === 0) {
    console.warn('⚠️ 縦の単語が配置されていません！');
    console.warn('配置された単語:', placed.map(p => `"${p.answer}" (${p.dir})`));
  }

  // 最小限のパズルチェック（少なくとも2単語は必要）
  if (placed.length < 2) {
    console.error('❌ パズル生成失敗: 配置された単語が少なすぎます');
    return generateSimpleFallbackPuzzle(puzzle);
  }

  return {
    grid,
    across,
    down,
    constraints: {
      size,
      wordCount: placed.length
    },
    numbering
  };
}

// 最もシンプルなフォールバック関数
function generateSimpleFallbackPuzzle(puzzle) {
  console.log('🔄 シンプルフォールバック生成開始');
  
  const size = 7;
  const grid = createEmptyGrid(size);
  const placed = [];
  
  // 最初の3つの単語のみ使用
  const simpleWords = puzzle.words.slice(0, 3);
  
  // 1. 中央に横単語を配置
  const word1 = simpleWords[0].answer;
  const row1 = 3;
  const col1 = Math.floor((size - word1.length) / 2);
  placeWord(grid, word1, row1, col1, "across");
  placed.push({ ...simpleWords[0], row: row1, col: col1, dir: "across" });
  
  // 2. 縦単語を配置（可能なら交差させる）
  if (simpleWords.length > 1) {
    const word2 = simpleWords[1].answer;
    const row2 = Math.floor((size - word2.length) / 2);
    const col2 = col1 + 1; // 2文字目で交差
    
    if (row2 >= 0 && row2 + word2.length <= size && col2 < size) {
      placeWord(grid, word2, row2, col2, "down");
      placed.push({ ...simpleWords[1], row: row2, col: col2, dir: "down" });
    }
  }
  
  // 黒マスで埋める
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === "") grid[r][c] = "#";
    }
  }
  
  // 番号付けとヒント作成（配置順にソート）
  const numbering = {};
  const across = [];
  const down = [];
  let num = 1;
  
  // 配置された単語をZ順でソート
  const sortedWords = [...placed].sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });
  
  console.log('シンプルフォールバック - ソート後の単語:', sortedWords.map(w => `"${w.answer}" at (${w.row},${w.col}) ${w.dir}`));
  
  for (const word of sortedWords) {
    numbering[`${word.row},${word.col}`] = num;
    const clueData = {
      number: num,
      clue: word.clue,
      answer: word.answer,
      row: word.row,
      col: word.col,
      length: word.answer.length
    };
    
    console.log(`シンプルフォールバック - 番号付与: "${word.answer}" -> 番号${num}`);
    
    if (word.dir === "across") {
      across.push(clueData);
    } else {
      down.push(clueData);
    }
    num++;
  }
  
  console.log('✅ シンプルフォールバック完了:', { across: across.length, down: down.length });
  
  return {
    grid,
    across,
    down,
    constraints: { size, wordCount: placed.length },
    numbering
  };
}

// フォールバック用のクロスワード生成（独立配置を許可）
function generatePuzzleWithFallback(puzzle) {
  console.log('フォールバック生成開始');
  
  const longest = Math.max(...puzzle.words.map(w => w.answer.length));
  let size = Math.max(9, longest + 4);
  
  const wordCount = puzzle.words.length;
  if (wordCount > 8) {
    size = Math.max(size, 12);
  }
  if (wordCount > 12) {
    size = Math.max(size, 15);
  }
  
  let grid = createEmptyGrid(size);
  const words = [...puzzle.words].sort((a, b) => b.answer.length - a.answer.length);
  const placed = [];
  
  // 1語目を中央横配置
  const first = words[0].answer;
  const startCol = Math.floor((size - first.length) / 2);
  const midRow = Math.floor(size / 2);
  placeWord(grid, first, midRow, startCol, "across");
  placed.push({ ...words[0], row: midRow, col: startCol, dir: "across" });
  
  // 残りの単語を交差または独立配置
  for (let wi = 1; wi < words.length; wi++) {
    const w = words[wi].answer;
    let placedWord = false;
    
    // まず交差を試行
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
          
          if (r >= 0 && c >= 0 &&
              (dir === "across" && c + w.length <= size) ||
              (dir === "down" && r + w.length <= size)) {
            if (canPlace(grid, w, r, c, dir)) {
              placeWord(grid, w, r, c, dir);
              placed.push({ ...words[wi], row: r, col: c, dir, answer: w });
              placedWord = true;
              break;
            }
          }
        }
        if (placedWord) break;
      }
      if (placedWord) break;
    }
    
    // 交差できない場合は独立配置
    if (!placedWord) {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (canPlace(grid, w, r, c, "across")) {
            placeWord(grid, w, r, c, "across");
            placed.push({ ...words[wi], row: r, col: c, dir: "across", answer: w });
            placedWord = true;
            break;
          }
        }
        if (placedWord) break;
      }
    }
  }
  
  // 未使用セルを黒マスに
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === "") grid[r][c] = "#";
    }
  }
  
  // 番号付けとヒント生成（既存のロジックと同じ）
  let num = 1;
  const numbering = {};
  const across = [], down = [];
  
  const startPositions = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === "#") continue;
      
      let acrossWordLength = 0;
      if (c < size - 1 && grid[r][c+1] !== "#") {
        let col = c;
        while (col < size && grid[r][col] !== "#") {
          acrossWordLength++;
          col++;
        }
      }
      const isStartAcross = (c === 0 || grid[r][c-1] === "#") && acrossWordLength >= 2;
      
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
  
  startPositions.sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });
  
  startPositions.forEach(pos => {
    numbering[`${pos.row},${pos.col}`] = num++;
  });
  
  startPositions.forEach(pos => {
    const no = numbering[`${pos.row},${pos.col}`];
    
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
  
  const constraints = validateJapaneseCrosswordRules(grid);
  
  return { grid, across, down, constraints, numbering };
}

// 単語順序最適化関数
function optimizeWordOrder(words) {
  const optimized = [];
  const used = new Set();

  // 最初の単語（最長の単語）
  optimized.push(words[0]);
  used.add(words[0].answer);

  // 2番目の単語は、1番目との交差可能性が最も高いものを選択
  const remaining = words.slice(1);
  let bestSecondWord = null;
  let bestScore = -1;

  for (const word of remaining) {
    let score = 0;
    for (const char of word.answer) {
      if (words[0].answer.includes(char)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestSecondWord = word;
    }
  }

  if (bestSecondWord) {
    optimized.push(bestSecondWord);
    remaining.splice(remaining.indexOf(bestSecondWord), 1);
  } else {
    // 交差が見つからない場合は、2番目に長い単語を選択
    if (remaining.length > 0) {
      optimized.push(remaining[0]);
      remaining.splice(0, 1);
    }
  }

  // 残りの単語を交差可能性でソート
  while (remaining.length > 0) {
    let bestWord = null;
    let bestScore = -1;

    for (const word of remaining) {
      let score = 0;
      for (const placedWord of optimized) {
        // 共通文字の数をスコアとして計算
        for (const char of word.answer) {
          if (placedWord.answer.includes(char)) {
            score++;
          }
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestWord = word;
      }
    }

    if (bestWord) {
      optimized.push(bestWord);
      remaining.splice(remaining.indexOf(bestWord), 1);
    } else {
      // 交差可能性がない場合は残りをそのまま追加
      optimized.push(...remaining);
      break;
    }
  }

  return optimized;
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
let currentDifficulty = 'beginner';
let currentPuzzleInDifficulty = 0;

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
        puzzle_select: 'パズル選択',
        intermediate: '中級',
        advanced: '上級'
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
        puzzle_select: 'Puzzle Selection',
        intermediate: 'Intermediate',
        advanced: 'Advanced'
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
    
    // パズルデータを読み込んでから初期化
    loadPuzzleData();
    
    // PWA service worker registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed'));
    }
});

// グローバル変数（現在の難易度）
let currentSelectedDifficulty = 'beginner';

// 難易度選択機能
function selectDifficulty(difficulty) {
    console.log(`難易度選択: ${difficulty}`);
    
    currentSelectedDifficulty = difficulty;
    
    // 難易度ボタンの状態を更新
    updateDifficultyButtons(difficulty);
    
    // パズル選択リストを更新
    updatePuzzleSelect(difficulty);
    
    // 難易度バッジを更新
    updateDifficultyBadge(difficulty);
    
    // 最初のパズルを自動選択
    if (puzzles[difficulty] && puzzles[difficulty].length > 0) {
        selectPuzzle(difficulty, 0);
    }
    
    // 選択した難易度を保存
    saveSettings();
}

// 難易度ボタンの状態を更新
function updateDifficultyButtons(selectedDifficulty) {
    const buttons = {
        'beginner': document.getElementById('difficultyBeginner'),
        'intermediate': document.getElementById('difficultyIntermediate'),
        'advanced': document.getElementById('difficultyAdvanced')
    };
    
    const styles = {
        'beginner': {
            active: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-300',
            inactive: 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-green-100 hover:border-green-200 hover:text-green-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-green-900 dark:hover:border-green-700 dark:hover:text-green-300'
        },
        'intermediate': {
            active: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300',
            inactive: 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-yellow-100 hover:border-yellow-200 hover:text-yellow-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-yellow-900 dark:hover:border-yellow-700 dark:hover:text-yellow-300'
        },
        'advanced': {
            active: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-300',
            inactive: 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-100 hover:border-red-200 hover:text-red-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-red-900 dark:hover:border-red-700 dark:hover:text-red-300'
        }
    };
    
    Object.keys(buttons).forEach(difficulty => {
        const button = buttons[difficulty];
        if (button) {
            // 既存のクラスをリセット
            button.className = 'difficulty-btn flex items-center px-4 py-2 rounded-lg border-2 transition-all duration-200 ' + 
                              (difficulty === selectedDifficulty ? styles[difficulty].active : styles[difficulty].inactive);
        }
    });
}

// パズル選択リストを更新（指定した難易度のパズルのみ表示）
function updatePuzzleSelect(difficulty) {
    const select = document.getElementById('puzzleSelect');
    if (!select) return;
    
    select.innerHTML = '';
    
    if (puzzles[difficulty]) {
        puzzles[difficulty].forEach((puzzle, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = puzzle.title;
            select.appendChild(option);
        });
    }
    
    // 選択イベントリスナーを再設定
    select.onchange = function(e) {
        const index = parseInt(e.target.value);
        selectPuzzle(currentSelectedDifficulty, index);
    };
}

// パズル選択の初期化（新しい実装）
function initializePuzzleSelect() {
    // 保存された難易度または初期難易度を設定
    selectDifficulty(currentSelectedDifficulty);
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
    
    if (settings.selectedDifficulty) {
        currentSelectedDifficulty = settings.selectedDifficulty;
    }
    
    updateTranslations();
    console.log('設定を読み込み:', settings);
}

// Save settings
function saveSettings() {
    const settings = {
        language: currentLanguage,
        fontSize: currentFontSize,
        darkMode: isDarkMode,
        selectedDifficulty: currentSelectedDifficulty
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
    
    // 既にパズルが選択されている場合はそれを使用、そうでなければデフォルトを選択
    if (!currentPuzzle) {
        selectPuzzle('beginner', 0);
    } else {
        renderPuzzle(currentPuzzleIndex);
    }
    
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
    console.log('renderPuzzle開始: index=', index);
    
    const target = document.getElementById('crosswordGrid');
    target.innerHTML = '';
    
    let data;
    if (currentPuzzle) {
        // 既に動的生成されたパズルがある場合はそれを使用
        data = currentPuzzle;
        console.log('既存のパズルデータを使用:', data);
    } else {
        // 初回またはデフォルトパズルの場合
        const defaultPuzzle = puzzles.beginner[0];
        console.log('デフォルトパズルを使用:', defaultPuzzle);
        data = generatePuzzle(defaultPuzzle);
        currentPuzzle = data;
    }
    
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
    console.log('createClues開始:', data);
    
    const acrossContainer = document.getElementById('acrossClues');
    const downContainer = document.getElementById('downClues');
    const mobileAcrossContainer = document.getElementById('mobileAcrossClues');
    const mobileDownContainer = document.getElementById('mobileDownClues');
    
    if (!acrossContainer || !downContainer) {
        console.error('ヒントコンテナが見つかりません');
        return;
    }
    
    console.log('Across clues:', data.across);
    console.log('Down clues:', data.down);
    
    // Across clues (PC用)
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
    
    // Down clues (PC用)
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
    
    // モバイル用のカギも作成
    if (mobileAcrossContainer && mobileDownContainer) {
        // Across clues (モバイル用)
        mobileAcrossContainer.innerHTML = '';
        data.across.sort((a,b) => a.number - b.number).forEach(item => {
            const clueElement = document.createElement('div');
            clueElement.className = 'flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors clue-item';
            clueElement.onclick = () => highlightWord(item.number, 'across');
            clueElement.innerHTML = `
                <span class="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 rounded-full flex items-center justify-center text-xs font-bold">${item.number}</span>
                <span class="text-gray-700 dark:text-gray-300">${item.clue}</span>
            `;
            mobileAcrossContainer.appendChild(clueElement);
        });
        
        // Down clues (モバイル用)
        mobileDownContainer.innerHTML = '';
        data.down.sort((a,b) => a.number - b.number).forEach(item => {
            const clueElement = document.createElement('div');
            clueElement.className = 'flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors clue-item';
            clueElement.onclick = () => highlightWord(item.number, 'down');
            clueElement.innerHTML = `
                <span class="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 rounded-full flex items-center justify-center text-xs font-bold">${item.number}</span>
                <span class="text-gray-700 dark:text-gray-300">${item.clue}</span>
            `;
            mobileDownContainer.appendChild(clueElement);
        });
    }
    
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
function selectPuzzle(difficulty, index) {
  console.log(`パズル選択開始: difficulty=${difficulty}, index=${index}`);

  currentDifficulty = difficulty;
  currentPuzzleInDifficulty = index;
  currentPuzzleIndex = 0; // 動的生成用のインデックスは0にリセット

  // 選択されたパズルを動的生成
  const selectedPuzzle = puzzles[difficulty][index];
  console.log('選択されたパズル:', selectedPuzzle);
  console.log('パズルタイトル:', selectedPuzzle.title);
  console.log('パズル単語:', selectedPuzzle.words.map(w => w.answer));
  console.log('ファイルバージョン確認: 動物の名前パズルが読み込まれているかチェック');
    
    const data = generatePuzzle(selectedPuzzle);
    console.log('生成されたパズルデータ:', data);
    
    currentPuzzle = data;
    answerMap = {};
    
    renderPuzzle(0); // 動的生成されたパズルを表示
    saveGameState();
    updateProgress();
    
    // パズルタイトルを更新
    const titleElement = document.querySelector('[data-i18n="daily_puzzle"]');
    if (titleElement) {
        titleElement.textContent = selectedPuzzle.title;
    }
    
    // 難易度バッジを更新
    updateDifficultyBadge(difficulty);
    
    console.log(`パズル選択完了: ${difficulty} - ${selectedPuzzle.title}`);
}

// 難易度バッジを更新する関数
function updateDifficultyBadge(difficulty) {
    const badge = document.getElementById('currentDifficultyBadge');
    if (!badge) return;
    
    const difficultyLabels = {
        'beginner': { 
            text: '初級', 
            bg: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            icon: 'fas fa-seedling'
        },
        'intermediate': { 
            text: '中級', 
            bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            icon: 'fas fa-mountain'
        },
        'advanced': { 
            text: '上級', 
            bg: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            icon: 'fas fa-rocket'
        }
    };
    
    const difficultyInfo = difficultyLabels[difficulty];
    if (difficultyInfo) {
        badge.className = `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${difficultyInfo.bg}`;
        badge.innerHTML = `<i class="${difficultyInfo.icon} mr-1"></i><span data-i18n="${difficulty}">${difficultyInfo.text}</span>`;
    }
} 