LEGACY_HTML = True  # 既存HTMLを保持（再アセンブル禁止）
TITLE = 'クロスワードパズル【毎日更新】CrosPuzz|無料で脳トレ'
DESCRIPTION = '毎日新しいクロスワードパズルが楽しめる無料脳トレゲーム。日本語・横並びクロスワードで語彙力・知識力をアップ。'
JS_CODE = "(function(){\n  // グローバルエラーハンドラ\n  window.onerror=function(msg,src,line){try{console.error('[AppErr]',msg,src?src+':'+line:'');}catch(e){}return false;};\n  window.addEventListener('unhandledrejection',function(e){try{console.error('[PromErr]',e.reason);}catch(e){}});\n  // トースト通知\n  window.showToast=function(msg,type){\n    var c=document.getElementById('toastContainer');if(!c)return;\n    var t=document.createElement('div');t.className='toast toast-'+(type||'info');t.textContent=msg;\n    c.appendChild(t);requestAnimationFrame(function(){t.classList.add('show');});\n    setTimeout(function(){t.classList.remove('show');setTimeout(function(){t.remove();},350);},3500);\n  };\n  window.showSuccess=function(m){showToast(m,'success');};\n  window.showError=function(m){showToast(m,'error');};\n  window.showInfo=function(m){showToast(m,'info');};\n  // ローディング\n  window.showLoading=function(){var el=document.getElementById('loadingOverlay');if(el)el.classList.add('active');};\n  window.hideLoading=function(){var el=document.getElementById('loadingOverlay');if(el)el.classList.remove('active');};\n  // localStorage安全ラッパー\n  window.safeGet=function(k,d){try{var v=localStorage.getItem(k);return v!==null?JSON.parse(v):d;}catch(e){return d;}};\n  window.safeSet=function(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){console.warn('storage err',e);}};\n})();"
MAIN_HTML = '<div><button class="btn">開始する</button></div>'
FAQ = [
    ('クロスワードパズルは無料で使えますか？', 'はい、完全無料・登録不要でご利用いただけます。'),
    ('記録データはどこに保存されますか？', 'ご使用のブラウザのローカルストレージに保存されます。他のデバイスとは共有されません。'),
    ('ブラウザを閉じても記録は残りますか？', 'はい、同じブラウザを使う限りデータは保持されます。'),
    ('記録を削除するにはどうすればいいですか？', 'リセットボタン、またはブラウザのサイトデータをクリアすることで削除できます。'),
    ('スマートフォンで利用できますか？', 'はい、スマートフォン・タブレット・PCすべてでご利用いただけます。'),
]
HOW_TO = [
    '記録したい項目を入力フォームに入力する',
    '「追加」または「記録」ボタンをクリックする',
    '記録一覧で過去のデータを確認する',
    'グラフや集計で傾向を把握する',
    '継続的に記録して変化を追跡する',
]
FOOTER_LINKS = [('https://appadaycreator.com/sleep-quality-checker/', '睡眠の質チェッカー'), ('https://appadaycreator.com/bmi-body-tracker/', 'BMI・体重管理'), ('https://appadaycreator.com/household-budget-analyzer/', '家計簿診断')]
