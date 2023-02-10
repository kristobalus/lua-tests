const { Client } = require('pg')
const client = new Client({
    user: 'polls',
    database: 'polls',
    host: process.env.PG_HOST,
    password: process.env.PG_PASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});
(async () => {

    await client.connect()
    const time = Date.now()
    const eventId = process.env.EVENT_ID || 644
    const orgId = process.env.ORG_ID || 6911691355886452736
    const count = 100_000
    for (let i = 0; i < count; i++) {
        const { rows: [ row ] } = await client.query(
            'select * from moderation where organization_id = $1 and event_id = $2',
            [ orgId, eventId ])
    }
    console.log('millis per select', (Date.now() - time) / count)
})().catch(err => console.log(err))