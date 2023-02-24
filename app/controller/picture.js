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
  async index() {
    const { ctx } = this;
    const { limit, offset, isAdmin = false } = ctx.query;
    const query = {
      limit: toInt(limit),
      offset: toInt(offset),
      order: [
        [ 'timestamp', 'desc' ], // 降序desc，升序asc
      ],
    };
    // 用户侧只返回审核通过的图片
    if (!isAdmin) {
      query.where = {
        status: 'pass',
      };
    }
    const res = await ctx.model.File.findAll(query);
    console.log(res.length);
    ctx.body = {
      data: res,
      done: res.length < query.limit,
    };
  }
  async getItemTotal() {
    const { ctx } = this;
    const res = await ctx.model.File.findAll();
    console.log(res.length);
    ctx.body = {
      data: res.length,
    };
  }

  async update() {
    const { ctx } = this;
    const { id, attrName, value } = ctx.request.body;
    console.log(id, attrName, value);
    const pic = await ctx.model.File.findByPk(id);
    if (!pic) {
      ctx.status = 404;
      ctx.body = '数据库无此条目';
      return;
    }
    await pic.update({ [attrName]: value });
    ctx.body = pic;
  }
  async del() {
    const { ctx, config } = this;
    const { id } = ctx.request.body;
    const pic = await ctx.model.File.findByPk(id);
    if (!pic) {
      ctx.status = 404;
      ctx.body = '数据库无此条目';
      return;
    }
    const { path: filename } = pic;
    const picFilePath = path.join(config.WATERFALL_PATH, filename);
    const picSmallFilePath = path.join(config.WATERFALL_PATH, `small-${filename}`);
    try {
      if (fs.existsSync(picFilePath)) {
        console.log(picFilePath);
        fs.rmSync(picFilePath);
      }
      if (fs.existsSync(picSmallFilePath)) {
        console.log(picSmallFilePath);
        fs.rmSync(picSmallFilePath);
      }
    } catch (error) {
      ctx.status = 400;
      ctx.body = '图片文件删除出错';
    }
    await pic.destroy();
    ctx.status = 200;
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
      const timestamp = new Date().getTime();
      for (let index = 0; index < fileInfoList.length; index++) {
        const fileInfo = fileInfoList[index];
        const { tmpPath, username, title, intro, type, other, status = 'pending' } = fileInfo;
        const filename = path.basename(tmpPath);
        // 将临时文件永久保存
        const sourcePath = path.join(config.multipart.tmpdir, tmpPath);
        const destPath = path.join(config.WATERFALL_PATH, filename);
        const readStream = fs.createReadStream(sourcePath);
        const writeStream = fs.createWriteStream(destPath);
        readStream.pipe(writeStream);
        // 图片压缩 gif 压缩成本过高，暂不处理
        if (path.extname(filename).toLocaleLowerCase() !== '.gif') {
          const toPath = path.join(path.dirname(destPath), `small-${filename}`);
          sharp(sourcePath).resize(1080).jpeg({ mozjpeg: true })
            .toFile(toPath);
        }
        // 数据库新增条目
        const pic = await ctx.model.File.create({ username, path: filename, title, intro, type, other, status, timestamp: (timestamp + index) * 10000 });
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
