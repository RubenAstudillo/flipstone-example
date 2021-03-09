var stack = [];
var op_stack = [];
var cur_value = zero();

const def_op = {
    sum: {kind: "op", name: "sum", fun: (a,b) => a + b, priority: 1},
    minus: {kind: "op", name: "minus", fun: (a,b) => a - b, priority: 1},
    mult: {kind: "op", name: "mult", fun: (a,b) => a * b, priority: 2},
    div: {kind: "op", name: "div", fun: (a,b) => a / b, priority: 2}
};

function num_constructor(a) {
    return {kind: "num", value: a, order: 0, setting_decimal: false};
}
function zero() { return num_constructor(0); }

function setDecimal() {
    cur_value.setting_decimal = true;
    cur_value.order = -1;
    showValue(cur_value.value);
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
    showValue(cur_value.value);
}

function showValue(val) {
    let panel = document.getElementById("output_panel");
    panel.textContent = val.toString();
}

// https://en.wikipedia.org/wiki/Shunting-yard_algorithm
function pushNumber(num) {
    stack.push(num);
}

function pushOperator(thisop) {
    if (op_stack.length >= 1) {
        const prevop = op_stack[0];
        if (thisop.priority > prevop.priority) {
            op_stack.unshift(thisop);
        } else {
            op_stack.shift();
            op_stack.unshift(thisop);
            stack.push(prevop);
        }
    } else {
        op_stack.unshift(thisop);
    }
}

function optimisticEval() {
    const len = stack.length;
    if (len >= 3 && stack[len - 1].kind == "op"
        && stack[len - 2].kind == "num"
        && stack[len - 3].kind == "num") {
        const op = stack.pop().fun;
        const b = stack.pop().value;
        const a = stack.pop().value;
        const res = op(a,b);
        pushNumber(num_constructor(res));
        return [true, res];
    } else {
        return [false];
    }
}

function setOperand(op) {
    pushNumber(cur_value);
    pushOperator(op);
    const evalRes = optimisticEval();
    if (evalRes[0]) {
        showValue(evalRes[1]);
    }
    cur_value = zero();
}

function calculate() {
    pushNumber(cur_value);
    stack = stack.concat(op_stack);
    for (var i = 0; i < stack.length - 1; i++) {
        const val = stack[i];
        if (val.kind == "num") {
            stack.push(val);
        } else {
            const b = stack.pop().value;
            const a = stack.pop().value;
            const fun = val.fun;
            const res = num_constructor(fun(a,b));
            stack.push(res);
        }
    }
    const finalres = stack.pop();
    stack = [ finalres ];
    showValue(finalres.value);
}

// setDecimal();
// addDigit(8);
// addDigit(3);
// negate();
// addDigit(9);

