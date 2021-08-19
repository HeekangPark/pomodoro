<template>
  <div id="app">
    <Home />
  </div>
</template>

<script>
import Home from "@/views/Home.vue";

export default {
  name: "App",
  components: {
    Home
  },
};
</script>

<style lang="scss">
@font-face {
  font-family: "NotoSansKR";
  src: local("Noto Sans KR Light"), local("NotoSansKR-Light"),
       url("./assets/fonts/sans-serif/Noto Sans KR/NotoSansKR-Light.woff2") format("woff2"),;
  font-display: swap;
  font-weight: 300;
}

@font-face {
  font-family: "NotoSansKR";
  src: local("Noto Sans KR Medium"), local("NotoSansKR-Medium"),
       url("./assets/fonts/sans-serif/Noto Sans KR/NotoSansKR-Medium.woff2") format("woff2");
  font-display: swap;
  font-weight: 500;
}

html, body, div, span, p, nav,
h1, h2, h3, h4, h5, h6, strong, small, b, u, i,
ul, ol, li, a, img, figure,
table, thead, tbody, tfoot, th, tr, td,
pre, blockquote, input {
	margin: 0;
	padding: 0;
	border: none;
	min-width: 0;
}

input {
  font-family: "NotoSansKR";
  font-weight: 300;
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  box-sizing: border-box;
  font-size: 1rem;
  -webkit-appearance: none;
  
  &:focus {
    outline: none;
  }
}

textarea {
  font-family: "NotoSansKR";
  font-weight: 300;
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  box-sizing: border-box;
  font-size: 1rem;

  &:focus {
    outline: none;
  }
}

button {
  border: none;
  font-family: "NotoSansKR", sans-serif;
  font-weight: 300;
}

html {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: "NotoSansKR", sans-serif;
  font-weight: 500;
  
  body {
    height: 100%;
    width: 100%;
    overflow: hidden;

    #app {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
