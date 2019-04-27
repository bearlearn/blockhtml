var app = new Vue({
    el: "#app",
    data: {
        txId: '',
        txHash:'',
        weight:'',
        txSize:'',
        txTime:'',
        input:'',
        output:'',
        txDetailTxInfo:'',
        activeNames:"1"
        
    },
    mounted() {
        var url = new URL(location.href)
        var hash = url.searchParams.get("hash")
        console.log(hash)
        this.getTransaction(hash)
    },
    methods: {
        getTransaction(hash) {
            axios.get('http://localhost:8080/transaction/getTransactionInfoByTxhash',
                {
                    params: {
                        txHash: hash
                    }
                }).then(function (response) {
                    console.log(response)
                   var tx= response.data;
                   app.txDetailTxInfo=tx.txDetailTxInfo;
                   app.txId=tx.txId;
                   app.txHash=tx.txHash;
                   app.weight=tx.weight;
                   app.txSize=tx.txSize;
                   app.txTime=moment(new Date(tx.txTime).getTime()).format('YYYY-MM-DD HH:mm:ss');
                   app.input=tx.input;
                   app.output=tx.output;    
                                                   
                })
        }
    },
})