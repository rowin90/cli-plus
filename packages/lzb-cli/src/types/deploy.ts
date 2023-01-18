
interface IEnv {
  // 项目类型
  type?:'uni-app' | undefined
  // uni-app 的打包的项目名
  appProjectName?:string
  // 测试环境任务地址
  test?:string[]
  // 线上环境任务地址
  online?:string[]
}

export interface ITask {
  listing:IEnv
  'pdy-app(h5)':IEnv
}
