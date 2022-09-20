import { Database } from 'sqlite'
import SqliteConnect from './sqlite-connect'
import * as fs from 'fs';
import { resolve } from 'path';


export class SqliteHelper {
    static conn: Database;
    static database: string;

    static async connect (database: string): Promise<void> {
        if (!fs.existsSync(database)) {
            console.log(resolve(database) + " not exists")
        }
        const db = await new SqliteConnect().connect(database);
        this.conn = db;
    };

    static async all (command: string) {
     const result = await this.conn.all(command);
     return result;
    };

    static async get (command: string, values: Array<any>) {
        const result = await this.conn.get(command, values);
        return result;
    }

    static getObjectValues(columns: Array<string>, values: Array<string>) {
        let valuesObject = {};
        columns.forEach((column, i) => {
            valuesObject[":" + column] = values[i];
        });
        return valuesObject;
    }

    static getColumnsValues(columns: Array<string>) {
        return "(" + columns.join(",") + ")";
    }
    
    static getColumnsVariables(columns: Array<string>) {
        return "(" + columns.map(column => ":" + column).join(",") + ")";
    }
    
    static getColumnsUpdateVariables(columns: Array<string>) {
        return columns.map(column => column + "=?").join(",");
    }

    static async insert(table: string, columns: Array<string>, valuesN: Array<string>) {
        if (valuesN.length != columns.length) throw "Erro: Número de colunas e valores não são iguais";
        if (columns.length == 0 || valuesN.length == 0) throw "Erro: É necessario informar no minimo 1 valor/coluna";

        let id = valuesN[columns.indexOf("id")];

        let row = await this.conn.get(`SELECT * FROM ${table} WHERE id = ?`, id);
        let valuesSql = this.getObjectValues(columns, valuesN);
        let columnsSql = this.getColumnsValues(columns);
        let columnsVariableSql = this.getColumnsVariables(columns);
        let columnsUpdateVariablesSql = this.getColumnsUpdateVariables(columns);

        if (row) {

            let sql =
                "UPDATE "       + table +
                " SET "         + columnsUpdateVariablesSql +
                " WHERE id ='"  + id + "'";
            let result = this.conn.run(sql, valuesN);
            return result;
        } else {
            let sql =
                "INSERT INTO " +    table +
                                    columnsSql +
                " VALUES " +        columnsVariableSql;
            let result = this.conn.run(sql, valuesSql)
            return result;
        }
    }

    static async disconnect (database: string): Promise<void> {
          this.conn.close()
   }
}
