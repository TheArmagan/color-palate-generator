Vue.use(Verte);

const app = new Vue({
  el: "#app",
  data: {
    currentColor: null,
    currentColors: null,
    selectedColor: null,
    pr: new PalateRenderer(),
    suggestedColors: [],
    dialogs: {
      export: {
        active: false
      },
      import: {
        active: false
      }
    }
  },
  mounted() {
    this.$watch(function () {
      return this.$refs.colorPicker.value
    }, function (value) {
      this.currentColor = value;

      if (this.selectedColor != null) {
        this.currentColors.set(this.selectedColor, new Color(this.currentColor));
        this.$forceUpdate();
      }
    });

    this.currentColor = (JSON.parse(localStorage.getItem('colors') || "{}")[0] || "#000000");
    this.currentColors = new Map([["0", new Color(this.currentColor)]]);
  },
  computed: {
    currentColorsArray: () => {
      return Array.from(this.currentColors);
    }
  },
  methods: {
    addColor(color = this.currentColor) {
      this.currentColors.set(Date.now(), new Color(color));
      this.$forceUpdate();
    },
    removeColor(key = 0) {
      this.currentColors.delete(key);
      this.$forceUpdate();
    }
  },
  watch: {
    "currentColor"(value) {
      this.suggestedColors = [...new Set([
        ...Array(20).fill().map((c, i) => tinycolor(value).lighten(i * 5)).reverse(),
        ...Array(20).fill().map((c, i) => tinycolor(value).darken(i * 5)),
        ...tinycolor(value).monochromatic(results = 12),
        ...tinycolor(value).analogous(results = 12, slices = 30),
        ...tinycolor(value).triad(),
        ...tinycolor(value).tetrad(),
        tinycolor(invertHex(value)),
        tinycolor(value).greyscale(),
        ...Array(20).fill().map((c, i) => tinycolor(value).spin(i * 5))
      ].map(i => i.toHexString()))];
      this.$forceUpdate();
    }
  }
});