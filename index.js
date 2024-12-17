const { Client, logger } = require('./lib/client')
const { DATABASE, VERSION } = require('./config')
const { stopInstance } = require('./lib/pm2')

const SESSION_ID = 'levanter_18cfab200b477e44c9840e653732520633'
if (!SESSION_ID) {
  console.error('SESSION_ID environment variable is not set.')
  process.exit(1)
}

const start = async () => {
  logger.info(`levanter ${VERSION}`)
  try {
    await DATABASE.authenticate({ retry: { max: 3 } })
  } catch (error) {
    const databaseUrl = process.env.DATABASE_URL
    logger.error({ msg: 'Unable to connect to the database', error: error.message, databaseUrl })
    return stopInstance()
  }
  try {
    const bot = new Client()
    await bot.connect()
    if (ALWAYS_ONLINE) {
      logger.info('Bot is set to always stay online.')
    } else {
      logger.info('Bot will not stay always online.')
    }
  } catch (error) {
    logger.error(error)
  }
}
start()
