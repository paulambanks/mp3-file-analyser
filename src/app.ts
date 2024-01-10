import express from 'express';
import cors from 'cors';
const app = express()

app.use(cors())

app.get('/', (req, res) => {
	res.json('Hello World')
})

app.post('/test', (req, res, err) => {
	console.log(req.body)
	res.json('Successful post')
})

export default app;
