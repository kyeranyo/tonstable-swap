// Hàm giải phương trình
function solveEquation(A, x, D) {
    const numerator = Math.pow(2, 2) * A * (x + y) + D;
    const denominator = Math.pow(2, 2) * A * D + Math.pow(D, 3) / (Math.pow(2, 2) * x * y);
    return (numerator - denominator) / (Math.pow(2, 2) * A);
}

// Giá trị ban đầu
const A = 100;
const x = 8.5;
const D = 29.878;

// Giải phương trình
const y = solveEquation(A, x, D);
console.log('Giá trị y:', y);
