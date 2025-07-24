#!/usr/bin/env python3
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import json

# ヘッドレスモードで実行
chrome_options = Options()
chrome_options.add_argument('--headless')
driver = webdriver.Chrome(options=chrome_options)

try:
    # ローカルサーバーにアクセス
    driver.get('http://localhost:8004')
    wait = WebDriverWait(driver, 10)
    
    # ページが読み込まれるまで待機
    time.sleep(3)
    
    # 各難易度でテスト
    difficulties = ['beginner', 'intermediate', 'advanced']
    results = {}
    
    for difficulty in difficulties:
        print(f"\n=== {difficulty.upper()} 難易度のテスト ===")
        results[difficulty] = []
        
        # 難易度ボタンをクリック
        diff_button = driver.find_element(By.CSS_SELECTOR, f'button[data-difficulty="{difficulty}"]')
        diff_button.click()
        time.sleep(1)
        
        # パズル選択ドロップダウンを取得
        puzzle_select = Select(driver.find_element(By.ID, 'puzzle-select'))
        
        # 各パズルをテスト
        for i in range(len(puzzle_select.options)):
            if i == 0:  # "パズルを選択"をスキップ
                continue
                
            puzzle_select.select_by_index(i)
            time.sleep(2)
            
            # タテとヨコのカギの数を取得
            across_clues = driver.find_elements(By.CSS_SELECTOR, '#across-clues li')
            down_clues = driver.find_elements(By.CSS_SELECTOR, '#down-clues li')
            
            across_count = len(across_clues)
            down_count = len(down_clues)
            
            puzzle_name = puzzle_select.options[i].text
            print(f"\nパズル: {puzzle_name}")
            print(f"ヨコのカギ: {across_count}個")
            print(f"タテのカギ: {down_count}個")
            print(f"バランス: {across_count}:{down_count}")
            
            # バランスチェック
            balance_ratio = min(across_count, down_count) / max(across_count, down_count) if max(across_count, down_count) > 0 else 0
            print(f"バランス比率: {balance_ratio:.2f} (1.0が完璧なバランス)")
            
            results[difficulty].append({
                'puzzle': puzzle_name,
                'across': across_count,
                'down': down_count,
                'balance_ratio': balance_ratio
            })
    
    # 結果のサマリー
    print("\n\n=== 結果サマリー ===")
    for difficulty, puzzles in results.items():
        print(f"\n{difficulty.upper()}:")
        avg_ratio = sum(p['balance_ratio'] for p in puzzles) / len(puzzles) if puzzles else 0
        print(f"平均バランス比率: {avg_ratio:.2f}")
        for p in puzzles:
            status = "✅" if p['balance_ratio'] >= 0.7 else "⚠️"
            print(f"  {status} {p['puzzle']}: ヨコ {p['across']} / タテ {p['down']} (比率: {p['balance_ratio']:.2f})")

finally:
    driver.quit()