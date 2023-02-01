const { Controller } = require('egg');
const path = require('path');
const fs = require('fs');
class UploadController extends Controller {
  async upload() {
    const { ctx } = this;
    const { username, title, intro, type, other, status = 'pending' } = ctx.request.body;
    console.log(ctx.request.body);
    console.log('got %d files', ctx.request.files.length);

    try {
      // 遍历处理多个文件
      const hashMap = {};
      for (const file of ctx.request.files) {
        console.log('field: ' + file.fieldname);
        console.log('filename: ' + file.filename);
        console.log('encoding: ' + file.encoding);
        console.log('mime: ' + file.mime);
        console.log('tmp filepath: ' + file.filepath);
        const { fieldname, filepath } = file;
        // 处理文件，比如上传到云端
        // const result = await ctx.oss.put('egg-multipart-test/' + file.filename, file.filepath);
        // console.log(result);
        const newFileName = path.basename(filepath);
        const destPath = path.join(this.app.config.WATERFALL_PATH, newFileName);
        const readStream = fs.createReadStream(filepath);
        const writeStream = fs.createWriteStream(destPath);
        readStream.pipe(writeStream);
        hashMap[fieldname] = newFileName;
        // 添加进数据库
        const user = await ctx.model.File.create({ username, path: newFileName, title, intro, type, other, status });
        console.log(user);
      }
      ctx.body = {
        status: 200,
        data: hashMap,
      };
    } finally {
      // 需要删除临时文件
      await ctx.cleanupRequestFiles();
    }
  }
}

module.exports = UploadController;
