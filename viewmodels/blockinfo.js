var app = new Vue({
    el: "#app",
    data: {
        blockinfo: '',
        blockHash: '',
        merkleRoot: '',
        txSize: '',
        blockTime: '',
        blockHeight: '',
        blockDiffculty: '',
        blockSizeOnDisk: '',
        height: '',
        list: [],
        outputTotal: 0,
        fee: '',

    },
    mounted() {
        var url = new URL(location.href);
        this.height = url.searchParams.get("height")
        this.getBlcoInfo(this.height)
    },
    computed: {
        trasnaction() {
            this.list.forEach(
                t => {
                    t.amount = 0;
                    t.txTime = moment(new Date(t.txTime).getTime()).format('YYYY-MM-DD HH:mm:ss');
                    t.txDetailTxInfo.forEach(
                        tx => {
                            if (tx.type == 2) {
                                t.amount = eval(t.amount + tx.amount)
                            }
                        })
                })
            return this.list;
        }


    },
    methods: {
        getBlcoInfo(height) {
            axios.get('http://localhost:8080/block/getBlockDetailByHeight', {
                params: {
                    blockHeight: height
                }
            }).then(function (response) {
                blockinfo = response.data;
                app.blockHash = blockinfo.blockhash;
                app.merkleRoot = blockinfo.merkleRoot,
                    app.txSize = blockinfo.txSize,
                    app.blockTime = blockinfo.time,
                    app.blockHeight = blockinfo.height,
                    app.blockDiffculty = blockinfo.difficulty,
                    app.blockSizeOnDisk = blockinfo.sizeOnDisk
                app.list = blockinfo.transactions
                var a = app.trasnaction[0].amount
                console.log(a)
                console.log(blockinfo.outputTotal)
                console.log(blockinfo.transactionFees)
                app.fee = blockinfo.transactionFees - (blockinfo.outputTotal - a);
                app.outputTotal = blockinfo.outputTotal - a;
            })
        },
        pre_block() {
            console.log("pre_block")
            height = eval(this.height - 1);
            console.log(height)
            location = "blockinfo.html?height=" + height;
        },
        next_block() {
            console.log("next_block")
            height = eval(parseInt(this.height) + 1);
            location = "blockinfo.html?height=" + height;
        }

    }
})