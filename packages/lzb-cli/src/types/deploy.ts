
interface IEnv {
  test?:string[]
  online?:string[]
}

export interface ITask {
  listing:IEnv
  [key:string]:IEnv
}
