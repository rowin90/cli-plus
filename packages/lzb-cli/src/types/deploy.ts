export interface IEnv {
    // 项目类型
    type?: 'uni-app' | 'monorepo'
    // uni-app 的打包的项目名
    appProjectName?: string
    // 测试环境任务地址
    test?: string[]
    // 线上环境任务地址
    online?: string[],
    [key:string]:any
}

export interface ITask {
    [key:string]:IEnv
}
