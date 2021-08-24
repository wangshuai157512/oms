let baseUrl= "";  
switch (process.env.NODE_ENV) {
    case 'development':
        baseUrl = "http://172.16.16.212:8810"  //开发环境url
        break
    case 'ceshi':   
        baseUrl = "http://172.16.16.212:8810"  //测试环境中的url
        break
    case 'production':
        baseUrl = ""   
        break
}
export default{
	baseUrl
}
