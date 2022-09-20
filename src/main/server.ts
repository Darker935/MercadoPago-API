import { SqliteHelper } from '../infra/db/helpers/sqlite/sqlite-helper'
import env from './config/env'

SqliteHelper.connect(env.DB_PATH)
	.then(async () => {
		const { setupApp } = await import('./config/app')
		const { setupAppWs } = await import('./config/app-ws')
		const app = await setupApp()
		const appWs = await setupAppWs(app)
		
	})
	.catch(err => {
		console.log(err)
	})
