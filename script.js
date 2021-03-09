var stack = [];
var cur_value = zero();
var op_stack = [];

const def_op = {
    sum: (a,b) => a + b,
    minus: (a,b) => a - b,
    multiplication: (a,b) => a * b,
    division: (a,b) => a / b
};

function num_constructor(a) {
    return {value: a, order: 0, setting_decimal: false};
}
function zero() { return num_constructor(0); }

function setDecimal() {
    cur_value.setting_decimal = true;
    cur_value.order = -1;
    showValue();
}

function addDigit(digit) {
    let op;
    if (cur_value.value < 0) {
        op = (a,b) => a - b;
    } else {
        op = (a,b) => a + b;
    }

    if (cur_value.setting_decimal) {
        const shiftedDigit = digit * (10 ** cur_value.order);
        cur_value.value = op(cur_value.value, shiftedDigit);
        cur_value.order -= 1;
    } else {
        cur_value.value = op(cur_value.value * 10, digit);
    }
    showValue(cur_value.value);
}

function negate() {
    cur_value.value = (-1) * cur_value.value;
    showValue();
}

function showValue(val) {
    let panel = document.getElementById("output_panel");
    panel.textContent = val.toString();
}

function setOperand(op) {
    stack.push(cur_value.value);
    op_stack.push(def_op[op]);
    cur_value = zero();
    showValue();
}

function calculate() {
    stack.push(cur_value.value);
    if (stack.length >= 2 && op_stack.length >= 1) {
        const a = stack.pop();
        const b = stack.pop();
        const op = op_stack.pop();
        const result = op(a,b);
        stack.push(result);
        showValue(result);
    } else {
        showValue("Missing arguments");
    }
    cur_value = zero();
}

// setDecimal();
// addDigit(8);
// addDigit(3);
// negate();
// addDigit(9);

