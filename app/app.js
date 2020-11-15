const express = require('express')
const app = express()
const sqlite3 = require('sqlite3')
const path = require('path')
const bodyParser = require('body-parser')
const { runInNewContext } = require('vm')
const dbPath = "app/db/database.sqlite3"

// リクエストのbodyをパースする設定
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// publicディレクトリを静的ファイル群のルートディレクトリとして設定
app.use(express.static(path.join(__dirname, 'public')))

// Get all users
app.get('/api/v1/users', (req, res) => {
  // Connect database
  const db = new sqlite3.Database(dbPath)

  db.all('SELECT * FROM users', (err, rows) => {
    res.json(rows)
  })

  db.close()
})

// GET a user
app.get('/api/v1/users/:id', (req, res)=> {
  // Connect database
  const db = new sqlite3.Database(dbPath)
  const id = req.params.id

  db.get(`SELECT * FROM users WHERE id=${id}`, (err, row) => {
    if (!row) {
      res.status(404).send( {error: "Not Found!"} )
    } else {
      res.status(200).json(row)
    }
  })

  db.close()
})

// Search users matching keyword
app.get('/api/v1/search', (req, res) => {
  // Connect database
  const db = new sqlite3.Database(dbPath)
  const keyword = req.query.q

  db.all(`SELECT * FROM users WHERE name LIKE "%${keyword}%"`, (err, rows) => {
    res.json(rows)
  })

  db.close()
})

const run = async (sql, db) => {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) {
        return reject(err)
      } else {
        return resolve()
      }
    })
  })
}

// Create a new user
app.post('/api/v1/users', async (req, res) => {
  if(!req.body.name || req.body.name === "") {
    res.status(400).send({error: "ユーザー名が指定されていません。"})
  } else {
    // Connect database
    const db = new sqlite3.Database(dbPath)
  
    const name = req.body.name
    const profile = req.body.profile ? req.body.profile: ""
    const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : ""
  
    try {
      await run(
        `INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}","${profile}", "${dateOfBirth}")`,
        db,
        )
        res.status(201).send({message: "新規ユーザーを作成しました！"})
    } catch (e) {
      res.status(500).send({error: e})
    }

  
    db.close()
  }
})

// Update user data
app.put('/api/v1/users/:id', async (req, res) => {
  if (!req.body.name || req.body.name === "") {
    res.status(400).send({error: "ユーザー名が指定されていません。"})
  } else {
    // Connect database
    const db =new sqlite3.Database(dbPath)
    const id = req.params.id
  
    // 現在の情報を取得する
    db.get(`SELECT * FROM users WHERE id=${id}`, async(err, row) => {

      if(!row) {
        res.status(404).send({error: "指定されてたユーザーが見つかりません。"})
      } else {
        const name = req.body.name ? req.body.name : row.name
        const profile =req.body.profile ? req.body.profile : row.profile
        const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : row.date_of_birth
        try {
          await run(
            `UPDATE users SET name="${name}" , profile="${profile}", date_of_birth="${dateOfBirth}" WHERE id=${id}`
            ,db
          )
          res.status(200).send({message: "ユーザー情報を更新しました！"})
        } catch (e) {
          res.status(500).send({error: e})
        }
      }
    })
    db.close()
  }
})


// Delete user data
app.delete(`/api/v1/users/:id`, async (req, res) => {
  // Connect database
  const db = new sqlite3.Database(dbPath)
  const id = req.params.id

  // 現在のユーザー情報を取得する
  db.get(`SELECT * FROM users WHERE id=${id}`, async (err, row) => {

    if (!row) {
      res.status(404).send({error: "指定されてたユーザーが見つかりません。"})
    } else {
      try {
        await run(
          `DELETE FROM users WHERE id=${id}`
          ,db
        )
          res.status(200).send({message: "ユーザー情報を削除しました。"})
      } catch (e) {
        res.status(500).send({error: e})
      }
    }
  })

  db.close
})


// ========================
// Create a new user
app.post('/api/v2/users', async (req, res) => {
  // Connect database
  const db =new sqlite3.Database(dbPath)

  const name = req.body.name
  const profile =req.body.profile ? req.body.profile : ""
  const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : ""

  // const run = async (sql) => {
  //   return new Promise((resolve, reject) => {
  //     db.run(sql, (err) => {
  //       if(err) {
  //         res.status(500).send(err)
  //         return reject()
  //       } else {
  //         res.json({message: "新規ユーザーを作成しました"})
  //         return resolve()
  //       }
  //     })
  //   })
  // }

  await run(
    `INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}","${profile}", "${dateOfBirth}")`
    ,db
    ,res
    ,"新規ユーザーを作成しました"
    )
  db.close()
})

// Update user data
app.put(`/api/v2/users/:id`, async (req, res) => {
  // Connect database

  const db = new sqlite3.Database(dbPath)
  const id = req.params.id

  // 現在のユーザー情報を取得する
  db.get(`SELECT * FROM users WHERE id=${id}`, async (err, row) => {
    const name =req.body.name ? req.body.name : row.name
    const profile = req.body.profile ? req.body.profile : row.profile
    const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : row.date_of_birth

    await run(
      `UPDATE users SET name="${name}",profile="${profile}", date_of_birth="${dateOfBirth}" WHERE id=${id}`,
      db,
      res,
      "ユーザー情報を更新しました"
    )
  })
  db.close()
})


// Delete user data
app.delete(`/api/v2/users/:id`, async (req, res) => {
  // Connect database
  const db = new sqlite3.Database(dbPath)
  const id = req.params.id
  await run(
    `DELETE FROM users WHERE id =${id}`,
    db,
    res,
    "ユーザー情報を削除しました"
  )
  db.close()
})



const port = process.env.PORT || 3000;
app.listen(port)
console.log("Listen on port:" + port)