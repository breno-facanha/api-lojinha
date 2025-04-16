import express from 'express'
import pkg from 'pg'
const { Pool } = pkg
import dotenv from "dotenv"

dotenv.config();
const app = express()
const port = 4000

app.use(express.json())

const connection = new Pool({
    connectionString: process.env.CONEXAOBANCOPG
})

app.get("/", (req, res) => {
    res.status(200).send("olá pessoal")
})

app.post("/login", (req, res) => {
    const {email, senha } = req.body

    if(!email || !senha){
        res.status(400).send("Email e senha são obrigatórios")
    }

    return res.status(200).send("Login Realizado com sucesso")
})



app.post("/produtos", async (req, res) => {
    const {nome, categoria, preco} = req.body

    if(!nome || !preco || !categoria){
        res.status(400).send("Preencha todos os campos")
    }

    const produto = await connection.query(`
            INSERT INTO produtos (nome, categoria, preco)
            VALUES ('${nome}', '${categoria}', ${preco} )
            RETURNING *
        `)

    res.status(201).send(produto.rows)
    
})

app.get("/produtos", async (req, res) => {
    try {
        const dbProdutos = await connection.query("SELECT * FROM produtos")
        res.status(200).send(dbProdutos.rows)
    } catch (error) {
        console.log(error)
    }
})

app.delete("/produtos/:id", async (req, res) => {
    const id = req.params.id

    await connection.query(`DELETE FROM produtos WHERE id = ${id}`)

    res.status(200).send({message: `produto de id:${id} deletado com sucesso`})
})


app.listen(port, () => console.log(`Servidor rodando na porta ${port}`))

