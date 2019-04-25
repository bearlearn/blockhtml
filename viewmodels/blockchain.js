var app = new Vue({
    el: "#app",
    data: {
        blockinfo:[],
        value:'',
        sreach:'',
        transaction:[]
    },
    mounted() {
        this.getBlock("/block/getRecentBlocks");
        this.handleConnect();
        
    },
    computed: {
        getblockinfo() {
            var a=moment();
            this.blockinfo.forEach(block => {
             
            block.time=moment(new Date(block.time)).fromNow();
            block.sizeOnDisk = block.sizeOnDisk.toLocaleString('en');
            });
            return this.blockinfo;
        },
        getTransactionData(){
            this.transaction.forEach(
                tx=>{
                    tx.txTime=moment(new Date(tx.txTime)*1000).fromNow();
                }   
            )
            return this.transaction;
        }


    },
    methods: {
        handleConnect() {
            console.log("connect click");
            var socket = new SockJS('http://localhost:8080/meng');
            stompClient = Stomp.over(socket);
            stompClient.connect({}, function (frame) {
                console.log(frame)
                app.handleSubscribe();
            })
        },
        handleSubscribe() {
            console.log('subscribe click');
            stompClient.subscribe('/bitcoin/block', function (frame) {
                console.log(frame);
                app.getBlock(frame.body)
            });
        },
        handleDisconnect() {
            console.log('disconnect click');
            stompClient.disconnect(function () {
                console.log("See you next time!");
            });
        },
        getBlock(url){
            axios.get('http://localhost:8080'+url)
                .then(function (response) {
                    console.log(response);
                    app.blockinfo = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        blockHandler(){
            $("#block").css("display","inline-block")
            $("#block").css("width","100%")
            $("#transaction").css("display","none")
            app.handleConnect();
        },
        transactionhandler(){
            $("#transaction").css("display","inline-block")
            $("#transaction").css("width","100%")
            $("#block").css("display","none");
            app.handleDisconnect();
            app.getTransaction();
            
        },
        getTransaction(){
            axios.get('http://localhost:8080/transaction/getRecentTransactions')
            .then(function (response) {
                console.log(response);
                app.transaction = response.data;
                console.log(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        handleKeyWordSearch(){
            
        },
        blockVIEWMORE(){
            location="viewmore";
        },
        transactionVIEWMORE(){

        }

    }

})
