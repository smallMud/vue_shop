// 格式化日期时间格式
export const formartTime = (time) => {
  const date = new Date(time)
  const y = date.getFullYear()
  const m = ('0' + (date.getMonth() + 1)).slice(-2)
  const d = ('0' + (date.getDate())).slice(-2)

  const yy = ('0' + (date.getHours())).slice(-2)
  const mm = ('0' + (date.getMinutes())).slice(-2)
  const ss = ('0' + date.getSeconds()).slice(-2)
  return `${y}-${m}-${d} ${yy}:${mm}:${ss}`
}
