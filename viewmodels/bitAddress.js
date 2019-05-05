var app = new Vue({
    el: "#app",
    data: {
        address: '',
        hash160: '',
        txSize: '',
        receiveAmount: '',
        finalBalance: '',
        trasnaction: [],
        
    },
   
    mounted() {
        var url = new URL(location.href)
        this.address = url.searchParams.get("address")
        this.getAddressInfo(this.address);
        this.openFullScreen();
    },
    computed: {
        getaddress() {
            return this.address;
        },
        getTrasnaction() {
            this.trasnaction.forEach(
                tx => {
                    tx.time = moment(new Date(tx.time).getTime()).format('YYYY-MM-DD HH:mm:ss');
                }
            )
            return this.trasnaction;
        },
    


    },
    methods: {
        getAddressInfo(address) {
            axios.get('http://localhost:8080/detail/getAddressdto', {
                params: {
                    address: address
                }
            })
                .then(function (response) {
                    var detail = response.data;
                    //console.log(detail)
                    app.address = detail.address;
                    app.hash160 = detail.hash160
                    app.txSize = detail.txSize
                    app.receiveAmount = detail.receiveAmount
                    app.finalBalance = detail.finalBalance
                    app.trasnaction = detail.addressOnTxs
                    // app.loading='false';

                })

        },

    }


})


var qrcode = new QRCode(document.getElementById("qrcode"), {
    text: app.getaddress,
    width: 200,
    height: 200,
    correctLevel: QRCode.CorrectLevel.L,
})

