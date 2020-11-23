// const { json } = require("body-parser")

// 即時関数のモジュール化
const usersModule =(() => {
  const BASE_URL = "http://localhost:3000/api/v1/users"

  // ヘッダーの設定
  const headers = new Headers()
  // リクエストのbodyの中身がJSONの形で渡す指定をする宣言
  headers.set("Content-Type", "application/json")

  const handleError = async(res) => {
    // レスポンスの結果のJSONをjsオブジェクトの形にする
    const resJson = await res.json()

    switch (res.status) {
      case 200:
        alert(resJson.messge)
        window.location.href = "/"
        break;
      case 201:
        alert(resJson.messge)
        window.location.href = "/"
        break;
      case 400:
        // リクエストのパラメーター間違い
        alert(resJson.error)
        break;
        // 指定したリソースが見つからない
      case 404:
        alert(resJson.error)
        break;
      case 500:
        // サーバーの内部エラー
        alert(resJson.error)
        break;
      default:
        alert("何らかのエラーが発生しました")
        break;
    }

    //runメソッドのmessagenの中身を表示
    alert(resJson.message)
    window.location.href = "/"
  }

  return {
    fetchAllUsers: async () => {
      const res = await fetch(BASE_URL)
      const users = await res.json()

      for (let i=0; i< users.length; i++) {
        const user = users[i]

        const body = `<tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.profile}</td>
                        <td>${user.date_of_birth}</td>
                        <td>${user.created_at}</td>
                        <td>${user.updated_at}</td>
                        <td><a href="edit.html?uid=${user.id}">編集</a></td>
                      </tr>`
        document.getElementById('users-list').insertAdjacentHTML('beforeend', body)
      }
    },
    createUser: async () => {
      const name = document.getElementById("name").value
      const profile = document.getElementById("profile").value
      const dateOfBirth =document.getElementById("date-of-birth").value

      // リクエストのbody・・jsnのオブジェクトの形
      const body = {
        name: name,
        profile: profile,
        date_of_birth: dateOfBirth
      }

      // fetchメソッドでリクエストを投げる レスポンスを受け取る
      const res = await fetch(BASE_URL , {
        method: "POST",
        headers: headers,
        body:JSON.stringify(body)  //jsのオブジェクトからJSON文字列の形にする
      })

      // // レスポンスの結果のJSONをjsオブジェクトの形にする
      // const resJson = await res.json()
      // // runメソッドのmessagenの中身を表示
      // alert(resJson.message)
      // window.location.href = "/"
      return handleError(res)
    },
    setExistingValue: async (uid) => {
      // fetchメソッドでGETリクエストを投げる(GETなのでパラメータの指定はしない)・・resでレスポンスを受け取る
      const res = await fetch(BASE_URL + "/" + uid)

      // 帰ってきたレスポンスのJSONをjsのオブジェクトにして受け取る
      const resJson = await res.json()

      // edit.htmlの各inputタグのvalueに受け取ったJSONの値を代入
      document.getElementById('name').value = resJson.name
      document.getElementById('profile').value =resJson.profile
      document.getElementById('date-of-birth').value = resJson.date_of_birth
    },
    saveUser: async (uid) => {
      const name = document.getElementById('name').value
      const profile =document.getElementById('profile').value
      const dateOfBirth =document.getElementById('date-of-birth').value

      // リクエストのbody・・jsオブジェクトの形
      const body = {
        name: name,
        profile: profile,
        date_of_birth: dateOfBirth
      }

      //fetchメソッドでリクエストを投げる  resでレスポンスを受け取る
      const res = await fetch(BASE_URL + "/" + uid, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(body)  //jsのオブジェクトからJSON文字列の形にする
      })

      //レスポンスの結果のJSONをjsオブジェクトの形にする
      // const resJson = await res.json()
      // alert(resJson.message)
      // window.location.href = "/"
      return handleError(res)
    },
    deleteUser: async (uid) => {
      const ret = window.confirm('このユーザーを削除しますか？')
      if(!ret) {
        return false
      } else {
        // fetchメソッドでリクエストを投げる・・resでレスポンスを受け取る
        const res = await fetch(BASE_URL + "/" + uid, {
          method: "DELETE",
          headers: headers
        })

        // const resJson = await res.json()
        // alert(resJson.message)
        // window.location.href = '/'
        return handleError(res)
      }
    }
  }

})()