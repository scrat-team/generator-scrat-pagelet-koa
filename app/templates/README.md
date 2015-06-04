## <%= name %> - <%= description %>

  - 生产环境: 
  - 源码地址: <%= repository %>

### 初始化
  - 安装工具: `npm install scrat -g`
  - 安装依赖: `scrat install`

### 常用指令
  - 开发: `scrat release -wL`
  - 服务: `scrat server start`
  - 打包:
    - `scrat publish` 发布到 ../dist/{name}.{version}.{buildDate}.zip
    - `scrat publish -d local` 发布到 ../dist 目录
    - `scrat publish -d ../dist,zip` 同时执行以上两者
    - `scrat publish -f ../dist/test.zip` 发布到指定文件名

### Tip
  - 注意源码目录下不要有`node_modules`, 否则编译速度很慢.