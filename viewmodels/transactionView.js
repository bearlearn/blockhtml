var app=new Vue({
    el:"#app",
    data:{
        fees:'11',
        size:'22',
        trasnaction:[],
        info:''

    },
    mounted () {
        this.getTransaction();
        this.handleConnect1();
    },
    computed: {
      gettrasnaction(){
        this.trasnaction.forEach(
            t=>{
              t.txTime=moment(t.txTime).format('YYYY-MM-DD HH:mm:ss');   
            })
        return this.trasnaction;  
      },
      
    //   getOutputTotal(){
    //     var output=0;
    //     this.list.forEach(
            
    //         t=>{
    //           t.amount=0;
    //           t.txTime=moment(new Date(t.txTime).getTime()).format('YYYY-MM-DD HH:mm:ss');
    //           t.txDetailTxInfo.forEach(
    //               tx=>{
    //                  if(tx.type==2){
    //                     t.amount=eval(t.amount+tx.amount)
    //                 }
    //               })  
    //               output=eval(output+t.amount);  
    //         })
    //     return output;
    //   }
    },
    methods: {
        handleConnect1() {
            console.log("connect click");
            var socket = new SockJS('http://localhost:8080/bit');
            stompClient = Stomp.over(socket);
            stompClient.connect({}, function (frame) {
                console.log(frame)
                app.handleSubscribe2();
            })
        },

        handleSubscribe2() {
            console.log('subscribe click');
            stompClient.subscribe('/transaction/info', function (frame) {
                console.log(frame);
                app.getTransaction();
            });
        },
        getTransaction() {
            axios.get('http://localhost:8080/transaction/getRecentTransactions')
                .then(function (response) {
                    console.log(response.data);
                    app.info=response.data.transactionInBlockDtos;
                    app.trasnaction = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
    }
})