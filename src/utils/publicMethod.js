// 导出文件
// export const exportRight = function rightExport(filePath) {
//     let fileName = '测试文件'
//     const link = document.createElement('a')
//     const blob = new Blob([filePath], { type: 'application/vnd.ms-excel' })
//     link.style.display = 'none'
//     link.href = URL.createObjectURL(blob)
//     link.setAttribute('download', `${fileName || '导出文件'}.xlsx`)
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
// }