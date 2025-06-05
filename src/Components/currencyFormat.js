export function currencyFormat(x) {
        x = x.toString().split('.');
        let lastThree = x[0].slice(-3);
        let otherNumbers = x[0].slice(0, -3);
        if (otherNumbers !== '') {
            lastThree = ',' + lastThree;
        }
        let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        if (x.length > 1) {
            res += "." + x[1];
        }
        return res;
    }