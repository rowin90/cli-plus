module.exports = {
  types: [
    {
      value: '✨ feat',
      name: '✨  feat:     新功能'
    },
    {
      value: '🐛 fix',
      name: '🐛 fix:      修复bug'
    },
    {
      value: '🎉 init',
      name: '🎉 init:     初始化'
    },
    {
      value: '✏️ docs',
      name: '✏️ docs:     文档变更'
    },
    {
      value: '💄 style',
      name: '💄 style:    代码的样式美化'
    },
    {
      value: '♻️ refactor',
      name: '♻️ refactor:     重构'
    },
    {
      value: '⚡️ perf',
      name: '⚡️ perf:     性能优化'
    },
    {
      value: '✅ test',
      name: '✅  test:     测试'
    },
    {
      value: '⏪️ revert',
      name: '⏪️ revert:   回退'
    },
    {
      value: '📦️ build',
      name: '📦️build:    打包'
    },
    {
      value: '🚀 chore',
      name: '🚀 chore:    构建/工程依赖/工具'
    },
    {
      value: '👷 ci',
      name: '👷 ci:       CI related changes'
    }
  ],
  messages: {
    type: '请选择提交类型:',
    scope: '请输入文件修改范围(必填):',
    subject: '请简要描述提交(必填):',
    body: '请输入详细描述(可选，待优化去除，跳过即可):',
    footer: '请输入要关闭的issue(待优化去除，跳过即可):',
    confirmCommit: '确认使用以上信息提交？(y/n)'
  },
  allowCustomScopes: false,
  scopes: [
    // { name: 'lzb-cli' },
    // { name: '*' }
  ],
  skipQuestions: ['body', 'footer'],
  subjectLimit: 100
}
