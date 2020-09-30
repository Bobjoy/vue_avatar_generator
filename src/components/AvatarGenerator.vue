<template>
<div>
  <canvas ref="canvas" :width="width" :height="height"/>
  <br/>
  <section>
    <span>方位：</span>
    <label for="lt"><input type="radio" v-model="pos" :value="[0,0]" name="dir" id="lt">左上</label>
    <label for="ct"><input type="radio" v-model="pos" :value="[1,0]" name="dir" id="ct">中上</label>
    <label for="rt"><input type="radio" v-model="pos" :value="[2,0]" name="dir" id="rt">右上</label>
    <label for="rc"><input type="radio" v-model="pos" :value="[2,1]" name="dir" id="rc">右中</label>
    <label for="cc"><input type="radio" v-model="pos" :value="[1,1]" name="dir" id="cc">中心</label>
    <label for="rb"><input type="radio" v-model="pos" :value="[2,2]" name="dir" id="rb">右下</label>
    <label for="cb"><input type="radio" v-model="pos" :value="[1,2]" name="dir" id="cb">中下</label>
    <label for="lb"><input type="radio" v-model="pos" :value="[0,2]" name="dir" id="lb">左下</label>
    <label for="lc"><input type="radio" v-model="pos" :value="[0,1]" name="dir" id="lc">左中</label>
  </section>
  <section>
    <input type="file" @change="handleChange($event, 0)">
    <!-- <input type="file" @change="handleChange($event, 1)"> -->
  </section>
</div>
</template>

<script>
export default {
  name: 'AvatarGeneraor',
  data() {
    return {
      pos: [2,0],
      width: 600,
      height: 600,
      backImg: null,
      frontImg: null
    }
  },
  watch: {
    async pos() {
      if (this.backImg && this.frontImg) {
        await this.drawBack();
        await this.drawFront();
      }
    }
  },
  created() {
    this.frontImg = require('../assets/china.jpg');
  },
  metaInfo() {
    return {
      title: '热烈庆祝中华人民共和国成立71周年🇨🇳',
      htmlAttrs: {
        lang: 'zh'
      },
      link: [
        { rel: 'icon', href: '/favicon.ico' }
      ]
    }
  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext('2d');
  },
  methods: {
    calcPosition(imgWidth, imgHeight) {
      let px = 0;
      let py = 0;

      const [ x, y ] = this.pos;
      switch(x) {
        case 1: px = (this.width - imgWidth) / 2;break;
        case 2: px = this.width - imgWidth;break;
        default: px = 0;
      }
      switch(y) {
        case 1: py = (this.height - imgHeight) / 2;break;
        case 2: py = this.height - imgHeight;break;
        default: py = 0;
      }

      return [ px, py ];
    },

    loadImg(img) {
      return new Promise((resolve, reject) => {
        let image = new Image();
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = () => {
          resolve(image);
        };
        image.onerror = () => {
          reject("image load fail");
        };
        image.src = img;
      })
    },

    drawBack() {
      return this.loadImg(this.backImg).then((image) => {
        this.width = image.width;
        this.height = image.height;
        this.$nextTick(() => {
          this.ctx.drawImage(image, 0, 0, image.width, image.height);
        });
      });
    },

    drawFront() {
      return this.loadImg(this.frontImg).then((image) => {
        const width = Math.min(this.width * 2/5, image.width);
        const height = Math.min(width * 2/3, image.height); // 国旗长宽比例3:2
        const [ x, y ] = this.calcPosition(width, height);
        this.ctx.drawImage(image, x, y, width, height);
      });
    },

    handleChange(evt, flag) {
      if (typeof FileReader === 'undefined') {
        alert('您的浏览器不支持图片上传，请升级您的浏览器');
        return false;
      }
      if (flag && !this.backImg) {
        alert('请先上传背景图');
        return false;
      }

      const reader = new FileReader();
      reader.readAsDataURL(evt.target.files[0]);
      reader.onload = e => {
        if (!flag) {
          this.backImg = e.target.result;
          this.drawBack().then(() => {
            if (this.frontImg) {
              this.drawFront();
            }
          });
        } else {
          this.frontImg = e.target.result;
          this.drawFront();
        }
      };
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  border: 1px solid #ccc;
}
</style>
