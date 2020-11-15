const indexModule = (() => {
  // 検索ボタンをクリックしたときのイベントリスナー設定
  document.getElementById('search-btn').addEventListener('click', ()=> {
    console.log('クリックした！')
     return searchModule.searchUsers()
  })
  // UsersモジュールのfetchAllUsersメソッドを呼び出す
  return usersModule.fetchAllUsers()
})()