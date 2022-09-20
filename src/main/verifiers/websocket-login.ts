import env from '../config/env';

function getQuery(str: string) : any {
    let json = {}
    str
    .slice(1)
    ?.split("?")[1]
    ?.split("&")
    ?.forEach(a => {
        if (a) {
            let keys = a.split("=")
            json = {
                ...json,
                [keys[0]]: keys[1]
            }
        }
    })
    return json;
}

export default (info, callback) => {
    let login = getQuery(info.req.url)
    if (
        login.user ==  env.WS_USER
        && login.password == env.WS_PASSWORD
    ) callback(true)
    else callback(false)
}