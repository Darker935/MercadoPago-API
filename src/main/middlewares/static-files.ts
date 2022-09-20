import express from 'express'
import path from 'path'

export const staticFiles = express.static(path.join(__dirname, '../../../public'))
