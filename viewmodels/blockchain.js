var app = new Vue({
    el: "#app",
    data: {
        blockinfo: [],
        value: '',
        sreach: '',
        miner: '',
        transaction: [],
        select: ''
    },
    mounted() {

        this.getBlock("/block/getRecentBlocks");

        this.handleConnect();

    },
    computed: {
        //处理块列表信息中的时间和文件大小的信息生成新的数据
        getblockinfo() {
            var a = moment();
            this.blockinfo.forEach(block => {

                block.time = moment(new Date(block.time)).fromNow();
                block.sizeOnDisk = block.sizeOnDisk.toLocaleString('en');
            });
            return this.blockinfo;
        },
        //处理交易信息中的时间,生成新的数据信息
        getTransactionData() {
            this.transaction.forEach(
                tx => {
                    tx.txTime = moment(new Date(tx.txTime) * 1000).fromNow();
                }
            )
            return this.transaction;
        }


    },


    methods: {


        handleConnect() {

            console.log("connect click");

            var socket = new SockJS('http://localhost:8080/bear');

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

        //获取块列表的数据
        getBlock(url) {
            axios.get('http://localhost:8080' + url, {
                params: {
                    blockchainId: this.select
                }
            })
                .then(function (response) {
                    console.log(response);
                    app.blockinfo = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        //点击事件,交替显示块信息和交易列表信息
        blockHandler() {
            $("#block").css("display", "inline-block")
            $("#block").css("width", "100%")
            $("#transaction").css("display", "none")
            app.handleConnect();
        },
        //点击事件,交替显示块信息和交易列表信息
        transactionhandler() {
            $("#transaction").css("display", "inline-block")
            $("#transaction").css("width", "100%")
            $("#block").css("display", "none");
            app.handleDisconnect();
            app.getTransaction();

        },
        //获取交易信息列表数据

        getTransaction() {
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
        handleKeyWordSearch() {

        },
        blockViewMore() {
            location = "blockviewmore.html";
        },
        transactionViewMore() {
            location = "transactionView.html";
        }

    }

})
