
const env = import.meta.env.MODE || "prod"

const EnvConfig = {
    development:{
        baseApi:"http://127.0.0.1:3002",
        mockApi:"http://127.0.0.1:3002"
    },
    test:{
        baseApi:"//test.future.com/api",
        mockApi:"https://apifoxmock.com/m1/4068509-0-default/api"
    },
    prod:{
        baseApi:"//future.com/api",
        mockApi:"https://apifoxmock.com/m1/4068509-0-default/api"
    },
};
export default {
    env,
    ...EnvConfig[env],
    //mock
    mock: false,
}