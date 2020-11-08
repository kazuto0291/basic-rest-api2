const searchModule = (() => {
  const Base_URL = "http://localhost:3000/api/v1/search"

  return {
    searchUsers: async () => {
      // 検索窓への入力値を取得
      const query = document.getElementById('search').value //inputタグの入力値

      const res = await fetch(Base_URL + '?q=' + query)
      const result = await res.json()

      let body = ""

      for (let i=0; i < result.length; i++) {
        const user = result[i]
        body += `<tr>
                  <td>${user.id}</td>
                  <td>${user.name}</td>
                  <td>${user.profile}</td>
                  <td>${user.date_of_birth}</td>
                  <td>${user.created_at}</td>
                  <td>${user.updated_at}</td>
                </tr>`
      }
        document.getElementById('users-list').innerHTML = body
    }
  }
})()