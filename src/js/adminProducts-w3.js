import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

// 1.bootstrap實體化
// 2.套用modal.show()方法
// const modal = document.querySelector("#modal");
// var myModal = new bootstrap.Modal(document.getElementById('myModal'), options)

let myModal = ""; //實體化
createApp({
  data() {
    return {
      api_url: "https://ec-course-api.hexschool.io/v2",
      api_path: "yuling2023",
      products: [],
      tempProduct: {
        "imagesUrl": []
      },
      modalProduct:null,//productModal
      modalDel:null,//delProductModal
      isNew:false
    };
  },
  methods: {
    checkAdmin() {
      axios
        .post(`${this.api_url}/api/user/check`)
        .then((res) => {
          // console.log(res);
          this.getProducts();
        })
        .catch((err) => {
          // console.log(err);
          alert(`${err.data.message}`);
          window.location = "adminLogin.html";
        });
    },
    getProducts() {
      //有分頁
      axios
        .get(`${this.api_url}/api/${this.api_path}/admin/products`)
        .then((res) => {
          this.products = res.data.products;
          // console.log(res);
        })
        .catch((arr) => {
          alert(`${err.data.message}`);
        });
    },
    openModal(status,product) {
      // myModal.show();=>element id方法
      // console.log(status,product);
      if( status === 'new'){
        this.tempProduct = {
          "imagesUrl": []
        }
        this.isNew = true;
        this.modalProduct.show();

      }else if(status === 'edit'){
        this.tempProduct = { ...product };
        if(!Array.isArray(this.tempProduct.imagesUrl)){
          this.tempProduct.imagesUrl=[];
        }
        this.isNew = false;
        this.modalProduct.show();
      }else if(status === 'delete'){
        this.tempProduct = { ...product };
        this.modalDel.show();
      }
    },
    updateProduct(){
      //新增
      if(this.isNew ){
        axios
        .post(
          `${this.api_url}/api/${this.api_path}/admin/product`,
          {data:this.tempProduct}
        )
        .then((res) => {
          // console.log(res);
          alert(`已建立產品`);
          this.getProducts();
          this.tempProduct ={};
          this.modalProduct.hide();
        })
        .catch((err) => {
          // console.log(err);
          alert(`${err.data.message}`);
        });
      }else if(!this.isNew){
        //更新
        axios
        .put(
          `${this.api_url}/api/${this.api_path}/admin/product/${this.tempProduct.id}`,
          {data:this.tempProduct}
        )
        .then((res) => {
          // console.log(res);
          alert(`已更新產品`);
          this.getProducts();
          this.tempProduct ={};
          this.modalProduct.hide();
        })
        .catch((err) => {
          // console.log(err);
          alert(`${err.data.message}`);
        });
      }

    },
    deleteProduct(){
      axios
      .delete(
        `${this.api_url}/api/${this.api_path}/admin/product/${this.tempProduct.id}`,
        {data:this.tempProduct}
      )
      .then((res) => {
        // console.log(res);
        this.getProducts();
        this.tempProduct ={};
        this.modalDel.hide();
      })
      .catch((err) => {
        // console.log(err);
        alert(`${err.data.message}`);
      });
    }
  },
  mounted() {
    //取得cookie資料
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    // console.log(token);
    this.checkAdmin();
    // console.log(this.$refs);
    // myModal=new bootstrap.Modal( document.querySelector('#productModal'));=>element id方法
    this.modalProduct = new bootstrap.Modal(this.$refs.productModal);
    this.modalDel = new bootstrap.Modal(this.$refs.delProductModal);
  },
}).mount("#app");
