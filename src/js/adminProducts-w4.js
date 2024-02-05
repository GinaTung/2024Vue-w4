import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import pagination from "./pagination.js";
import ProductModal from "./ProductModal.js";
import DelProductModal from "./DelProductModal.js";
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
      pages:{},
      modalProduct:null,//productModal
      modelDel:null,//delProductModal
      isNew:false,
      rating_id: null,
      starScore:0,
      tempproduct2: [],
      latestRating:[]
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
    getProducts(page=1) {//參數預設值
      //有分頁
      axios
        .get(`${this.api_url}/api/${this.api_path}/admin/products?page=${page}`)
        .then((res) => {
          this.products = res.data.products;
          this.pages = res.data.pagination;
          console.log(res);
        })
        .catch((arr) => {
          alert(`${err.data.message}`);
        });
    },
    setRating(id,star) {
      this.rating_id = id;
      this.starScore = star;
    // 保存最新的評分
    const latestRating = { id: this.rating_id, rating: this.starScore };
    
    // 將最新的評分保存到本地存儲中
    localStorage.setItem('latestRating', JSON.stringify(latestRating));
    console.log(latestRating);
    },
    openModal(status,product) {
      // myModal.show();=>element id方法
      // console.log(status,product);
      if( status === 'new'){
        this.tempProduct = {
          "imagesUrl": []
        }
        this.isNew = true;

        // this.modalProduct.show();
        // 影片大概30分部分
        this.$refs.pModal.openModal(this.tempProduct, this.isNew); // 將資料透過 props 傳遞

      }else if(status === 'edit'){
        this.tempProduct = { ...product };
        if(!Array.isArray(this.tempProduct.imagesUrl)){
          this.tempProduct.imagesUrl=[];
        }
      this.isNew = false;

        // 從本地存儲中讀取特定產品的評分
    const productRating = JSON.parse(localStorage.getItem(`productRating_${product.id}`));

    // 如果找到相應的評分，設置 starScore；否則，設置為 0 或其他默認值
    this.starScore = productRating ? productRating.rating : 0;



      // this.modalProduct.show();
      console.log(this.productRating);
        this.$refs.pModal.openModal(this.tempProduct, this.isNew); // 將資料透過 props 傳遞
      }else if(status === 'delete'){
        this.tempProduct = { ...product };
        this.$refs.delpModal.openModal();
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
          this.$refs.pModal.closeModal();
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
          this.$refs.pModal.closeModal();
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
        this.$refs.delpModal.closeModal();
      })
      .catch((err) => {
        // console.log(err);
        alert(`${err.data.message}`);
      });
    },
    upload(){
      // const fileInput = document.querySelector("#file");

    // 上傳檔案
      const fileInput = this.$refs.pModal.$refs.fileInput;
        // console.dir(fileInput)
        const file = fileInput.files[0];

        const formData = new FormData();
        formData.append('file-to-upload', file);
        // console.log(file);
        axios
        .post(`${this.api_url}/api/${this.api_path}/admin/upload`,formData)
        .then((res) => {
          alert("網址產生中，請稍後");

          // 使用 setTimeout 等待一段時間（這裡是3秒，根據需求調整）
          setTimeout(() => {
            // 執行後續的代碼
            this.tempProduct.imagesUrl.push(res.data.imageUrl);
            console.log(res.data.imageUrl);
            // 彈出警告
            // 其他後續操作
          }, 2000); // 3000 毫秒即為 3 秒
          // alert(`${res.data.imageUrl}`);
        })
        .catch((err) => {
          console.log(err);
          // console.dir(err);
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
    // this.modalProduct = new bootstrap.Modal(this.$refs.productModal);
    // this.modelDel = new bootstrap.Modal(this.$refs.delProductModal);
    // this.$refs.pModal.upload()
  },
  // 區域註冊可以包含多個子元件
  components:{
    pagination,ProductModal,DelProductModal
  }
}).mount("#app");
