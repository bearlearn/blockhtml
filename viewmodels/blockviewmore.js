var app = new Vue({
    el: "#app",
    data: {
        time: '',
        blockinfo: [],
        isPage: '',
        dateTime: ''
    },
    computed: {
        getblockinfo() {
            //通过循环对所有块的时间进行处理
            this.blockinfo.forEach(block => {
                
               block.time=moment(new Date(block.time).getTime()).format('YYYY-MM-DD HH:mm:ss');
               
                block.sizeOnDisk = block.sizeOnDisk.toLocaleString('en');
            });
            return this.blockinfo;
        }
    },
    mounted() {
        //获取当前时间并带着当前时间去查询今天的块信息情况
        this.dateTime = new Date().getTime();
        this.time = new Date(this.dateTime);
        this.getBlockList();
        this.time = moment().format("DD/MM/YYYY")

    },

    methods: {
        getBlockList() {
            axios.get('http://localhost:8080/block/getBlockView'
                , {
                    params: {
                        isPage: this.isPage,
                        now: this.dateTime
                    }
                }
            ).then(function (reponse) {
                app.blockinfo = reponse.data;
            })
        },
        //前一天的时间搓处理带着这个时间再次去数据库查询拿到和该时间匹配的数据
        preHanlder() {
            app.dateTime = app.dateTime - 24 * 60 * 60 * 1000;
            this.getBlockList();
            var t1=moment(app.dateTime).format('DD/MM/YYYY');
            this.time = t1;

        },
        //后一天的时间搓处理带着这个时间再次去数据库查询拿到和该时间匹配的数据
        nextHanlder() {
            app.dateTime = app.dateTime + 24 * 60 * 60 * 1000;
            this.getBlockList();
            this.time =moment(app.dateTime).format('DD/MM/YYYY');

        }

    }




})