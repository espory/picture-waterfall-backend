const { Controller } = require('egg');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}
class PictureController extends Controller {
  async get() {
    const { ctx } = this;
    const { limit, offset } = ctx.query;
    const query = {
      limit: toInt(limit),
      offset: toInt(offset),
    };
    console.log(query);
    const res = await ctx.model.File.findAll(query);
    console.log(res.length);
    ctx.body = {
      data: res,
      done: res.length < query.limit,
    };
  }
  async upload() {
    const { ctx } = this;
    console.log(ctx.request.body);
    console.log('got %d files', ctx.request.files.length);

    try {
      const { filepath } = ctx.request.files?.[0];
      if (!filepath) {
        ctx.status = 400;
      }
      // 防止服务器文件目录泄露
      const tmpPath = filepath.replace(this.config.multipart.tmpdir, '');
      ctx.body = {
        data: { tmpPath },
      };
    } finally {
      // 删除临时文件，由于是需要临时存储，这里进行了注释
      // 实际上通过定时器设置临时文件夹会每天进行自动清理
      //   await ctx.cleanupRequestFiles();
    }
  }
  async create() {
    const { ctx, config } = this;
    const { fileInfoList } = ctx.request.body;
    console.log(fileInfoList);
    try {
      for (let index = 0; index < fileInfoList.length; index++) {
        const fileInfo = fileInfoList[index];
        const { tmpPath, username, title, intro, type, other, status = 'pending' } = fileInfo;
        const filename = path.basename(tmpPath);
        // 将临时文件永久保存
        const sourcePath = path.join(config.multipart.tmpdir, tmpPath);
        const destPath = path.join(config.WATERFALL_PATH, filename);
        console.log(sourcePath, 123);
        console.log(destPath, 123);
        const readStream = fs.createReadStream(sourcePath);
        const writeStream = fs.createWriteStream(destPath);
        readStream.pipe(writeStream);
        // 图片压缩 gif 压缩成本过高，暂不处理
        if(path.extname(filename).toLocaleLowerCase()!=='.gif'){
          const toPath = path.join(path.dirname(destPath),`small-${filename}`)
          sharp(sourcePath).resize(1080).jpeg({ mozjpeg: true }).toFile(toPath)
        }
        // 数据库新增条目
        const pic = await ctx.model.File.create({ username, path: filename, title, intro, type, other, status });
        console.log(pic);
      }
    } catch (e) {
      console.log(e);
      ctx.body = {
        data: e,
      };
    }
    ctx.body = {
      status: 200,
      data: {},
    };
  }

}

module.exports = PictureController;
