var settings = {
    login: {
        url: 'https://interviewer-api.herokuapp.com/login',
        method: 'POST',
        header: '',
        value: ''
    },
    balance: {
        url: 'https://interviewer-api.herokuapp.com/balance',
        method: 'GET',
        header: 'authorization: Bearer ',
        value: ''
    },
    transactions: {
        url: 'https://interviewer-api.herokuapp.com/transactions',
        method: 'GET',
        header: 'authorization: Bearer ',
        value: ''
    },
    payment: {
        url: 'https://interviewer-api.herokuapp.com/spend',
        method: 'POST',
        header: 'authorization: Bearer ',
        value: '',
        isPayment: true
    }
};


async function load() {

    var a;
    var b;
    var c;

    a = await login();

    b = getTransactions();

    c = getBalance();

    return settings.login.value;
}



function apiCall(input) {

    var request;
    var urlQueries;
    var header;
    var paymentDetails;

    request = input;

    urlQueries = 'URL=' + request.url + '&METHOD=' + request.method + '&HEADER=' + request.header + settings.login.value.token + '&AMOUNT=';

    if (request.isPayment) {

        var a;

        a = paymentPost();

        urlQueries += a;

    }



    header = new Headers();

    header.append('accept', 'application/json');
    header.append('cache-control', 'no-cache');
    header.append('content-type', 'application/json');
    header.append('authorization', 'Bearer ' + settings.login.value);

    var myInit = {
        method: request.method,
        headers: header,
        mode: 'cors',
        cache: 'default'
    };


    return fetch('./test.php?' + urlQueries).then(function(response) {
        console.log(response.status);

        if (response.status === 200) {
            return response.text();
        } else {
            return response.status;
        }

    }).then(function(j) {

        console.log(j);
        return j;


    });

}

async function getTransactions() {
    var a = await apiCall(settings.transactions);
    
    if (isValidJSON(a)) {;
        settings.transactions.value = JSON.parse(a);
    var b = popupateTransactionsTable(settings.transactions.value);
    } else {
        displayMessage(a);
    }
}

async function getBalance() {
    var a = await apiCall(settings.balance);
    var b = document.getElementById('balanceContainer');
    
    if (isValidJSON(a)) {;
        settings.transactions.value = JSON.parse(a);
        b.innerHTML = "Your Balance is: " + settings.transactions.value.balance + " " + settings.transactions.value.currency;
    } else {
        displayMessage(a);
    }
}

async function makePayment(){
    var a  = await apiCall(settings.payment);
    var b = getTransactions();
    var c = getBalance();
    
    displayMessage(a, true);
}

async function login() {
    var a = await apiCall(settings.login);

    if (isValidJSON(a)) {;
        settings.login.value = JSON.parse(a);
        console.log("logged in as " + settings.login.value.token);
    } else {
        displayMessage(a);
    }

}

function isValidJSON(input) {
    if (!parseInt(input)) {
        try {
            input = JSON.parse(input);
            return true;
        } catch (err) {
            return false;
        }
    } else {
        return false;
    }
}


function paymentPost() {

    var description;
    var amount;
    var currency;
    
    description = document.getElementById('description').value;
    amount = document.getElementById('amount').value;
    currency = "GBP";
    console.log(description);

    return '{\n\t\"date\": \"2016-12-15T10:44:33Z\",\n\t\"description\": \"' + description + '\",\n\t\"amount\": \"' + amount + '\",\n\t\"currency\": \"' + currency + '\"\n}'

}


function displayMessage(message, payment) {
    

    var error;
    var alertStatus;
    var messageLocation = 'alertContainer';
    if(payment){
        messageLocation = 'paymentAlertContainer';
    }

    if(message === 406){
        alertStatus = 'danger';
        error = "Payment declined - Please ensure you have sufficient funds";
    }
    else if(message === 401){
        alertStatus = 'danger';
        error = "Authorization failed - Please login again";
    }
    else if(message === 204){
        alertStatus = "success";
        error = "Payment Successful";
    }
    else if(message ===404){
        alertStatus = 'danger';
        error = "Error: Could not connect to server";
    } 
    else{
        alertStatus = 'danger';
        error = "sorry an error has occured";
    }   

    var div = document.getElementById(messageLocation);
    div.innerHTML = '<div class="alert alert-' + alertStatus + ' alert-dismissible fade show fixed-bottom text-center" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 id="error">' + error + '</h4></div>';


}


function popupateTransactionsTable(transactionsJSON){
    console.log(transactionsJSON.length - 1);
    var i = transactionsJSON.length - 1;
    var transactionsHTML = "";
    console.log(transactionsJSON);
    for(i ; i >=0 ; i--){
       var transactionDate = new Date(transactionsJSON[i].date);
       transactionsJSON[i].date = transactionDate.toLocaleString(); 
     var div = document.getElementById('transactionsList');
     transactionsHTML += ' <a href="#" class="list-group-item list-group-item-action flex-column align-items-start"><div class="d-flex w-100 justify-content-between align-items-center"><h4 class="mb-1">' + transactionsJSON[i].description + '</h4><h3 class="kbd align-middle align-items-center">' + transactionsJSON[i].amount + ' '+ transactionsJSON[i].currency + '</h3></div><p class="mb-1">' + transactionsJSON[i].date + '</p></a>';
    }
    div.innerHTML = transactionsHTML;
}