import sqlite3 from 'sqlite3'
import { open, Database} from 'sqlite'

export default class SqliteConnect {
    async connect (db: string) {
      let database = await open({
        filename: db,
        driver: sqlite3.Database
      })
      this.createTables(database)
      return database;
    }
    async createTables (db: Database) {
      db.exec(
        "CREATE TABLE IF NOT EXISTS payments " +
        "(" +
        "id INTEGER PRIMARY KEY, "  +
        "status TEXT, "             +
        "email TEXT, "              +
        "currency_id TEXT, "        +
        "description TEXT, "        +
        "live_mode TEXT, "          +
        "amount INTEGER, "          +
        "qrcode TEXT, "             +
        "qrcode_base64 TEXT, "      +
        "ticket_url TEXT"           +
        ")"
    );
    }
  }
  