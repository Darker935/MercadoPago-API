import { Router, Request, Response } from 'express'
import path from 'path'
import { SqliteHelper } from '../../infra/db/helpers/sqlite/sqlite-helper';

function sendError(res: Response) {
    res.statusCode = 403
    res.statusMessage = "Necessário informar 3 valores!"
    res.send("Parâmetros inválidos! Verifique o status message")
}

export default (router: Router): void => {
    router.get('/sql/get', async (req: Request, res: Response) => {
        const keys = Object.keys(req.query)
        if (keys.length == 0) {
            res.statusCode = 403
            res.statusMessage = "Nenhum valor para consulta informado"
            res.send("Informe um valor a ser consultado")
        } else {
            const command = {
                row: keys[0],
                value: req.query[keys[0]]
            }
            let sql = await SqliteHelper.get("SELECT * FROM logins WHERE " +command.row + " = ?", [command.value])
            res.json(Object.keys(sql)[0] ? sql : {})
        }
    })

    router.get('/sql/insert', async (req: Request, res: Response) => {
        const keys = Object.keys(req.query) as string[]
        const values = Object.values(req.query) as string[]
        if (keys.length != 3) return sendError(res);
        const { 
            email,
            password,
            number
        } = req.query;
        if (!email || !password || !number) return sendError(res);
            const command = {
                rows: keys,
                value: values
            }
            let result = await SqliteHelper.insert("logins",keys,values)
            res.json(result.changes ? result : {})
    })
}

